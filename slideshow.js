(function () {
  var stack = document.getElementById('stack');
  if (!stack) return;
  var TOTAL = 14, INTERVAL = 3000, LEAVE_MS = 900;
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

  var busy = false;
  function advance() {
    if (busy || document.hidden) return;
    busy = true;
    var top = stack.lastElementChild;
    var photo = wrap(next);
    top.classList.add('leaving');
    setTimeout(function () {
      // Send the finished polaroid to the bottom of the stack with the next photo.
      // It stays out to the side while re-ordered, then slides back in under the pile.
      top.classList.add('no-anim');
      top.querySelector('img').src = src(photo);
      stack.insertBefore(top, stack.firstElementChild);
      void top.offsetWidth;
      top.classList.remove('no-anim');
      top.classList.remove('leaving');
      next = wrap(next + 1);
      preload(next);
      busy = false;
    }, LEAVE_MS);
  }
  setInterval(advance, INTERVAL);
})();
