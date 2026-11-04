/* git-viz app: the story player and free play. Wires the model (model.js), the story data
 * (story.js) and the drawing (view.js) together.
 *
 * URL hash: #step=12 opens step 12; #free&step=12 opens free play from step 12;
 * &noanim renders without animation (for screenshots); &theme=dark picks the dark theme.
 */
(function () {
  'use strict';

  var S = GitStory.STEPS, CHAPTERS = GitStory.CHAPTERS;
  var NAME = { carlos: 'Carlos', marcel: 'Marcel' };
  var state = { mode: 'story', step: 0, freeBase: 0, freeActions: [] };
  var cache = {};

  function $(id) { return document.getElementById(id); }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function flat(list) { return [].concat.apply([], list || []); }

  // ===== the stage keeps 16:9 and scales to the window =====
  function fit() {
    var w = window.innerWidth, h = window.innerHeight;
    var s = Math.min(w / 1600, h / 900);
    $('stage').style.transform = 'translate(' + ((w - 1600 * s) / 2).toFixed(1) + 'px,' + ((h - 900 * s) / 2).toFixed(1) + 'px) scale(' + s.toFixed(5) + ')';
  }

  // ===== story replay (cached: each step is a pure function of the steps before it) =====
  function replay(n) {
    if (!cache[n]) cache[n] = GitStory.replay(GitModel, n);
    return cache[n];
  }

  // Terminal entries per person, built from every result up to a step.
  function terminalsFrom(steps, resultsPerStep, upto) {
    var T = { carlos: [], marcel: [] };
    for (var i = 0; i <= upto; i++) {
      var st = steps[i];
      resultsPerStep[i].forEach(function (r) {
        if (!T[r.who] || !r.cmd) return;     // typing in the editor has no command
        if (st.continues) T[r.who].push({ continues: true, out: r.out.slice(), step: i });
        else T[r.who].push({ cmd: st.term || r.cmd, out: r.out.slice(), step: i });
      });
    }
    return T;
  }

  function freshCount(T, step) {
    var F = {};
    Object.keys(T).forEach(function (who) {
      var n = 0, acc = 0;
      T[who].forEach(function (e) {
        if (e.step !== step) return;
        n++;
        e.typeDelay = acc;
        acc += (e.continues ? 0 : Math.min(700, e.cmd.length * 22) + 260) + e.out.length * 70 + 200;
      });
      F[who] = n;
    });
    return F;
  }

  function focusFor(step) {
    if (!step.who) return null;
    var remote = step.ops.some(function (op) { return ['clone', 'push', 'pull', 'fetch'].indexOf(op[0]) >= 0; });
    return remote ? [step.who, 'gitlab'] : [step.who];
  }

  // ===== story mode =====
  function goStory(n, animate) {
    n = clamp(n, 0, S.length - 1);
    var forward = animate && n === state.step + 1;
    state.mode = 'story';
    state.step = n;
    var run = replay(n);
    var steps = S.slice(0, n + 1);
    var T = terminalsFrom(steps, run.results, n);
    var ctx = {
      animate: forward,
      results: flat(run.results[n]),
      prevWorld: n > 0 ? replay(n - 1).world : null,
      terminals: T,
      freshEntries: forward ? freshCount(T, n) : {},
      open: GitStory.openFiles(n),
      focus: focusFor(S[n]),
      summary: !!S[n].summary,
      scene: S[n].scene || null,
      termHeight: GitView.TERM.story
    };
    GitView.render(run.world, ctx);
    GitView.say(S[n].say, forward);
    renderChrome();
    writeHash();
  }



  function chapterIndex(id) { for (var i = 0; i < CHAPTERS.length; i++) if (CHAPTERS[i].id === id) return i; return 0; }

  function renderChrome() {
    var free = state.mode === 'free';
    $('stage').classList.toggle('free', free);
    $('mode-story').classList.toggle('on', !free);
    $('mode-free').classList.toggle('on', free);
    var nav = $('chapters');
    nav.textContent = '';
    var nowCh = chapterIndex(S[state.step].chapter);
    CHAPTERS.forEach(function (ch, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = ch.title;
      if (!free) b.className = i < nowCh ? 'done' : i === nowCh ? 'now' : '';
      b.addEventListener('click', function () {
        var first = 0;
        for (var k = 0; k < S.length; k++) if (S[k].chapter === ch.id) { first = k; break; }
        goStory(first, false);
      });
      nav.appendChild(b);
    });
    $('prev').disabled = state.step === 0;
    $('next').disabled = state.step === S.length - 1;
    $('stepno').textContent = free
      ? (state.nopull ? 'free play, fresh Git' : 'free play from step ' + state.freeBase)
      : 'step ' + state.step + ' of ' + (S.length - 1);
    $('undo').disabled = !state.freeActions.length;
    $('reset').disabled = !state.freeActions.length;
  }

  // ===== free play =====
  var DISCOUNTS = { carlos: [2, 7, 3, 8, 1], marcel: [6, 3, 9, 4, 1] };

  // Free play edits one known line per file, so the same line can be changed by both people.
  function editTotal(w, who, nth) {
    var cur = w.places[who].work['total.py'];
    var m = /# (\d+)% off/.exec(cur || '');
    var now = m ? +m[1] : 5;
    var seq = DISCOUNTS[who], next = seq[nth % seq.length];
    if (next === now) next = seq[(nth + 1) % seq.length];
    var base = cur && m ? cur : GitStory.total(5);
    var text = base.replace(/amount \* [0-9.]+   # \d+% off/, 'amount * ' + (1 - next / 100).toFixed(2) + '   # ' + next + '% off');
    return { results: [w.write(who, 'total.py', text)],
      caption: NAME[who] + ' changes the discount to ' + next + '%. It is not saved in a commit yet.', show: 'total.py' };
  }

  function editReceipt(w, who) {
    var cur = w.places[who].work['receipt.py'] || GitStory.receipt(false);
    var text, what;
    if (who === 'carlos') {
      text = /, "CHF"\)/.test(cur) ? cur.replace(', "CHF")', ')') : cur.replace(/\)\n$/, ', "CHF")\n');
      what = /, "CHF"\)/.test(text) ? 'adds the currency to the receipt' : 'removes the currency from the receipt';
    } else {
      text = /"Total:"/.test(cur) ? cur.replace('"Total:"', '"To pay:"') : cur.replace('"To pay:"', '"Total:"');
      what = /"To pay:"/.test(text) ? 'changes the receipt to say "To pay:"' : 'changes the receipt back to "Total:"';
    }
    return { results: [w.write(who, 'receipt.py', text)], caption: NAME[who] + ' ' + what + '. It is not saved in a commit yet.', show: 'receipt.py' };
  }

  function commitAll(w, who) {
    var p = w.places[who], res = [];
    var st = w.status(who);
    var paths = st.modified.concat(st.untracked);
    if (paths.length) res.push(w.add(who, paths));
    var head = w.tree(p.tip), idx = p.index;
    var parts = [], labels = [];
    if (idx['total.py'] !== head['total.py'] && idx['total.py']) {
      var m = /# (\d+)% off/.exec(idx['total.py']);
      parts.push(m ? 'Discount ' + m[1] + '%' : 'Update total'); labels.push(m ? m[1] + '%' : 'total');
    }
    if (idx['receipt.py'] !== head['receipt.py'] && idx['receipt.py']) { parts.push('Update receipt'); labels.push('receipt'); }
    var merging = !!p.merging;
    var r = merging ? w.commit(who) : w.commit(who, parts.join(', ') || 'Update', labels.join(' + '));
    res.push(r);
    var caption;
    if (r.ok) caption = merging ? NAME[who] + ' commits the merge. Both lines of work are joined.'
      : NAME[who] + ' commits. Only his laptop has this commit so far.';
    else if (/unmerged/.test(r.out.join(' '))) caption = 'Git refuses: the conflict is not solved yet. Keep one version first.';
    else caption = 'Nothing to commit: ' + NAME[who] + ' has no changes since his last commit.';
    return { results: res, caption: caption };
  }

  function push(w, who) {
    var r = w.push(who);
    var caption = r.ok ? (r.out[0] === 'Everything up-to-date' ? 'Nothing to push: GitLab already has all of ' + NAME[who] + '\'s commits.'
      : NAME[who] + ' pushes. GitLab now has his commits.')
      : 'Rejected: GitLab has commits that ' + NAME[who] + ' does not have. Pull first, then push.';
    return { results: [r], caption: caption };
  }

  function pull(w, who) {
    var r = w.pull(who);
    var out = r.out.join('\n'), caption, show = null;
    if (r.conflict) { caption = 'Conflict: both changed the same line. Keep one version, then commit.'; show = w.places[who].merging.unmerged[0]; }
    else if (/Need to specify/.test(out)) caption = 'Git stops: this laptop never set pull.rebase.';
    else if (/not concluded your merge/.test(out)) caption = 'Finish the merge first: solve the conflict, then commit.';
    else if (/would be overwritten/.test(out)) caption = 'Git refuses to pull: it would overwrite ' + NAME[who] + '\'s uncommitted change. Commit first.';
    else if (/Already up to date/.test(out)) caption = NAME[who] + ' already has everything GitLab has.';
    else if (/Fast-forward/.test(out)) caption = NAME[who] + ' pulls. His history catches up with GitLab; no merge needed.';
    else caption = NAME[who] + ' pulls. Git merges both lines of work into a merge commit.';
    return { results: [r], caption: caption, show: show };
  }

  function keep(w, who, favor) {
    var p = w.places[who];
    var res = p.merging.unmerged.slice().map(function (path) { return w.resolve(who, path, favor); });
    var other = who === 'carlos' ? 'Marcel' : 'Carlos';
    return { results: res, show: 'total.py',
      caption: NAME[who] + ' keeps ' + (favor === 'ours' ? 'his own version' : other + '\'s version') + ' and marks the file as solved. Now commit.' };
  }

  function clone(w, who) { return { results: [w.cloneRepo(who)], caption: NAME[who] + ' clones the project.' }; }

  var ACTIONS = {
    clone: clone,
    total: function (w, who, nth) { return editTotal(w, who, nth); },
    receipt: editReceipt,
    commit: commitAll,
    push: push,
    pull: pull,
    mine: function (w, who) { return keep(w, who, 'ours'); },
    theirs: function (w, who) { return keep(w, who, 'theirs'); }
  };

  function runFree(actions) {
    var base = replay(state.freeBase);
    var w = base.world.clone();
    var open = GitStory.openFiles(state.freeBase);
    w.pullConfigured = !state.nopull;     // #free&nopull: a fresh Git without pull.rebase set
    var steps = S.slice(0, state.freeBase + 1).concat(actions.map(function () { return {}; }));
    var perStep = base.results.slice(0, state.freeBase + 1);
    var counts = { carlos: 0, marcel: 0 }, out = null;
    actions.forEach(function (a) {
      var nth = a.kind === 'total' ? counts[a.who]++ : 0;
      out = ACTIONS[a.kind](w, a.who, nth);
      out.who = a.who;
      if (out.show) open[a.who] = out.show;
      perStep.push(out.results);
    });
    return { world: w, steps: steps, perStep: perStep, last: out, open: open };
  }

  function renderFree(animate) {
    var prev = animate ? runFree(state.freeActions.slice(0, -1)).world : null;
    var run = runFree(state.freeActions);
    var lastIndex = run.perStep.length - 1;
    var T = terminalsFrom(run.steps, run.perStep, lastIndex);
    var last = run.last;
    GitView.render(run.world, {
      animate: animate && !!last,
      results: last ? last.results : [],
      prevWorld: prev || (last ? runFree(state.freeActions.slice(0, -1)).world : null),
      terminals: T,
      freshEntries: animate && last ? freshCount(T, lastIndex) : {},
      open: run.open,
      focus: null,
      summary: false,
      termHeight: GitView.TERM.free
    });
    GitView.say(last ? last.caption : 'Your turn. The buttons below act for Carlos and for Marcel. For example: what happens if Marcel pushes now?', animate);
    renderControls(run.world);
    renderChrome();
    writeHash();
  }

  function button(parent, label, cls, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    if (cls) b.className = cls;
    b.addEventListener('click', onClick);
    parent.appendChild(b);
    return b;
  }

  // Free play: the buttons for both laptops, in the narrator's pane.
  function renderControls(world) {
    var panel = $('free-panel');
    panel.textContent = '';
    if (state.mode !== 'free') return;
    ['carlos', 'marcel'].forEach(function (who) {
      var group = document.createElement('div');
      group.className = 'free-group ' + who;
      group.innerHTML = '<h3><span class="avatar ' + who + '">' + NAME[who][0] + '</span>' + NAME[who] + '</h3>';
      var box = document.createElement('div');
      box.className = 'btns';
      group.appendChild(box);
      panel.appendChild(group);
      var p = world.places[who];
      var act = function (kind) { return function () { state.freeActions.push({ kind: kind, who: who }); renderFree(true); }; };
      if (!p.cloned) { button(box, 'git clone', 'git', act('clone')); return; }
      if (p.merging && p.merging.unmerged.length) {
        button(box, 'Keep mine', 'solve', act('mine'));
        button(box, 'Keep theirs', 'solve', act('theirs'));
      } else {
        button(box, 'Edit total.py', '', act('total'));
        button(box, 'Edit receipt.py', '', act('receipt'));
      }
      button(box, 'git commit', 'git', act('commit'));
      button(box, 'git push', 'git', act('push'));
      button(box, 'git pull', 'git', act('pull'));
    });
  }

  function enterFree(base) {
    state.mode = 'free';
    // free play needs the GitLab project, so it never starts inside the opening pictures
    state.freeBase = clamp(base === undefined ? state.step : base, GitStory.indexOf('start'), S.length - 1);
    state.freeActions = [];
    renderFree(false);
  }

  function leaveFree() {
    state.mode = 'story';
    renderControls(replay(state.step).world);
    goStory(state.step, false);
  }

  // ===== URL hash =====
  function readHash() {
    var h = location.hash || '';
    var m = h.match(/step=(\d+)/);
    return { step: m ? +m[1] : 0, free: /(^#|&)free\b/.test(h), noanim: /noanim/.test(h), nopull: /nopull/.test(h) };
  }
  var hashBase = '';
  function writeHash() {
    var parts = [];
    if (state.mode === 'free') parts.push('free', 'step=' + state.freeBase); else parts.push('step=' + state.step);
    var extra = (location.hash.match(/&(noanim|nopull|theme=\w+)/g) || []).join('');
    var h = '#' + parts.join('&') + extra;
    if (h !== location.hash) { hashBase = h; history.replaceState(null, '', h); }
  }

  // ===== input =====

  // Next: a long animation (typing code) is finished first, so a second press moves on.
  function next() {
    if (state.mode !== 'story') return;
    if (GitView.remaining() > 450) { GitView.finish(); return; }
    if (state.step < S.length - 1) goStory(state.step + 1, true);
  }

  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 't' || k === 'T') { Theme.toggle(); return; }
    if (k === 'f' || k === 'F') { toggleFullscreen(); return; }
    if (k === '?') { $('help').classList.toggle('show'); return; }
    if (k === 'Escape') { $('help').classList.remove('show'); return; }
    if (state.mode !== 'story') return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].indexOf(k) >= 0 && !e.shiftKey) {
      e.preventDefault(); next();
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].indexOf(k) >= 0 || (k === ' ' && e.shiftKey)) {
      e.preventDefault(); if (state.step > 0) goStory(state.step - 1, false);
    } else if (k === 'Home') { e.preventDefault(); goStory(0, false); }
    else if (k === 'End') { e.preventDefault(); goStory(S.length - 1, false); }
  }

  function toggleFullscreen() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } catch (err) { /* not allowed here: the browser's own full screen still works */ }
  }

  function start() {
    var h = readHash();
    state.nopull = h.nopull;
    GitView.init();
    GitView.setNoAnim(h.noanim);
    fit();
    window.addEventListener('resize', fit);
    document.addEventListener('keydown', onKey);
    $('next').addEventListener('click', next);
    $('prev').addEventListener('click', function () { if (state.step > 0) goStory(state.step - 1, false); });
    $('mode-story').addEventListener('click', function () { if (state.mode !== 'story') leaveFree(); });
    $('mode-free').addEventListener('click', function () { if (state.mode !== 'free') enterFree(); });
    $('back-to-story').addEventListener('click', leaveFree);
    $('undo').addEventListener('click', function () { state.freeActions.pop(); renderFree(false); });
    $('reset').addEventListener('click', function () { state.freeActions = []; renderFree(false); });
    $('theme-btn').addEventListener('click', function () { Theme.toggle(); });
    $('help-btn').addEventListener('click', function () { $('help').classList.toggle('show'); });
    window.addEventListener('hashchange', function () {
      if (location.hash === hashBase) return;
      var hh = readHash();
      if (hh.free) enterFree(hh.step); else { state.mode = 'story'; renderControls(replay(hh.step).world); goStory(hh.step, false); }
    });
    state.step = clamp(h.step, 0, S.length - 1);
    if (h.free) enterFree(h.step);
    else { renderControls(replay(state.step).world); goStory(state.step, false); }
  }

  start();
}());
