/* git-viz view: draws the model's state on the fixed 1600x900 stage and animates each change.
 *
 * Layout: the narrator's pane on the left (0 to 384), GitLab as a band on top of the main area,
 * Carlos's laptop below on the left and Marcel's on the right. Each laptop shows its commit graph,
 * its files, an editor with the file it works on, and a terminal.
 * GitView.render(world, ctx) draws the final state of a step, then (if ctx.animate) plays the
 * change on top: commits flying between places, a commit filling its dashed placeholder, commits
 * sliding to a new lane, code typed keystroke by keystroke, the terminal typing the command.
 * Going back or jumping renders the final state directly, so nothing depends on an animation.
 * The three graphs live in one SVG layer above the panels, so a flight is a move in one
 * coordinate system. GitView.say() is the narrator.
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var PLACES = ['gitlab', 'carlos', 'marcel'];
  var PEOPLE = ['carlos', 'marcel'];
  var NAME = { carlos: 'Carlos', marcel: 'Marcel', gitlab: 'GitLab', start: 'GitLab' };
  var FILE_ORDER = ['README.md', 'total.py', 'receipt.py'];

  // ===== geometry (logical pixels on the 1600x900 stage) =====
  var BOX = {
    gitlab: { x: 396, y: 64, w: 1192, h: 206 },
    carlos: { x: 396, y: 282, w: 590, h: 608 },
    marcel: { x: 998, y: 282, w: 590, h: 608 }
  };
  var GRAPH = {            // column 0 / lane 0, and the width the columns may use
    gitlab: { x: 466, y: 176, w: 1040, lanesRoom: 44 },
    carlos: { x: 456, y: 386, w: 470, lanesRoom: 60 },
    marcel: { x: 1058, y: 386, w: 470, lanesRoom: 60 }
  };
  var FILES_TOP = { gitlab: 12, local: 200 };        // relative to the panel
  var EDITOR = { top: 242, height: 228 };            // relative to the laptop panel
  var TERM = { story: 118, free: 118 };              // terminal height (bottom edge 12 px above the panel's)
  var LINE = { cmd: 25.6, out: 19, pad: 14 };        // terminal line heights (see style.css)
  var DX = 84, DY = 44, R = 16;
  var ARROW = {            // vertical block arrows between GitLab (above) and a laptop (below)
    carlos: { cx: 930, cy: 276 },
    marcel: { cx: 1532, cy: 276 }
  };

  var noAnim = false;

  // ===== a tiny tween engine =====
  var Tween = (function () {
    var items = [], raf = null, onFrame = null;
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function tick(now) {
      var keep = [];
      for (var i = 0; i < items.length; i++) {
        var o = items[i];
        if (o.t0 === undefined) o.t0 = now + (o.delay || 0);
        var t = (now - o.t0) / o.dur;
        if (t < 0) { keep.push(o); continue; }
        if (!o.started && o.start) { o.started = true; o.start(); }
        if (t >= 1) { o.step(1); if (o.end) o.end(); } else { o.step(o.linear ? t : ease(t)); keep.push(o); }
      }
      items = keep;
      if (onFrame) onFrame();
      raf = items.length ? requestAnimationFrame(tick) : null;
    }
    return {
      add: function (o) { items.push(o); if (!raf) raf = requestAnimationFrame(tick); },
      finish: function () {
        var all = items; items = [];
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        all.forEach(function (o) { if (!o.started && o.start) o.start(); o.step(1); if (o.end) o.end(); });
        if (onFrame) onFrame();
      },
      busy: function () { return items.length > 0; },
      // milliseconds until the last running animation ends
      remaining: function () {
        var now = performance.now(), end = now;
        items.forEach(function (o) { end = Math.max(end, (o.t0 !== undefined ? o.t0 : now + (o.delay || 0)) + o.dur); });
        return end - now;
      },
      setOnFrame: function (f) { onFrame = f; }
    };
  }());

  // ===== DOM helpers =====
  function svgEl(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function htmlEl(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function $(id) { return document.getElementById(id); }
  function place(el, b) { el.style.left = b.x + 'px'; el.style.top = b.y + 'px'; el.style.width = b.w + 'px'; el.style.height = b.h + 'px'; }

  // ===== state kept between renders =====
  var layers = {};
  var nodeEls = { gitlab: {}, carlos: {}, marcel: {} };
  var edgeEls = { gitlab: {}, carlos: {}, marcel: {} };
  var pendingEls = {};
  var pos = { gitlab: {}, carlos: {}, marcel: {} };      // id -> {x, y, s, o, hideEdges}
  var lastLayouts = null;

  function init() {
    place($('place-gitlab'), BOX.gitlab);
    place($('place-carlos'), BOX.carlos);
    place($('place-marcel'), BOX.marcel);
    $('files-gitlab').style.top = FILES_TOP.gitlab + 'px';
    PEOPLE.forEach(function (who) {
      $('files-' + who).style.top = FILES_TOP.local + 'px';
      var ed = $('ed-' + who);
      ed.style.top = EDITOR.top + 'px'; ed.style.height = EDITOR.height + 'px';
      $('term-' + who).style.height = TERM.story + 'px';
    });
    var svg = $('overlay');
    layers.arrows = svgEl('g', { id: 'arrows' }, svg);
    PLACES.forEach(function (who) {
      var g = svgEl('g', { 'class': 'graph', id: 'graph-' + who }, svg);
      layers[who] = { root: g, edges: svgEl('g', {}, g), extra: svgEl('g', {}, g), nodes: svgEl('g', {}, g) };
    });
    layers.fx = svgEl('g', { id: 'fx' }, svg);
    Tween.setOnFrame(drawAll);
  }

  // ===== graph geometry =====
  function geometry(layout, who) {
    var g = GRAPH[who];
    var cols = Math.max(layout.cols, 1);
    var dx = DX;
    if (cols > 1 && (cols - 1) * dx > g.w) dx = Math.max(52, g.w / (cols - 1));
    var offset = 0;
    if ((cols - 1) * dx > g.w) offset = (cols - 1) - Math.floor(g.w / dx);
    var dy = layout.lanes > 1 ? Math.min(DY, g.lanesRoom / (layout.lanes - 1)) : DY;
    return {
      dx: dx, dy: dy, offset: offset,
      at: function (col, lane) { return { x: g.x + (col - offset) * dx, y: g.y + lane * dy }; },
      labelOn: function (col) { return dx >= 70 || col >= cols - 3; }
    };
  }

  function edgePath(a, b, dx) {
    if (Math.abs(a.y - b.y) < 0.5) return 'M' + a.x + ',' + a.y + 'L' + b.x + ',' + b.y;
    var bend = Math.min(dx, b.x - a.x);
    var sx = b.x - bend;               // run along the parent's lane, then bend into the child
    var mid = sx + bend / 2;
    return 'M' + a.x + ',' + a.y + 'L' + sx + ',' + a.y + 'C' + mid + ',' + a.y + ' ' + mid + ',' + b.y + ' ' + b.x + ',' + b.y;
  }

  function initialOf(author) { return author === 'carlos' ? 'C' : author === 'marcel' ? 'M' : ''; }

  function makeNode(who, n) {
    var g = svgEl('g', { 'class': 'commit ' + (n.merge ? 'merge' : 'by-' + n.author) }, layers[who].nodes);
    if (n.merge) {
      svgEl('path', { 'class': 'half left', d: 'M0,-16A16,16 0 0 0 0,16Z' }, g);
      svgEl('path', { 'class': 'half right', d: 'M0,-16A16,16 0 0 1 0,16Z' }, g);
      svgEl('circle', { 'class': 'rim', r: R }, g);
    } else {
      svgEl('circle', { 'class': 'body', r: R }, g);
      var t = svgEl('text', { 'class': 'initial', y: 0.5 }, g);
      t.textContent = initialOf(n.author);
    }
    var label = svgEl('text', { 'class': 'clabel' }, g);
    var title = svgEl('title', {}, g);
    return { g: g, label: label, title: title };
  }

  function setNodeTransform(el, p) {
    el.g.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ') scale(' + (p.s === undefined ? 1 : p.s).toFixed(3) + ')');
    el.g.style.opacity = p.o === undefined ? 1 : p.o;
  }

  // Redraw edges and node transforms from the current positions (called every frame).
  var geoms = {};
  function drawAll() {
    PLACES.forEach(function (who) {
      var els = nodeEls[who], P = pos[who];
      for (var id in els) if (P[id]) setNodeTransform(els[id], P[id]);
      var E = edgeEls[who];
      for (var key in E) {
        var e = E[key], a = P[e.from], b = P[e.to];
        if (!a || !b) continue;
        e.path.setAttribute('d', edgePath(a, b, geoms[who] ? geoms[who].dx : DX));
        var hidden = a.hideEdges || b.hideEdges;
        e.path.style.opacity = hidden ? 0 : Math.min(a.o === undefined ? 1 : a.o, b.o === undefined ? 1 : b.o);
      }
    });
  }

  // ===== the graphs =====
  function renderGraphs(world, ctx, layouts, animate) {
    var flights = [], arrivals = {};
    (ctx.results || []).forEach(function (r) {
      r.events.forEach(function (ev) {
        if (ev.type !== 'transfer') return;
        ev.ids.forEach(function (id, i) {
          var from = (pos[ev.from] && pos[ev.from][id]) ? { x: pos[ev.from][id].x, y: pos[ev.from][id].y } : null;
          arrivals[ev.to + ':' + id] = { from: from, order: i, kind: ev.kind };
        });
      });
    });
    var created = {};
    (ctx.results || []).forEach(function (r) {
      r.events.forEach(function (ev) { if (ev.type === 'commit' || ev.type === 'merge-commit') created[ev.who + ':' + ev.id] = true; });
    });

    PLACES.forEach(function (who) {
      var lay = layouts[who], geo = geometry(lay, who);
      geoms[who] = geo;
      var keep = {};
      lay.nodes.forEach(function (n) {
        keep[n.id] = true;
        var el = nodeEls[who][n.id];
        var isNew = !el;
        if (!el) el = nodeEls[who][n.id] = makeNode(who, n);
        var target = geo.at(n.col, n.lane);
        var showLabel = geo.labelOn(n.col);
        el.label.textContent = showLabel ? n.label : '';
        el.label.setAttribute('y', n.lane === 0 ? -27 : 37);
        el.title.textContent = n.id + '  ' + n.message + '  (' + NAME[n.author] + ')';
        el.g.style.visibility = target.x < GRAPH[who].x - 30 ? 'hidden' : 'visible';
        var prev = pos[who][n.id];
        var P = pos[who][n.id] = { x: target.x, y: target.y, s: 1, o: 1 };
        if (!animate) return;
        var arr = arrivals[who + ':' + n.id];
        if (isNew && arr && arr.from) {
          flights.push({ who: who, id: n.id, from: arr.from, to: target, order: arr.order, kind: arr.kind });
          P.x = arr.from.x; P.y = arr.from.y; P.o = 0; P.hideEdges = true;
        } else if (isNew && created[who + ':' + n.id]) {
          P.s = 0.4; P.o = 0; P.hideEdges = true;
          Tween.add({ delay: 120, dur: 520, step: function (t) { P.s = 0.4 + 0.6 * t; P.o = Math.min(1, t * 1.6); },
            end: function () { P.hideEdges = false; } });
        } else if (isNew) {
          P.o = 0;
          Tween.add({ delay: 100, dur: 450, step: function (t) { P.o = t; } });
        } else if (prev && (Math.abs(prev.x - target.x) > 0.5 || Math.abs(prev.y - target.y) > 0.5)) {
          var fx = prev.x, fy = prev.y;
          P.x = fx; P.y = fy;
          Tween.add({ delay: 150, dur: 650, step: function (t) { P.x = fx + (target.x - fx) * t; P.y = fy + (target.y - fy) * t; } });
        }
      });
      // remove what this place no longer has (only happens when jumping back)
      Object.keys(nodeEls[who]).forEach(function (id) {
        if (!keep[id]) { nodeEls[who][id].g.remove(); delete nodeEls[who][id]; delete pos[who][id]; }
      });
      // edges
      var ekeep = {};
      lay.edges.forEach(function (e) {
        var key = e.from + '>' + e.to;
        ekeep[key] = true;
        if (!edgeEls[who][key]) edgeEls[who][key] = { from: e.from, to: e.to, path: svgEl('path', { 'class': 'edge' }, layers[who].edges) };
      });
      Object.keys(edgeEls[who]).forEach(function (key) {
        if (!ekeep[key]) { edgeEls[who][key].path.remove(); delete edgeEls[who][key]; }
      });
      renderPending(who, lay, geo, animate, ctx);
    });

    // flights: commits travel from where they were to their place in the other graph
    flights.forEach(function (f) {
      var P = pos[f.who][f.id];
      var c = { x: (f.from.x + f.to.x) / 2 + (f.to.y < f.from.y ? 0 : 0), y: Math.min(f.from.y, f.to.y) - 70 };
      Tween.add({
        delay: 260 + f.order * 170, dur: 820,
        start: function () { P.o = 1; },
        step: function (t) {
          var u = 1 - t;
          P.x = u * u * f.from.x + 2 * u * t * c.x + t * t * f.to.x;
          P.y = u * u * f.from.y + 2 * u * t * c.y + t * t * f.to.y;
          P.s = 1 + 0.25 * Math.sin(Math.PI * t);
        },
        end: function () { P.x = f.to.x; P.y = f.to.y; P.s = 1; P.hideEdges = false; }
      });
    });
    drawAll();
    return flights.length ? 260 + (flights.length - 1) * 170 + 820 : 0;
  }

  // The commit being prepared: dashed placeholder after git add, or the merge in progress.
  function renderPending(who, lay, geo, animate, ctx) {
    var layer = layers[who].extra;
    var old = pendingEls[who];
    var pend = lay.pending;
    var key = pend ? [pend.kind, pend.col, pend.lane, pend.conflict].join(':') : null;
    if (old && old.key === key) return;
    if (old) { old.g.remove(); pendingEls[who] = null; }
    if (!pend) return;
    var p = geo.at(pend.col, pend.lane);
    var g = svgEl('g', { 'class': 'pending ' + who + (pend.conflict ? ' conflict' : ''), transform: 'translate(' + p.x + ',' + p.y + ')' }, layer);
    // dashed lines from the parents, drawn first so the circle sits on top
    pend.parents.forEach(function (q) {
      var parent = lay.nodes.filter(function (n) { return n.id === q; })[0];
      if (!parent) return;
      var a = geo.at(parent.col, parent.lane);
      svgEl('path', { 'class': 'edge', d: edgePath({ x: a.x - p.x, y: a.y - p.y }, { x: 0, y: 0 }, geo.dx),
        style: 'stroke-dasharray:6 7; opacity:.8' }, g);
    });
    svgEl('circle', { r: R + 1 }, g);
    if (pend.conflict) { var m = svgEl('text', { 'class': 'mark' }, g); m.textContent = '!'; }
    var lab = svgEl('text', { 'class': 'plabel', y: pend.lane === 0 ? -27 : 39 }, g);
    lab.textContent = pend.conflict ? 'conflict' : (pend.kind === 'merge' ? 'merge' : 'next commit');
    pendingEls[who] = { g: g, key: key };
    if (animate) {
      g.style.opacity = 0;
      Tween.add({ delay: pend.conflict ? 900 : 350, dur: 450, step: function (t) { g.style.opacity = t; } });
      if (pend.conflict) {
        Tween.add({ delay: 1350, dur: 600, linear: true, step: function (t) {
          var dx = Math.sin(t * Math.PI * 6) * 5 * (1 - t);
          g.setAttribute('transform', 'translate(' + (p.x + dx) + ',' + p.y + ')');
        } });
      }
    }
  }

  // ===== arrows, rejection, missing commits =====
  // A vertical block arrow at the right end of a laptop: up to GitLab (push) or down (pull,
  // clone), with the word beside it, as on Carlos's storyboard pages.
  function arrowShape(parent, a, word, up) {
    var g = svgEl('g', { 'class': 'arrow' }, parent);
    svgEl('path', { 'class': 'shape', transform: 'translate(' + a.cx + ',' + a.cy + ') rotate(' + (up ? -90 : 90) + ')',
      d: 'M-70,-15 L22,-15 L22,-33 L70,0 L22,33 L22,15 L-70,15 Z' }, g);
    var t = svgEl('text', { 'class': 'word', x: a.cx - 44, y: a.cy + 2, style: 'text-anchor:end' }, g);
    t.textContent = word;
    return g;
  }

  function renderFx(world, ctx, layouts, animate) {
    layers.arrows.textContent = '';
    layers.fx.textContent = '';
    var results = ctx.results || [];
    results.forEach(function (r) {
      r.events.forEach(function (ev) {
        var person = ev.type === 'transfer' ? (ev.from === 'gitlab' ? ev.to : ev.from) : ev.who;
        if (ev.type === 'transfer') {
          var a = ARROW[person];
          var g = arrowShape(layers.arrows, a, ev.kind === 'fetch' ? 'pull' : ev.kind, ev.from !== 'gitlab');
          if (animate) { g.style.opacity = 0; Tween.add({ delay: 0, dur: 300, step: function (t) { g.style.opacity = t; } }); }
        }
        if (ev.type === 'rejected') renderRejected(world, ev, layouts, animate);
      });
    });
  }

  function renderRejected(world, ev, layouts, animate) {
    var a = ARROW[ev.who];
    var arrow = arrowShape(layers.arrows, a, 'push', true);
    // the X stamp at the arrow head, inside GitLab's band
    var rad = -Math.PI / 2;
    var hx = a.cx, hy = a.cy - 66;
    var x = svgEl('g', { transform: 'translate(' + hx + ',' + hy + ')' }, layers.fx);
    svgEl('path', { 'class': 'xmark', d: 'M-22,-22L22,22M22,-22L-22,22' }, x);
    var w = svgEl('text', { 'class': 'xword', x: -36, y: 8, style: 'text-anchor:end' }, x);
    w.textContent = 'rejected';
    // a dashed ring around what GitLab has and the laptop lacks
    var geo = geometry(layouts.gitlab, 'gitlab');
    ev.missing.forEach(function (id) {
      var n = layouts.gitlab.nodes.filter(function (m) { return m.id === id; })[0];
      if (!n) return;
      var p = geo.at(n.col, n.lane);
      var ring = svgEl('g', { transform: 'translate(' + p.x + ',' + p.y + ')' }, layers.fx);
      svgEl('circle', { 'class': 'missing', r: R + 8 }, ring);
      var t = svgEl('text', { 'class': 'missing-label', y: n.lane === 0 ? 46 : -30 }, ring);
      t.textContent = 'not on ' + NAME[ev.who] + '\'s laptop';
      if (animate) { ring.style.opacity = 0; Tween.add({ delay: 1500, dur: 500, step: function (tt) { ring.style.opacity = tt; } }); }
    });
    if (!animate) return;
    arrow.style.opacity = 0;
    x.style.opacity = 0;
    Tween.add({ dur: 300, step: function (t) { arrow.style.opacity = t; } });
    // ghosts of the commits that tried to go up, bouncing back
    ev.ids.forEach(function (id, i) {
      var from = pos[ev.who][id];
      if (!from) return;
      var c = world.commits[id];
      var gh = svgEl('g', { 'class': 'commit ghost by-' + c.author }, layers.fx);
      svgEl('circle', { 'class': 'body', r: R }, gh);
      var stop = { x: hx - Math.cos(rad) * 14, y: hy - Math.sin(rad) * 14 };
      var fx0 = from.x, fy0 = from.y;
      Tween.add({ delay: 250 + i * 150, dur: 650, step: function (t) {
        gh.setAttribute('transform', 'translate(' + (fx0 + (stop.x - fx0) * t) + ',' + (fy0 + (stop.y - fy0) * t) + ')');
      } });
      Tween.add({ delay: 900 + i * 150, dur: 600, step: function (t) {
        gh.setAttribute('transform', 'translate(' + (stop.x + (fx0 - stop.x) * t) + ',' + (stop.y + (fy0 - stop.y) * t) + ')');
        gh.style.opacity = 1 - t;
      }, end: function () { gh.remove(); } });
    });
    Tween.add({ delay: 880, dur: 300, step: function (t) {
      x.style.opacity = t;
      x.setAttribute('transform', 'translate(' + hx + ',' + hy + ') scale(' + (1.6 - 0.6 * t) + ')');
    } });
  }

  // ===== files =====
  function fileStates(world, who) {
    var p = world.places[who];
    if (who === 'gitlab') {
      return Object.keys(world.tree(p.tip)).map(function (f) { return { path: f, state: '' }; });
    }
    if (!p.cloned) return [];
    var st = world.status(who);
    var paths = {};
    [p.work, p.index, world.tree(p.tip)].forEach(function (o) { for (var k in o) paths[k] = true; });
    return Object.keys(paths).map(function (f) {
      var s = '';
      if (st.unmerged.indexOf(f) >= 0) s = 'conflict';
      else if (st.untracked.indexOf(f) >= 0) s = 'new';
      else if (st.modified.indexOf(f) >= 0) s = 'edited';
      else if (st.staged.indexOf(f) >= 0) s = 'staged';
      return { path: f, state: s };
    });
  }

  function sortFiles(list) {
    return list.sort(function (a, b) {
      var ia = FILE_ORDER.indexOf(a.path), ib = FILE_ORDER.indexOf(b.path);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || (a.path < b.path ? -1 : 1);
    });
  }

  var TAG = { 'new': 'new', edited: 'edited', staged: '+ staged', conflict: '! conflict' };

  function renderFiles(world, ctx, animate, landAt) {
    PLACES.forEach(function (who) {
      var box = $('files-' + who);
      var before = {};
      Array.prototype.forEach.call(box.children, function (c) { before[c.dataset.path] = c.dataset.sig; });
      box.textContent = '';
      sortFiles(fileStates(world, who)).forEach(function (f) {
        var content = who === 'gitlab' ? world.tree(world.places.gitlab.tip)[f.path] : world.places[who].work[f.path];
        var chip = htmlEl('span', 'chip ' + (f.state || '') + ' ' + who, box);
        htmlEl('span', 'fname', chip, f.path);
        if (f.state) htmlEl('span', 'tag', chip, TAG[f.state]);
        chip.dataset.path = f.path;
        chip.dataset.sig = f.state + ':' + (content || '').length + ':' + hashText(content || '');
        if (ctx.open && ctx.open[who] === f.path) chip.classList.add('shown');
        if (animate && before[f.path] !== chip.dataset.sig) {
          chip.classList.add('appear');
          chip.style.animationDelay = (landAt[who] || 0) + 'ms';
        }
      });
      if (who !== 'gitlab') {
        var cloned = world.places[who].cloned;
        $('empty-' + who).style.display = cloned ? 'none' : 'block';
        $('ed-' + who).style.display = cloned ? 'block' : 'none';
        $('term-' + who).style.visibility = cloned || (ctx.terminals && ctx.terminals[who] && ctx.terminals[who].length) ? 'visible' : 'hidden';
      }
    });
  }

  function hashText(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

  // ===== terminals =====

  // The audience are managers: keep Git's own words, but only the lines that tell the story.
  // Dropped: per-file statistics, "create mode", the "failed to push" line (the line above it
  // already says rejected), "Auto-merging" and "done.".
  function essential(lines) {
    return lines.filter(function (l) {
      return !(/^ \S+\s+\| \d+ [+-]*$/.test(l) || /^ \d+ files? changed/.test(l) || /^ (create|delete) mode/.test(l) ||
        /^error: failed to push some refs/.test(l) || /^Auto-merging /.test(l) || /^done\.$/.test(l));
    });
  }

  function lineClass(l) {
    if (/^ ?! \[rejected\]|^error:|^fatal:|^CONFLICT|^Automatic merge failed/.test(l)) return 'ln bad';
    if (/^hint:/.test(l)) return 'ln hint';
    return 'ln';
  }

  // Make a command's output fit in max lines: first the hint lines shrink to one "hint: ...",
  // then the tail is cut. Lines that report an error or a conflict survive the first step.
  function fitLines(tagged, max) {
    if (tagged.length <= max) return tagged;
    var isHint = function (t) { return /^hint:/.test(t.text); };
    var plain = tagged.filter(function (t) { return !isHint(t); });
    if (plain.length + 1 <= max) {
      var out = [], placed = false;
      tagged.forEach(function (t) {
        if (!isHint(t)) out.push(t);
        else if (!placed) { out.push({ text: 'hint: ...', entry: t.entry, k: t.k }); placed = true; }
      });
      return out;
    }
    var cutAt = tagged[max - 1];
    return tagged.slice(0, max - 1).concat([{ text: '...', entry: cutAt.entry, k: cutAt.k }]);
  }

  // The newest command must stay readable with the most telling lines of its output. Older
  // commands fill whatever room is left above it (the box clips them at the top).
  function renderTerminals(ctx, animate) {
    PEOPLE.forEach(function (who) {
      var box = $('term-' + who);
      box.textContent = '';
      var entries = (ctx.terminals && ctx.terminals[who]) || [];
      if (!entries.length) return;
      var fresh = (ctx.freshEntries && ctx.freshEntries[who]) || 0;
      var room = (ctx.termHeight || TERM.story) - LINE.pad;
      var isFresh = function (i) { return animate && i >= entries.length - fresh; };
      var delayOf = function (e, k) {
        return (e.typeDelay || 0) + (e.continues ? 0 : Math.min(700, e.cmd.length * 22) + 200) + k * 70;
      };
      var line = function (text, i, k, old) {
        var e = entries[i];
        var d = htmlEl('div', lineClass(text) + old + (isFresh(i) ? ' fresh' : ''), box, text.replace(/\t/g, '    '));
        if (isFresh(i)) d.style.animationDelay = delayOf(e, k) + 'ms';
      };
      var command = function (i, old) {
        var e = entries[i];
        var cl = htmlEl('div', 'ln cmd' + old, box);
        htmlEl('span', 'ps', cl, '$ ');
        var txt = htmlEl('span', '', cl, isFresh(i) ? '' : e.cmd);
        if (isFresh(i)) typeInto(txt, e.cmd, cl, e.typeDelay || 0);
      };
      // the newest block: the last command plus any continuation of it
      var lastCmd = entries.length - 1;
      while (lastCmd > 0 && entries[lastCmd].continues) lastCmd--;
      for (var i = 0; i < lastCmd; i++) {
        if (!entries[i].continues) command(i, ' old');
        essential(entries[i].out).forEach(function (l, k) { line(l, i, k, ' old'); });
      }
      if (!entries[lastCmd].continues) command(lastCmd, '');
      var budget = room - (entries[lastCmd].continues ? 0 : LINE.cmd);
      var tagged = [];
      for (var b = lastCmd; b < entries.length; b++) {
        essential(entries[b].out).forEach(function (l, k) { tagged.push({ text: l, entry: b, k: k }); });
      }
      fitLines(tagged, Math.max(1, Math.floor(budget / LINE.out))).forEach(function (t) { line(t.text, t.entry, t.k, ''); });
    });
  }

  function typeInto(span, text, line, delay) {
    var caret = htmlEl('span', 'caret', line);
    var dur = Math.min(700, text.length * 22);
    Tween.add({ delay: delay, dur: Math.max(dur, 1), linear: true,
      step: function (t) { span.textContent = text.slice(0, Math.round(text.length * t)); },
      end: function () { span.textContent = text; caret.remove(); } });
  }

  // ===== Python syntax colouring: a small tokenizer, enough for the code on screen =====
  var PY_KW = { 'def': 1, 'if': 1, 'elif': 1, 'else': 1, 'return': 1, 'from': 1, 'import': 1, 'for': 1, 'in': 1,
    'while': 1, 'and': 1, 'or': 1, 'not': 1, 'class': 1, 'None': 1, 'True': 1, 'False': 1 };
  var PY_BUILTIN = { 'print': 1, 'round': 1, 'len': 1, 'range': 1 };
  var TOKEN = /(#.*$)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([^\s\w])/g;

  function pyTokens(line) {
    var out = [], m, prevWord = null;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(line))) {
      var cls = '';
      if (m[1]) cls = 'com';
      else if (m[2]) cls = 'str';
      else if (m[3]) cls = 'num';
      else if (m[4]) { cls = PY_KW[m[4]] ? 'kw' : prevWord === 'def' ? 'fn' : PY_BUILTIN[m[4]] ? 'bi' : ''; prevWord = m[4]; }
      out.push({ text: m[0], cls: cls });
    }
    return out;
  }

  function addTok(row, cls, text) {
    if (!text) return;
    if (cls) htmlEl('span', 'tok-' + cls, row, text); else row.appendChild(document.createTextNode(text));
  }

  // Python line with colours; with caretCol, a blinking caret at that column.
  function appendCode(row, text, caretCol) {
    var pos = 0, placed = caretCol === undefined || caretCol === null;
    pyTokens(text).forEach(function (t) {
      var end = pos + t.text.length;
      if (!placed && caretCol >= pos && caretCol < end) {
        addTok(row, t.cls, t.text.slice(0, caretCol - pos));
        htmlEl('span', 'code-caret', row);
        addTok(row, t.cls, t.text.slice(caretCol - pos));
        placed = true;
      } else addTok(row, t.cls, t.text);
      pos = end;
    });
    if (!placed) htmlEl('span', 'code-caret', row);
  }

  function isMarkerLine(l) { return /^(<<<<<<< |=======$|>>>>>>> )/.test(l); }

  // ===== the editor in each laptop: the file that person is working on =====

  // Who wrote this line: the author of the oldest commit on this laptop whose file contains it
  // (fetched commits count, so the incoming side of a conflict gets its author's colour).
  function lineAuthor(world, who, path, line) {
    var ids = world.commitsOf(who);
    for (var i = 0; i < ids.length; i++) {
      var c = world.commits[ids[i]];
      var text = c.tree[path];
      if (text && GitModel.splitLines(text).indexOf(line) >= 0) return c.author === 'start' ? who : c.author;
    }
    return who;
  }

  // One editor row: a line number (none for a struck-out old line), then the content.
  function codeRow(code, cls, num) {
    var row = htmlEl('div', cls, code);
    htmlEl('span', 'ln', row, num === null ? '' : String(num));
    return row;
  }

  // The finished view of a file, used for jumps, for Back and at the end of every typing.
  //  - a conflict: the two sides in their authors' colours, each marker line that opens a side
  //    labelled with the author's name;
  //  - a file this step changed: the old line struck out above the new one, tinted in the colour
  //    of whoever wrote it;
  //  - otherwise: a bar in the owner's colour beside every line not yet committed, as in VS Code.
  function drawStaticCode(code, world, who, path, text, prevText, changed, flash) {
    code.textContent = '';
    var lines = GitModel.splitLines(text);
    if (lines.some(function (l) { return /^<<<<<<< /.test(l); })) {
      var side = null;
      lines.forEach(function (l, i) {
        if (/^<<<<<<< /.test(l)) side = 'ours';
        else if (/^=======$/.test(l)) side = 'theirs';
        else if (/^>>>>>>> /.test(l)) side = null;
        if (isMarkerLine(l)) {
          var mrow = codeRow(code, 'cl marker', i + 1);
          mrow.appendChild(document.createTextNode(l));
          if (side && i + 1 < lines.length && !isMarkerLine(lines[i + 1])) {
            var tag = lineAuthor(world, who, path, lines[i + 1]);
            htmlEl('span', 'side-tag ' + tag, mrow, NAME[tag] + '\'s version');
          }
        } else {
          appendCode(codeRow(code, 'cl' + (side ? ' ' + side + ' ' + lineAuthor(world, who, path, l) : ''), i + 1), l, null);
        }
      });
      return;
    }
    var added = {}, removedBefore = {}, mod = {};
    var oldLines = changed && prevText !== undefined ? GitModel.splitLines(prevText) : null;
    if (oldLines) {
      var shift = 0;   // how far the new file has moved relative to the old one so far
      GitModel.diffHunks(oldLines, lines).forEach(function (h) {
        var newStart = h.a0 + shift;
        for (var k = 0; k < h.lines.length; k++) added[newStart + k] = true;
        var gone = oldLines.slice(h.a0, h.a1).filter(function (l) { return !isMarkerLine(l); });
        if (gone.length && gone.length <= 2 && h.lines.length) removedBefore[newStart] = gone;
        shift += h.lines.length - (h.a1 - h.a0);
      });
    } else {
      var head = world.tree(world.places[who].tip)[path];
      var headLines = head === undefined ? [] : GitModel.splitLines(head);
      var sh = 0;
      GitModel.diffHunks(headLines, lines).forEach(function (h) {
        for (var k = 0; k < h.lines.length; k++) mod[h.a0 + sh + k] = true;
        sh += h.lines.length - (h.a1 - h.a0);
      });
    }
    lines.forEach(function (l, i) {
      if (removedBefore[i]) removedBefore[i].forEach(function (g) { codeRow(code, 'cl del', null).appendChild(document.createTextNode(g)); });
      var cls = 'cl';
      if (added[i]) cls += ' add ' + lineAuthor(world, who, path, l) + (flash ? ' flash' : '');
      else if (mod[i]) cls += ' mod ' + who;
      appendCode(codeRow(code, cls, i + 1), l, null);
    });
  }

  // ===== typing: the code appears keystroke by keystroke, as if someone were programming =====
  // A changed line is edited in place (the caret travels to the change, deletes, types), a block is
  // selected and deleted, a new line is typed after its indentation. Times in milliseconds;
  // Carlos asked for "almost as if someone were typing it in real time", a bit faster.
  var TYPE = { key: 46, jitter: 16, space: 32, del: 80, travel: 420, lineEnd: 210, select: 650, settle: 350 };

  function typingFrames(before, after) {
    var A = GitModel.splitLines(before), B = GitModel.splitLines(after);
    var cur = A.slice(), frames = [], t = 0, shift = 0, presses = 0;
    function snap(caret, extra) {
      var f = { t: t, lines: cur.slice(), caret: caret };
      if (extra) for (var k in extra) f[k] = extra[k];
      frames.push(f);
    }
    function keyDelay(ch) {   // a steady rhythm with a little irregularity, the same on every run
      presses++;
      return ch === ' ' ? TYPE.space : TYPE.key + ((presses * 37) % (2 * TYPE.jitter + 1)) - TYPE.jitter;
    }
    snap(null);
    GitModel.diffHunks(A, B).forEach(function (h) {
      var row = h.a0 + shift, removed = h.a1 - h.a0;
      if (removed === 1 && h.lines.length === 1) {
        var line = cur[row], off = 0;
        GitModel.diffHunks(line.split(''), h.lines[0].split('')).forEach(function (c) {
          var at = c.a0 + off, gone = c.a1 - c.a0;
          t += TYPE.travel; snap({ row: row, col: at + gone }, { active: row });
          for (var d = 0; d < gone; d++) {
            var col = at + gone - d;
            line = line.slice(0, col - 1) + line.slice(col);
            cur[row] = line; t += TYPE.del; snap({ row: row, col: col - 1 }, { active: row });
          }
          c.lines.forEach(function (ch, k) {
            line = line.slice(0, at + k) + ch + line.slice(at + k);
            cur[row] = line; t += keyDelay(ch); snap({ row: row, col: at + k + 1 }, { active: row });
          });
          off += c.lines.length - gone;
        });
      } else {
        if (removed) {
          t += TYPE.travel; snap(null, { sel: [row, row + removed] });
          t += TYPE.select; cur.splice(row, removed); snap({ row: row, col: 0 });
        }
        h.lines.forEach(function (target, k) {
          var indent = target.match(/^\s*/)[0];
          cur.splice(row + k, 0, indent);
          t += TYPE.lineEnd; snap({ row: row + k, col: indent.length }, { active: row + k });
          for (var q = indent.length; q < target.length; q++) {
            cur[row + k] = target.slice(0, q + 1);
            t += keyDelay(target[q]); snap({ row: row + k, col: q + 1 }, { active: row + k });
          }
        });
      }
      shift += h.lines.length - removed;
    });
    t += TYPE.settle; snap(null);
    return frames;
  }

  function drawFrame(code, who, f) {
    code.textContent = '';
    f.lines.forEach(function (l, i) {
      var cls = 'cl';
      if (f.sel && i >= f.sel[0] && i < f.sel[1]) cls += ' sel';
      else if (f.active === i) cls += ' add ' + who;
      var caret = f.caret && f.caret.row === i ? f.caret.col : null;
      if (isMarkerLine(l)) { codeRow(code, cls + ' marker', i + 1).appendChild(document.createTextNode(l)); return; }
      appendCode(codeRow(code, cls, i + 1), l, caret);
    });
    if (!f.lines.length) appendCode(codeRow(code, 'cl add ' + who, 1), '', 0);
  }

  function playTyping(code, who, frames, done) {
    frames.forEach(function (f) {
      Tween.add({ delay: f.t, dur: 1, linear: true, step: function (x) { if (x >= 1) drawFrame(code, who, f); } });
    });
    Tween.add({ delay: frames[frames.length - 1].t + 1, dur: 1, step: function (x) { if (x >= 1) done(); } });
  }

  function renderEditors(world, prevWorld, ctx, animate) {
    PEOPLE.forEach(function (who) {
      var ed = $('ed-' + who), head = ed.querySelector('.ed-head'), code = ed.querySelector('.code');
      var path = ctx.open ? ctx.open[who] : null;
      var place = world.places[who];
      head.textContent = '';
      code.textContent = '';
      if (!place.cloned) return;
      if (!path || place.work[path] === undefined) { htmlEl('span', 'none', head, 'no file open'); return; }
      head.textContent = path;
      var text = place.work[path];
      var prevText = prevWorld && prevWorld.places[who].cloned ? prevWorld.places[who].work[path] : undefined;
      var edit = null;   // did this person type in this file during this step?
      (ctx.results || []).forEach(function (r) {
        r.events.forEach(function (ev) { if (ev.type === 'edit' && ev.who === who && ev.path === path) edit = ev; });
      });
      var changed = !!edit || (prevText !== undefined && prevText !== text);
      if (animate && edit) {
        var frames = typingFrames(edit.before || '', edit.after || '');
        drawFrame(code, who, frames[0]);
        playTyping(code, who, frames, function () { drawStaticCode(code, world, who, path, text, edit.before, true, false); });
      } else {
        drawStaticCode(code, world, who, path, text, edit ? edit.before : prevText, changed, animate);
      }
    });
  }

  // ===== focus =====
  function renderFocus(ctx) {
    var focus = ctx.focus;
    PLACES.forEach(function (who) {
      var dim = !!focus && focus.indexOf(who) < 0;
      $('place-' + who).classList.toggle('dim', dim);
      layers[who].root.classList.toggle('dim', dim);
    });
  }

  // ===== the closing summary: the whole history, as GitLab lists it =====
  function renderSummary(world, ctx) {
    var box = $('summary');
    if (!ctx.summary) { box.classList.remove('show'); return; }
    box.textContent = '';
    var log = htmlEl('div', 'log', box);
    htmlEl('h2', '', log, 'The whole history on GitLab');
    var ids = world.reachable(world.places.gitlab.tip).reverse();
    ids.forEach(function (id) {
      var c = world.commits[id];
      var row = htmlEl('div', 'log-row', log);
      htmlEl('span', 'dot ' + (c.parents.length > 1 ? 'merge' : c.author), row);
      htmlEl('span', 'hash', row, id);
      htmlEl('span', 'msg', row, c.message);
      htmlEl('span', 'who', row, c.author === 'start' ? '' : NAME[c.author]);
    });
    var rules = htmlEl('div', 'rules', box);
    htmlEl('h2', '', rules, 'Three rules');
    var ol = htmlEl('ol', '', rules);
    [['Pull before you push.'], ['Push rejected? Pull, then push again.'], ['Conflict? Decide what the line should be, then add and commit.']]
      .forEach(function (r) { htmlEl('li', '', ol, r[0]); });
    box.classList.add('show');
  }

  // ===== opening pictures and cutscenes (drawn by js/scenes.js) =====
  function renderScene(ctx, animate) {
    var box = $('scene');
    if (!ctx.scene || !window.GitScenes || !GitScenes[ctx.scene]) { box.classList.remove('show'); return; }
    $('scene-svg').innerHTML = GitScenes[ctx.scene](animate);
    box.classList.add('show');
  }

  // ===== the narrator =====
  // The text appears word by word while the face's mouth moves, so the room notices a new line.
  var talkTimer = null;
  function say(text, animate) {
    var c = $('caption'), face = $('face');
    c.textContent = '';
    c.classList.remove('long');
    if (animate && !noAnim) {
      text.split(' ').forEach(function (word, i) {
        var w = htmlEl('span', 'w', c, word);
        w.style.animationDelay = (i * 60) + 'ms';
        c.appendChild(document.createTextNode(' '));
      });
      face.classList.remove('nod', 'talk');
      void face.offsetWidth;
      face.classList.add('nod', 'talk');
      clearTimeout(talkTimer);
      talkTimer = setTimeout(function () { face.classList.remove('talk'); }, text.split(' ').length * 60 + 250);
    } else {
      c.textContent = text;
      face.classList.remove('talk');
    }
    if (c.scrollHeight > c.parentNode.clientHeight - 40) c.classList.add('long');
  }

  // ===== entry point =====
  function render(world, ctx) {
    Tween.finish();
    var animate = !!ctx.animate && !noAnim;
    var layouts = {};
    PLACES.forEach(function (who) { layouts[who] = GitLayout.layoutPlace(world, who); });
    var flightEnd = renderGraphs(world, ctx, layouts, animate);
    renderFx(world, ctx, layouts, animate);
    var landAt = {};
    (ctx.results || []).forEach(function (r) { r.events.forEach(function (ev) { if (ev.type === 'transfer') landAt[ev.to] = flightEnd - 300; }); });
    renderFiles(world, ctx, animate, landAt);
    renderTerminals(ctx, animate);
    renderEditors(world, ctx.prevWorld, ctx, animate);
    renderFocus(ctx);
    renderSummary(world, ctx);
    renderScene(ctx, animate);
    lastLayouts = layouts;
    drawAll();
  }

  window.GitView = {
    init: init,
    render: render,
    finish: function () { Tween.finish(); },
    busy: function () { return Tween.busy(); },
    remaining: function () { return Tween.remaining(); },
    setNoAnim: function (v) { noAnim = !!v; },
    say: say,
    BOX: BOX,
    TERM: TERM
  };
}());
