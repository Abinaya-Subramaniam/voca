// export const DEFAULT_BOARDS = [
//   {
//     id: 'board_home',
//     name: 'Home',
//     category: 'home',
//     gridColumns: 4,
//     symbols: [
//       { position: 0,  symbolId: '25427', label: 'I',      imageUrl: null, isCustom: false },
//       { position: 1,  symbolId: '25428', label: 'you',    imageUrl: null, isCustom: false },
//       { position: 2,  symbolId: '25429', label: 'want',   imageUrl: null, isCustom: false },
//       { position: 3,  symbolId: '25430', label: 'like',   imageUrl: null, isCustom: false },
//       { position: 4,  symbolId: '5510',  label: 'go',     imageUrl: null, isCustom: false },
//       { position: 5,  symbolId: '5512',  label: 'come',   imageUrl: null, isCustom: false },
//       { position: 6,  symbolId: '5515',  label: 'eat',    imageUrl: null, isCustom: false },
//       { position: 7,  symbolId: '5514',  label: 'drink',  imageUrl: null, isCustom: false },
//       { position: 8,  symbolId: '5517',  label: 'play',   imageUrl: null, isCustom: false },
//       { position: 9,  symbolId: '5516',  label: 'sleep',  imageUrl: null, isCustom: false },
//       { position: 10, symbolId: '5518',  label: 'home',   imageUrl: null, isCustom: false },
//       { position: 11, symbolId: '5519',  label: 'more',   imageUrl: null, isCustom: false },
//       { position: 12, symbolId: '5520',  label: 'help',   imageUrl: null, isCustom: false },
//       { position: 13, symbolId: '5521',  label: 'stop',   imageUrl: null, isCustom: false },
//       { position: 14, symbolId: '5522',  label: 'yes',    imageUrl: null, isCustom: false },
//       { position: 15, symbolId: '5523',  label: 'no',     imageUrl: null, isCustom: false },
//     ]
//   },
//   {
//     id: 'board_feelings',
//     name: 'Feelings',
//     category: 'feelings',
//     gridColumns: 4,
//     symbols: [
//       { position: 0, symbolId: '5524', label: 'happy',   imageUrl: null, isCustom: false },
//       { position: 1, symbolId: '5525', label: 'sad',     imageUrl: null, isCustom: false },
//       { position: 2, symbolId: '5526', label: 'angry',   imageUrl: null, isCustom: false },
//       { position: 3, symbolId: '5527', label: 'scared',  imageUrl: null, isCustom: false },
//       { position: 4, symbolId: '5528', label: 'tired',   imageUrl: null, isCustom: false },
//       { position: 5, symbolId: '5529', label: 'hungry',  imageUrl: null, isCustom: false },
//       { position: 6, symbolId: '5530', label: 'hurt',    imageUrl: null, isCustom: false },
//       { position: 7, symbolId: '5531', label: 'good',    imageUrl: null, isCustom: false },
//     ]
//   },
//   {
//     id: 'board_food',
//     name: 'Food & Drink',
//     category: 'food',
//     gridColumns: 4,
//     symbols: [
//       { position: 0, symbolId: '5532', label: 'water',   imageUrl: null, isCustom: false },
//       { position: 1, symbolId: '5533', label: 'milk',    imageUrl: null, isCustom: false },
//       { position: 2, symbolId: '5534', label: 'juice',   imageUrl: null, isCustom: false },
//       { position: 3, symbolId: '5535', label: 'bread',   imageUrl: null, isCustom: false },
//       { position: 4, symbolId: '5536', label: 'apple',   imageUrl: null, isCustom: false },
//       { position: 5, symbolId: '5537', label: 'banana',  imageUrl: null, isCustom: false },
//       { position: 6, symbolId: '5538', label: 'rice',    imageUrl: null, isCustom: false },
//       { position: 7, symbolId: '5539', label: 'cookie',  imageUrl: null, isCustom: false },
//     ]
//   },
//   {
//     id: 'board_school',
//     name: 'School',
//     category: 'school',
//     gridColumns: 4,
//     symbols: [
//       { position: 0, symbolId: '5540', label: 'school',  imageUrl: null, isCustom: false },
//       { position: 1, symbolId: '5541', label: 'teacher', imageUrl: null, isCustom: false },
//       { position: 2, symbolId: '5542', label: 'friend',  imageUrl: null, isCustom: false },
//       { position: 3, symbolId: '5543', label: 'book',    imageUrl: null, isCustom: false },
//       { position: 4, symbolId: '5544', label: 'write',   imageUrl: null, isCustom: false },
//       { position: 5, symbolId: '5545', label: 'read',    imageUrl: null, isCustom: false },
//       { position: 6, symbolId: '5546', label: 'draw',    imageUrl: null, isCustom: false },
//       { position: 7, symbolId: '5547', label: 'learn',   imageUrl: null, isCustom: false },
//     ]
//   },
//   {
//     id: 'board_emergency',
//     name: 'Emergency',
//     category: 'emergency',
//     gridColumns: 3,
//     symbols: [
//       { position: 0, symbolId: '5522', label: 'yes',    imageUrl: null, isCustom: false },
//       { position: 1, symbolId: '5523', label: 'no',     imageUrl: null, isCustom: false },
//       { position: 2, symbolId: '5520', label: 'help',   imageUrl: null, isCustom: false },
//       { position: 3, symbolId: '5521', label: 'stop',   imageUrl: null, isCustom: false },
//       { position: 4, symbolId: '5548', label: 'hurts',  imageUrl: null, isCustom: false },
//       { position: 5, symbolId: '5549', label: 'toilet', imageUrl: null, isCustom: false },
//     ]
//   },
// ]

export const WORD_TYPES = {
  verb:       { label: 'Action',      bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800'  },
  noun:       { label: 'Thing',       bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
  descriptor: { label: 'Descriptor',  bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-800'   },
  social:     { label: 'Social',      bg: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-800'   },
  question:   { label: 'Question',    bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
  pronoun:    { label: 'Pronoun',     bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800' },
  none:       { label: '',            bg: 'bg-white',     border: 'border-warm-200',   text: 'text-warm-900'   },
}

export const DEFAULT_BOARDS = [
  {
    id: 'board_home',
    name: 'Home',
    category: 'home',
    isRoot: true,
    gridColumns: 4,
    symbols: [
      { position: 0,  symbolId: '6632',  label: 'I',      wordType: 'pronoun', imageUrl: null, isCustom: false },
      { position: 1,  symbolId: '6625',  label: 'you',    wordType: 'pronoun', imageUrl: null, isCustom: false },
      { position: 2,  symbolId: '5441',  label: 'want',   wordType: 'verb',    imageUrl: null, isCustom: false },
      { position: 3,  symbolId: '37826', label: 'like',   wordType: 'verb',    imageUrl: null, isCustom: false },
      { position: 4,  symbolId: '8142',  label: 'go',     wordType: 'verb',    imageUrl: null, isCustom: false },
      { position: 5,  symbolId: '32669', label: 'come',   wordType: 'verb',    imageUrl: null, isCustom: false },
      { position: 6,  symbolId: '6456',  label: 'eat',    wordType: 'verb',    imageUrl: null, isCustom: false },
      { position: 7,  symbolId: '6061',  label: 'drink',  wordType: 'verb',    imageUrl: null, isCustom: false },
      { position: 8,  symbolId: '23392', label: 'play',   wordType: 'verb',    imageUrl: null, isCustom: false },
      { position: 9,  symbolId: '6479',  label: 'sleep',  wordType: 'verb',    imageUrl: null, isCustom: false },
      { position: 10, symbolId: '6964',  label: 'home',   wordType: 'noun',    imageUrl: null, isCustom: false },
      { position: 11, symbolId: '5508',  label: 'more',   wordType: 'descriptor', imageUrl: null, isCustom: false },
      { position: 12, symbolId: '32648', label: 'help',   wordType: 'social',  imageUrl: null, isCustom: false },
      { position: 13, symbolId: '7196',  label: 'stop',   wordType: 'social',  imageUrl: null, isCustom: false },
      { position: 14, symbolId: '5584',  label: 'yes',    wordType: 'social',  imageUrl: null, isCustom: false },
      { position: 15, symbolId: '5526',  label: 'no',     wordType: 'social',  imageUrl: null, isCustom: false },
    ]
  },
  {
    id: 'board_feelings',
    name: 'Feelings',
    category: 'feelings',
    isRoot: false,
    gridColumns: 4,
    symbols: [
      { position: 0, symbolId: '35533', label: 'happy',   wordType: 'descriptor', imageUrl: null, isCustom: false },
      { position: 1, symbolId: '35545', label: 'sad',     wordType: 'descriptor', imageUrl: null, isCustom: false },
      { position: 2, symbolId: '35539', label: 'angry',   wordType: 'descriptor', imageUrl: null, isCustom: false },
      { position: 3, symbolId: '35535', label: 'scared',  wordType: 'descriptor', imageUrl: null, isCustom: false },
      { position: 4, symbolId: '35537', label: 'tired',   wordType: 'descriptor', imageUrl: null, isCustom: false },
      { position: 5, symbolId: '4962',  label: 'hungry',  wordType: 'descriptor', imageUrl: null, isCustom: false },
      { position: 6, symbolId: '30620', label: 'hurt',    wordType: 'descriptor', imageUrl: null, isCustom: false },
      { position: 7, symbolId: '4581',  label: 'good',    wordType: 'descriptor', imageUrl: null, isCustom: false },
    ]
  },
  {
    id: 'board_food',
    name: 'Food & Drink',
    category: 'food',
    isRoot: false,
    gridColumns: 4,
    symbols: [
      { position: 0, symbolId: '32464', label: 'water',   wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 1, symbolId: '2445',  label: 'milk',    wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 2, symbolId: '11461', label: 'juice',   wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 3, symbolId: '2494',  label: 'bread',   wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 4, symbolId: '2462',  label: 'apple',   wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 5, symbolId: '2530',  label: 'banana',  wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 6, symbolId: '6911',  label: 'rice',    wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 7, symbolId: '8312',  label: 'cookie',  wordType: 'noun', imageUrl: null, isCustom: false },
    ]
  },
  {
    id: 'board_school',
    name: 'School',
    category: 'school',
    isRoot: false,
    gridColumns: 4,
    symbols: [
      { position: 0, symbolId: '32446', label: 'school',  wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 1, symbolId: '6556',  label: 'teacher', wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 2, symbolId: '25790', label: 'friend',  wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 3, symbolId: '25191', label: 'book',    wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 4, symbolId: '2380',  label: 'write',   wordType: 'verb', imageUrl: null, isCustom: false },
      { position: 5, symbolId: '7141',  label: 'read',    wordType: 'verb', imageUrl: null, isCustom: false },
      { position: 6, symbolId: '8088',  label: 'draw',    wordType: 'verb', imageUrl: null, isCustom: false },
      { position: 7, symbolId: '37810', label: 'learn',   wordType: 'verb', imageUrl: null, isCustom: false },
    ]
  },
  {
    id: 'board_emergency',
    name: 'Emergency',
    category: 'emergency',
    isRoot: false,
    gridColumns: 3,
    symbols: [
      { position: 0, symbolId: '5584',  label: 'yes',    wordType: 'social', imageUrl: null, isCustom: false },
      { position: 1, symbolId: '5526',  label: 'no',     wordType: 'social', imageUrl: null, isCustom: false },
      { position: 2, symbolId: '32648', label: 'help',   wordType: 'social', imageUrl: null, isCustom: false },
      { position: 3, symbolId: '7196',  label: 'stop',   wordType: 'social', imageUrl: null, isCustom: false },
      { position: 4, symbolId: '30620', label: 'hurts',  wordType: 'descriptor', imageUrl: null, isCustom: false },
      { position: 5, symbolId: '5921',  label: 'toilet', wordType: 'noun',   imageUrl: null, isCustom: false },
    ]
  },
  {
    id: 'board_people',
    name: 'People',
    category: 'people',
    isRoot: false,
    gridColumns: 4,
    symbols: [
      { position: 0, symbolId: '2458',  label: 'mom',      wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 1, symbolId: '31146', label: 'dad',      wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 2, symbolId: '2423',  label: 'brother',  wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 3, symbolId: '2422',  label: 'sister',   wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 4, symbolId: '23710', label: 'grandma',  wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 5, symbolId: '23718', label: 'grandpa',  wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 6, symbolId: '6060',  label: 'baby',     wordType: 'noun', imageUrl: null, isCustom: false },
      { position: 7, symbolId: '25790', label: 'friend',   wordType: 'noun', imageUrl: null, isCustom: false },
    ]
  },
  {
    id: 'board_activities',
    name: 'Activities',
    category: 'activities',
    isRoot: false,
    gridColumns: 4,
    symbols: [
      { position: 0, symbolId: '6465',  label: 'run',     wordType: 'verb', imageUrl: null, isCustom: false },
      { position: 1, symbolId: '39052', label: 'jump',    wordType: 'verb', imageUrl: null, isCustom: false },
      { position: 2, symbolId: '6568',  label: 'swim',    wordType: 'verb', imageUrl: null, isCustom: false },
      { position: 3, symbolId: '29951', label: 'walk',    wordType: 'verb', imageUrl: null, isCustom: false },
      { position: 4, symbolId: '6960',  label: 'sing',    wordType: 'verb', imageUrl: null, isCustom: false },
      { position: 5, symbolId: '35747', label: 'dance',   wordType: 'verb', imageUrl: null, isCustom: false },
      { position: 6, symbolId: '29123', label: 'watch',   wordType: 'verb', imageUrl: null, isCustom: false },
      { position: 7, symbolId: '4550',  label: 'hug',     wordType: 'verb', imageUrl: null, isCustom: false },
    ]
  },
  {
    id: 'board_social',
    name: 'Social',
    category: 'social',
    isRoot: false,
    gridColumns: 4,
    symbols: [
      { position: 0, symbolId: '8195',  label: 'please',    wordType: 'social', imageUrl: null, isCustom: false },
      { position: 1, symbolId: '8129',  label: 'thank you', wordType: 'social', imageUrl: null, isCustom: false },
      { position: 2, symbolId: '6522',  label: 'hello',     wordType: 'social', imageUrl: null, isCustom: false },
      { position: 3, symbolId: '6028',  label: 'goodbye',   wordType: 'social', imageUrl: null, isCustom: false },
      { position: 4, symbolId: '11625', label: 'sorry',     wordType: 'social', imageUrl: null, isCustom: false },
      { position: 5, symbolId: '36914', label: 'wait',      wordType: 'social', imageUrl: null, isCustom: false },
      { position: 6, symbolId: '37163', label: 'again',     wordType: 'social', imageUrl: null, isCustom: false },
      { position: 7, symbolId: '28429', label: 'finished',  wordType: 'social', imageUrl: null, isCustom: false },
    ]
  },
]

export const CATEGORY_CARDS = [
  { category: 'feelings',   name: 'Feelings',     color: 'bg-yellow-50 border-yellow-200'  },
  { category: 'food',       name: 'Food & Drink', color: 'bg-red-50 border-red-200'        },
  { category: 'people',     name: 'People',       color: 'bg-purple-50 border-purple-200'  },
  { category: 'activities', name: 'Activities',   color: 'bg-green-50 border-green-200'   },
  { category: 'social',     name: 'Social',       color: 'bg-teal-50 border-teal-100'      },
  { category: 'school',     name: 'School',       color: 'bg-blue-50 border-blue-200'      },
  { category: 'numbers',    name: 'Numbers',      color: 'bg-cyan-50 border-cyan-200'      },
  { category: 'emergency',  name: 'Emergency',    color: 'bg-orange-50 border-orange-200'  },
]