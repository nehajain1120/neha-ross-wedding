// Polaroid slideshow.
// - Moves to the next photo every 1.5 seconds on its own.
// - Click or tap the photo to go to the next one.
// - On phones, swipe the top photo left or right to flick it away.
// Any click, tap or swipe restarts the 1.5 second timer.
(function () {
  var stack = document.getElementById('stack');
  if (!stack) return;

  var TOTAL = 14;          // photos: images/photo-01.jpg ... photo-14.jpg
  var INTERVAL = 1500;     // ms between photos
  var LEAVE_MS = 450;      // how long the top photo takes to slide away
  var SWIPE_MIN = 50;      // px a finger must travel to count as a swipe

  function src(n) { return 'images/photo-' + (n < 10 ? '0' : '') + n + '.jpg'; }
  function wrap(n) { return ((n - 1) % TOTAL) + 1; }

  // The stack starts with photos 1-4 (1 on top); photo 5 comes in next.
  var next = 5;
  var loaded = {};
  function preload(n) {
    n = wrap(n);
    if (loaded[n]) return;
    var i = new Image();
    i.src = src(n);
    loaded[n] = i;
  }
  preload(next);
  preload(next + 1);

  stack.querySelectorAll('img').forEach(function (img) {
    img.draggable = false;
  });

  var busy = false;
  var timer = null;

  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(function () { advance(1); }, ms);
  }

  // dir: 1 = slide off to the right, -1 = slide off to the left
  function advance(dir) {
    if (busy) return;
    if (document.hidden) { schedule(INTERVAL); return; }
    busy = true;
    clearTimeout(timer);

    var top = stack.lastElementChild;
    top.style.transition = 'transform ' + LEAVE_MS + 'ms cubic-bezier(.45, 0, .7, .4)';
    top.style.transform = 'translate(' + (dir * 115) + '%, -6%) rotate(' + (dir * 14) + 'deg)';

    setTimeout(function () {
      // Tuck the finished polaroid under the pile with the next photo in it.
      top.style.transition = 'none';
      top.querySelector('img').src = src(wrap(next));
      stack.insertBefore(top, stack.firstElementChild);
      void top.offsetWidth;
      top.style.transition = '';
      top.style.transform = '';
      next = wrap(next + 1);
      preload(next);
      preload(next + 1);
      busy = false;
      schedule(INTERVAL - LEAVE_MS);
    }, LEAVE_MS);
  }

  // Tap / click / swipe handling
  var startX = null, startY = 0, dx = 0, dragging = false, pointer = null;

  stack.addEventListener('pointerdown', function (e) {
    if (busy || (e.pointerType === 'mouse' && e.button !== 0)) return;
    startX = e.clientX; startY = e.clientY; dx = 0; dragging = false; pointer = e.pointerId;
    clearTimeout(timer);
  });

  stack.addEventListener('pointermove', function (e) {
    if (startX === null || e.pointerId !== pointer) return;
    dx = e.clientX - startX;
    var dy = e.clientY - startY;
    if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      dragging = true;
      try { stack.setPointerCapture(pointer); } catch (err) {}
    }
    if (dragging) {
      var top = stack.lastElementChild;
      top.style.transition = 'none';
      top.style.transform = 'translateX(' + dx + 'px) rotate(' + (2 + dx / 25) + 'deg)';
    }
  });

  function finish(e) {
    if (startX === null || e.pointerId !== pointer) return;
    var top = stack.lastElementChild;
    if (dragging) {
      if (Math.abs(dx) >= SWIPE_MIN) {
        advance(dx > 0 ? 1 : -1);
      } else {
        top.style.transition = '';
        top.style.transform = '';
        schedule(INTERVAL);
      }
    } else if (e.type === 'pointerup') {
      advance(1);
    } else {
      schedule(INTERVAL);
    }
    startX = null; dragging = false; pointer = null;
  }
  stack.addEventListener('pointerup', finish);
  stack.addEventListener('pointercancel', finish);

  // Keyboard: Enter or Space on the photo stack goes to the next photo.
  stack.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(1); }
  });

  schedule(INTERVAL);
})();
