// Mock beginner reading stories — domain-appropriate, child-friendly content

export interface Question {
  question: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
}

export interface Story {
  id: string;
  title: string;
  emoji: string;
  color: string;        // Tailwind bg class for card accent
  level: 'Easy' | 'Medium' | 'Fun' | 'Hard';
  levelColor: string;
  text: string;
  questions: Question[];
  /** Maps sentence index → illustration (emoji or SVG data-uri) */
  sentenceIllustrations?: Record<number, string>;
}

export const STORIES: Story[] = [
  {
    id: 'cat-and-hat',
    title: 'The Cat and the Hat',
    emoji: '🐱',
    color: 'bg-orange-100',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'The cat sat on the mat. The cat had a big hat. The hat was red and fat. The cat liked the hat a lot. She wore it every day. One day the hat fell off. The cat ran to get it back. She put it on her head again. Now the cat was happy.',
    sentenceIllustrations: {
      0: '🐱🪑',
      1: '🐱🎩',
      2: '🎩❤️',
      3: '😻🎩',
      4: '📅🎩',
      5: '🎩💨',
      6: '🏃🐱',
      7: '🐱🎩✅',
      8: '😸🎉',
    },
    questions: [
      {
        question: 'What colour was the cat\'s hat?',
        options: ['Blue', 'Red', 'Green'],
        correctIndex: 1,
      },
      {
        question: 'What happened to the hat one day?',
        options: ['It got wet', 'It fell off', 'It got lost'],
        correctIndex: 1,
      },
      {
        question: 'How did the cat feel at the end?',
        options: ['Sad', 'Angry', 'Happy'],
        correctIndex: 2,
      },
      {
        question: 'Where did the cat sit?',
        options: ['On a chair', 'On the mat', 'On the floor'],
        correctIndex: 1,
      },
      {
        question: 'What did the cat do after the hat fell off?',
        options: ['She cried', 'She left it there', 'She ran to get it back'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'dog-and-ball',
    title: 'Max and the Ball',
    emoji: '🐶',
    color: 'bg-blue-100',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'Max the dog loved his red ball. He ran fast to catch it. The ball went up high in the sky. Max jumped and got it. He ran back to his friend Sam. Sam threw the ball far away. Max ran and ran. He was a very good dog. Sam gave Max a big hug.',
    sentenceIllustrations: {
      0: '🐶❤️🔴',
      1: '🐶💨',
      2: '🔴☁️',
      3: '🐶⬆️🔴',
      4: '🐶👦',
      5: '👦🔴➡️',
      6: '🐶🏃',
      7: '🐶⭐',
      8: '👦🤗🐶',
    },
    questions: [
      {
        question: 'What colour was Max\'s ball?',
        options: ['Blue', 'Yellow', 'Red'],
        correctIndex: 2,
      },
      {
        question: 'Who was Max\'s friend?',
        options: ['Sam', 'Tom', 'Lily'],
        correctIndex: 0,
      },
      {
        question: 'What did Sam give Max at the end?',
        options: ['A treat', 'A big hug', 'A new ball'],
        correctIndex: 1,
      },
      {
        question: 'What did Max do when the ball went high in the sky?',
        options: ['He barked', 'He sat down', 'He jumped and got it'],
        correctIndex: 2,
      },
      {
        question: 'What kind of dog was Max?',
        options: ['A very good dog', 'A very fast dog', 'A very big dog'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'little-fish',
    title: 'The Little Blue Fish',
    emoji: '🐠',
    color: 'bg-cyan-100',
    level: 'Medium',
    levelColor: 'bg-yellow-200 text-yellow-800',
    text:
      'Once there was a little blue fish. She lived in a big bright sea. Every day she swam past the coral reef. The reef was full of pretty colours. Pink and yellow and green. One day she found a hidden cave. Inside the cave was a sparkly shell. She picked it up and swam home. She put the shell on her shelf.',
    sentenceIllustrations: {
      0: '🐟💙',
      1: '🌊🌟',
      2: '🐟🪸',
      3: '🪸🌈',
      4: '🩷💛💚',
      5: '🐟🕳️',
      6: '🐚✨',
      7: '🐟🏠',
      8: '🐚🪟',
    },
    questions: [
      {
        question: 'Where did the little fish live?',
        options: ['In a river', 'In a big bright sea', 'In a pond'],
        correctIndex: 1,
      },
      {
        question: 'What did the fish find in the cave?',
        options: ['A sparkly shell', 'A treasure chest', 'A pretty fish'],
        correctIndex: 0,
      },
      {
        question: 'What did the fish do with what she found?',
        options: ['She gave it away', 'She put it on her shelf', 'She left it in the cave'],
        correctIndex: 1,
      },
      {
        question: 'What colours were on the coral reef?',
        options: ['Red, blue and white', 'Pink, yellow and green', 'Orange, purple and black'],
        correctIndex: 1,
      },
      {
        question: 'Where was the hidden cave?',
        options: ['Near the beach', 'Under the reef', 'In the sea near the reef'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'rainy-day',
    title: 'A Rainy Day',
    emoji: '🌧️',
    color: 'bg-purple-100',
    level: 'Medium',
    levelColor: 'bg-yellow-200 text-yellow-800',
    text:
      'It was a rainy day outside. Lily looked out the window. The rain made puddles on the path. She put on her yellow raincoat and her red boots. She jumped in every puddle she could find. Splash splash splash! She got very muddy. Mum was not pleased. But Lily was very happy. She loved rainy days.',
    sentenceIllustrations: {
      0: '🌧️🏠',
      1: '👧🪟',
      2: '🌧️💧',
      3: '🧥👢',
      4: '👧💦',
      5: '💦💦💦',
      6: '👧🟤',
      7: '👩😤',
      8: '👧😄',
      9: '🌧️❤️',
    },
    questions: [
      {
        question: 'What colour was Lily\'s raincoat?',
        options: ['Red', 'Blue', 'Yellow'],
        correctIndex: 2,
      },
      {
        question: 'What did Lily jump in?',
        options: ['Puddles', 'Leaves', 'Snow'],
        correctIndex: 0,
      },
      {
        question: 'How did Mum feel about Lily getting muddy?',
        options: ['Happy', 'Not pleased', 'Excited'],
        correctIndex: 1,
      },
      {
        question: 'What colour were Lily\'s boots?',
        options: ['Yellow', 'Blue', 'Red'],
        correctIndex: 2,
      },
      {
        question: 'What sound did the puddles make?',
        options: ['Drip drip drip', 'Splash splash splash', 'Boom boom boom'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'stars-at-night',
    title: 'Stars at Night',
    emoji: '⭐',
    color: 'bg-indigo-100',
    level: 'Fun',
    levelColor: 'bg-pink-200 text-pink-800',
    text:
      'Every night the stars came out to play. There were tiny stars and big bright stars. Tommy liked to lie in the grass and look up. He could see the Big Dipper and the North Star. His dad said the stars were very very far away. Tommy thought that was amazing. He wanted to fly up and touch one someday. Maybe one day he will.',
    sentenceIllustrations: {
      0: '🌙⭐',
      1: '✨🌟',
      2: '👦🌿🔭',
      3: '🌌⭐',
      4: '👨⭐♾️',
      5: '😮🤩',
      6: '👦🚀⭐',
      7: '🌠💫',
    },
    questions: [
      {
        question: 'Where did Tommy lie to look at the stars?',
        options: ['On his bed', 'In the grass', 'On the roof'],
        correctIndex: 1,
      },
      {
        question: 'What did Tommy\'s dad say about the stars?',
        options: ['They are very bright', 'They are very far away', 'They are very small'],
        correctIndex: 1,
      },
      {
        question: 'What did Tommy want to do someday?',
        options: ['Draw the stars', 'Count the stars', 'Fly up and touch a star'],
        correctIndex: 2,
      },
      {
        question: 'Which star group could Tommy see?',
        options: ['The Little Dipper', 'The Big Dipper', 'The South Star'],
        correctIndex: 1,
      },
      {
        question: 'What kinds of stars were there?',
        options: ['Only big stars', 'Only tiny stars', 'Tiny stars and big bright stars'],
        correctIndex: 2,
      },
    ],
  },

  // ── NEW EASY STORIES ────────────────────────────────────────────────────────

  {
    id: 'big-red-hen',
    title: 'The Big Red Hen',
    emoji: '🐔',
    color: 'bg-red-100',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'The big red hen sat on her nest. She had three eggs in the nest. The eggs were small and white. One day the eggs cracked open. Three baby chicks came out. They were soft and yellow. The hen was very happy. She kept her chicks warm. They all lived on the farm.',
    questions: [
      { question: 'How many eggs did the hen have?', options: ['Two', 'Three', 'Four'], correctIndex: 1 },
      { question: 'What colour were the eggs?', options: ['Yellow', 'Brown', 'White'], correctIndex: 2 },
      { question: 'What colour were the baby chicks?', options: ['White', 'Yellow', 'Orange'], correctIndex: 1 },
      { question: 'Where did the hen sit?', options: ['On a fence', 'On her nest', 'On the grass'], correctIndex: 1 },
      { question: 'Where did they all live?', options: ['In a forest', 'On the farm', 'By the sea'], correctIndex: 1 },
    ],
  },
  {
    id: 'little-seed',
    title: 'The Little Seed',
    emoji: '🌱',
    color: 'bg-green-100',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'Tom had a little seed. He put it in the ground. He gave it water every day. The sun shone down on it. A tiny green shoot came up. It grew taller and taller. Soon there was a big yellow flower. Tom smiled at his flower. He was very proud.',
    questions: [
      { question: 'What did Tom put in the ground?', options: ['A stone', 'A little seed', 'A stick'], correctIndex: 1 },
      { question: 'What did Tom give the seed every day?', options: ['Milk', 'Water', 'Juice'], correctIndex: 1 },
      { question: 'What colour was the flower?', options: ['Red', 'Blue', 'Yellow'], correctIndex: 2 },
      { question: 'What came up first from the ground?', options: ['A big leaf', 'A tiny green shoot', 'A flower'], correctIndex: 1 },
      { question: 'How did Tom feel about his flower?', options: ['Sad', 'Bored', 'Very proud'], correctIndex: 2 },
    ],
  },
  {
    id: 'the-lost-sock',
    title: 'The Lost Sock',
    emoji: '🧦',
    color: 'bg-pink-100',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'Ben could not find his sock. He looked under his bed. He looked in his bag. He looked behind the door. Then he saw his dog. The dog had the sock in his mouth. Ben laughed and took the sock back. He put on both socks. Now his feet were warm.',
    questions: [
      { question: 'What was Ben looking for?', options: ['His shoe', 'His sock', 'His hat'], correctIndex: 1 },
      { question: 'Where did Ben look first?', options: ['In his bag', 'Under his bed', 'Behind the door'], correctIndex: 1 },
      { question: 'Who had the sock?', options: ['His cat', 'His dog', 'His sister'], correctIndex: 1 },
      { question: 'Where was the sock?', options: ['In the dog\'s mouth', 'On the floor', 'In the garden'], correctIndex: 0 },
      { question: 'How did Ben feel when he found the sock?', options: ['Angry', 'Sad', 'He laughed'], correctIndex: 2 },
    ],
  },
  {
    id: 'the-yellow-bus',
    title: 'The Yellow Bus',
    emoji: '🚌',
    color: 'bg-yellow-100',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'The yellow bus came down the road. It stopped at the corner. Many children got on. They sat in their seats. The bus driver said good morning. The children said good morning back. The bus drove to school. The children got off and ran inside. It was a good day.',
    questions: [
      { question: 'What colour was the bus?', options: ['Red', 'Blue', 'Yellow'], correctIndex: 2 },
      { question: 'Where did the bus stop?', options: ['At the park', 'At the corner', 'At the shop'], correctIndex: 1 },
      { question: 'Where did the bus go?', options: ['To the park', 'To school', 'To the shops'], correctIndex: 1 },
      { question: 'What did the bus driver say?', options: ['Good night', 'Good morning', 'Goodbye'], correctIndex: 1 },
      { question: 'What did the children do when they got off?', options: ['They sat down', 'They ran inside', 'They waited'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-apple-tree',
    title: 'The Apple Tree',
    emoji: '🍎',
    color: 'bg-red-50',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'There was a big apple tree in the garden. It had lots of red apples on it. Mia climbed up to pick one. She bit into it. It was sweet and crunchy. She picked three more for her family. Mum made a pie with the apples. It smelled very good. They ate it after dinner.',
    questions: [
      { question: 'Where was the apple tree?', options: ['In the park', 'In the garden', 'By the road'], correctIndex: 1 },
      { question: 'What colour were the apples?', options: ['Green', 'Yellow', 'Red'], correctIndex: 2 },
      { question: 'What did Mia do with the apples?', options: ['She threw them away', 'She picked them', 'She painted them'], correctIndex: 1 },
      { question: 'What did Mum make with the apples?', options: ['A cake', 'A pie', 'A drink'], correctIndex: 1 },
      { question: 'When did they eat the pie?', options: ['After breakfast', 'After lunch', 'After dinner'], correctIndex: 2 },
    ],
  },
  {
    id: 'the-little-boat',
    title: 'The Little Boat',
    emoji: '⛵',
    color: 'bg-blue-100',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'Sam had a little red boat. He put it in the pond. The boat floated on the water. The wind pushed it along. It went to the other side. Sam ran around the pond to get it. He picked it up and smiled. He put it in the water again. He loved his little boat.',
    questions: [
      { question: 'What colour was Sam\'s boat?', options: ['Blue', 'Red', 'Green'], correctIndex: 1 },
      { question: 'Where did Sam put the boat?', options: ['In the bath', 'In the pond', 'In the sea'], correctIndex: 1 },
      { question: 'What pushed the boat along?', options: ['Sam\'s hand', 'The wind', 'The rain'], correctIndex: 1 },
      { question: 'What did Sam do to get the boat back?', options: ['He swam', 'He used a stick', 'He ran around the pond'], correctIndex: 2 },
      { question: 'How did Sam feel about his boat?', options: ['He loved it', 'He was bored of it', 'He was scared of it'], correctIndex: 0 },
    ],
  },
  {
    id: 'the-sleepy-bear',
    title: 'The Sleepy Bear',
    emoji: '🐻',
    color: 'bg-amber-100',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'The big brown bear was very sleepy. He found a cosy burrow under the big oak tree. He went inside and lay down. He closed his eyes. He slept all winter long. When spring came the sun shone in. The bear woke up and stretched. He walked outside and sniffed the air. He was ready for a new day.',
    questions: [
      { question: 'What colour was the bear?', options: ['Black', 'White', 'Brown'], correctIndex: 2 },
      { question: 'Where did the bear sleep?', options: ['Under a tree', 'In a cosy cave', 'By the river'], correctIndex: 1 },
      { question: 'How long did the bear sleep?', options: ['All summer', 'All winter', 'All autumn'], correctIndex: 1 },
      { question: 'What woke the bear up?', options: ['A loud noise', 'The spring sun', 'Another animal'], correctIndex: 1 },
      { question: 'What did the bear do when he woke up?', options: ['He went back to sleep', 'He stretched and walked outside', 'He ate some fish'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-rainbow',
    title: 'After the Rain',
    emoji: '🌈',
    color: 'bg-violet-100',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'It rained all morning. Then the rain stopped. The sun came out. Lily looked up at the sky. She saw a big rainbow. It had many colours. Red, orange, yellow, green, blue, and purple. Lily pointed at it. Her little brother looked too. They both said wow.',
    questions: [
      { question: 'When did the rain stop?', options: ['In the evening', 'At night', 'After raining all morning'], correctIndex: 2 },
      { question: 'What did Lily see in the sky?', options: ['A big cloud', 'A big rainbow', 'A big bird'], correctIndex: 1 },
      { question: 'What came out after the rain?', options: ['The moon', 'The sun', 'The stars'], correctIndex: 1 },
      { question: 'What did they both say?', options: ['Oh no', 'Wow', 'Help'], correctIndex: 1 },
      { question: 'What colour was the cloud from the August sunset?', options: ['Orange', 'Purple', 'Pink'], correctIndex: 2 },
    ],
  },
  {
    id: 'the-new-puppy',
    title: 'The New Puppy',
    emoji: '🐕',
    color: 'bg-orange-50',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'Dad came home with a box. Inside the box was a puppy. The puppy was small and fluffy. It had big brown eyes. The children were so happy. They named the puppy Biscuit. Biscuit wagged his tail. He licked their faces. They gave him a bowl of water. Biscuit was home.',
    questions: [
      { question: 'What was inside the box?', options: ['A kitten', 'A puppy', 'A rabbit'], correctIndex: 1 },
      { question: 'What colour were the puppy\'s eyes?', options: ['Blue', 'Green', 'Brown'], correctIndex: 2 },
      { question: 'What did the children name the puppy?', options: ['Cookie', 'Biscuit', 'Muffin'], correctIndex: 1 },
      { question: 'What did Biscuit do to the children\'s faces?', options: ['He sniffed them', 'He licked them', 'He bit them'], correctIndex: 1 },
      { question: 'What did the children give Biscuit?', options: ['A bone', 'A toy', 'A bowl of water'], correctIndex: 2 },
    ],
  },
  {
    id: 'the-big-wave',
    title: 'At the Beach',
    emoji: '🏖️',
    color: 'bg-cyan-50',
    level: 'Easy',
    levelColor: 'bg-green-200 text-green-800',
    text:
      'Jack went to the beach with his family. The sand was warm and soft. He built a sandcastle near the water. He put a flag on top. Then a big wave came. It knocked the sandcastle down. Jack was sad for a moment. Then he started to build a new one. This time he built it further from the water.',
    questions: [
      { question: 'Where did Jack go?', options: ['To the park', 'To the beach', 'To the forest'], correctIndex: 1 },
      { question: 'What did Jack build?', options: ['A snowman', 'A sandcastle', 'A tent'], correctIndex: 1 },
      { question: 'What did Jack put on top of the sandcastle?', options: ['A shell', 'A flag', 'A stone'], correctIndex: 1 },
      { question: 'What knocked the sandcastle down?', options: ['The wind', 'A big wave', 'His sister'], correctIndex: 1 },
      { question: 'Where did Jack build the new sandcastle?', options: ['Further from the water', 'Closer to the water', 'On the road'], correctIndex: 0 },
    ],
  },

  // ── NEW MEDIUM STORIES ──────────────────────────────────────────────────────

  {
    id: 'bunny-garden',
    title: 'The Bunny in the Garden',
    emoji: '🐰',
    color: 'bg-green-100',
    level: 'Medium',
    levelColor: 'bg-yellow-200 text-yellow-800',
    text:
      'Bella the bunny lived in a cosy burrow under the big oak tree. Every morning she hopped out to eat fresh carrots from the garden. One day she found a small bird with a hurt wing sitting on the ground. Bella brought the bird some seeds and water. She sat beside it all afternoon. By evening the bird could flap its wing again. The bird sang a sweet song to say thank you. Bella hopped home feeling very warm inside.',
    sentenceIllustrations: {
      0: '🐰🌳',
      1: '🐰🥕',
      2: '🐦🩹',
      3: '🐰🌾💧',
      4: '🐰🐦🕐',
      5: '🐦✅',
      6: '🐦🎵',
      7: '🐰🏠❤️',
    },
    questions: [
      {
        question: 'Where did Bella the bunny live?',
        options: ['In a tree house', 'Under the big oak tree', 'In a flower pot'],
        correctIndex: 1,
      },
      {
        question: 'What did Bella eat every morning?',
        options: ['Fresh carrots', 'Apples', 'Grass'],
        correctIndex: 0,
      },
      {
        question: 'What was wrong with the bird Bella found?',
        options: ['It was lost', 'It had a hurt wing', 'It was hungry'],
        correctIndex: 1,
      },
      {
        question: 'What did Bella bring the bird?',
        options: ['Carrots and milk', 'Seeds and water', 'Bread and honey'],
        correctIndex: 1,
      },
      {
        question: 'How did the bird say thank you to Bella?',
        options: ['It danced', 'It sang a sweet song', 'It brought her a gift'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'lost-kite',
    title: 'The Lost Kite',
    emoji: '🪁',
    color: 'bg-sky-100',
    level: 'Medium',
    levelColor: 'bg-yellow-200 text-yellow-800',
    text:
      'Jake had a bright orange kite with a long yellow tail. One windy afternoon he ran to the park to fly it. The kite soared up high above the trees. Then a strong gust of wind pulled the string from Jake\'s hand. The kite flew away over the rooftops. Jake felt sad and looked everywhere. He found it caught in a tall apple tree at the edge of the park. A kind old man helped him climb up and get it back. Jake thanked the man and flew his kite all the way home.',
    sentenceIllustrations: {
      0: '🪁🟠',
      1: '👦🌬️🌳',
      2: '🪁☁️',
      3: '💨🪁✋',
      4: '🪁🏠',
      5: '👦😢',
      6: '🪁🍎🌳',
      7: '👴👦🌳',
      8: '👦🪁🏠',
    },
    questions: [
      {
        question: 'What colour was Jake\'s kite?',
        options: ['Bright orange', 'Bright blue', 'Bright red'],
        correctIndex: 0,
      },
      {
        question: 'Where did Jake go to fly his kite?',
        options: ['The beach', 'The park', 'The school field'],
        correctIndex: 1,
      },
      {
        question: 'What made the kite fly away?',
        options: ['Jake let go on purpose', 'A strong gust of wind', 'The string broke'],
        correctIndex: 1,
      },
      {
        question: 'Where did Jake find his kite?',
        options: ['On a rooftop', 'In a tall apple tree', 'In a bush'],
        correctIndex: 1,
      },
      {
        question: 'Who helped Jake get his kite back?',
        options: ['His mum', 'A kind old man', 'A park ranger'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'baking-cookies',
    title: 'Baking Cookies with Gran',
    emoji: '🍪',
    color: 'bg-amber-100',
    level: 'Medium',
    levelColor: 'bg-yellow-200 text-yellow-800',
    text:
      'On Saturday morning, Mia went to her gran\'s house to bake cookies. Gran had already set out flour, butter, sugar, and chocolate chips on the table. They mixed everything together in a big bowl. Mia got to stir the dough until it was smooth. Gran rolled it flat and Mia used a star-shaped cutter to cut out the cookies. They put them in the oven for twelve minutes. When the cookies came out they smelled wonderful. Mia and Gran ate two each with a glass of cold milk.',
    sentenceIllustrations: {
      0: '👧👵🍪',
      1: '🌾🧈🍫',
      2: '🥣🍪',
      3: '👧🥄',
      4: '⭐🍪✂️',
      5: '🔥🍪⏱️',
      6: '🍪😍',
      7: '👧👵🥛',
    },
    questions: [
      {
        question: 'When did Mia go to her gran\'s house?',
        options: ['Friday evening', 'Sunday afternoon', 'Saturday morning'],
        correctIndex: 2,
      },
      {
        question: 'What shape did Mia cut the cookies?',
        options: ['Heart shape', 'Star shape', 'Circle shape'],
        correctIndex: 1,
      },
      {
        question: 'How long did the cookies bake in the oven?',
        options: ['Ten minutes', 'Fifteen minutes', 'Twelve minutes'],
        correctIndex: 2,
      },
      {
        question: 'What did Mia do with the dough?',
        options: ['She rolled it flat', 'She stirred it until smooth', 'She poured it into a tin'],
        correctIndex: 1,
      },
      {
        question: 'What did Mia and Gran drink with their cookies?',
        options: ['Hot chocolate', 'Orange juice', 'Cold milk'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'frog-pond',
    title: 'Freddie the Frog',
    emoji: '🐸',
    color: 'bg-lime-100',
    level: 'Medium',
    levelColor: 'bg-yellow-200 text-yellow-800',
    text:
      'Freddie was a small green frog who lived beside a quiet pond. He loved to jump from lily pad to lily pad. One summer day he decided to explore the other side of the pond. He leaped across six lily pads without stopping. On the other side he met a turtle named Tess. Tess showed him a patch of tall reeds where fireflies glowed at night. Freddie had never seen anything so beautiful. He visited Tess every evening after that to watch the fireflies together.',
    sentenceIllustrations: {
      0: '🐸🌿',
      1: '🐸🌸',
      2: '🐸🗺️',
      3: '🐸🌸🌸🌸',
      4: '🐸🐢',
      5: '🌾✨🌙',
      6: '🐸😍',
      7: '🐸🐢🌟',
    },
    questions: [
      {
        question: 'Where did Freddie the frog live?',
        options: ['In a tree', 'Beside a quiet pond', 'Under a rock'],
        correctIndex: 1,
      },
      {
        question: 'How many lily pads did Freddie leap across?',
        options: ['Four', 'Six', 'Eight'],
        correctIndex: 1,
      },
      {
        question: 'Who did Freddie meet on the other side of the pond?',
        options: ['A duck named Daisy', 'A turtle named Tess', 'A fish named Finn'],
        correctIndex: 1,
      },
      {
        question: 'What glowed in the tall reeds at night?',
        options: ['Stars', 'Fireflies', 'Lanterns'],
        correctIndex: 1,
      },
      {
        question: 'What did Freddie do every evening after meeting Tess?',
        options: ['He swam in the pond', 'He jumped on lily pads', 'He visited Tess to watch the fireflies'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'snowy-morning',
    title: 'The Snowy Morning',
    emoji: '❄️',
    color: 'bg-blue-50',
    level: 'Medium',
    levelColor: 'bg-yellow-200 text-yellow-800',
    text:
      'When Zoe woke up she looked out her window and gasped. Everything was covered in white snow. She quickly pulled on her thick coat, her woolly hat, and her purple gloves. She ran outside and her boots crunched on the snow. She built a snowman with a carrot nose and two buttons for eyes. Her little brother Leo came out and helped her add a scarf. They threw snowballs at each other until their cheeks were rosy red. Mum called them in for hot soup and they sat by the fire to warm up.',
    sentenceIllustrations: {
      0: '👧🪟😮',
      1: '❄️🏠',
      2: '🧥🧤🟣',
      3: '👢❄️',
      4: '⛄🥕',
      5: '👦🧣⛄',
      6: '❄️🤣',
      7: '🍲🔥',
    },
    questions: [
      {
        question: 'What did Zoe see when she looked out the window?',
        options: ['Rain on the grass', 'Everything covered in white snow', 'A sunny morning'],
        correctIndex: 1,
      },
      {
        question: 'What colour were Zoe\'s gloves?',
        options: ['Red', 'Blue', 'Purple'],
        correctIndex: 2,
      },
      {
        question: 'What did Zoe use for the snowman\'s nose?',
        options: ['A stick', 'A carrot', 'A stone'],
        correctIndex: 1,
      },
      {
        question: 'Who helped Zoe add a scarf to the snowman?',
        options: ['Her mum', 'Her little brother Leo', 'Her dad'],
        correctIndex: 1,
      },
      {
        question: 'What did Mum call them in for?',
        options: ['Hot chocolate', 'Hot soup', 'Warm bread'],
        correctIndex: 1,
      },
    ],
  },

  // ── NEW FUN STORIES ─────────────────────────────────────────────────────────

  {
    id: 'the-talking-parrot',
    title: 'Percy the Talking Parrot',
    emoji: '🦜',
    color: 'bg-green-100',
    level: 'Fun',
    levelColor: 'bg-pink-200 text-pink-800',
    text:
      'Percy the parrot could say thirty-seven words. His favourite was "biscuit." Every time someone opened the kitchen cupboard Percy would shout "BISCUIT! BISCUIT!" at the top of his voice. One day he learned to say "bath time" and would shout it at random moments, making everyone jump. The family tried to teach him to say "good morning" but he always mixed it up and said "good biscuit" instead. The neighbours thought the family was very strange. Percy thought he was absolutely hilarious.',
    questions: [
      { question: 'How many words could Percy say?', options: ['Twenty-seven', 'Thirty-seven', 'Forty-seven'], correctIndex: 1 },
      { question: 'What was Percy\'s favourite word?', options: ['Hello', 'Biscuit', 'Pretty'], correctIndex: 1 },
      { question: 'What new phrase did Percy learn that made everyone jump?', options: ['Dinner time', 'Bath time', 'Bed time'], correctIndex: 1 },
      { question: 'What did Percy say instead of "good morning"?', options: ['Good parrot', 'Good biscuit', 'Good night'], correctIndex: 1 },
      { question: 'What did Percy think of himself?', options: ['He thought he was very clever', 'He thought he was absolutely hilarious', 'He thought he was very handsome'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-invisible-friend',
    title: 'My Invisible Friend',
    emoji: '👻',
    color: 'bg-purple-100',
    level: 'Fun',
    levelColor: 'bg-pink-200 text-pink-800',
    text:
      'Poppy had an invisible friend called Zigzag. Zigzag was very tall, had purple hair, and ate only spaghetti. Poppy set a place at the table for Zigzag every night. One evening Dad accidentally sat on Zigzag\'s chair. Poppy gasped and told him Zigzag was now sitting on his head. Dad spent the whole dinner trying not to laugh. Mum asked Zigzag if the food was nice. Poppy said Zigzag wanted more spaghetti. They gave Zigzag a second helping. Poppy ate it for him.',
    questions: [
      { question: 'What was Poppy\'s invisible friend called?', options: ['Zigzag', 'Zippity', 'Zorro'], correctIndex: 0 },
      { question: 'What colour was Zigzag\'s hair?', options: ['Blue', 'Green', 'Purple'], correctIndex: 2 },
      { question: 'What did Zigzag eat only?', options: ['Pizza', 'Spaghetti', 'Rice'], correctIndex: 1 },
      { question: 'What happened when Dad sat on Zigzag\'s chair?', options: ['Poppy cried', 'Poppy said Zigzag was on his head', 'Poppy laughed and moved chairs'], correctIndex: 1 },
      { question: 'Who ate Zigzag\'s second helping of spaghetti?', options: ['Dad', 'Mum', 'Poppy'], correctIndex: 2 },
    ],
  },
  {
    id: 'the-backwards-day',
    title: 'Backwards Day',
    emoji: '🔄',
    color: 'bg-yellow-100',
    level: 'Fun',
    levelColor: 'bg-pink-200 text-pink-800',
    text:
      'On April Fool\'s Day, the whole class decided to do everything backwards. They said goodbye when they arrived and hello when they left. They ate their snacks before doing their work and their work after snacks. Leo wore his jumper inside out and back to front. The teacher played along and wrote the date on the board from right to left. At the end of the day everyone said "Good morning!" as they walked out the door. The caretaker outside looked very confused.',
    questions: [
      { question: 'What day did the class do everything backwards?', options: ['Halloween', 'April Fool\'s Day', 'The last day of term'], correctIndex: 1 },
      { question: 'What did the children say when they arrived?', options: ['Hello', 'Good morning', 'Goodbye'], correctIndex: 2 },
      { question: 'What did Leo wear inside out and back to front?', options: ['His coat', 'His jumper', 'His shirt'], correctIndex: 1 },
      { question: 'What did the teacher write backwards on the board?', options: ['Her name', 'The lesson title', 'The date'], correctIndex: 2 },
      { question: 'Who looked very confused at the end of the day?', options: ['The headteacher', 'The caretaker', 'A parent'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-giant-pancake',
    title: 'The Giant Pancake',
    emoji: '🥞',
    color: 'bg-amber-100',
    level: 'Fun',
    levelColor: 'bg-pink-200 text-pink-800',
    text:
      'Dad decided to make the world\'s biggest pancake on Sunday morning. He used every egg in the fridge and a whole bag of flour. The batter filled the biggest bowl in the kitchen. When he poured it into the pan it spread to the edges and kept going. The smoke alarm went off. The dog barked. The pancake was too big to flip so Dad tried to slide it onto a plate. Half of it landed on the floor. The dog ate that half. Dad said it was a great success. Nobody agreed.',
    questions: [
      { question: 'What day did Dad make the giant pancake?', options: ['Saturday morning', 'Sunday morning', 'Friday evening'], correctIndex: 1 },
      { question: 'What went off when Dad was cooking?', options: ['The oven timer', 'The smoke alarm', 'The doorbell'], correctIndex: 1 },
      { question: 'Why couldn\'t Dad flip the pancake?', options: ['He was too tired', 'It was too big to flip', 'The pan was too hot'], correctIndex: 1 },
      { question: 'What happened to half the pancake?', options: ['It burned', 'It landed on the floor', 'It stuck to the ceiling'], correctIndex: 1 },
      { question: 'Who ate the half that fell on the floor?', options: ['The cat', 'The dog', 'Dad'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-robot-vacuum',
    title: 'The Robot Vacuum',
    emoji: '🤖',
    color: 'bg-slate-100',
    level: 'Fun',
    levelColor: 'bg-pink-200 text-pink-800',
    text:
      'The family got a new robot vacuum cleaner. It was supposed to clean the floors by itself. On the first day it got stuck under the sofa for two hours. On the second day it ate one of Dad\'s socks and made a terrible noise. On the third day the cat discovered she could ride on it. She sat on top and was carried slowly around the kitchen looking very pleased with herself. The family decided the robot was useless for cleaning but excellent for entertaining the cat.',
    questions: [
      { question: 'What did the family get?', options: ['A robot lawnmower', 'A robot vacuum cleaner', 'A robot dishwasher'], correctIndex: 1 },
      { question: 'Where did the robot get stuck on the first day?', options: ['Behind the fridge', 'Under the sofa', 'In the bathroom'], correctIndex: 1 },
      { question: 'What did the robot eat on the second day?', options: ['A toy', 'A sock', 'A piece of food'], correctIndex: 1 },
      { question: 'What did the cat discover she could do?', options: ['Turn the robot off', 'Ride on the robot', 'Chase the robot'], correctIndex: 1 },
      { question: 'What did the family decide the robot was excellent for?', options: ['Cleaning the kitchen', 'Entertaining the cat', 'Scaring visitors'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-magic-wellies',
    title: 'The Magic Wellies',
    emoji: '🥾',
    color: 'bg-teal-100',
    level: 'Fun',
    levelColor: 'bg-pink-200 text-pink-800',
    text:
      'Finn found a pair of bright green wellies at a car boot sale. They were a perfect fit. The moment he put them on he felt like jumping. He jumped over the garden gate. He jumped over the neighbour\'s hedge. He jumped over the postbox at the end of the road. His mum watched from the window with her mouth open. Finn was convinced the wellies were magic. His mum was convinced he had eaten too much sugar at breakfast. Either way, Finn jumped all the way to school and arrived ten minutes early.',
    questions: [
      { question: 'Where did Finn find the wellies?', options: ['In a charity shop', 'At a car boot sale', 'In his attic'], correctIndex: 1 },
      { question: 'What colour were the wellies?', options: ['Bright blue', 'Bright red', 'Bright green'], correctIndex: 2 },
      { question: 'What did Finn jump over at the end of the road?', options: ['A fence', 'A postbox', 'A puddle'], correctIndex: 1 },
      { question: 'What did Finn think about the wellies?', options: ['He thought they were too big', 'He was convinced they were magic', 'He thought they were ugly'], correctIndex: 1 },
      { question: 'How early did Finn arrive at school?', options: ['Five minutes early', 'Ten minutes early', 'Twenty minutes early'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-sneezing-dragon',
    title: 'The Dragon Who Sneezed',
    emoji: '🐉',
    color: 'bg-red-100',
    level: 'Fun',
    levelColor: 'bg-pink-200 text-pink-800',
    text:
      'Dex the dragon had a terrible problem. Every time he sneezed he accidentally set something on fire. He sneezed on his birthday cake and it became a bonfire. He sneezed at the library and singed three books. He sneezed during a school photo and the photographer\'s hat caught fire. The other dragons suggested he try pepper-free food, nose plugs, and even a tiny umbrella over his snout. Nothing worked. Then one day he sneezed while standing next to the village bonfire pile and lit it perfectly. The whole village cheered. Dex decided his sneezes were actually a gift.',
    questions: [
      { question: 'What happened when Dex sneezed?', options: ['He flew backwards', 'He set things on fire', 'He made a loud roar'], correctIndex: 1 },
      { question: 'What did Dex\'s birthday cake become when he sneezed?', options: ['A pile of ash', 'A bonfire', 'A puddle'], correctIndex: 1 },
      { question: 'What caught fire during the school photo?', options: ['The camera', 'The photographer\'s hat', 'The backdrop'], correctIndex: 1 },
      { question: 'What did Dex accidentally light perfectly?', options: ['The village fireplace', 'The village bonfire pile', 'The village lanterns'], correctIndex: 1 },
      { question: 'What did Dex decide about his sneezes?', options: ['They were a curse', 'They were a gift', 'They were getting worse'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-upside-down-house',
    title: 'The Upside-Down House',
    emoji: '🏠',
    color: 'bg-orange-100',
    level: 'Fun',
    levelColor: 'bg-pink-200 text-pink-800',
    text:
      'When the Flipp family moved into their new house they noticed something odd. The front door was at the top and the chimney was at the bottom. The stairs went down to the bedrooms and up to the kitchen. The garden was on the roof. The family decided to just go with it. They grew tomatoes on the roof garden. They slid down the stairs to bed each night. They climbed up to make breakfast. The neighbours thought they were very peculiar. The Flipps thought the neighbours were the peculiar ones for living in ordinary houses.',
    questions: [
      { question: 'Where was the front door of the Flipp family\'s house?', options: ['At the side', 'At the bottom', 'At the top'], correctIndex: 2 },
      { question: 'Where was the garden?', options: ['At the back', 'On the roof', 'Underground'], correctIndex: 1 },
      { question: 'What did the family grow on the roof garden?', options: ['Flowers', 'Tomatoes', 'Herbs'], correctIndex: 1 },
      { question: 'How did the family get to bed each night?', options: ['They climbed up the stairs', 'They slid down the stairs', 'They used a lift'], correctIndex: 1 },
      { question: 'What did the Flipps think about the neighbours?', options: ['They thought they were very friendly', 'They thought they were peculiar for living in ordinary houses', 'They thought they were very noisy'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-cloud-collector',
    title: 'The Cloud Collector',
    emoji: '☁️',
    color: 'bg-sky-100',
    level: 'Fun',
    levelColor: 'bg-pink-200 text-pink-800',
    text:
      'Iris had a very unusual hobby. She collected clouds. She kept them in glass jars on her bedroom shelf. A fluffy white one from a Tuesday in March. A grey stormy one from the day it hailed. A pink one from a sunset in August. Her friends thought she was making it up until she opened the jar with the stormy cloud and it rained on her carpet. Her mum was not impressed. Iris quickly put the lid back on. She labelled the jar "DO NOT OPEN INDOORS" and went to find a new cloud to add to her collection.',
    questions: [
      { question: 'What did Iris collect?', options: ['Raindrops', 'Clouds', 'Snowflakes'], correctIndex: 1 },
      { question: 'Where did Iris keep her cloud collection?', options: ['In boxes under her bed', 'In glass jars on her shelf', 'In bags in her wardrobe'], correctIndex: 1 },
      { question: 'What happened when Iris opened the stormy cloud jar?', options: ['Thunder boomed', 'It rained on her carpet', 'Wind blew through the room'], correctIndex: 1 },
      { question: 'What did Iris label the stormy cloud jar?', options: ['"HANDLE WITH CARE"', '"DO NOT OPEN INDOORS"', '"DANGER: STORM INSIDE"'], correctIndex: 1 },
      { question: 'What colour was the cloud from the August sunset?', options: ['Orange', 'Purple', 'Pink'], correctIndex: 2 },
    ],
  },
  {
    id: 'the-singing-vegetables',
    title: 'The Singing Vegetables',
    emoji: '🥦',
    color: 'bg-green-100',
    level: 'Fun',
    levelColor: 'bg-pink-200 text-pink-800',
    text:
      'One morning, Theo opened the fridge and heard singing. The broccoli was humming a low tune. The carrots were doing harmonies. The peas were providing a beat by rolling around in their bag. Theo stood very still and listened. It was actually quite good. He called his sister in. She said she couldn\'t hear anything. The moment she arrived the vegetables went silent. Theo was sure they were doing it on purpose. That evening he left a tiny note in the fridge that said "I know you can sing." The next morning all the vegetables had been rearranged to spell "SO WHAT."',
    questions: [
      { question: 'What was the broccoli doing?', options: ['Humming a low tune', 'Singing loudly', 'Whistling'], correctIndex: 0 },
      { question: 'What were the peas doing?', options: ['Providing harmonies', 'Providing a beat by rolling around', 'Staying very still'], correctIndex: 1 },
      { question: 'What did Theo\'s sister say when she arrived?', options: ['She said it was amazing', 'She said she couldn\'t hear anything', 'She said she was scared'], correctIndex: 1 },
      { question: 'What did Theo leave in the fridge?', options: ['A drawing', 'A tiny note saying "I know you can sing"', 'A piece of paper with music on it'], correctIndex: 1 },
      { question: 'What had the vegetables spelled out the next morning?', options: ['"GO AWAY"', '"SO WHAT"', '"STOP IT"'], correctIndex: 1 },
    ],
  },

  // ── NEW HARD STORIES ────────────────────────────────────────────────────────

  {
    id: 'the-ancient-map',
    title: 'The Ancient Map',
    emoji: '🗺️',
    color: 'bg-amber-100',
    level: 'Hard',
    levelColor: 'bg-red-200 text-red-800',
    text:
      'When eleven-year-old Cleo was helping her grandmother clear out the attic, she discovered a rolled-up piece of parchment tucked inside an old tin box. Unrolling it carefully, she found a hand-drawn map of the town, but it looked nothing like the town she knew. Streets had different names, and a large building was marked "The Grand Assembly Hall" where the supermarket now stood. Cleo took the map to the local history museum, where a curator named Mr. Okafor identified it as being over one hundred and fifty years old. He explained that the Assembly Hall had been demolished in 1923 to make way for a railway line. Cleo donated the map to the museum and was invited to give a short talk to a visiting school group about her discovery.',
    questions: [
      { question: 'How old was Cleo?', options: ['Nine years old', 'Ten years old', 'Eleven years old'], correctIndex: 2 },
      { question: 'Where did Cleo find the map?', options: ['In a drawer in the kitchen', 'In an old tin box in the attic', 'Under the floorboards'], correctIndex: 1 },
      { question: 'What building was marked on the map where the supermarket now stands?', options: ['The Grand Town Hall', 'The Grand Assembly Hall', 'The Grand Library'], correctIndex: 1 },
      { question: 'When was the Assembly Hall demolished?', options: ['In 1903', 'In 1913', 'In 1923'], correctIndex: 2 },
      { question: 'What was Cleo invited to do at the museum?', options: ['Help restore old documents', 'Give a short talk to a visiting school group', 'Design a new exhibition'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-solar-project',
    title: 'The Solar Project',
    emoji: '☀️',
    color: 'bg-yellow-100',
    level: 'Hard',
    levelColor: 'bg-red-200 text-red-800',
    text:
      'When the village of Ashford learned that the council planned to close the community centre due to high energy bills, thirteen-year-old Anya proposed an unusual solution. She had been researching solar energy for a school project and calculated that installing solar panels on the centre\'s south-facing roof could reduce electricity costs by up to seventy percent. She presented her findings to the parish council with charts and cost projections she had made herself. The council was impressed but said the installation would cost twelve thousand pounds. Anya launched a community fundraising campaign, organising a sponsored walk, a bake sale, and an online crowdfunding page. Within four months the full amount had been raised. The solar panels were installed the following spring, and the community centre remained open.',
    questions: [
      { question: 'Why was the council planning to close the community centre?', options: ['It was too old to repair', 'Due to high energy bills', 'Because not enough people used it'], correctIndex: 1 },
      { question: 'How old was Anya?', options: ['Eleven years old', 'Twelve years old', 'Thirteen years old'], correctIndex: 2 },
      { question: 'By how much did Anya calculate solar panels could reduce electricity costs?', options: ['Up to fifty percent', 'Up to sixty percent', 'Up to seventy percent'], correctIndex: 2 },
      { question: 'How much did the solar panel installation cost?', options: ['Ten thousand pounds', 'Twelve thousand pounds', 'Fifteen thousand pounds'], correctIndex: 1 },
      { question: 'How long did it take to raise the full amount?', options: ['Two months', 'Three months', 'Four months'], correctIndex: 2 },
    ],
  },
  {
    id: 'the-migration',
    title: 'Following the Wildebeest',
    emoji: '🦬',
    color: 'bg-orange-100',
    level: 'Hard',
    levelColor: 'bg-red-200 text-red-800',
    text:
      'Every year, more than one and a half million wildebeest make one of the greatest journeys on Earth — the Great Migration across the Serengeti plains of Tanzania and into Kenya\'s Masai Mara. The herds follow the rains, moving in a vast circular route in search of fresh grass. The most dangerous part of the journey is crossing the Mara River, where enormous Nile crocodiles wait in the murky water. The wildebeest must decide when to cross, and the hesitation of the herd can last for hours. Once one animal leaps in, thousands follow in a thundering rush. Many do not survive. Yet the migration continues year after year, driven by the ancient instinct to find food and sustain the next generation.',
    questions: [
      { question: 'How many wildebeest take part in the Great Migration?', options: ['More than half a million', 'More than one million', 'More than one and a half million'], correctIndex: 2 },
      { question: 'What do the wildebeest follow during their migration?', options: ['The direction of the wind', 'The rains', 'The path of the sun'], correctIndex: 1 },
      { question: 'What is the most dangerous part of the journey?', options: ['Crossing the open plains', 'Crossing the Mara River', 'Climbing the rocky hills'], correctIndex: 1 },
      { question: 'What waits for the wildebeest in the Mara River?', options: ['Hippos', 'Nile crocodiles', 'Leopards'], correctIndex: 1 },
      { question: 'What drives the wildebeest to continue the migration year after year?', options: ['The need to escape predators', 'The ancient instinct to find food and sustain the next generation', 'The search for warmer weather'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-code-breaker',
    title: 'The Code Breaker',
    emoji: '🔐',
    color: 'bg-indigo-100',
    level: 'Hard',
    levelColor: 'bg-red-200 text-red-800',
    text:
      'During the Second World War, a team of mathematicians and linguists worked in secret at a country house called Bletchley Park in England. Their mission was to decode encrypted messages sent by the enemy. The Germans used a machine called Enigma to scramble their communications, believing the code was unbreakable. A brilliant mathematician named Alan Turing designed an electromechanical machine called the Bombe, which could test thousands of possible code combinations every hour. By cracking the Enigma code, the team at Bletchley Park helped the Allies understand enemy plans and is credited with shortening the war by an estimated two to four years. For decades after the war, their work remained classified and largely unknown to the public.',
    questions: [
      { question: 'Where did the code-breaking team work?', options: ['A secret underground bunker', 'A country house called Bletchley Park', 'A naval base in Scotland'], correctIndex: 1 },
      { question: 'What was the German coding machine called?', options: ['Cipher', 'Enigma', 'Bombe'], correctIndex: 1 },
      { question: 'What did Alan Turing design?', options: ['A new type of radio', 'An electromechanical machine called the Bombe', 'A faster aircraft'], correctIndex: 1 },
      { question: 'By how many years is the team credited with shortening the war?', options: ['One to two years', 'Two to four years', 'Four to six years'], correctIndex: 1 },
      { question: 'What happened to the team\'s work after the war?', options: ['It was published in newspapers', 'It remained classified and largely unknown', 'It was turned into a film immediately'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-coral-reef',
    title: 'Saving the Reef',
    emoji: '🪸',
    color: 'bg-cyan-100',
    level: 'Hard',
    levelColor: 'bg-red-200 text-red-800',
    text:
      'The Great Barrier Reef off the coast of Australia is the world\'s largest coral reef system, stretching over two thousand three hundred kilometres. It is home to more than nine hundred species of fish, four thousand types of mollusc, and six of the world\'s seven species of marine turtle. However, rising ocean temperatures caused by climate change have led to repeated coral bleaching events, where corals expel the algae that give them colour and nutrients, turning white and eventually dying. Scientists are working on several strategies to protect the reef, including breeding heat-resistant coral in laboratories and releasing them onto damaged sections. Some researchers are also experimenting with shading parts of the reef using fine mist to reflect sunlight. The future of the reef depends on both local conservation efforts and global action to reduce carbon emissions.',
    questions: [
      { question: 'How long is the Great Barrier Reef?', options: ['Over one thousand kilometres', 'Over two thousand kilometres', 'Over two thousand three hundred kilometres'], correctIndex: 2 },
      { question: 'What causes coral bleaching?', options: ['Pollution from ships', 'Rising ocean temperatures', 'Overfishing near the reef'], correctIndex: 1 },
      { question: 'What happens to corals during a bleaching event?', options: ['They grow too fast', 'They expel the algae that give them colour and nutrients', 'They sink to the ocean floor'], correctIndex: 1 },
      { question: 'What are scientists breeding in laboratories?', options: ['New species of fish', 'Heat-resistant coral', 'Larger sea turtles'], correctIndex: 1 },
      { question: 'What are some researchers experimenting with to shade the reef?', options: ['Giant underwater mirrors', 'Fine mist to reflect sunlight', 'Artificial clouds'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-young-chef',
    title: 'The Young Chef',
    emoji: '👨‍🍳',
    color: 'bg-rose-100',
    level: 'Hard',
    levelColor: 'bg-red-200 text-red-800',
    text:
      'At the age of ten, Kwame began watching cooking videos online and teaching himself to prepare dishes from around the world. By twelve he could make a Thai green curry, a Moroccan tagine, and a classic French omelette. When his school announced a charity fundraising dinner, Kwame volunteered to cook the main course for sixty guests. He spent two weeks planning the menu, calculating ingredient quantities, and practising the timing. On the evening of the dinner he managed a team of four classmates in the school kitchen, directing each person with calm precision. The guests were astonished that a twelve-year-old had prepared the meal. A local restaurant owner who attended offered Kwame a weekend work experience placement. Kwame accepted without hesitation.',
    questions: [
      { question: 'How did Kwame teach himself to cook?', options: ['By taking cooking classes', 'By watching cooking videos online', 'By reading cookbooks'], correctIndex: 1 },
      { question: 'How many guests did Kwame cook for at the charity dinner?', options: ['Forty guests', 'Fifty guests', 'Sixty guests'], correctIndex: 2 },
      { question: 'How long did Kwame spend planning the dinner?', options: ['One week', 'Two weeks', 'Three weeks'], correctIndex: 1 },
      { question: 'How many classmates did Kwame manage in the kitchen?', options: ['Three', 'Four', 'Five'], correctIndex: 1 },
      { question: 'What did the local restaurant owner offer Kwame?', options: ['A cooking trophy', 'A weekend work experience placement', 'A scholarship to a cookery school'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-glacier',
    title: 'The Melting Glacier',
    emoji: '🧊',
    color: 'bg-blue-100',
    level: 'Hard',
    levelColor: 'bg-red-200 text-red-800',
    text:
      'High in the Swiss Alps, glaciologists have been monitoring the Rhône Glacier for over a century. Their records show that the glacier has retreated by more than three kilometres since measurements began in 1879. In recent decades the rate of melting has accelerated dramatically due to rising global temperatures. Each summer, volunteers cover sections of the glacier with white fleece blankets to reflect sunlight and slow the melting process. While this buys some time, scientists warn that without significant reductions in greenhouse gas emissions, the glacier could disappear entirely within the next eighty years. The loss would affect not only the landscape but also the freshwater supply for communities downstream who depend on glacial meltwater during dry summer months.',
    questions: [
      { question: 'How long have scientists been monitoring the Rhône Glacier?', options: ['Over fifty years', 'Over seventy-five years', 'Over a century'], correctIndex: 2 },
      { question: 'By how much has the glacier retreated since 1879?', options: ['More than one kilometre', 'More than two kilometres', 'More than three kilometres'], correctIndex: 2 },
      { question: 'What do volunteers use to slow the melting?', options: ['Ice-making machines', 'White fleece blankets', 'Cooling fans'], correctIndex: 1 },
      { question: 'Within how many years could the glacier disappear?', options: ['Within fifty years', 'Within eighty years', 'Within one hundred years'], correctIndex: 1 },
      { question: 'Who depends on glacial meltwater during dry summer months?', options: ['Tourists visiting the Alps', 'Communities downstream', 'Farmers on the glacier itself'], correctIndex: 1 },
    ],
  },
  {
    id: 'the-space-telescope',
    title: 'Eyes on the Universe',
    emoji: '🔭',
    color: 'bg-violet-100',
    level: 'Hard',
    levelColor: 'bg-red-200 text-red-800',
    text:
      'The James Webb Space Telescope, launched in December 2021, is the most powerful space telescope ever built. It orbits the Sun at a point called L2, approximately one and a half million kilometres from Earth, where it can observe the universe without interference from Earth\'s heat or light. Unlike its predecessor the Hubble Telescope, which primarily observed visible light, Webb detects infrared radiation, allowing it to peer through clouds of dust and gas that previously blocked our view. In its first year of operation, Webb captured images of galaxies that formed just a few hundred million years after the Big Bang — the earliest glimpse of the universe ever recorded. Scientists hope Webb will help answer fundamental questions about how stars, galaxies, and planetary systems form.',
    questions: [
      { question: 'When was the James Webb Space Telescope launched?', options: ['December 2019', 'December 2020', 'December 2021'], correctIndex: 2 },
      { question: 'How far from Earth does Webb orbit?', options: ['Approximately one million kilometres', 'Approximately one and a half million kilometres', 'Approximately two million kilometres'], correctIndex: 1 },
      { question: 'What type of radiation does Webb detect?', options: ['Ultraviolet radiation', 'Infrared radiation', 'X-ray radiation'], correctIndex: 1 },
      { question: 'What did Webb capture images of in its first year?', options: ['Nearby planets in our solar system', 'Galaxies that formed just after the Big Bang', 'The surface of distant moons'], correctIndex: 1 },
      { question: 'What is one key difference between Webb and the Hubble Telescope?', options: ['Webb is smaller than Hubble', 'Webb orbits closer to Earth than Hubble', 'Webb detects infrared while Hubble primarily observed visible light'], correctIndex: 2 },
    ],
  },
  {
    id: 'the-bridge-builders',
    title: 'Building the Bridge',
    emoji: '🌉',
    color: 'bg-slate-100',
    level: 'Hard',
    levelColor: 'bg-red-200 text-red-800',
    text:
      'For generations, the villagers of Qeswachaka in Peru have rebuilt the same suspension bridge every year using traditional Inca techniques. The bridge spans the Apurímac River canyon and is made entirely from braided grass rope. Each June, families from four surrounding communities gather to weave thousands of metres of rope from a mountain grass called qoya. The old bridge is cut down and the new one is constructed in just three days. The process requires precise coordination — the main cables must be tensioned correctly, and the walkway woven tightly enough to support the weight of a person. The bridge-building ceremony was added to UNESCO\'s list of Intangible Cultural Heritage in 2013, recognising it as a living tradition that connects modern Peruvians to their Inca ancestors.',
    questions: [
      { question: 'How often is the Qeswachaka bridge rebuilt?', options: ['Every five years', 'Every two years', 'Every year'], correctIndex: 2 },
      { question: 'What is the bridge made from?', options: ['Braided grass rope', 'Woven bamboo', 'Twisted vines'], correctIndex: 0 },
      { question: 'How long does it take to construct the new bridge?', options: ['One day', 'Three days', 'One week'], correctIndex: 1 },
      { question: 'What is the mountain grass used to make the rope called?', options: ['Quipu', 'Qoya', 'Quinoa'], correctIndex: 1 },
      { question: 'When was the bridge-building ceremony added to UNESCO\'s Intangible Cultural Heritage list?', options: ['In 2003', 'In 2008', 'In 2013'], correctIndex: 2 },
    ],
  },
  {
    id: 'the-night-market',
    title: 'The Night Market',
    emoji: '🏮',
    color: 'bg-red-100',
    level: 'Hard',
    levelColor: 'bg-red-200 text-red-800',
    text:
      'Every Friday evening, the old quarter of the city transformed into a bustling night market. Hundreds of lanterns strung between the buildings cast a warm amber glow over the narrow streets. Vendors called out in a dozen languages, offering everything from hand-carved wooden toys to steaming bowls of noodle soup. Fifteen-year-old Sana had been helping at her family\'s spice stall since she was eight. She knew the name, origin, and culinary use of every spice on the table — from Kashmiri saffron to smoked paprika from Spain. One evening a food journalist stopped at their stall and spent an hour asking Sana questions. The article he published described her as "a walking encyclopaedia of the spice world." Her parents framed the article and hung it above the stall.',
    questions: [
      { question: 'When did the night market take place?', options: ['Every Saturday evening', 'Every Thursday evening', 'Every Friday evening'], correctIndex: 2 },
      { question: 'What cast a warm amber glow over the streets?', options: ['Fairy lights on the stalls', 'Hundreds of lanterns strung between buildings', 'Torches along the road'], correctIndex: 1 },
      { question: 'How old was Sana when she started helping at the spice stall?', options: ['Six', 'Seven', 'Eight'], correctIndex: 2 },
      { question: 'Who stopped at the stall one evening?', options: ['A television presenter', 'A food journalist', 'A famous chef'], correctIndex: 1 },
      { question: 'How did the article describe Sana?', options: ['"A future master chef"', '"A walking encyclopaedia of the spice world"', '"The youngest spice expert in the city"'], correctIndex: 1 },
    ],
  },
];

/**
 * Tokenize a story text into sentences and words.
 * Returns an array of sentences, each being an array of word tokens.
 */
export function tokenizeText(text: string): string[][] {
  // Split into sentences on . ! ?
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return sentences.map((sentence) =>
    // Split sentence into words, keeping punctuation attached to the word
    sentence.match(/[\w']+[.,!?;:]?/g) ?? []
  );
}

/**
 * Strip punctuation from a word before passing to TTS.
 */
export function cleanWordForSpeech(word: string): string {
  return word.replace(/[.,!?;:'"]/g, '').trim();
}