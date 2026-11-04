/* git-viz scenes: the opening pictures and the cutscenes that motivate each change in the code.
 *
 * Each scene is SVG markup for the main area (1216 x 846, right of the narrator's pane).
 * The people are simple line drawings in the spirit of Carlos's storyboards: Carlos with curly
 * hair (purple), Marcel with straight hair (green), the shop owner with a bun and an apron, a
 * customer with a cap. Carlos always stands on the left and Marcel on the right, as on the stage.
 * With animate, the parts appear one after the other: the one who asks, what they say, the one
 * who answers, the answer.
 */
(function () {
  'use strict';

  function fade(animate, delay) { return animate ? ' class="fade" style="animation-delay:' + delay + 'ms"' : ''; }

  // ===== people =====

  function curls(x, y) {   // a scalloped line over the top of the head
    var d = '', r = 54, n = 7, a0 = -165, a1 = -15;
    for (var i = 0; i <= n; i++) {
      var a = (a0 + (a1 - a0) * i / n) * Math.PI / 180;
      var px = x + r * Math.cos(a), py = y + r * Math.sin(a);
      d += (i === 0 ? 'M' : ' A13,13 0 0 1 ') + px.toFixed(1) + ',' + py.toFixed(1);
    }
    return '<path class="hairline" d="' + d + '"/>';
  }

  function hair(kind, x, y) {
    if (kind === 'carlos') return curls(x, y);
    if (kind === 'marcel') {
      return '<path class="hairline" d="M' + (x - 50) + ',' + (y - 2) + ' C' + (x - 54) + ',' + (y - 48) + ' ' + (x - 18) + ',' + (y - 60) + ' ' + (x + 6) + ',' + (y - 58) +
        ' C' + (x + 36) + ',' + (y - 56) + ' ' + (x + 56) + ',' + (y - 38) + ' ' + (x + 50) + ',' + (y - 2) + '"/>' +
        '<path class="hairline" d="M' + (x - 46) + ',' + (y - 22) + ' C' + (x - 22) + ',' + (y - 40) + ' ' + (x + 8) + ',' + (y - 44) + ' ' + (x + 34) + ',' + (y - 36) + '"/>';
    }
    if (kind === 'owner') {
      return '<circle class="hairfill" cx="' + x + '" cy="' + (y - 64) + '" r="17"/>' +
        '<path class="hairfill" d="M' + (x - 51) + ',' + (y - 4) + ' C' + (x - 54) + ',' + (y - 50) + ' ' + (x - 16) + ',' + (y - 58) + ' ' + x + ',' + (y - 56) +
        ' C' + (x + 16) + ',' + (y - 58) + ' ' + (x + 54) + ',' + (y - 50) + ' ' + (x + 51) + ',' + (y - 4) +
        ' C' + (x + 40) + ',' + (y - 32) + ' ' + (x - 40) + ',' + (y - 32) + ' ' + (x - 51) + ',' + (y - 4) + ' Z"/>';
    }
    // customer: a cap with a brim
    return '<path class="hairfill" d="M' + (x - 49) + ',' + (y - 16) + ' C' + (x - 49) + ',' + (y - 66) + ' ' + (x + 49) + ',' + (y - 66) + ' ' + (x + 49) + ',' + (y - 16) + ' Z"/>' +
      '<path class="hairline" style="stroke-width:7" d="M' + (x - 30) + ',' + (y - 17) + ' L' + (x + 76) + ',' + (y - 11) + '"/>';
  }

  function mouth(mood, x, y) {
    if (mood === 'talk') return '<ellipse class="feature" cx="' + x + '" cy="' + (y + 25) + '" rx="10" ry="8"/>';
    if (mood === 'worried') return '<path class="mouthline" d="M' + (x - 15) + ',' + (y + 29) + ' Q' + x + ',' + (y + 17) + ' ' + (x + 15) + ',' + (y + 29) + '"/>';
    if (mood === 'flat') return '<path class="mouthline" d="M' + (x - 13) + ',' + (y + 25) + ' L' + (x + 13) + ',' + (y + 25) + '"/>';
    return '<path class="mouthline" d="M' + (x - 16) + ',' + (y + 20) + ' Q' + x + ',' + (y + 35) + ' ' + (x + 16) + ',' + (y + 20) + '"/>';
  }

  var LABEL = { carlos: ['Carlos', ''], marcel: ['Marcel', ''], owner: ['', 'the shop owner'], customer: ['', 'a customer'] };

  // kind: carlos, marcel, owner, customer. (x, y): the centre of the head. opts.phone: 'left' or
  // 'right' puts a phone at that ear. opts.prop: extra markup drawn in front of the body.
  function person(kind, x, y, mood, opts) {
    opts = opts || {};
    var body = '<path class="body-' + kind + '" d="M' + (x - 94) + ',' + (y + 182) + ' C' + (x - 94) + ',' + (y + 102) + ' ' + (x - 42) + ',' + (y + 72) + ' ' + x + ',' + (y + 72) +
      ' C' + (x + 42) + ',' + (y + 72) + ' ' + (x + 94) + ',' + (y + 102) + ' ' + (x + 94) + ',' + (y + 182) + ' Z"/>';
    var apron = kind === 'owner'
      ? '<path class="apron" d="M' + (x - 38) + ',' + (y + 96) + ' L' + (x + 38) + ',' + (y + 96) + ' L' + (x + 44) + ',' + (y + 182) + ' L' + (x - 44) + ',' + (y + 182) + ' Z"/>' +
        '<path class="thin" d="M' + (x - 20) + ',' + (y + 140) + ' H' + (x + 20) + '"/>'
      : '';
    var head = '<circle class="skin" cx="' + x + '" cy="' + y + '" r="50"/>' + hair(kind, x, y) +
      '<circle class="feature" cx="' + (x - 17) + '" cy="' + (y - 3) + '" r="4.8"/>' +
      '<circle class="feature" cx="' + (x + 17) + '" cy="' + (y - 3) + '" r="4.8"/>' + mouth(mood, x, y);
    var phone = '';
    if (opts.phone) {
      var px = opts.phone === 'right' ? x + 50 : x - 72;
      var rot = opts.phone === 'right' ? 14 : -14;
      phone = '<g transform="rotate(' + rot + ' ' + (px + 11) + ' ' + (y + 6) + ')"><rect class="phone" x="' + px + '" y="' + (y - 16) + '" width="22" height="44" rx="5"/>' +
        '<rect class="phone-screen" x="' + (px + 4) + '" y="' + (y - 10) + '" width="14" height="28" rx="2"/></g>';
    }
    var lab = LABEL[kind];
    var names = (lab[0] ? '<text class="name ' + kind + '" x="' + x + '" y="' + (y + 216) + '">' + lab[0] + '</text>' : '') +
      (lab[1] ? '<text class="role" x="' + x + '" y="' + (y + 214) + '">' + lab[1] + '</text>' : '');
    return body + apron + head + phone + (opts.prop || '') + names;
  }

  // A speech bubble at (x, y), w wide, with lines of text and a tail pointing to (tx, ty).
  function bubble(x, y, w, lines, tx, ty, kind) {
    var h = 30 + lines.length * 42;
    var bx = Math.max(x + 44, Math.min(x + w - 44, tx)), by = y + h;
    var text = lines.map(function (l, i) {
      return '<text class="speech" x="' + (x + 26) + '" y="' + (y + 52 + i * 42) + '">' + l + '</text>';
    }).join('');
    return '<rect class="bubble ' + kind + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="24"/>' +
      '<path style="fill:var(--card)" d="M' + (bx - 17) + ',' + (by - 3) + ' L' + tx + ',' + ty + ' L' + (bx + 17) + ',' + (by - 3) + ' Z"/>' +
      '<path class="bubble ' + kind + '" style="fill:none" d="M' + (bx - 17) + ',' + by + ' L' + tx + ',' + ty + ' L' + (bx + 17) + ',' + by + '"/>' + text;
  }

  var HEAD_Y = 470;   // where the heads of the people in a cutscene are

  // A two-person cutscene: a time cue on top, the first speaker, their words, then the answer.
  function dialogue(cue, a, b, animate) {
    return '<text class="title"' + (animate ? ' style="opacity:0;animation:appear .5s ease forwards"' : '') + ' x="608" y="64">' + cue + '</text>' +
      '<g' + fade(animate, 150) + '>' + person(a.kind, a.x, HEAD_Y, a.mood, a.opts) + '</g>' +
      '<g' + fade(animate, 600) + '>' + bubble(a.bx, a.by + 50, a.bw, a.lines, a.x + (a.x < 608 ? 30 : -30), HEAD_Y - 62, a.kind) + '</g>' +
      '<g' + fade(animate, 1500) + '>' + person(b.kind, b.x, HEAD_Y, b.mood, b.opts) + '</g>' +
      '<g' + fade(animate, 1950) + '>' + bubble(b.bx, b.by + 50, b.bw, b.lines, b.x + (b.x < 608 ? 30 : -30), HEAD_Y - 62, b.kind) + '</g>';
  }

  // ===== the shop program (storyboard 2025-10-28, p3) =====

  function cartArt(x, y, s) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
      '<rect class="item" x="128" y="58" width="92" height="80" rx="6"/>' +
      '<rect class="item" x="236" y="28" width="82" height="110" rx="6"/>' +
      '<rect class="item" x="334" y="70" width="104" height="68" rx="6"/>' +
      '<path class="paper" d="M76,130 L470,130 L430,280 L109,280 Z"/>' +
      '<path class="thin" d="M180,130 V280 M280,130 V280 M380,130 V280 M92,205 H450"/>' +
      '<path class="line" d="M0,60 L60,60 L120,330 L410,330"/>' +
      '<path class="line" d="M160,330 V349 M390,330 V349"/>' +
      '<circle class="paper" cx="160" cy="375" r="26"/><circle class="paper" cx="390" cy="375" r="26"/>' +
      '</g>';
  }

  function receiptPaper(x, y, w, h, lines) {
    var d = 'M' + x + ',' + y + ' H' + (x + w) + ' V' + (y + h);
    var step = w / 12;
    for (var i = 1, up = true; i <= 12; i++, up = !up) d += ' L' + (x + w - i * step).toFixed(1) + ',' + (y + h + (up ? 18 : 0));
    d += ' Z';
    return '<path class="paper" d="' + d + '"/>' + lines;
  }

  function laptopFront(x, y) {   // an open laptop seen from behind its screen, in front of a person
    return '<rect class="paper" x="' + (x - 82) + '" y="' + (y + 74) + '" width="164" height="100" rx="9"/>' +
      '<circle class="thin" cx="' + x + '" cy="' + (y + 124) + '" r="9"/>' +
      '<path class="line" d="M' + (x - 104) + ',' + (y + 180) + ' H' + (x + 104) + '"/>';
  }

  var SCENES = {
    team: function (animate) {
      return '<g' + fade(animate, 0) + '>' +
        '<rect class="tag" x="438" y="96" width="340" height="86" rx="12"/>' +
        '<path class="thin" d="M498,96 L540,40 M718,96 L676,40"/>' +
        '<text class="question" style="font-size:44px" x="608" y="155">Online shop</text>' +
        '</g>' +
        '<g' + fade(animate, 450) + '>' + person('carlos', 330, HEAD_Y, 'smile') + laptopFront(330, HEAD_Y) + '</g>' +
        '<g' + fade(animate, 900) + '>' + person('marcel', 886, HEAD_Y, 'smile') + laptopFront(886, HEAD_Y) + '</g>';
    },
    shop: function (animate) {
      return cartArt(110, 190, 0.9) +
        '<g' + fade(animate, 250) + '>' +
        '<path class="thin" d="M520,305 L570,325"/>' +
        '<path class="tag" d="M570,290 L770,290 L770,362 L570,362 L542,326 Z"/>' +
        '<circle class="thin" cx="562" cy="326" r="5"/>' +
        '<text class="mid" x="670" y="337">10 CHF each</text>' +
        '<text class="big" x="330" y="660">12 items</text>' +
        '</g>' +
        '<g' + fade(animate, 700) + '>' +
        '<text class="question" x="975" y="420">What does the</text>' +
        '<text class="question" x="975" y="482">customer pay?</text>' +
        '</g>';
    },
    rule: function (animate) {
      return cartArt(28, 270, 0.5) +
        '<text class="mid" x="146" y="520">12 items</text>' +
        '<text class="mid" x="146" y="558">10 CHF each</text>' +
        '<g' + fade(animate, 200) + '>' +
        '<path class="arrow2" d="M285,400 H352 M336,386 L354,400 L336,414"/>' +
        '<rect class="box" x="378" y="250" width="404" height="300" rx="14"/>' +
        '<text class="mid" x="580" y="318">quantity x price</text>' +
        '<text class="mid" x="580" y="364">5% off from 10 items</text>' +
        '<path class="thin" d="M414,396 H746" style="stroke-dasharray:4 8"/>' +
        '<text class="mono plain" x="580" y="452">12 x 10 = 120</text>' +
        '<text class="mono plain" x="580" y="500">120 minus 5% = 114</text>' +
        '<text class="mono" x="580" y="606">total.py</text>' +
        '</g>' +
        '<g' + fade(animate, 900) + '>' +
        '<path class="arrow2" d="M800,400 H866 M850,386 L868,400 L850,414"/>' +
        receiptPaper(892, 250, 262, 280,
          '<text class="mono" x="1023" y="310">SHOP</text>' +
          '<path class="thin" d="M920,336 H1126" style="stroke-dasharray:4 8"/>' +
          '<text class="mono plain" x="1023" y="410">Total: 114.0</text>') +
        '<text class="mono" x="1023" y="606">receipt.py</text>' +
        '</g>';
    },
    'owner-4': function (animate) {
      var chart = '<g><path class="thin" d="M40,650 H190"/>' +
        '<rect class="bar" x="52" y="560" width="30" height="90"/><rect class="bar" x="98" y="590" width="30" height="60"/>' +
        '<rect class="bar" x="144" y="620" width="30" height="30"/>' +
        '<text class="role" x="115" y="688">profit</text></g>';
      return dialogue('A week later',
        { kind: 'owner', x: 330, mood: 'talk', opts: { prop: chart }, bx: 150, by: 96, bw: 470, lines: ['We give away too much.', '4% is enough.'] },
        { kind: 'marcel', x: 900, mood: 'smile', bx: 690, by: 210, bw: 420, lines: ['OK, I will change it.'] },
        animate);
    },
    'customer-chf': function (animate) {
      var slip = receiptPaper(1004, 556, 150, 92, '<text class="mono plain" style="font-size:19px" x="1079" y="608">Total: 114.0</text>');
      return dialogue('Meanwhile',
        { kind: 'customer', x: 900, mood: 'worried', opts: { prop: slip }, bx: 650, by: 96, bw: 450, lines: ['114.0 what?', 'Francs? Euros?'] },
        { kind: 'carlos', x: 310, mood: 'smile', bx: 110, by: 210, bw: 480, lines: ['I will add the currency.'] },
        animate);
    },
    'owner-2': function (animate) {
      return dialogue('One morning',
        { kind: 'owner', x: 900, mood: 'talk', opts: { phone: 'left' }, bx: 700, by: 96, bw: 400, lines: ['Sales are slow.', 'Make it 2%.'] },
        { kind: 'carlos', x: 310, mood: 'smile', opts: { phone: 'right' }, bx: 130, by: 210, bw: 300, lines: ['2%. Got it.'] },
        animate);
    },
    'customer-6': function (animate) {
      return dialogue('The same morning',
        { kind: 'customer', x: 330, mood: 'worried', bx: 130, by: 96, bw: 450, lines: ['The shop next door', 'gives 6%.'] },
        { kind: 'marcel', x: 900, mood: 'smile', bx: 680, by: 210, bw: 430, lines: ['Then we give 6% too.'] },
        animate);
    },
    'agree-3': function (animate) {
      return dialogue('A phone call',
        { kind: 'marcel', x: 900, mood: 'talk', opts: { phone: 'left' }, bx: 690, by: 96, bw: 420, lines: ['You put 2%,', 'I put 6%.'] },
        { kind: 'carlos', x: 310, mood: 'smile', opts: { phone: 'right' }, bx: 110, by: 210, bw: 440, lines: ['Let us meet in', 'the middle: 3%.'] },
        animate);
    }
  };

  window.GitScenes = SCENES;
}());
