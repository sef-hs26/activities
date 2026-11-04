/* git-viz: the guided story, as data.
 *
 * Source: Carlos's iPad storyboards in ../hs25/ (the later one, 2025-11-04, has priority), his
 * HS25 note (purple for Carlos, green for Marcel, merges in both colours, no branches) and his
 * feedback of 2026-10-27: start slowly with the problem (what the software should do), and let a
 * narrator say at every step, in simple words, what happens and why. The audience are managers
 * with little coding experience, so the code stays minimal. README.md maps storyboard pages to
 * steps and lists every change.
 *
 * Each step is one click:
 *   id      stable name (the tests use it)
 *   chapter one of CHAPTERS
 *   who     the person acting (focus, terminal), or null
 *   scene   a picture instead of the stage: the opening ('team', 'shop', 'rule') and the cutscenes that
 *           show why the code changes ('owner-4', 'customer-chf', 'owner-2', 'customer-6', 'agree-3');
 *           js/scenes.js draws them
 *   ops     Git model operations; the same list drives the browser (js/app.js), the model test
 *           (test/model.test.js) and the real-Git check (test/real-git.test.js):
 *             ['init', files]                 GitLab project created with these files
 *             ['clone', who]
 *             ['write', who, path, content]   typing in the editor (no Git command)
 *             ['add', who, [paths]]
 *             ['commit', who, message, label] label: the short name drawn next to the commit
 *             ['push', who]  ['pull', who]  ['fetch', who]  ['merge', who]
 *   term    the command shown in the terminal when it differs from the op (the story splits one
 *           git pull into its download half and its merge half; both show as one git pull)
 *   open    the file that person's editor shows from this step on: { who, path }
 *   say     what the narrator says: what happens, and why, in plain words
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GitStory = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ===== the program they build: the "final price" example of the storyboard =====

  var README = '# Shop\n\nThe final price of a shopping cart.\n';

  // Quantity times price, with a discount from 10 items on.
  function total(percent) {
    var factor = (1 - percent / 100).toFixed(2);
    return 'def total(quantity, price):\n' +
      '    amount = quantity * price\n' +
      '    if quantity >= 10:\n' +
      '        amount = amount * ' + factor + '   # ' + percent + '% off\n' +
      '    return amount\n';
  }

  function receipt(currency) {
    return 'from total import total\n' +
      '\n' +
      'def receipt(quantity, price):\n' +
      '    amount = total(quantity, price)\n' +
      '    print("Total:", amount' + (currency ? ', "CHF"' : '') + ')\n';
  }

  // ===== chapters =====

  var CHAPTERS = [
    { id: 'shop', title: 'The shop' },
    { id: 'clone', title: 'Clone' },
    { id: 'commit', title: 'Commit' },
    { id: 'share', title: 'Push, pull' },
    { id: 'parallel', title: 'In parallel' },
    { id: 'rejected', title: 'Rejected push' },
    { id: 'conflict', title: 'Conflict' },
    { id: 'rules', title: 'Rules' }
  ];

  // ===== the steps =====

  var STEPS = [
    { id: 'team', chapter: 'shop', who: null, scene: 'team', ops: [],
      say: "Meet Carlos and Marcel. Together they are building a small program for an online shop." },
    { id: 'shop', chapter: 'shop', who: null, scene: 'shop', ops: [],
      say: "The program must answer one question: what does a customer pay for a full shopping cart?" },
    { id: 'rule', chapter: 'shop', who: null, scene: 'rule', ops: [],
      say: "The rule: quantity times price, and 5% off from 10 items on. The file total.py computes the price, and receipt.py prints the receipt." },
    { id: 'start', chapter: 'shop', who: null, ops: [['init', { 'README.md': README }]],
      say: "Each of them works on a laptop. GitLab, a server on the internet, keeps the shared copy of the project. The grey dot is its first saved version: a commit." },

    { id: 'clone-carlos', chapter: 'clone', who: 'carlos', ops: [['clone', 'carlos']],
      say: "Carlos copies the project to his laptop with git clone. He gets the files and the whole history: so far, one commit." },
    { id: 'clone-marcel', chapter: 'clone', who: 'marcel', ops: [['clone', 'marcel']],
      say: "Marcel does the same. Now there are three copies of the project: one on GitLab and one on each laptop." },

    { id: 'write-total', chapter: 'commit', who: 'carlos',
      ops: [['write', 'carlos', 'total.py', total(5)]], open: { who: 'carlos', path: 'total.py' },
      say: "Carlos opens his editor and types the price rule into a new file, total.py." },
    { id: 'write-receipt', chapter: 'commit', who: 'carlos',
      ops: [['write', 'carlos', 'receipt.py', receipt(false)]], open: { who: 'carlos', path: 'receipt.py' },
      say: "Then he writes receipt.py, which prints the total for the customer. Git sees two new files, but nothing is saved in the history yet." },
    { id: 'add-files', chapter: 'commit', who: 'carlos', ops: [['add', 'carlos', ['total.py', 'receipt.py']]],
      say: "With git add, Carlos chooses what goes into his next commit: both files. The dashed circle is that commit, still being prepared." },
    { id: 'commit-files', chapter: 'commit', who: 'carlos', ops: [['commit', 'carlos', 'Add total and receipt', 'new files']],
      say: "git commit saves it, with a short note: 'Add total and receipt'. The new purple dot exists only on Carlos's laptop." },

    { id: 'push-files', chapter: 'share', who: 'carlos', ops: [['push', 'carlos']],
      say: "git push sends Carlos's commit to GitLab. Now the shared copy has the price rule too." },
    { id: 'pull-files', chapter: 'share', who: 'marcel', ops: [['pull', 'marcel']], open: { who: 'marcel', path: 'total.py' },
      say: "Marcel runs git pull and receives Carlos's commit, with both files. All three copies are the same again." },

    { id: 'owner-4', chapter: 'parallel', who: null, scene: 'owner-4', ops: [],
      say: "A week later, the shop owner checks the numbers. The discount costs too much, and she asks Marcel to lower it to 4%." },
    { id: 'edit-4', chapter: 'parallel', who: 'marcel', ops: [['write', 'marcel', 'total.py', total(4)]],
      open: { who: 'marcel', path: 'total.py' },
      say: "Marcel opens total.py and changes one number: from 10 items on, customers now get 4% off." },
    { id: 'commit-4', chapter: 'parallel', who: 'marcel',
      ops: [['add', 'marcel', ['total.py']], ['commit', 'marcel', 'Discount 4%', '4%']],
      say: "He saves the change as a commit with the note 'Discount 4%': first git add, then git commit." },
    { id: 'push-4', chapter: 'parallel', who: 'marcel', ops: [['push', 'marcel']],
      say: "And he pushes it at once. GitLab now has Marcel's 4%." },
    { id: 'customer-chf', chapter: 'parallel', who: null, scene: 'customer-chf', ops: [],
      say: "Meanwhile, a customer is puzzled by a receipt: 114.0 what? Francs? Euros? Carlos promises to show the currency." },
    { id: 'edit-chf', chapter: 'parallel', who: 'carlos', ops: [['write', 'carlos', 'receipt.py', receipt(true)]],
      open: { who: 'carlos', path: 'receipt.py' },
      say: "Carlos adds \"CHF\" to the receipt. He has not pulled, so he does not know about Marcel's change." },
    { id: 'commit-chf', chapter: 'parallel', who: 'carlos',
      ops: [['add', 'carlos', ['receipt.py']], ['commit', 'carlos', 'Receipt in CHF', 'CHF']],
      say: "Carlos commits too. Compare the last dots: GitLab ends with Marcel's green commit, Carlos's laptop with his own purple one." },

    { id: 'push-rejected', chapter: 'rejected', who: 'carlos', ops: [['push', 'carlos']],
      say: "Carlos pushes, and GitLab refuses. It holds Marcel's commit, which Carlos has never seen, and Git never lets one person silently overwrite someone else's work." },
    { id: 'pull-download', chapter: 'rejected', who: 'carlos', ops: [['fetch', 'carlos']], term: 'git pull',
      say: "So Carlos pulls. First, Git downloads Marcel's commit. Now Carlos's laptop holds both new commits, side by side." },
    { id: 'pull-merge', chapter: 'rejected', who: 'carlos', ops: [['merge', 'carlos']], term: 'git pull', continues: true,
      open: { who: 'carlos', path: 'total.py' },
      say: "Then Git combines them into a new commit with both changes: Marcel's 4% (see Carlos's total.py) and Carlos's CHF. Half purple, half green: it has two parents." },
    { id: 'push-merge', chapter: 'rejected', who: 'carlos', ops: [['push', 'carlos']],
      say: "Now Carlos has everything GitLab has, plus his own work. This time GitLab accepts the push." },
    { id: 'pull-merge-marcel', chapter: 'rejected', who: 'marcel', ops: [['pull', 'marcel']], open: { who: 'marcel', path: 'receipt.py' },
      say: "Marcel pulls and receives the combined commit, with Carlos's CHF. Everybody has the same history again." },

    { id: 'owner-2', chapter: 'conflict', who: null, scene: 'owner-2', ops: [],
      say: "One morning, the shop owner phones Carlos. Sales are slow this month: she wants the discount down to 2%." },
    { id: 'edit-2', chapter: 'conflict', who: 'carlos', ops: [['write', 'carlos', 'total.py', total(2)]],
      open: { who: 'carlos', path: 'total.py' },
      say: "Carlos changes the discount line to 2%." },
    { id: 'customer-6', chapter: 'conflict', who: null, scene: 'customer-6', ops: [],
      say: "The same morning, a customer complains to Marcel: the shop next door gives 6%. Marcel decides to match it." },
    { id: 'edit-6', chapter: 'conflict', who: 'marcel', ops: [['write', 'marcel', 'total.py', total(6)]],
      open: { who: 'marcel', path: 'total.py' },
      say: "Marcel changes the very same line to 6%. Neither of them knows what the other one did." },
    { id: 'commit-2', chapter: 'conflict', who: 'carlos',
      ops: [['add', 'carlos', ['total.py']], ['commit', 'carlos', 'Discount 2%', '2%']],
      say: "Carlos commits his 2%..." },
    { id: 'push-2', chapter: 'conflict', who: 'carlos', ops: [['push', 'carlos']],
      say: "...and pushes first. GitLab now says 2%." },
    { id: 'commit-6', chapter: 'conflict', who: 'marcel',
      ops: [['add', 'marcel', ['total.py']], ['commit', 'marcel', 'Discount 6%', '6%']],
      say: "Marcel commits his 6%." },
    { id: 'push-rejected-2', chapter: 'conflict', who: 'marcel', ops: [['push', 'marcel']],
      say: "His push is refused, just like Carlos's before: GitLab has a commit that Marcel does not have. So he pulls." },
    { id: 'pull-download-2', chapter: 'conflict', who: 'marcel', ops: [['fetch', 'marcel']], term: 'git pull',
      say: "Git downloads Carlos's 2% commit..." },
    { id: 'conflict', chapter: 'conflict', who: 'marcel', ops: [['merge', 'marcel']], term: 'git pull', continues: true,
      open: { who: 'marcel', path: 'total.py' },
      say: "...but this time both of them changed the same line. Git cannot know whether 2% or 6% is right. It stops and writes both versions into the file, for Marcel to decide." },
    { id: 'agree-3', chapter: 'conflict', who: null, scene: 'agree-3', ops: [],
      say: "Marcel calls Carlos. Two percent was the owner's wish, six percent the customer's. They agree to meet in the middle: 3%." },
    { id: 'resolve', chapter: 'conflict', who: 'marcel', ops: [['write', 'marcel', 'total.py', total(3)]],
      open: { who: 'marcel', path: 'total.py' },
      say: "Marcel deletes the marker lines and both old versions, and types the line they agreed on." },
    { id: 'commit-merge-2', chapter: 'conflict', who: 'marcel',
      ops: [['add', 'marcel', ['total.py']], ['commit', 'marcel', 'Merge: discount 3%', 'merge 3%']],
      say: "git add tells Git that the conflict is solved, and git commit saves the combined version." },
    { id: 'push-merge-2', chapter: 'conflict', who: 'marcel', ops: [['push', 'marcel']],
      say: "Marcel pushes the solution to GitLab." },
    { id: 'pull-final', chapter: 'conflict', who: 'carlos', ops: [['pull', 'carlos']], open: { who: 'carlos', path: 'total.py' },
      say: "Carlos pulls. One history again: everyone has 3%, and every change is recorded, with who made it and why." },

    { id: 'rules', chapter: 'rules', who: null, ops: [], summary: true,
      say: "Three habits for the project: pull before you push. If GitLab refuses your push, pull, then push again. If you both changed the same line, talk, decide, then add and commit." }
  ];

  // Which file each laptop's editor shows after step n: the last `open` of that person so far.
  function openFiles(n) {
    var open = { carlos: null, marcel: null };
    for (var i = 0; i <= n && i < STEPS.length; i++) if (STEPS[i].open) open[STEPS[i].open.who] = STEPS[i].open.path;
    return open;
  }

  // Apply one op to a GitModel.World and return the model's result.
  function runOp(world, op) {
    switch (op[0]) {
      case 'init': return world.initRemote(op[1]);
      case 'clone': return world.cloneRepo(op[1]);
      case 'write': return world.write(op[1], op[2], op[3]);
      case 'add': return world.add(op[1], op[2]);
      case 'commit': return world.commit(op[1], op[2], op[3]);
      case 'push': return world.push(op[1]);
      case 'pull': return world.pull(op[1]);
      case 'fetch': return world.fetch(op[1]);
      case 'merge': return world.mergeOrigin(op[1]);
      default: throw new Error('unknown op ' + op[0]);
    }
  }

  // Replay steps 0..n (inclusive) on a fresh world. Returns the world and every step's results.
  function replay(GitModel, n, options) {
    var world = new GitModel.World(options);
    var results = [];
    for (var i = 0; i <= n && i < STEPS.length; i++) {
      results.push(STEPS[i].ops.map(function (op) { return runOp(world, op); }));
    }
    return { world: world, results: results };
  }

  function indexOf(id) {
    for (var i = 0; i < STEPS.length; i++) if (STEPS[i].id === id) return i;
    throw new Error('no step with id ' + id);
  }

  return { CHAPTERS: CHAPTERS, STEPS: STEPS, runOp: runOp, replay: replay, indexOf: indexOf, openFiles: openFiles,
    total: total, receipt: receipt, README: README };
}));
