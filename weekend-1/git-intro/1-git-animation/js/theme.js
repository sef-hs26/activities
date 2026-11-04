/* git-viz theme: the page always opens light, which projects well (Carlos, 2026-11-04: "make sure
 * it is not dark themed because it does not project well"). t switches to dark for this visit only;
 * nothing is stored. A #...&theme=dark in the URL wins, for screenshots. */
(function () {
  'use strict';
  function read() {
    var m = (location.hash || '').match(/theme=(light|dark)/);
    return m ? m[1] : 'light';
  }
  function apply(t) { document.documentElement.setAttribute('data-theme', t); }
  function toggle() {
    apply(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }
  apply(read());
  window.Theme = { toggle: toggle, apply: apply };
}());
