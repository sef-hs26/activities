/* git-viz: where each commit sits in a place's graph. Pure, no DOM.
 *
 * The same commits are drawn the same way in every place, so the room can see at a glance
 * that GitLab and a laptop hold the same history.
 *   - Column: time flows left to right. A commit sits one column right of its newest parent.
 *   - Lane: lane 0 is the straight line. Commits are placed column by column; among commits of
 *     one column, the one that reached GitLab first gets the straighter lane (commits that never
 *     reached GitLab come last). A commit stays on its parent's lane when it is free, a merge
 *     takes the lowest lane of its parents, otherwise the commit moves one lane down.
 * Consequence in the story: when Carlos pulls Marcel's commit, Marcel's commit (already on
 * GitLab) takes the straight line and Carlos's own commit steps down a lane. On GitLab and on
 * Marcel's laptop nothing moves later, because they get the same picture.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GitLayout = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var NEVER = 1e9;

  function cmp(a, b) {
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
  }

  function freeLane(taken, col, from) {
    var lane = from;
    while (taken[col + ',' + lane]) lane++;
    return lane;
  }

  function layoutPlace(world, who) {
    var place = world.places[who];
    var ids = world.commitsOf(who);              // creation order, so parents come first
    var col = {}, lane = {}, taken = {};
    ids.forEach(function (id) {
      var c = world.commits[id];
      col[id] = c.parents.length ? 1 + Math.max.apply(null, c.parents.map(function (q) { return col[q]; })) : 0;
    });
    var order = ids.slice().sort(function (a, b) {
      var ca = world.commits[a], cb = world.commits[b];
      return cmp([col[a], ca.pub === null ? NEVER : ca.pub, ca.seq], [col[b], cb.pub === null ? NEVER : cb.pub, cb.seq]);
    });
    order.forEach(function (id) {
      var c = world.commits[id];
      var want = 0;
      if (c.parents.length === 1) want = lane[c.parents[0]];
      else if (c.parents.length > 1) want = Math.min.apply(null, c.parents.map(function (q) { return lane[q]; }));
      lane[id] = freeLane(taken, col[id], want);
      taken[col[id] + ',' + lane[id]] = true;
    });

    var nodes = ids.map(function (id) {
      var c = world.commits[id];
      return { id: id, col: col[id], lane: lane[id], author: c.author, label: c.label,
        merge: c.parents.length > 1, tip: id === place.tip, message: c.message };
    });
    var edges = [];
    ids.forEach(function (id) {
      world.commits[id].parents.forEach(function (q) { edges.push({ from: q, to: id }); });
    });

    // The commit being prepared: after git add (staged changes), or a merge in progress.
    var pending = null;
    if (place.kind === 'local' && place.tip) {
      if (place.merging) {
        var ps = [place.tip, place.merging.theirs];
        var pc = 1 + Math.max(col[ps[0]], col[ps[1]]);
        pending = { col: pc, lane: freeLane(taken, pc, Math.min(lane[ps[0]], lane[ps[1]])), kind: 'merge',
          parents: ps, author: who, conflict: place.merging.unmerged.length > 0 };
      } else if (!sameTree(place.index, world.tree(place.tip))) {
        var c1 = col[place.tip] + 1;
        pending = { col: c1, lane: freeLane(taken, c1, lane[place.tip]), kind: 'commit',
          parents: [place.tip], author: who, conflict: false };
      }
    }

    var maxCol = 0, maxLane = 0;
    nodes.forEach(function (n) { maxCol = Math.max(maxCol, n.col); maxLane = Math.max(maxLane, n.lane); });
    if (pending) { maxCol = Math.max(maxCol, pending.col); maxLane = Math.max(maxLane, pending.lane); }
    return { who: who, nodes: nodes, edges: edges, pending: pending, cols: nodes.length ? maxCol + 1 : 0, lanes: maxLane + 1 };
  }

  function sameTree(a, b) {
    var k, seen = {};
    for (k in a) seen[k] = true;
    for (k in b) seen[k] = true;
    for (k in seen) if (a[k] !== b[k]) return false;
    return true;
  }

  // A compact text picture of a layout, used by the tests: "label@col,lane" sorted by position.
  function describe(layout) {
    return layout.nodes.slice().sort(function (a, b) { return cmp([a.col, a.lane], [b.col, b.lane]); })
      .map(function (n) { return (n.label || n.id) + '@' + n.col + ',' + n.lane; }).join(' ');
  }

  return { layoutPlace: layoutPlace, describe: describe };
}));
