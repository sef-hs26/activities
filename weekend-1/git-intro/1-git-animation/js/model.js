/* git-viz: a small, faithful model of Git for one GitLab project and two laptops.
 *
 * Pure logic, no DOM. In the browser it is window.GitModel; in Node, require('./model.js').
 * The drawing code (view.js) only reads the state this file produces.
 *
 * What is modelled, following Git's real rules:
 *   - one branch (main) everywhere, so no branch names are ever needed on screen;
 *   - clone, edit, add, commit, push, fetch, pull (= fetch + merge with pull.rebase=false);
 *   - push is rejected when GitLab has commits the laptop does not have
 *     ("fetch first" if never fetched, "non-fast-forward" if fetched but not merged);
 *   - pull fast-forwards when it can, otherwise makes a merge commit with two parents;
 *   - a line-based three-way merge: changes to the same or adjacent lines conflict, like Git;
 *   - conflicts leave markers in the file; commit is refused until the file is added;
 *   - pull is refused when it would overwrite uncommitted changes.
 * Output lines imitate Git 2.50 (checked against real Git on 2026-10-27).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GitModel = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PEOPLE = ['carlos', 'marcel'];
  var PUSH_URL = 'gitlab.inf.ethz.ch:team01/shop.git';
  var FETCH_URL = 'gitlab.inf.ethz.ch:team01/shop';
  var MERGE_MESSAGE = "Merge branch 'main' of " + FETCH_URL;

  // ===== small helpers =====

  function copy(obj) { return JSON.parse(JSON.stringify(obj)); }

  function keys(obj) { return Object.keys(obj); }

  function unionPaths() {
    var seen = {};
    for (var i = 0; i < arguments.length; i++) {
      var o = arguments[i] || {};
      for (var k in o) seen[k] = true;
    }
    return keys(seen).sort();
  }

  function sameTree(a, b) {
    var paths = unionPaths(a, b);
    for (var i = 0; i < paths.length; i++) if (a[paths[i]] !== b[paths[i]]) return false;
    return true;
  }

  // Deterministic 7-hex ids (FNV-1a, two rounds). Real Git uses SHA-1; only the look matters here.
  function fnv1a(str, seed) {
    var h = seed >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }
  function shortHash(str) {
    var a = fnv1a(str, 0x811c9dc5).toString(16);
    var b = fnv1a(str, 0x01234567).toString(16);
    return ('00000000' + a).slice(-8).slice(0, 4) + ('00000000' + b).slice(-8).slice(0, 3);
  }

  function splitLines(text) {
    if (text === undefined || text === null || text === '') return [];
    var lines = text.split('\n');
    if (lines[lines.length - 1] === '') lines.pop();
    return lines;
  }
  function joinLines(lines) { return lines.length ? lines.join('\n') + '\n' : ''; }

  // ===== line diff and three-way merge =====

  // Hunks that turn a into b: each replaces a[a0:a1] by `lines`. LCS based; files here are tiny.
  function diffHunks(a, b) {
    var n = a.length, m = b.length, i, j;
    var L = [];
    for (i = 0; i <= n; i++) { L.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i -= 1) {
      for (j = m - 1; j >= 0; j -= 1) {
        L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
      }
    }
    var hunks = [], cur = null;
    i = 0; j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && a[i] === b[j]) {
        if (cur) { hunks.push(cur); cur = null; }
        i++; j++;
      } else if (i < n && (j === m || L[i + 1][j] >= L[i][j + 1])) {
        if (!cur) cur = { a0: i, a1: i, lines: [] };
        cur.a1 = i + 1; i++;
      } else {
        if (!cur) cur = { a0: i, a1: i, lines: [] };
        cur.lines.push(b[j]); j++;
      }
    }
    if (cur) hunks.push(cur);
    return hunks;
  }

  function lineChanges(beforeText, afterText) {
    var hunks = diffHunks(splitLines(beforeText), splitLines(afterText));
    var ins = 0, del = 0;
    hunks.forEach(function (h) { ins += h.lines.length; del += h.a1 - h.a0; });
    return { insertions: ins, deletions: del, hunks: hunks };
  }

  function applyRegion(base, start, end, hunks) {
    var res = [], p = start;
    hunks.forEach(function (h) {
      while (p < h.a0) res.push(base[p++]);
      Array.prototype.push.apply(res, h.lines);
      p = h.a1;
    });
    while (p < end) res.push(base[p++]);
    return res;
  }

  function sameLines(x, y) {
    if (x.length !== y.length) return false;
    for (var i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
    return true;
  }

  // Line-based three-way merge. Like Git's xdiff merge, two changes conflict when they overlap
  // or touch (one ends exactly where the other starts); identical changes merge cleanly.
  // favor: undefined (write conflict markers), 'ours' or 'theirs' (resolve every conflict).
  function merge3(baseText, oursText, theirsText, oursLabel, theirsLabel, favor) {
    var base = splitLines(baseText);
    var ho = diffHunks(base, splitLines(oursText)).map(function (h) { h.side = 'o'; return h; });
    var ht = diffHunks(base, splitLines(theirsText)).map(function (h) { h.side = 't'; return h; });
    var out = [], conflicts = 0, pos = 0, io = 0, it = 0, regions = [];
    while (io < ho.length || it < ht.length) {
      var first = (io < ho.length && (it >= ht.length || ho[io].a0 <= ht[it].a0)) ? ho[io++] : ht[it++];
      var group = [first], start = first.a0, end = first.a1, grew = true;
      while (grew) {
        grew = false;
        while (io < ho.length && ho[io].a0 <= end) { group.push(ho[io]); end = Math.max(end, ho[io].a1); io++; grew = true; }
        while (it < ht.length && ht[it].a0 <= end) { group.push(ht[it]); end = Math.max(end, ht[it].a1); it++; grew = true; }
      }
      while (pos < start) out.push(base[pos++]);
      var os = group.filter(function (h) { return h.side === 'o'; }).sort(function (a, b) { return a.a0 - b.a0; });
      var ts = group.filter(function (h) { return h.side === 't'; }).sort(function (a, b) { return a.a0 - b.a0; });
      var oursLines = applyRegion(base, start, end, os);
      var theirsLines = applyRegion(base, start, end, ts);
      if (!ts.length) Array.prototype.push.apply(out, oursLines);
      else if (!os.length) Array.prototype.push.apply(out, theirsLines);
      else if (sameLines(oursLines, theirsLines)) Array.prototype.push.apply(out, oursLines);
      else if (favor === 'ours') Array.prototype.push.apply(out, oursLines);
      else if (favor === 'theirs') Array.prototype.push.apply(out, theirsLines);
      else {
        conflicts++;
        var at = out.length;
        out.push('<<<<<<< ' + oursLabel);
        Array.prototype.push.apply(out, oursLines);
        out.push('=======');
        Array.prototype.push.apply(out, theirsLines);
        out.push('>>>>>>> ' + theirsLabel);
        regions.push({ start: at, oursCount: oursLines.length, theirsCount: theirsLines.length });
      }
      pos = end;
    }
    while (pos < base.length) out.push(base[pos++]);
    return { text: joinLines(out), conflicts: conflicts, regions: regions };
  }

  // ===== output formatting (imitates Git) =====

  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  function summaryLine(files, ins, del) {
    var parts = [' ' + plural(files, 'file changed', 'files changed')];
    if (ins || (!ins && !del)) parts.push(plural(ins, 'insertion(+)', 'insertions(+)'));
    if (del) parts.push(plural(del, 'deletion(-)', 'deletions(-)'));
    return parts.join(', ');
  }

  // Lines like " total.py | 2 +-" for each changed path, then the summary line.
  function diffstat(before, after) {
    var paths = unionPaths(before, after).filter(function (p) { return before[p] !== after[p]; });
    if (!paths.length) return [];
    var width = Math.max.apply(null, paths.map(function (p) { return p.length; }));
    var lines = [], ti = 0, td = 0;
    paths.forEach(function (p) {
      var c = lineChanges(before[p], after[p]);
      ti += c.insertions; td += c.deletions;
      var name = (p + '                    ').slice(0, width);
      lines.push(' ' + name + ' | ' + (c.insertions + c.deletions) + ' ' +
        new Array(c.insertions + 1).join('+') + new Array(c.deletions + 1).join('-'));
    });
    lines.push(summaryLine(paths.length, ti, td));
    paths.forEach(function (p) {
      if (before[p] === undefined) lines.push(' create mode 100644 ' + p);
      else if (after[p] === undefined) lines.push(' delete mode 100644 ' + p);
    });
    return lines;
  }

  // ===== the world: GitLab plus two laptops =====

  function emptyPlace(name, kind) {
    return { name: name, kind: kind, has: {}, tip: null, origin: null, work: {}, index: {},
      merging: null, cloned: kind === 'remote' };
  }

  function World(options) {
    options = options || {};
    this.commits = {};
    this.seq = 0;          // creation order of commits
    this.pubSeq = 0;       // order in which commits first reached GitLab
    this.pullConfigured = options.pullConfigured !== false;   // git config pull.rebase false
    this.places = {
      gitlab: emptyPlace('gitlab', 'remote'),
      carlos: emptyPlace('carlos', 'local'),
      marcel: emptyPlace('marcel', 'local')
    };
  }

  World.prototype.clone = function () {
    var w = new World({ pullConfigured: this.pullConfigured });
    w.commits = copy(this.commits); w.seq = this.seq; w.pubSeq = this.pubSeq;
    w.places = copy(this.places);
    return w;
  };

  World.prototype.tree = function (id) { return id ? this.commits[id].tree : {}; };

  World.prototype._newCommit = function (author, parents, tree, message, label) {
    var seq = this.seq++;
    var body = JSON.stringify([parents, author, message, tree, seq]);
    var id = shortHash(body), salt = 0;
    while (this.commits[id]) id = shortHash(body + '#' + (++salt));
    this.commits[id] = { id: id, parents: parents.slice(), author: author, message: message,
      label: label || '', tree: copy(tree), seq: seq, pub: null };
    return id;
  };

  World.prototype._publish = function (ids) {
    var self = this;
    ids.slice().sort(function (a, b) { return self.commits[a].seq - self.commits[b].seq; })
      .forEach(function (id) { if (self.commits[id].pub === null) self.commits[id].pub = ++self.pubSeq; });
  };

  // All commits reachable from id (id included), oldest first.
  World.prototype.reachable = function (id) {
    var self = this, seen = {}, stack = id ? [id] : [];
    while (stack.length) {
      var x = stack.pop();
      if (seen[x]) continue;
      seen[x] = true;
      self.commits[x].parents.forEach(function (p) { stack.push(p); });
    }
    return keys(seen).sort(function (a, b) { return self.commits[a].seq - self.commits[b].seq; });
  };

  World.prototype.isAncestor = function (a, b) {
    if (!a) return true;
    if (!b) return false;
    return this.reachable(b).indexOf(a) >= 0;
  };

  // Best common ancestor: a common ancestor that is not an ancestor of another common ancestor.
  World.prototype.mergeBase = function (a, b) {
    var self = this, ra = this.reachable(a), rb = {};
    this.reachable(b).forEach(function (x) { rb[x] = true; });
    var common = ra.filter(function (x) { return rb[x]; });
    var best = common.filter(function (x) {
      return !common.some(function (y) { return y !== x && self.isAncestor(x, y); });
    });
    best.sort(function (x, y) { return self.commits[y].seq - self.commits[x].seq; });
    return best[0] || null;
  };

  World.prototype.commitsOf = function (who) {
    var self = this;
    return keys(this.places[who].has).sort(function (a, b) { return self.commits[a].seq - self.commits[b].seq; });
  };

  function result(who, cmd, ok, out, events, extra) {
    var r = { who: who, cmd: cmd, ok: ok, out: out || [], events: events || [] };
    if (extra) for (var k in extra) r[k] = extra[k];
    return r;
  }

  // ===== GitLab side =====

  // The project as created on GitLab (with a README). Author 'start' is drawn neutral.
  World.prototype.initRemote = function (files, message, label) {
    var r = this.places.gitlab;
    var id = this._newCommit('start', [], files, message || 'Initial commit', label || 'README');
    r.has[id] = true; r.tip = id;
    this._publish([id]);
    return result('gitlab', null, true, [], [{ type: 'create', place: 'gitlab', id: id }]);
  };

  // ===== laptop commands =====

  World.prototype.cloneRepo = function (who) {
    var p = this.places[who], r = this.places.gitlab;
    var cmd = 'git clone git@' + PUSH_URL;
    if (p.cloned) {
      return result(who, cmd, false, ["fatal: destination path 'shop' already exists and is not an empty directory."]);
    }
    var ids = this.reachable(r.tip);
    ids.forEach(function (id) { p.has[id] = true; });
    p.cloned = true; p.tip = r.tip; p.origin = r.tip;
    p.work = copy(this.tree(r.tip)); p.index = copy(this.tree(r.tip));
    return result(who, cmd, true, ["Cloning into 'shop'...", 'done.'],
      [{ type: 'transfer', kind: 'clone', from: 'gitlab', to: who, ids: ids }]);
  };

  // Typing in the editor: not a Git command.
  World.prototype.write = function (who, path, content) {
    var p = this.places[who];
    var before = p.work[path];
    if (content === undefined) delete p.work[path]; else p.work[path] = content;
    return result(who, null, true, [], [{ type: 'edit', who: who, path: path, before: before, after: content }]);
  };

  World.prototype.add = function (who, paths) {
    var p = this.places[who];
    var cmd = 'git add ' + paths.join(' ');
    for (var i = 0; i < paths.length; i++) {
      if (!(paths[i] in p.work) && !(paths[i] in p.index)) {
        return result(who, cmd, false, ["fatal: pathspec '" + paths[i] + "' did not match any files"]);
      }
    }
    paths.forEach(function (path) {
      if (path in p.work) p.index[path] = p.work[path]; else delete p.index[path];
      if (p.merging) p.merging.unmerged = p.merging.unmerged.filter(function (u) { return u !== path; });
    });
    return result(who, cmd, true, [], [{ type: 'stage', who: who, paths: paths.slice() }]);
  };

  // Paths whose working copy differs from the index, or that Git does not track yet.
  World.prototype.status = function (who) {
    var p = this.places[who], head = this.tree(p.tip);
    var st = { untracked: [], modified: [], staged: [], unmerged: p.merging ? p.merging.unmerged.slice() : [] };
    unionPaths(p.work, p.index, head).forEach(function (path) {
      if (st.unmerged.indexOf(path) >= 0) return;
      var inIndex = path in p.index, inHead = path in head;
      if (!inIndex && !inHead && path in p.work) { st.untracked.push(path); return; }
      if (p.index[path] !== head[path]) st.staged.push(path);
      if (inIndex && p.work[path] !== p.index[path]) st.modified.push(path);
    });
    return st;
  };

  World.prototype.commit = function (who, message, label) {
    var p = this.places[who];
    var head = this.tree(p.tip);
    var merging = p.merging;
    var msg = message || (merging ? MERGE_MESSAGE : '');
    var cmd = message ? 'git commit -m "' + message + '"' : 'git commit';
    if (merging && merging.unmerged.length) {
      return result(who, cmd, false, [
        'error: Committing is not possible because you have unmerged files.',
        "hint: Fix them up in the work tree, and then use 'git add/rm <file>'",
        'hint: as appropriate to mark resolution and make a commit.',
        'fatal: Exiting because of an unresolved conflict.'].concat(
        merging.unmerged.map(function (u) { return 'U\t' + u; })));
    }
    if (!merging && sameTree(p.index, head)) {
      var st = this.status(who);
      var out = (st.modified.length || st.untracked.length)
        ? ['no changes added to commit (use "git add" and/or "git commit -a")']
        : ['nothing to commit, working tree clean'];
      return result(who, cmd, false, ['On branch main'].concat(out));
    }
    var parents = merging ? [p.tip, merging.theirs] : [p.tip];
    var id = this._newCommit(who, parents, p.index, msg, label || (merging ? 'merge' : ''));
    p.has[id] = true; p.tip = id; p.merging = null;
    var lines = ['[main ' + id + '] ' + msg];
    if (!merging) {
      var stat = diffstat(head, this.commits[id].tree);
      lines = lines.concat(stat.filter(function (l) { return l.indexOf(' | ') < 0; }));
    }
    return result(who, cmd, true, lines, [{ type: merging ? 'merge-commit' : 'commit', who: who, id: id }]);
  };

  World.prototype.push = function (who) {
    var p = this.places[who], r = this.places.gitlab;
    var cmd = 'git push';
    if (p.tip === r.tip) return result(who, cmd, true, ['Everything up-to-date'], [{ type: 'noop', who: who }]);
    if (!this.isAncestor(r.tip, p.tip)) {
      var known = !!p.has[r.tip];
      var out = ['To ' + PUSH_URL,
        ' ! [rejected]        main -> main (' + (known ? 'non-fast-forward' : 'fetch first') + ')',
        "error: failed to push some refs to '" + PUSH_URL + "'"];
      out = out.concat(known ? [
        'hint: Updates were rejected because the tip of your current branch is behind',
        "hint: its remote counterpart. If you want to integrate the remote changes,",
        "hint: use 'git pull' before pushing again."
      ] : [
        'hint: Updates were rejected because the remote contains work that you do not',
        'hint: have locally. This is usually caused by another repository pushing to',
        "hint: the same ref. If you want to integrate the remote changes, use",
        "hint: 'git pull' before pushing again."
      ]);
      var self = this;
      var mine = this.reachable(p.tip).filter(function (id) { return !r.has[id]; });
      var missing = this.reachable(r.tip).filter(function (id) { return !self.isAncestor(id, p.tip); });
      return result(who, cmd, false, out,
        [{ type: 'rejected', who: who, ids: mine, missing: missing, reason: known ? 'non-fast-forward' : 'fetch first' }],
        { rejected: true });
    }
    var newIds = this.reachable(p.tip).filter(function (id) { return !r.has[id]; });
    newIds.forEach(function (id) { r.has[id] = true; });
    this._publish(newIds);
    var old = r.tip;
    r.tip = p.tip; p.origin = p.tip;
    return result(who, cmd, true, ['To ' + PUSH_URL, '   ' + old + '..' + p.tip + '  main -> main'],
      [{ type: 'transfer', kind: 'push', from: who, to: 'gitlab', ids: newIds }]);
  };

  World.prototype.fetch = function (who) {
    var p = this.places[who], r = this.places.gitlab;
    var newIds = this.reachable(r.tip).filter(function (id) { return !p.has[id]; });
    newIds.forEach(function (id) { p.has[id] = true; });
    var old = p.origin;
    p.origin = r.tip;
    var out = (old !== r.tip) ? ['From ' + FETCH_URL, '   ' + old + '..' + r.tip + '  main       -> origin/main'] : [];
    return result(who, 'git fetch', true, out,
      newIds.length ? [{ type: 'transfer', kind: 'fetch', from: 'gitlab', to: who, ids: newIds }] : []);
  };

  // The second half of git pull: merge origin/main into main.
  World.prototype.mergeOrigin = function (who) {
    var p = this.places[who];
    var theirs = p.origin, ours = p.tip;
    var cmd = 'git merge';
    if (p.merging) {
      return result(who, cmd, false, ['error: You have not concluded your merge (MERGE_HEAD exists).',
        'hint: Please, commit your changes before merging.',
        'fatal: Exiting because of unfinished merge.'], [], { refused: true });
    }
    if (theirs === ours || this.isAncestor(theirs, ours)) {
      return result(who, cmd, true, ['Already up to date.'], [{ type: 'noop', who: who }]);
    }
    var head = this.tree(ours);
    if (this.isAncestor(ours, theirs)) {
      var after = this.tree(theirs);
      var touched = unionPaths(head, after).filter(function (path) { return head[path] !== after[path]; });
      var dirty = touched.filter(function (path) { return p.work[path] !== head[path] || p.index[path] !== head[path]; });
      if (dirty.length) {
        return result(who, cmd, false, ['Updating ' + ours + '..' + theirs,
          'error: Your local changes to the following files would be overwritten by merge:']
          .concat(dirty.map(function (d) { return '\t' + d; }))
          .concat(['Please commit your changes or stash them before you merge.', 'Aborting']), [], { refused: true });
      }
      touched.forEach(function (path) {
        if (after[path] === undefined) { delete p.work[path]; delete p.index[path]; }
        else { p.work[path] = after[path]; p.index[path] = after[path]; }
      });
      p.tip = theirs;
      return result(who, cmd, true, ['Updating ' + ours + '..' + theirs, 'Fast-forward'].concat(diffstat(head, after)),
        [{ type: 'fast-forward', who: who, from: ours, to: theirs, paths: touched }]);
    }
    if (!this.pullConfigured) {
      return result(who, cmd, false, [
        'hint: You have divergent branches and need to specify how to reconcile them.',
        'hint: You can do so by running one of the following commands sometime before',
        'hint: your next pull:',
        'hint:',
        'hint:   git config pull.rebase false  # merge',
        'hint:   git config pull.rebase true   # rebase',
        'hint:   git config pull.ff only       # fast-forward only',
        'fatal: Need to specify how to reconcile divergent branches.'], [], { refused: true });
    }
    var staged = unionPaths(p.index, head).filter(function (path) { return p.index[path] !== head[path]; });
    var baseId = this.mergeBase(ours, theirs);
    var B = this.tree(baseId), T = this.tree(theirs);
    var merged = {}, unmerged = [], auto = [];
    unionPaths(B, head, T).forEach(function (path) {
      var b = B[path], o = head[path], t = T[path];
      if (o === t) merged[path] = o;
      else if (b === o) merged[path] = t;
      else if (b === t) merged[path] = o;
      else {
        auto.push(path);
        var m = merge3(b === undefined ? '' : b, o === undefined ? '' : o, t === undefined ? '' : t, 'HEAD', theirs);
        merged[path] = m.text;
        if (m.conflicts) unmerged.push(path);
      }
    });
    var changes = unionPaths(head, merged).filter(function (path) { return head[path] !== merged[path]; });
    var blocked = changes.filter(function (path) { return p.work[path] !== head[path]; }).concat(staged)
      .filter(function (x, i, arr) { return arr.indexOf(x) === i; });
    if (blocked.length) {
      return result(who, cmd, false, ['error: Your local changes to the following files would be overwritten by merge:']
        .concat(blocked.map(function (d) { return '\t' + d; }))
        .concat(['Please commit your changes or stash them before you merge.', 'Aborting']), [], { refused: true });
    }
    changes.forEach(function (path) {
      if (merged[path] === undefined) { delete p.work[path]; delete p.index[path]; return; }
      p.work[path] = merged[path];
      if (unmerged.indexOf(path) < 0) p.index[path] = merged[path];
    });
    var autoLines = auto.map(function (path) { return 'Auto-merging ' + path; });
    if (unmerged.length) {
      p.merging = { theirs: theirs, base: baseId, unmerged: unmerged.slice() };
      return result(who, cmd, false, autoLines
        .concat(unmerged.map(function (path) { return 'CONFLICT (content): Merge conflict in ' + path; }))
        .concat(['Automatic merge failed; fix conflicts and then commit the result.']),
        [{ type: 'conflict', who: who, ours: ours, theirs: theirs, paths: unmerged.slice() }], { conflict: true });
    }
    var id = this._newCommit(who, [ours, theirs], p.index, MERGE_MESSAGE, 'merge');
    p.has[id] = true; p.tip = id;
    return result(who, cmd, true, autoLines.concat(["Merge made by the 'ort' strategy."]).concat(diffstat(head, merged)),
      [{ type: 'merge-commit', who: who, id: id }]);
  };

  World.prototype.pull = function (who) {
    var f = this.fetch(who);
    var m = this.mergeOrigin(who);
    return result(who, 'git pull', m.ok, f.out.concat(m.out), f.events.concat(m.events),
      { conflict: !!m.conflict, refused: !!m.refused });
  };

  // Free play: settle every conflict region of a file in one go, then git add it.
  World.prototype.resolve = function (who, path, favor) {
    var p = this.places[who];
    if (!p.merging || p.merging.unmerged.indexOf(path) < 0) return result(who, null, false, []);
    var ours = this.tree(p.tip)[path], theirs = this.tree(p.merging.theirs)[path];
    var base = this.tree(p.merging.base)[path];
    var m = merge3(base || '', ours || '', theirs || '', 'HEAD', p.merging.theirs, favor);
    var w = this.write(who, path, m.text);
    var a = this.add(who, [path]);
    return result(who, a.cmd, true, [], w.events.concat(a.events));
  };

  return {
    World: World,
    PEOPLE: PEOPLE,
    PUSH_URL: PUSH_URL,
    FETCH_URL: FETCH_URL,
    MERGE_MESSAGE: MERGE_MESSAGE,
    merge3: merge3,
    diffHunks: diffHunks,
    lineChanges: lineChanges,
    splitLines: splitLines,
    joinLines: joinLines,
    sameTree: sameTree
  };
}));
