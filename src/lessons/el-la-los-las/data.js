// Data and phrases for the lesson «El, la, los, las». Shared with scripts/audio.mjs.
export const ARTS = ['el', 'la', 'los', 'las'];
// nouns: g = m/f
export const NOUNS = [
  {s:'perro',p:'perros',g:'m',e:'🐶'},{s:'gato',p:'gatos',g:'m',e:'🐱'},
  {s:'sol',p:'soles',g:'m',e:'☀️'},{s:'árbol',p:'árboles',g:'m',e:'🌳'},
  {s:'coche',p:'coches',g:'m',e:'🚗'},{s:'pez',p:'peces',g:'m',e:'🐟'},
  {s:'globo',p:'globos',g:'m',e:'🎈'},{s:'oso',p:'osos',g:'m',e:'🐻'},
  {s:'plátano',p:'plátanos',g:'m',e:'🍌'},{s:'libro',p:'libros',g:'m',e:'📕'},
  {s:'casa',p:'casas',g:'f',e:'🏠'},{s:'flor',p:'flores',g:'f',e:'🌸'},
  {s:'luna',p:'lunas',g:'f',e:'🌙'},{s:'manzana',p:'manzanas',g:'f',e:'🍎'},
  {s:'mariposa',p:'mariposas',g:'f',e:'🦋'},{s:'estrella',p:'estrellas',g:'f',e:'⭐'},
  {s:'pelota',p:'pelotas',g:'f',e:'⚽'},{s:'vaca',p:'vacas',g:'f',e:'🐮'},
  {s:'fresa',p:'fresas',g:'f',e:'🍓'},{s:'tortuga',p:'tortugas',g:'f',e:'🐢'},
  {s:'conejo',p:'conejos',g:'m',e:'🐰'},
  {s:'caballo',p:'caballos',g:'m',e:'🐴'},
  {s:'pato',p:'patos',g:'m',e:'🦆'},
  {s:'cerdo',p:'cerdos',g:'m',e:'🐷'},
  {s:'león',p:'leones',g:'m',e:'🦁'},
  {s:'ratón',p:'ratones',g:'m',e:'🐭'},
  {s:'pollito',p:'pollitos',g:'m',e:'🐥'},
  {s:'mono',p:'monos',g:'m',e:'🐵'},
  {s:'elefante',p:'elefantes',g:'m',e:'🐘'},
  {s:'tiburón',p:'tiburones',g:'m',e:'🦈'},
  {s:'pájaro',p:'pájaros',g:'m',e:'🐦'},
  {s:'caracol',p:'caracoles',g:'m',e:'🐌'},
  {s:'pulpo',p:'pulpos',g:'m',e:'🐙'},
  {s:'dinosaurio',p:'dinosaurios',g:'m',e:'🦖'},
  {s:'huevo',p:'huevos',g:'m',e:'🥚'},
  {s:'helado',p:'helados',g:'m',e:'🍦'},
  {s:'tomate',p:'tomates',g:'m',e:'🍅'},
  {s:'limón',p:'limones',g:'m',e:'🍋'},
  {s:'queso',p:'quesos',g:'m',e:'🧀'},
  {s:'caramelo',p:'caramelos',g:'m',e:'🍬'},
  {s:'zapato',p:'zapatos',g:'m',e:'👟'},
  {s:'barco',p:'barcos',g:'m',e:'⛵'},
  {s:'tren',p:'trenes',g:'m',e:'🚂'},
  {s:'avión',p:'aviones',g:'m',e:'✈️'},
  {s:'cohete',p:'cohetes',g:'m',e:'🚀'},
  {s:'lápiz',p:'lápices',g:'m',e:'✏️'},
  {s:'reloj',p:'relojes',g:'m',e:'⌚'},
  {s:'regalo',p:'regalos',g:'m',e:'🎁'},
  {s:'tambor',p:'tambores',g:'m',e:'🥁'},
  {s:'rana',p:'ranas',g:'f',e:'🐸'},
  {s:'abeja',p:'abejas',g:'f',e:'🐝'},
  {s:'oveja',p:'ovejas',g:'f',e:'🐑'},
  {s:'jirafa',p:'jirafas',g:'f',e:'🦒'},
  {s:'cebra',p:'cebras',g:'f',e:'🦓'},
  {s:'ballena',p:'ballenas',g:'f',e:'🐋'},
  {s:'gallina',p:'gallinas',g:'f',e:'🐔'},
  {s:'serpiente',p:'serpientes',g:'f',e:'🐍'},
  {s:'pera',p:'peras',g:'f',e:'🍐'},
  {s:'piña',p:'piñas',g:'f',e:'🍍'},
  {s:'uva',p:'uvas',g:'f',e:'🍇'},
  {s:'sandía',p:'sandías',g:'f',e:'🍉'},
  {s:'naranja',p:'naranjas',g:'f',e:'🍊'},
  {s:'zanahoria',p:'zanahorias',g:'f',e:'🥕'},
  {s:'galleta',p:'galletas',g:'f',e:'🍪'},
  {s:'pizza',p:'pizzas',g:'f',e:'🍕'},
  {s:'tarta',p:'tartas',g:'f',e:'🎂'},
  {s:'taza',p:'tazas',g:'f',e:'☕'},
  {s:'cama',p:'camas',g:'f',e:'🛏️'},
  {s:'silla',p:'sillas',g:'f',e:'🪑'},
  {s:'llave',p:'llaves',g:'f',e:'🔑'},
  {s:'mochila',p:'mochilas',g:'f',e:'🎒'},
  {s:'camiseta',p:'camisetas',g:'f',e:'👕'},
  {s:'corona',p:'coronas',g:'f',e:'👑'},
  {s:'nube',p:'nubes',g:'f',e:'☁️'},
  {s:'gota',p:'gotas',g:'f',e:'💧'},
  {s:'hoja',p:'hojas',g:'f',e:'🍃'},
  {s:'seta',p:'setas',g:'f',e:'🍄'},
  {s:'bicicleta',p:'bicicletas',g:'f',e:'🚲'},
  {s:'guitarra',p:'guitarras',g:'f',e:'🎸'},
  {s:'campana',p:'campanas',g:'f',e:'🔔'},
  {s:'vela',p:'velas',g:'f',e:'🕯️'}
];

export const artOf = (n, pl) => (n.g === 'm' ? (pl ? 'los' : 'el') : pl ? 'las' : 'la');
export const wordOf = (n, pl) => (pl ? n.p : n.s);
export const picOf = (n, pl) => (pl ? n.e + n.e + n.e : n.e);
export const phrase = (n, pl) => artOf(n, pl) + ' ' + wordOf(n, pl);

export const ANIMALS = ['perro','gato','pez','oso','mariposa','vaca','tortuga','conejo','caballo','pato','cerdo','león','ratón','pollito','mono','elefante','tiburón','pájaro','caracol','pulpo','dinosaurio','rana','abeja','oveja','jirafa','cebra','ballena','gallina'];

// body parts with their place in the drawing (circles: cx, cy, r)
export const BODY = [
  { s: 'cabeza', a: 'la', r: [[100, 70, 52]] },
  { s: 'pelo', a: 'el', r: [[100, 34, 24]] },
  { s: 'ojos', a: 'los', r: [[84, 68, 11], [116, 68, 11]] },
  { s: 'orejas', a: 'las', r: [[56, 72, 15], [144, 72, 15]] },
  { s: 'nariz', a: 'la', r: [[100, 82, 10]] },
  { s: 'boca', a: 'la', r: [[100, 96, 16]] },
  { s: 'cuello', a: 'el', r: [[100, 116, 13]] },
  { s: 'brazos', a: 'los', r: [[52, 168, 18], [148, 168, 18]] },
  { s: 'barriga', a: 'la', r: [[100, 170, 28]] },
  { s: 'piernas', a: 'las', r: [[85, 234, 17], [115, 234, 17]] },
  { s: 'pies', a: 'los', r: [[80, 276, 20], [120, 276, 20]] },
];

// sentences: a = start (ap = plural start), b = ending
export const SENT = [
  { a: 'Mira', b: '.' }, { a: 'Dibujo', b: '.' },
  { a: '¿Dónde está', b: '?', ap: '¿Dónde están' }, { a: 'Me gusta', b: '.', ap: 'Me gustan' },
  { a: 'Lola busca', b: '.' }, { a: 'Toca', b: '.' },
];

export const CHEERS = ['¡Muy bien!', '¡Genial!', '¡Eres una estrella!', '¡Fantástico!', '¡Así se hace!', '¡Bravo!', '¡Perfecto!'];

// Everything Lola says as a whole sentence.
export const L = {
  hello: '¡Hola! Soy Lola la lombriz. Vamos a aprender el, la, los y las. ¡Toca un juego!',
  tickle: '¡Ji, ji! ¡Me haces cosquillas!',
  star: '¡Has ganado una estrella!',
  intros: {
    menu: '¿A qué jugamos? ¡Toca un juego!',
    learn: 'Toca cada casita y escucha. El y la son para uno solo. Los y las son para muchos.',
    choose: 'Mira el dibujo. ¿Qué palabrita va delante? ¿El, la, los o las?',
    listen: 'Toca el altavoz, escucha bien y toca el dibujo correcto.',
    balloons: '¡Explota solo los globos que van con la palabrita!',
    sort: 'Lleva cada cosa a su casita. ¿El, la, los o las?',
    plural: '¡Vamos a hacer magia! Cambia de uno a muchos.',
    detective: 'Soy Lola detective. A veces me equivoco. ¡Escucha y dime si lo digo bien!',
    sentence: 'Lee la frase y elige la palabrita que falta.',
    unicorn: 'El unicornio busca a sus amigos los animales. ¡Lee y ayúdale a encontrarlos!',
    body: 'Mira lo que brilla en el dibujo y elige la palabrita.',
  },
  learn: {
    el: 'El. Uno solo, del equipo azul. El perro.',
    la: 'La. Una sola, del equipo naranja. La casa.',
    los: 'Los. Muchos, del equipo azul. Los perros. ¿Oyes la ese al final?',
    las: 'Las. Muchas, del equipo naranja. Las casas. ¡También con ese!',
  },
  tip: 'Truco: si hay muchos, la palabrita lleva una ese al final, igual que la cosa. Los perros. Las casas.',
  tags: {
    one: 'Uno solo',
    many: 'Muchos',
    blue: 'Equipo azul: el perro, los perros',
    orange: 'Equipo naranja: la casa, las casas',
  },
  one: 'Uno:',
  many: 'Muchos:',
  whichArt: '¿Qué palabrita va?',
  manyNeedS: '¡Mira! Hay muchos. Necesitas una palabrita con ese.',
  oneNoS: '¡Mira! Hay solo uno. La palabrita no lleva ese.',
  almostSayIt: 'Casi. Prueba a decirlo en voz alta:',
  soundsOdd: 'Suena raro, ¿verdad?',
  thereMany: 'Ahí hay muchos. Escucha otra vez:',
  thereOne: 'Ahí hay solo uno. Escucha otra vez:',
  thatIs: 'Eso es',
  listenAgain: 'Escucha otra vez:',
  yes: '¡Sí!',
  oops: '¡Uy! Ese es',
  findWith: (a) => `¡Busca las cosas que van con ${a}!`,
  find: (a) => `Busca ${a}.`,
  whichHouse: '¿A qué casita va?',
  manyHouseS: 'Hay muchos. Busca una casita con ese.',
  oneHouseNoS: 'Hay solo uno. Busca una casita sin ese.',
  almostSay: 'Casi. Di en voz alta:',
  soundsGood: '¿Suena bien?',
  ifMany: '¿Y si hay muchos?',
  ifOne: '¿Y si hay solo uno?',
  mmm: 'Mmm,',
  notGood: 'no suena bien. ¡Prueba otra!',
  saidRight: '¿Lo he dicho bien?',
  caught: '¡Me has pillado! ¿Cómo se dice bien?',
  thatsIt: '¡Eso es!',
  notThat: 'Tampoco. ¡Otra!',
  yesRight: '¡Sí! Lo he dicho bien:',
  sure: '¿Seguro que suena bien?',
  iThinkRight: 'Pues yo creo que sí está bien:',
  listen: '¡Escucha!',
  missing: '¿Qué palabrita falta?',
  lookMany: 'Fíjate: hay muchos.',
  lookOne: 'Fíjate: hay solo uno.',
  readWith: 'Casi. Léelo en voz alta con',
  uniAsks: 'El unicornio pregunta:',
  hereIs: '¡Aquí está',
  hereAre: '¡Aquí están',
  readMany: 'Ahí hay muchos. Lee otra vez:',
  readOne: 'Ahí hay solo uno. Lee otra vez:',
  thatOne: 'Ese es',
  glows: 'Mira lo que brilla:',
  touch: '¡Tócate',
  glowTwo: 'Fíjate: brillan dos. Son muchos.',
  glowOne: 'Fíjate: brilla solo uno.',
  almost: 'Casi.',
  sayAloud: 'Dilo en voz alta.',
};

// [title, text, emoji] of each prize
export const WINS = {
  learn: ['¡Las conoces todas!', 'El, la, los y las', '🏠'],
  choose: ['¡Lo has hecho genial!', 'Ya sabes usar el, la, los y las', '🧩'],
  listen: ['¡Qué oído tienes!', 'Has acertado todas', '👂'],
  balloons: ['¡Campeona de globos!', 'Has explotado seis globos', '🎈'],
  sort: ['¡Casitas llenas!', 'Todo está en su sitio', '🏠'],
  plural: ['¡Magia!', 'Sabes cambiar de uno a muchos', '🪄'],
  detective: ['¡Gran detective!', 'Has pillado todos los fallos de Lola', '🕵️'],
  sentence: ['¡Frases perfectas!', 'Ya lees frases enteras', '📖'],
  unicorn: ['¡Arcoíris completo!', 'El unicornio ha encontrado a todos sus amigos', '🦄'],
  body: ['¡Conoces tu cuerpo!', 'De la cabeza a los pies', '🧒'],
};

/** Marks a piece that is said in Spanish (the word being learned), even in the English version. */
export const es = (t) => ({ t, lang: 'es' });

// Spanish content of the unicorn (it is part of what is read)
export const WHERE = { one: '¿Dónde está', many: '¿Dónde están' };

/* ================= English version (England English) ================= */
// The Spanish words (el perro, las casas…) go inside es() and are said with the Spanish voice.
export const L_EN = {
  hello: ["Hi! I'm Lola the worm. Let's learn the little words", es('el, la, los y las.'), 'Tap a game!'],
  tickle: 'Hee hee! That tickles!',
  star: "You've won a star!",
  intros: {
    menu: 'What shall we play? Tap a game!',
    learn: ['Tap each little house and listen.', es('El y la'), 'are for just one.', es('Los y las'), 'are for many.'],
    choose: ['Look at the picture. Which little word goes in front?', es('¿El, la, los o las?')],
    listen: 'Tap the speaker, listen carefully and tap the right picture.',
    balloons: 'Pop only the balloons that go with the little word!',
    sort: ['Take each thing to its little house.', es('¿El, la, los o las?')],
    plural: "Let's do some magic! Change from one to many.",
    detective: "I'm Detective Lola. Sometimes I get it wrong. Listen and tell me if I say it right!",
    sentence: 'Read the sentence and pick the missing little word.',
    unicorn: 'The unicorn is looking for its animal friends. Read and help it find them!',
    body: 'Look at what is shining in the picture and pick the little word.',
  },
  learn: {
    el: [es('El.'), 'Just one, from the blue team.', es('El perro.')],
    la: [es('La.'), 'Just one, from the orange team.', es('La casa.')],
    los: [es('Los.'), 'Many, from the blue team.', es('Los perros.'), 'Can you hear the S at the end?'],
    las: [es('Las.'), 'Many, from the orange team.', es('Las casas.'), 'With an S too!'],
  },
  tip: ['Tip: if there are many, the little word ends in S, just like the thing.', es('Los perros. Las casas.')],
  tags: {
    one: 'Just one',
    many: 'Many',
    blue: ['Blue team:', es('el perro, los perros')],
    orange: ['Orange team:', es('la casa, las casas')],
  },
  one: 'One:',
  many: 'Many:',
  whichArt: 'Which little word goes here?',
  manyNeedS: 'Look! There are many. You need a little word with S.',
  oneNoS: "Look! There's only one. The little word has no S.",
  almostSayIt: 'Almost. Try saying it out loud:',
  soundsOdd: 'Sounds funny, right?',
  thereMany: 'There are many there. Listen again:',
  thereOne: "There's only one there. Listen again:",
  thatIs: "That's",
  listenAgain: 'Listen again:',
  yes: 'Yes!',
  oops: "Oops! That's",
  findWith: (a) => ['Find the things that go with', es(a)],
  find: (a) => ['Find', es(a)],
  whichHouse: 'Which little house does it go to?',
  manyHouseS: 'There are many. Find a little house with S.',
  oneHouseNoS: "There's only one. Find a little house without S.",
  almostSay: 'Almost. Say it out loud:',
  soundsGood: 'Does it sound right?',
  ifMany: 'What if there are many?',
  ifOne: "What if there's only one?",
  mmm: 'Hmm,',
  notGood: "doesn't sound right. Try another one!",
  saidRight: 'Did I say it right?',
  caught: 'You caught me! How do you say it right?',
  thatsIt: "That's it!",
  notThat: 'Not that one either. Try again!',
  yesRight: 'Yes! I said it right:',
  sure: 'Are you sure it sounds right?',
  iThinkRight: 'I think it is right:',
  listen: 'Listen!',
  missing: 'Which little word is missing?',
  lookMany: 'Look: there are many.',
  lookOne: "Look: there's only one.",
  readWith: 'Almost. Read it out loud with',
  uniAsks: 'The unicorn asks:',
  hereIs: 'Here it is:',
  hereAre: 'Here they are:',
  readMany: 'There are many there. Read again:',
  readOne: "There's only one there. Read again:",
  thatOne: "That's",
  glows: 'Look at what is shining:',
  touch: 'Touch your',
  glowTwo: 'Look: two are shining. That means many.',
  glowOne: 'Look: only one is shining.',
  almost: 'Almost.',
  sayAloud: 'Say it out loud.',
};

export const CHEERS_EN = ['Well done!', 'Great!', "You're a star!", 'Fantastic!', "That's the way!", 'Bravo!', 'Perfect!'];

export const WINS_EN = {
  learn: ['You know them all!', es('El, la, los y las'), '🏠'],
  choose: ['You did brilliantly!', ['Now you can use', es('el, la, los y las')], '🧩'],
  listen: ['What good ears!', 'You got them all right', '👂'],
  balloons: ['Balloon champion!', "You've popped six balloons", '🎈'],
  sort: ['Houses full!', 'Everything is in its place', '🏠'],
  plural: ['Magic!', 'You can change from one to many', '🪄'],
  detective: ['Great detective!', "You caught all of Lola's mistakes", '🕵️'],
  sentence: ['Perfect sentences!', 'You can read whole sentences now', '📖'],
  unicorn: ['Rainbow complete!', 'The unicorn has found all its friends', '🦄'],
  body: ['You know your body!', 'From head to toe', '🧒'],
};

// English meaning of each Spanish word (shown in the English version)
export const GLOSS = {
  perro: 'dog', gato: 'cat', sol: 'sun', 'árbol': 'tree', coche: 'car', pez: 'fish', globo: 'balloon', oso: 'bear',
  'plátano': 'banana', libro: 'book', casa: 'house', flor: 'flower', luna: 'moon', manzana: 'apple',
  mariposa: 'butterfly', estrella: 'star', pelota: 'ball', vaca: 'cow', fresa: 'strawberry', tortuga: 'tortoise',
  conejo: 'rabbit', caballo: 'horse', pato: 'duck', cerdo: 'pig', 'león': 'lion', 'ratón': 'mouse', pollito: 'chick',
  mono: 'monkey', elefante: 'elephant', 'tiburón': 'shark', 'pájaro': 'bird', caracol: 'snail', pulpo: 'octopus',
  dinosaurio: 'dinosaur', huevo: 'egg', helado: 'ice cream', tomate: 'tomato', 'limón': 'lemon', queso: 'cheese',
  caramelo: 'sweet', zapato: 'shoe', barco: 'boat', tren: 'train', 'avión': 'aeroplane', cohete: 'rocket',
  'lápiz': 'pencil', reloj: 'watch', regalo: 'present', tambor: 'drum', rana: 'frog', abeja: 'bee', oveja: 'sheep',
  jirafa: 'giraffe', cebra: 'zebra', ballena: 'whale', gallina: 'hen', serpiente: 'snake', pera: 'pear',
  'piña': 'pineapple', uva: 'grape', 'sandía': 'watermelon', naranja: 'orange', zanahoria: 'carrot',
  galleta: 'biscuit', pizza: 'pizza', tarta: 'cake', taza: 'cup', cama: 'bed', silla: 'chair', llave: 'key',
  mochila: 'school bag', camiseta: 'T-shirt', corona: 'crown', nube: 'cloud', gota: 'drop', hoja: 'leaf',
  seta: 'mushroom', bicicleta: 'bike', guitarra: 'guitar', campana: 'bell', vela: 'candle',
  cabeza: 'head', pelo: 'hair', ojos: 'eyes', orejas: 'ears', nariz: 'nose', boca: 'mouth', cuello: 'neck',
  brazos: 'arms', barriga: 'tummy', piernas: 'legs', pies: 'feet',
};
// plural in English (when it is not just adding an "s")
const GLOSS_PL = { fish: 'fish', sheep: 'sheep', mouse: 'mice', 'ice cream': 'ice creams', watch: 'watches', tortoise: 'tortoises',
  butterfly: 'butterflies', strawberry: 'strawberries', 'school bag': 'school bags', 'T-shirt': 'T-shirts', peach: 'peaches' };
/** English meaning of a noun in singular or plural. */
export function glossOf(n, pl) {
  const g = GLOSS[n.s];
  if (!g) return '';
  if (!pl) return (/^[aeiou]/i.test(g) ? 'an ' : 'a ') + g;
  return GLOSS_PL[g] || g + 's';
}

export const TEXTS = {
  es: { L, CHEERS, WINS },
  en: { L: L_EN, CHEERS: CHEERS_EN, WINS: WINS_EN },
};

/** All the phrases the lesson can say, by language (to generate the mp3s). */
export function allTexts() {
  const out = { es: new Set(), en: new Set() };
  const add = (v, lang) => {
    if (typeof v === 'string') out[lang].add(v);
    else if (typeof v === 'function') ARTS.forEach((a) => add(v(a), lang));
    else if (Array.isArray(v)) v.forEach((x) => add(x, lang));
    else if (v && v.lang) out[v.lang].add(v.t);
    else if (v && typeof v === 'object') Object.values(v).forEach((x) => add(x, lang));
  };
  for (const lang of ['es', 'en']) {
    const T = TEXTS[lang];
    add(T.L, lang);
    add(T.CHEERS, lang);
    Object.values(T.WINS).forEach(([t, x]) => add([t, x], lang));
  }
  add(Object.values(WHERE), 'es');
  SENT.forEach((s) => add([s.a, s.ap].filter(Boolean), 'es'));
  add(ARTS, 'es');
  const words = [...NOUNS.flatMap((n) => [n.s, n.p]), ...BODY.map((b) => b.s)];
  words.forEach((w) => {
    out.es.add(w);
    ARTS.forEach((a) => out.es.add(`${a} ${w}`));
  });
  return { es: [...out.es], en: [...out.en] };
}

/** Games in the lesson (menu order), with name and emoji in both languages. */
export const GAMES = [
  { id: 'learn', em: '🏠', es: 'Conoce', en: 'Meet them' },
  { id: 'choose', em: '🧩', es: '¿Cuál va?', en: 'Which one?' },
  { id: 'listen', em: '👂', es: 'Escucha y toca', en: 'Listen and tap' },
  { id: 'balloons', em: '🎈', es: 'Explota globos', en: 'Pop balloons' },
  { id: 'sort', em: '🏡', es: 'Casitas', en: 'Little houses' },
  { id: 'plural', em: '🪄', es: 'Uno y muchos', en: 'One and many' },
  { id: 'detective', em: '🕵️', es: 'Lola detective', en: 'Detective Lola' },
  { id: 'sentence', em: '📖', es: 'Frases', en: 'Sentences' },
  { id: 'unicorn', em: '🦄', es: 'El unicornio', en: 'The unicorn' },
  { id: 'body', em: '🧒', es: 'Mi cuerpo', en: 'My body' },
];
