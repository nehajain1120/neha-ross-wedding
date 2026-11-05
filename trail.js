// Draws the dotted hiking trail on "What's the Plan?", winding from the
// trailhead sign to each day's card and down to the beach.
(function () {
  var trail = document.querySelector('.trail');
  if (!trail) return;
  var svg = trail.querySelector('.trail-svg');
  var route = svg.querySelector('.route');
  var reveal = svg.querySelector('.reveal');
  var segments = [['start', 'p1'], ['b1', 'p2'], ['b2', 'end']];
  var animated = false;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function point(name) {
    var el = trail.querySelector('[data-a="' + name + '"]');
    var r = el.getBoundingClientRect(), t = trail.getBoundingClientRect();
    return { x: r.left + r.width / 2 - t.left, y: r.top + r.height / 2 - t.top };
  }
  function f(n) { return Math.round(n * 10) / 10; }

  function draw() {
    var w = trail.clientWidth, h = trail.clientHeight;
    if (!w || !h) return;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var swing = Math.min(w * 0.22, 90);
    var d = segments.map(function (seg, i) {
      var a = point(seg[0]), b = point(seg[1]);
      var dy = b.y - a.y;
      // Each stretch of trail bows out to one side, alternating, like switchbacks.
      var s = (i % 2 ? -1 : 1) * swing;
      return 'M' + f(a.x) + ' ' + f(a.y) +
        ' C' + f(a.x + s) + ' ' + f(a.y + dy * 0.45) + ' ' +
        f(b.x + s) + ' ' + f(b.y - dy * 0.55) + ' ' +
        f(b.x) + ' ' + f(b.y);
    }).join(' ');
    route.setAttribute('d', d);
    reveal.setAttribute('d', d);

    var len = Math.ceil(reveal.getTotalLength ? reveal.getTotalLength() : 0);
    if (!animated && !still && len) {
      animated = true;
      reveal.style.transition = 'none';
      reveal.style.strokeDasharray = len + ' ' + len;
      reveal.style.strokeDashoffset = len;
      void reveal.getBoundingClientRect();
      reveal.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(.45, .1, .3, 1) .3s';
      reveal.style.strokeDashoffset = 0;
    } else if (animated) {
      reveal.style.strokeDasharray = len + ' ' + len;
    }
    trail.classList.add('drawn');
  }

  draw();
  window.addEventListener('load', draw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  if (window.ResizeObserver) new ResizeObserver(draw).observe(trail);
  else window.addEventListener('resize', draw);
})();
