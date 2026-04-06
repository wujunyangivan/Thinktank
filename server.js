'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');
const WebSocket = require('ws');

// ── Word list ─────────────────────────────────────────────────────────────────
const WORDS = [
  'ABOUT','ABUSE','ACUTE','ADMIT','ADOPT','ADULT','AFTER','AGAIN','AGENT','AGREE',
  'AHEAD','ALARM','ALBUM','ALERT','ALIEN','ALIGN','ALIKE','ALIVE','ALLOW','ALONE',
  'ALONG','ALTER','ANGEL','ANGER','ANGLE','ANGRY','ANVIL','APART','APPLE','APPLY',
  'ARENA','ARGUE','ARISE','ARMOR','AROMA','AROSE','ARRAY','ARROW','ASIDE','ASSET',
  'ATLAS','ATONE','ATTIC','AUDIO','AUDIT','AVOID','AWAKE','AWARD','AWARE','AWFUL',
  'BASIC','BEACH','BEARD','BEAST','BEGIN','BEING','BELOW','BENCH','BERRY','BLACK',
  'BLADE','BLAME','BLAND','BLANK','BLAST','BLAZE','BLEAK','BLEND','BLINK','BLOCK',
  'BLOOD','BLOOM','BLOWN','BLUNT','BOARD','BOOST','BOOTH','BRAID','BRAIN','BRAVE',
  'BREAD','BREAK','BREED','BRICK','BRIDE','BRIEF','BRING','BRISK','BROAD','BROOK',
  'BROOM','BROTH','BROWN','BRUSH','BUILD','BUILT','BUNCH','BURST','CABIN','CANAL',
  'CARGO','CATCH','CAUSE','CEDAR','CHAIN','CHAIR','CHALK','CHAOS','CHARM','CHART',
  'CHASE','CHEAP','CHEAT','CHECK','CHEEK','CHEER','CHESS','CHEST','CHIEF','CHILD',
  'CHINA','CHOIR','CHUNK','CIVIC','CIVIL','CLAIM','CLASH','CLASS','CLEAN','CLEAR',
  'CLERK','CLICK','CLIFF','CLIMB','CLING','CLOCK','CLONE','CLOSE','CLOTH','CLOUD',
  'CLOWN','COACH','COAST','COLOR','COMET','COMIC','CORAL','COUNT','COURT','COVER',
  'CRACK','CRAFT','CRANE','CRAZE','CRAZY','CREAM','CREEK','CREEP','CRIME','CRISP',
  'CROSS','CROWD','CROWN','CRUSH','CURLY','CURSE','CURVE','DAILY','DANCE','DECOY',
  'DELAY','DELTA','DENSE','DEPTH','DISCO','DITCH','DIZZY','DODGE','DOUBT','DOUGH',
  'DRAFT','DRAIN','DRAMA','DRAPE','DREAM','DRIFT','DRILL','DRINK','DRONE','DROWN',
  'DRUNK','EAGLE','EARLY','EARTH','EIGHT','ELITE','EMBER','EMPTY','ENEMY','ENJOY',
  'ENTER','ENVOY','EQUAL','ERROR','ESSAY','EVADE','EVERY','EXACT','EXILE','EXIST',
  'EXTRA','FABLE','FACET','FAITH','FANCY','FATAL','FEAST','FENCE','FERRY','FETCH',
  'FEVER','FIBER','FIELD','FIGHT','FINAL','FIXED','FLAME','FLANK','FLARE','FLASH',
  'FLEET','FLESH','FLICK','FLING','FLOAT','FLOOD','FLOOR','FLOUR','FLUID','FLUTE',
  'FOCUS','FORCE','FORGE','FORTH','FORUM','FOUND','FRAME','FRANK','FRAUD','FRESH',
  'FROWN','FROST','FROZE','FRUIT','FUNNY','GHOST','GIANT','GIVEN','GLARE','GLASS',
  'GLEAM','GLIDE','GLOOM','GLOSS','GLOVE','GRACE','GRADE','GRAIN','GRAND','GRANT',
  'GRAPE','GRASP','GRAZE','GREED','GREEN','GREET','GRIEF','GRILL','GRIND','GROAN',
  'GROWL','GUARD','GUESS','GUILD','GUSTO','HABIT','HARSH','HAVEN','HEART','HEAVY',
  'HEDGE','HELLO','HENCE','HONEY','HONOR','HORDE','HORSE','HOTEL','HUMAN','HUMOR',
  'IDEAL','IMAGE','IMPLY','INNER','INPUT','INTRO','IRATE','IRONY','ISSUE','IVORY',
  'JEWEL','JUDGE','JUICE','JUMBO','KNACK','KNIFE','KNOCK','KNOWN','LABEL','LANCE',
  'LARGE','LASER','LATER','LAYER','LEARN','LEASE','LEAVE','LEGAL','LEMON','LEVEL',
  'LIGHT','LIMIT','LOCAL','LODGE','LOGIC','LOOSE','LOWER','LUCID','LUCKY','LUNAR',
  'MAGIC','MAJOR','MAKER','MAPLE','MARCH','MARSH','MATCH','MERCY','MERGE','MERIT',
  'METAL','MIGHT','MINOR','MIRTH','MOODY','MORAL','MOUTH','MUSIC','NAIVE','NIGHT',
  'NINJA','NOBLE','NOISE','NORTH','NOTCH','NOVEL','NURSE','OCCUR','OFFER','OFTEN',
  'OLIVE','ONSET','OPERA','ORBIT','ORDER','ORGAN','OTHER','OUTER','OZONE','PAINT',
  'PANEL','PANIC','PARTY','PAUSE','PEACE','PEACH','PEARL','PHASE','PHONE','PILOT',
  'PINCH','PITCH','PIXEL','PLACE','PLAIN','PLANE','PLANT','PLATE','PLAZA','PLEAD',
  'PLUCK','PLUMB','PLUME','POINT','POKER','POLAR','PORCH','POUND','POWER','PRESS',
  'PRICE','PRIDE','PRIME','PRIZE','PROBE','PROSE','PROUD','PROVE','PROXY','PUNCH',
  'PURGE','QUEEN','QUEST','QUICK','QUIET','RADAR','RADIO','RAINY','RALLY','RANCH',
  'RANGE','RAPID','RAVEN','REACH','READY','REALM','REBEL','REFER','REIGN','RELAY',
  'RENEW','REPLY','RIDGE','RIGHT','RISKY','RIVAL','RIVER','ROAST','ROCKY','ROUGH',
  'ROUND','ROUTE','ROYAL','RULER','SAINT','SAUCE','SAVOR','SCALE','SCARE','SCENE',
  'SCOPE','SCORE','SCOUT','SCRAP','SERVE','SHADE','SHAFT','SHAKE','SHAME','SHAPE',
  'SHARE','SHARK','SHARP','SHELF','SHELL','SHIFT','SHINE','SHIRT','SHOCK','SHORE',
  'SHORT','SHOUT','SHOWN','SIGMA','SIGHT','SINCE','SKILL','SKIRT','SKULL','SLACK',
  'SLATE','SLAVE','SLEEK','SLICE','SLIDE','SLOPE','SLOTH','SMALL','SMART','SMASH',
  'SMOKE','SNAKE','SOLAR','SOLID','SOLVE','SORRY','SOUTH','SPACE','SPARE','SPARK',
  'SPAWN','SPEAK','SPEAR','SPELL','SPEND','SPICE','SPILL','SPORT','SQUAD','STACK',
  'STAFF','STAGE','STAIN','STAIR','STAKE','STALE','STALK','STAMP','STAND','STARE',
  'STARK','START','STATE','STEAL','STEAM','STEEP','STEER','STERN','STICK','STILL',
  'STING','STOCK','STONE','STORM','STORY','STRAP','STRAW','STRIP','STRUT','STUCK',
  'STUDY','STUFF','STUMP','STUNT','STYLE','SUGAR','SUITE','SURGE','SWAMP','SWEAR',
  'SWEAT','SWEEP','SWIFT','SWORD','TACIT','TALON','TAUNT','TENSE','TERSE','THEFT',
  'THEIR','THEME','THICK','THING','THINK','THORN','THOSE','THREE','THROW','TIGER',
  'TIGHT','TITLE','TODAY','TOXIC','TRACK','TRADE','TRAIL','TRAIN','TRASH','TREND',
  'TRIAL','TRICK','TRULY','TRUNK','TRUST','TRUTH','TWICE','TWIST','ULTRA','UNDER',
  'UNTIL','UPPER','UPSET','USUAL','UTTER','VALID','VALOR','VALVE','VAPOR','VAULT',
  'VENOM','VERSE','VISTA','VIVID','VOCAL','VOICE','VOUCH','WALTZ','WAVER','WEDGE',
  'WEIGH','WEIRD','WHERE','WHICH','WHILE','WHITE','WHOLE','WITCH','WOMAN','WORLD',
  'WORRY','WORTH','WRATH','YIELD','YOUNG','ZEBRA',
];

// ── In-memory state ───────────────────────────────────────────────────────────
const rooms      = new Map(); // code  → Room
const playerRoom = new Map(); // WebSocket → roomCode

// ── Helpers ───────────────────────────────────────────────────────────────────
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

/**
 * Standard Wordle colouring: green > yellow > grey.
 * Returns an array of 5 strings: 'green' | 'yellow' | 'grey'.
 */
function checkGuess(guess, word) {
  const result  = new Array(5).fill('grey');
  const wordArr = word.split('');
  const used    = new Array(5).fill(false);

  // Pass 1: greens
  for (let i = 0; i < 5; i++) {
    if (guess[i] === wordArr[i]) {
      result[i] = 'green';
      used[i]   = true;
    }
  }
  // Pass 2: yellows
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'green') continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guess[i] === wordArr[j]) {
        result[i] = 'yellow';
        used[j]   = true;
        break;
      }
    }
  }
  return result;
}

function send(ws, msg) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}

function broadcast(room, msg, exclude = null) {
  const data = JSON.stringify(msg);
  for (const ws of room.players.keys()) {
    if (ws !== exclude && ws.readyState === WebSocket.OPEN) ws.send(data);
  }
}

function makePlayer(name) {
  return { name, guesses: [], results: [], solved: false, done: false, solveTime: null, disconnected: false };
}

function sanitizeName(raw) {
  return String(raw || '').trim().replace(/[<>]/g, '').slice(0, 20) || 'Anonymous';
}

function getLeaderboard(room) {
  return [...room.players.entries()]
    .map(([ws, p]) => ({
      id:           ws._id,
      name:         p.name,
      solved:       p.solved,
      done:         p.done,
      solveTime:    p.solveTime,
      guessCount:   p.guesses.length,
      disconnected: p.disconnected,
    }))
    .sort((a, b) => {
      if (a.solved && b.solved) return a.solveTime - b.solveTime;
      if (a.solved)  return -1;
      if (b.solved)  return  1;
      if (a.done && !b.done) return  1;
      if (!a.done && b.done) return -1;
      return 0;
    });
}

function allDone(room) {
  for (const p of room.players.values()) {
    if (!p.done && !p.disconnected) return false;
  }
  return true;
}

function activePlayers(room) {
  return [...room.players.values()].filter(p => !p.disconnected).map(p => p.name);
}

// ── HTTP server ───────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) { res.writeHead(500); res.end('Internal error'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else {
    res.writeHead(404); res.end('Not found');
  }
});

// ── WebSocket server ──────────────────────────────────────────────────────────
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws._id = Math.random().toString(36).slice(2, 10);

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    const code = playerRoom.get(ws);
    const room = code ? rooms.get(code) : null;

    switch (msg.type) {

      // ── Create room ──────────────────────────────────────────────────────
      case 'create_room': {
        if (playerRoom.has(ws)) return;
        const name    = sanitizeName(msg.name);
        const newCode = generateCode();
        const newRoom = {
          code:      newCode,
          word:      pickWord(),
          host:      ws,
          players:   new Map([[ws, makePlayer(name)]]),
          status:    'lobby',
          startTime: null,
        };
        rooms.set(newCode, newRoom);
        playerRoom.set(ws, newCode);
        send(ws, { type: 'room_created', code: newCode, myId: ws._id, players: [name] });
        break;
      }

      // ── Join room ────────────────────────────────────────────────────────
      case 'join_room': {
        if (playerRoom.has(ws)) return;
        const joinCode = String(msg.code || '').toUpperCase().trim().slice(0, 4);
        const joinRoom = rooms.get(joinCode);
        if (!joinRoom) { send(ws, { type: 'error', message: 'Room not found.' }); return; }
        if (joinRoom.status !== 'lobby') { send(ws, { type: 'error', message: 'Game already in progress.' }); return; }
        const name = sanitizeName(msg.name);
        joinRoom.players.set(ws, makePlayer(name));
        playerRoom.set(ws, joinCode);
        const allNames = activePlayers(joinRoom);
        send(ws, { type: 'room_joined', code: joinCode, myId: ws._id, players: allNames });
        broadcast(joinRoom, { type: 'player_joined', players: allNames }, ws);
        break;
      }

      // ── Start game ───────────────────────────────────────────────────────
      case 'start_game': {
        if (!room || room.host !== ws || room.status !== 'lobby') return;
        room.status    = 'playing';
        room.startTime = Date.now();
        broadcast(room, { type: 'game_started' }); // includes host
        break;
      }

      // ── Submit guess ─────────────────────────────────────────────────────
      case 'guess': {
        if (!room || room.status !== 'playing') return;
        const player = room.players.get(ws);
        if (!player || player.done) return;

        const guess = String(msg.word || '').toUpperCase().trim();
        if (!/^[A-Z]{5}$/.test(guess)) {
          send(ws, { type: 'error', message: 'Invalid word — must be 5 letters.' });
          return;
        }

        const result = checkGuess(guess, room.word);
        player.guesses.push(guess);
        player.results.push(result);

        const solved = result.every(c => c === 'green');
        player.solved = solved;
        if (solved)                          player.solveTime = Date.now() - room.startTime;
        if (solved || player.guesses.length >= 6) player.done = true;

        send(ws, {
          type:       'guess_result',
          guess,
          result,
          solved:     player.solved,
          done:       player.done,
          guessCount: player.guesses.length,
        });

        const lb = getLeaderboard(room);
        broadcast(room, { type: 'leaderboard_update', leaderboard: lb });

        if (allDone(room)) {
          room.status = 'finished';
          broadcast(room, { type: 'game_over', word: room.word, leaderboard: lb });
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    const code = playerRoom.get(ws);
    const room = code && rooms.get(code);
    if (!room) return;
    playerRoom.delete(ws);
    const player = room.players.get(ws);
    if (!player) return;
    player.disconnected = true;

    if (room.status === 'lobby') {
      if (room.host === ws) {
        // Host left — tear down the room and notify others
        broadcast(room, { type: 'error', message: 'Host left the room.', fatal: true }, ws);
        for (const otherWs of room.players.keys()) playerRoom.delete(otherWs);
        rooms.delete(code);
      } else {
        broadcast(room, { type: 'player_joined', players: activePlayers(room) });
      }
    } else if (room.status === 'playing') {
      player.done = true; // count as finished
      const lb = getLeaderboard(room);
      broadcast(room, { type: 'leaderboard_update', leaderboard: lb });
      if (allDone(room)) {
        room.status = 'finished';
        broadcast(room, { type: 'game_over', word: room.word, leaderboard: lb });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Wordle Showdown → http://localhost:${PORT}`));
