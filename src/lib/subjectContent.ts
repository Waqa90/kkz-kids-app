// Built-in subject activities for Science, Social Studies, Healthy Living, MCE, Fijian

import type { SubjectKey } from '@/lib/childProfile';

export type ActivityType = 'multiple-choice' | 'true-false' | 'match' | 'short-answer';

export interface SubjectQuestion {
  id: string;
  question: string;
  type: ActivityType;
  options?: string[];
  correctAnswer: string;
  correctIndex?: number;
  hint?: string;
  emoji?: string;
}

export interface SubjectActivity {
  id: string;
  subject: SubjectKey;
  class: 3 | 4 | 5;
  title: string;
  emoji: string;
  color: string;
  levelColor: string;
  activityType: ActivityType;
  questions: SubjectQuestion[];
  source: 'builtin' | 'uploaded';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

function mc(id: string, question: string, options: string[], correctIndex: number, emoji?: string, hint?: string): SubjectQuestion {
  return { id, question, type: 'multiple-choice', options, correctAnswer: options[correctIndex], correctIndex, emoji, hint };
}
function tf(id: string, question: string, correctAnswer: 'True' | 'False', emoji?: string, hint?: string): SubjectQuestion {
  return { id, question, type: 'true-false', options: ['True', 'False'], correctAnswer, correctIndex: correctAnswer === 'True' ? 0 : 1, emoji, hint };
}
function mt(id: string, question: string, correctAnswer: string, emoji?: string): SubjectQuestion {
  return { id, question, type: 'match', correctAnswer, emoji };
}

export const BUILTIN_ACTIVITIES: SubjectActivity[] = [
  // ── SCIENCE — Class 4 ────────────────────────────────────────────────────
  {
    id: 'sci-c4-plants', subject: 'science', class: 4, title: 'Plants & Growth 🌱', emoji: '🌱',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('sci-c4-p1','What do plants use sunlight for?',['Playing','Making food','Growing leaves','Drinking water'],1,'☀️','Photosynthesis uses sunlight'),
      mc('sci-c4-p2','Which part of a plant takes in water?',['Leaf','Flower','Root','Stem'],2,'🌿','Roots grow underground'),
      mc('sci-c4-p3','What gas do plants release during photosynthesis?',['Carbon dioxide','Nitrogen','Oxygen','Hydrogen'],2,'💨','We breathe this gas'),
      mc('sci-c4-p4','What is the green colouring in leaves called?',['Chlorophyll','Glucose','Cellulose','Starch'],0,'🍃','It captures sunlight'),
      mc('sci-c4-p5','Which part carries water from roots to leaves?',['Flower','Stem','Seed','Fruit'],1,'🌱'),
      mc('sci-c4-p6','What do seeds need to germinate?',['Sunlight only','Water and warmth','Soil only','Darkness'],1,'🌰','Seeds sprout with water and warmth'),
      mc('sci-c4-p7','What is the main job of leaves?',['Absorb water','Store food','Make food','Attract insects'],2,'🌿'),
      mc('sci-c4-p8','Which part of the plant makes seeds?',['Root','Stem','Leaf','Flower'],3,'🌸','Flowers make seeds'),
    ],
  },
  {
    id: 'sci-c4-animals', subject: 'science', class: 4, title: 'Animals & Habitats 🐾', emoji: '🐾',
    color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('sci-c4-a1','What do herbivores eat?',['Meat only','Plants only','Both plants and meat','Fish'],1,'🦒','Herbi = plant'),
      mc('sci-c4-a2','Where do fish live?',['Deserts','Trees','Water','Underground'],2,'🐟','Fish breathe through gills in water'),
      mc('sci-c4-a3','What is a habitat?',['A type of food','A place where animals live','A season','An animal home'],1,'🏡'),
      mc('sci-c4-a4','Which animal is a mammal?',['Eagle','Crocodile','Whale','Snake'],2,'🐋','Mammals feed their babies milk'),
      mc('sci-c4-a5','What do carnivores eat?',['Plants','Seeds','Meat','Fruit'],2,'🦁','Carni = meat'),
      mc('sci-c4-a6','Which bird cannot fly?',['Eagle','Penguin','Parrot','Hawk'],1,'🐧'),
      mc('sci-c4-a7','What is a food chain?',['A grocery store','The order of who eats whom','A type of habitat','A plant part'],1,'🔗'),
      mc('sci-c4-a8','What animals eat both plants and meat?',['Herbivores','Carnivores','Omnivores','Decomposers'],2,'🐻','Omni = both'),
    ],
  },
  // ── SCIENCE — Class 5 ────────────────────────────────────────────────────
  {
    id: 'sci-c5-forces', subject: 'science', class: 5, title: 'Forces & Energy ⚡', emoji: '⚡',
    color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('sci-c5-f1','What force pulls objects towards Earth?',['Magnetism','Friction','Gravity','Tension'],2,'🌍'),
      mc('sci-c5-f2','What type of force slows things down when they rub together?',['Gravity','Friction','Magnetism','Thrust'],1,'⚙️','Rough surfaces create more friction'),
      mc('sci-c5-f3','A push or pull is called a…',['Energy','Motion','Force','Speed'],2,'💪'),
      mc('sci-c5-f4','Which simple machine is like a sloped surface?',['Lever','Pulley','Inclined plane','Wheel'],2,'🏔️'),
      mc('sci-c5-f5','What makes a compass work?',['Gravity','Magnetism','Electricity','Friction'],1,'🧭'),
      mc('sci-c5-f6','Energy that objects have because they are moving is called…',['Potential energy','Chemical energy','Kinetic energy','Heat energy'],2,'⚡'),
      mc('sci-c5-f7','A see-saw is an example of which simple machine?',['Pulley','Lever','Wheel and axle','Wedge'],1,'⚖️'),
      mc('sci-c5-f8','When you stretch a rubber band it has…',['Kinetic energy','Thermal energy','Potential energy','Electrical energy'],2,'🔵'),
      mc('sci-c5-f9','What do we call a force that attracts iron objects?',['Gravity','Friction','Magnetism','Electricity'],2,'🧲'),
      mc('sci-c5-f10','Which unit is used to measure force?',['Kilogram','Metre','Newton','Joule'],2,'📏'),
    ],
  },
  {
    id: 'sci-c5-water', subject: 'science', class: 5, title: 'The Water Cycle 🌊', emoji: '🌊',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'true-false', source: 'builtin', difficulty: 'Hard',
    questions: [
      tf('sci-c5-w1','Evaporation is when water turns from liquid to vapour.','True','☀️'),
      tf('sci-c5-w2','Condensation happens when water vapour cools and becomes liquid.','True','💧'),
      tf('sci-c5-w3','Rain, hail and snow are all types of precipitation.','True','🌧️'),
      tf('sci-c5-w4','Water evaporates only from the ocean.','False','🏞️','Water evaporates from rivers, lakes and puddles too'),
      tf('sci-c5-w5','Clouds are made of water droplets.','True','☁️'),
      tf('sci-c5-w6','The water cycle needs energy from the moon.','False','🌙','The water cycle needs energy from the sun'),
      tf('sci-c5-w7','Groundwater is water stored underground.','True','⛰️'),
      tf('sci-c5-w8','Evaporation happens faster in cold weather.','False','❄️','Evaporation is faster in warm weather'),
      tf('sci-c5-w9','Rivers carry water back to the sea.','True','🌊'),
      tf('sci-c5-w10','Condensation forms clouds in the atmosphere.','True','🌤️'),
    ],
  },
  // ── SOCIAL STUDIES — Class 4 ─────────────────────────────────────────────
  {
    id: 'ss-c4-fiji', subject: 'social-studies', class: 4, title: 'Our Fiji 🇫🇯', emoji: '🇫🇯',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('ss-c4-f1','What is the capital city of Fiji?',['Lautoka','Nasinu','Suva','Nadi'],2,'🏙️'),
      mc('ss-c4-f2','What is the largest island in Fiji?',["Vanua Levu","Viti Levu","Taveuni","Kadavu"],1,'🏝️'),
      mc('ss-c4-f3','What colours are on the Fijian flag?',['Red and yellow','Light blue and white','Green and white','Orange and blue'],1,'🚩'),
      mc('ss-c4-f4','What is the traditional Fijian ceremony drink?',['Tea','Kava','Juice','Coffee'],1,'🥣','It is called yaqona'),
      mc('ss-c4-f5','Fiji is located in which ocean?',['Atlantic','Indian','Arctic','Pacific'],3,'🌊'),
      mc('ss-c4-f6','What language is widely spoken in Fiji besides Fijian?',['Spanish','Hindi','French','Mandarin'],1,'🗣️'),
      mc('ss-c4-f7','What is the traditional Fijian dance called?',['Haka','Meke','Siva','Hula'],1,'💃'),
      mc('ss-c4-f8','On what date did Fiji gain independence?',['January 1','October 10','July 4','March 15'],1,'🎉','10th October 1970'),
    ],
  },
  {
    id: 'ss-c4-community', subject: 'social-studies', class: 4, title: 'Our Community 🏘️', emoji: '🏘️',
    color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', activityType: 'true-false', source: 'builtin', difficulty: 'Medium',
    questions: [
      tf('ss-c4-c1','Doctors and nurses are community helpers.','True','🏥'),
      tf('ss-c4-c2','It is OK to litter in public places.','False','🚯','We should keep our community clean'),
      tf('ss-c4-c3','Rules help keep communities safe.','True','📋'),
      tf('ss-c4-c4','Only adults have responsibilities in the community.','False','👦','Children also have responsibilities'),
      tf('ss-c4-c5','Police officers help keep communities safe.','True','👮'),
      tf('ss-c4-c6','We should respect the property of others.','True','🏠'),
      tf('ss-c4-c7','Voting is a way people make decisions together.','True','🗳️'),
      tf('ss-c4-c8','We do not need to follow road rules.','False','🚦','Road rules keep everyone safe'),
    ],
  },
  // ── SOCIAL STUDIES — Class 5 ─────────────────────────────────────────────
  {
    id: 'ss-c5-pacific', subject: 'social-studies', class: 5, title: 'Pacific Neighbours 🌏', emoji: '🌏',
    color: 'bg-teal-100', levelColor: 'bg-teal-200 text-teal-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('ss-c5-p1','What is the capital of Samoa?',['Apia','Suva','Nuku\'alofa','Honiara'],0,'🏝️'),
      mc('ss-c5-p2','Which country is the largest in the Pacific?',['Fiji','Papua New Guinea','Samoa','Tonga'],1,'🗺️'),
      mc('ss-c5-p3','What is the capital of Tonga?',["Nuku'alofa",'Apia','Papeete','Honiara'],0,'🌺'),
      mc('ss-c5-p4','The Melanesian islands include…',['Hawaii and Tahiti','Fiji, Solomon Islands and Vanuatu','Samoa and Tonga','Cook Islands and Niue'],1,'🏝️'),
      mc('ss-c5-p5','Which ocean surrounds all Pacific islands?',['Indian Ocean','Atlantic Ocean','Pacific Ocean','Arctic Ocean'],2,'🌊'),
      mc('ss-c5-p6','What is Australia\'s capital city?',['Sydney','Melbourne','Canberra','Brisbane'],2,'🦘'),
      mc('ss-c5-p7','The traditional home in many Pacific cultures is called a…',['Igloo','Bure','Tepee','Cottage'],1,'🏠','In Fiji it is a bure'),
      mc('ss-c5-p8','What does the Pacific Forum do?',['Runs schools','Trades fish','Helps Pacific nations work together','Manages airlines'],2,'🤝'),
      mc('ss-c5-p9','New Zealand is also known as…',['Aotearoa','Samoa','Niue','Tokelau'],0,'🥝'),
      mc('ss-c5-p10','Which island group is furthest north in the Pacific?',['Fiji','Samoa','Hawaii','Tonga'],2,'🌺'),
    ],
  },
  {
    id: 'ss-c5-history', subject: 'social-studies', class: 5, title: 'Fiji History 📜', emoji: '📜',
    color: 'bg-amber-100', levelColor: 'bg-amber-200 text-amber-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('ss-c5-h1','In what year did Fiji become independent?',['1960','1970','1975','1980'],1,'🎉'),
      mc('ss-c5-h2','Who was the first Governor-General of independent Fiji?',['Sitiveni Rabuka','Ratu Sir George Cakobau','Ratu Sir Kamisese Mara','Mahendra Chaudhry'],1,'👑'),
      mc('ss-c5-h3','Fiji became a British colony in which year?',['1874','1900','1850','1920'],0,'🇬🇧'),
      mc('ss-c5-h4','What traditional ceremony welcomes important guests in Fiji?',['Soli','Yaqona ceremony','Meke','Lovo'],1,'🥣'),
      mc('ss-c5-h5','Indentured labourers were brought to Fiji mainly from…',['China','Africa','India','Australia'],2,'🌏'),
      mc('ss-c5-h6','The Fijian parliament is called the…',['Senate','Congress','National Assembly','Parliament of Fiji'],3,'🏛️'),
      mc('ss-c5-h7','iTaukei means…',['A type of food','The indigenous Fijian people','A Fijian dance','A type of cloth'],1,'👨‍👩‍👧'),
      mc('ss-c5-h8','Which crop was grown on Fijian plantations historically?',['Rice','Sugarcane','Wheat','Coffee'],1,'🌾'),
    ],
  },
  // ── HEALTHY LIVING — Class 4 ─────────────────────────────────────────────
  {
    id: 'hl-c4-food', subject: 'healthy-living', class: 4, title: 'Food Groups 🥗', emoji: '🥗',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('hl-c4-fd1','Which food group gives us energy?',['Proteins','Fats','Carbohydrates','Vitamins'],2,'🍞','Bread, rice and pasta are carbohydrates'),
      mc('hl-c4-fd2','Which food is a good source of protein?',['White rice','Apple','Egg','Bread'],2,'🥚'),
      mc('hl-c4-fd3','How many glasses of water should we drink daily?',['2','4','8','12'],2,'💧'),
      mc('hl-c4-fd4','Which fruit is grown in Fiji?',['Apple','Mango','Strawberry','Blueberry'],1,'🥭'),
      mc('hl-c4-fd5','Vegetables and fruits provide us with…',['Fats','Vitamins and minerals','Proteins only','Sugar'],1,'🥦'),
      mc('hl-c4-fd6','Which food group do fish and chicken belong to?',['Carbohydrates','Dairy','Fats','Proteins'],3,'🐟'),
      mc('hl-c4-fd7','Milk, cheese and yoghurt belong to which group?',['Grains','Proteins','Dairy','Fats'],2,'🥛'),
      mc('hl-c4-fd8','Which meal is considered the most important of the day?',['Lunch','Dinner','Supper','Breakfast'],3,'🌅'),
    ],
  },
  {
    id: 'hl-c4-exercise', subject: 'healthy-living', class: 4, title: 'Exercise & Body 🏃', emoji: '🏃',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'true-false', source: 'builtin', difficulty: 'Medium',
    questions: [
      tf('hl-c4-ex1','Exercise helps make our muscles stronger.','True','💪'),
      tf('hl-c4-ex2','Sitting still all day is as healthy as being active.','False','🛋️','We need to move our bodies regularly'),
      tf('hl-c4-ex3','Running is a form of exercise.','True','🏃'),
      tf('hl-c4-ex4','Sleep is important for good health.','True','😴'),
      tf('hl-c4-ex5','Exercise can help improve your mood.','True','😊'),
      tf('hl-c4-ex6','Children do not need to exercise.','False','🧒','Everyone benefits from exercise'),
      tf('hl-c4-ex7','Swimming is a good form of exercise.','True','🏊'),
      tf('hl-c4-ex8','Watching TV is the best form of exercise.','False','📺','TV watching is not exercise'),
    ],
  },
  // ── HEALTHY LIVING — Class 5 ─────────────────────────────────────────────
  {
    id: 'hl-c5-hygiene', subject: 'healthy-living', class: 5, title: 'Hygiene & Health 🦷', emoji: '🦷',
    color: 'bg-teal-100', levelColor: 'bg-teal-200 text-teal-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('hl-c5-hy1','How often should you brush your teeth?',['Once a week','Once a day','Twice a day','Once a month'],2,'🦷'),
      mc('hl-c5-hy2','When should you wash your hands?',['Before eating only','After the toilet only','Before eating and after the toilet','Only when they look dirty'],2,'🙌'),
      mc('hl-c5-hy3','How many hours of sleep does a child need each night?',['4-5 hours','6-7 hours','9-11 hours','12-14 hours'],2,'😴'),
      mc('hl-c5-hy4','What should you do when you sneeze?',['Sneeze openly','Cover your mouth and nose','Run away','Hold it in'],1,'🤧'),
      mc('hl-c5-hy5','How often should children have a bath or shower?',['Once a week','Every day','Every two days','Once a month'],1,'🚿'),
      mc('hl-c5-hy6','Which is the best drink for good health?',['Soft drinks','Fruit juice','Water','Cordial'],2,'💧'),
      mc('hl-c5-hy7','What helps prevent the spread of germs?',['Sharing utensils','Regular handwashing','Sneezing openly','Not washing hands'],1,'🧼'),
      mc('hl-c5-hy8','Healthy skin needs protection from…',['Rain','Wind','Strong sunlight','Cold'],2,'☀️','Use sunscreen in Fiji'),
    ],
  },
  {
    id: 'hl-c5-mental', subject: 'healthy-living', class: 5, title: 'Mental Wellbeing 🧠', emoji: '🧠',
    color: 'bg-pink-100', levelColor: 'bg-pink-200 text-pink-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('hl-c5-mw1','What should you do when you feel angry?',['Yell at others','Take deep breaths and calm down','Hit something','Run away'],1,'😤'),
      mc('hl-c5-mw2','Which activity helps reduce stress?',['Staying up late','Playing sport or exercising','Eating junk food','Watching screens all night'],1,'🏋️'),
      mc('hl-c5-mw3','Who can you talk to if you feel sad?',['Nobody','A trusted adult or friend','Only your pet','Just yourself'],1,'💬'),
      mc('hl-c5-mw4','Being kind to others helps…',['Nobody','Only yourself','Both you and others feel good','Make others jealous'],2,'💝'),
      mc('hl-c5-mw5','What is bullying?',['Playing games','Helping friends','Hurting others repeatedly','Making new friends'],2,'🚫'),
      mc('hl-c5-mw6','Good friendships make us feel…',['Unhappy','Lonely','Happy and supported','Angry'],2,'🤝'),
      mc('hl-c5-mw7','When should you ask for help?',['Never','Only for big problems','Whenever you need it','Only from adults'],2,'🙋'),
      mc('hl-c5-mw8','Laughing and having fun is…',['Bad for health','Good for your wellbeing','Not important','Childish'],1,'😄'),
    ],
  },
  // ── MCE — Class 3 ────────────────────────────────────────────────────────
  {
    id: 'mce-c3-behaviour', subject: 'mce', class: 3, title: 'Good Behaviour 🤝', emoji: '🤝',
    color: 'bg-pink-100', levelColor: 'bg-pink-200 text-pink-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('mce-c3-b1','Your friend drops their lunch. What should you do?',['Laugh at them','Help them pick it up','Walk away','Take their lunch'],1,'🍱','Be kind and helpful'),
      mc('mce-c3-b2','Someone is crying. What should you do?',['Ignore them','Make fun of them','Ask if they are OK','Walk away'],2,'😢'),
      mc('mce-c3-b3','You want to use the swing but someone is on it. What do you do?',['Push them off','Wait your turn nicely','Cry','Go away angry'],1,'🛝'),
      mc('mce-c3-b4','A classmate has a different idea. You should…',['Ignore their idea','Listen and respect their opinion','Laugh at them','Tell them they are wrong'],1,'💡'),
      mc('mce-c3-b5','What do you say when someone helps you?',['Nothing','Thank you','Whatever','Give me more'],1,'😊'),
      mc('mce-c3-b6','Your friend tells you a secret. You should…',['Tell everyone','Keep it private','Write it down','Forget it'],1,'🤫'),
      mc('mce-c3-b7','You find $5 on the ground at school. What should you do?',['Keep it','Hand it to the teacher','Buy yourself a treat','Hide it'],1,'💵'),
      mc('mce-c3-b8','Being honest means…',['Telling lies','Telling the truth always','Saying what people want to hear','Being quiet'],1,'✅'),
    ],
  },
  {
    id: 'mce-c3-rules', subject: 'mce', class: 3, title: 'School Rules 🏫', emoji: '🏫',
    color: 'bg-purple-100', levelColor: 'bg-purple-200 text-purple-800', activityType: 'true-false', source: 'builtin', difficulty: 'Easy',
    questions: [
      tf('mce-c3-r1','We should listen when the teacher is talking.','True','👂'),
      tf('mce-c3-r2','It is OK to run inside the classroom.','False','🏃','We walk inside to stay safe'),
      tf('mce-c3-r3','We should put our hand up before speaking.','True','🙋'),
      tf('mce-c3-r4','We should look after school property.','True','🖊️'),
      tf('mce-c3-r5','It is OK to push others in line.','False','🚫','We wait patiently in line'),
      tf('mce-c3-r6','We should clean up after ourselves.','True','🧹'),
      tf('mce-c3-r7','We can do whatever we want during lesson time.','False','📚','We follow the lesson and listen to the teacher'),
      tf('mce-c3-r8','We should include everyone in our games.','True','🎮'),
    ],
  },
  {
    id: 'mce-c3-values', subject: 'mce', class: 3, title: 'Values & Choices 💝', emoji: '💝',
    color: 'bg-rose-100', levelColor: 'bg-rose-200 text-rose-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('mce-c3-v1','Sharing your things shows you are…',['Selfish','Kind and generous','Bossy','Unfriendly'],1,'🎁'),
      mc('mce-c3-v2','When you do something wrong, you should…',['Hide it','Blame others','Say sorry and fix it','Pretend nothing happened'],2,'😔'),
      mc('mce-c3-v3','Treating others the way you want to be treated is called…',['Bullying','Ignoring','The Golden Rule','Being bossy'],2,'🌟'),
      mc('mce-c3-v4','What should you do when a new child joins your class?',['Ignore them','Welcome them and be friendly','Walk away','Laugh at them'],1,'👋'),
      mc('mce-c3-v5','If your friend makes a mistake, you should…',['Laugh at them','Help them learn from it','Tell everyone','Ignore them'],1,'🤝'),
      mc('mce-c3-v6','Being responsible means…',['Doing whatever you want','Doing your duties and keeping promises','Making others do your work','Blaming others'],1,'💪'),
      mc('mce-c3-v7','What is empathy?',['Feeling angry','Understanding how others feel','Being selfish','Not caring'],1,'❤️'),
      mc('mce-c3-v8','Manners means…',['Being rude','Being polite and respectful','Shouting','Ignoring people'],1,'🙏'),
    ],
  },
  // ── FIJIAN — Class 3 ────────────────────────────────────────────────────
  {
    id: 'fijian-c3-greetings', subject: 'fijian', class: 3, title: 'Fijian Greetings 👋', emoji: '👋',
    color: 'bg-purple-100', levelColor: 'bg-purple-200 text-purple-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('fij-c3-g1','What does "Bula" mean in Fijian?',['Goodbye','Hello / Life / Health','Thank you','Yes'],1,'👋'),
      mc('fij-c3-g2','How do you say "thank you" in Fijian?',['Bula','Moce','Vinaka','Io'],2,'🙏'),
      mc('fij-c3-g3','What does "Moce" mean?',['Hello','Good morning','Goodbye','Please'],2,'👋'),
      mc('fij-c3-g4','How do you say "yes" in Fijian?',['Sega','Io','Vinaka','Bula'],1,'✅'),
      mc('fij-c3-g5','How do you say "no" in Fijian?',['Io','Sega','Moce','Bula'],1,'❌'),
      mc('fij-c3-g6','What does "Sota tale" mean?',['Good morning','See you again','Thank you','Come here'],1,'👋'),
      mc('fij-c3-g7','"Yadra" means…',['Good night','Good morning','Goodbye','Please'],1,'🌅'),
      mc('fij-c3-g8','How do you say "please" in Fijian?',['Vinaka','Mada','Bula','Io'],1,'🙏','Adding "mada" makes it polite'),
    ],
  },
  {
    id: 'fijian-c3-numbers', subject: 'fijian', class: 3, title: 'Numbers in Fijian 🔢', emoji: '🔢',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('fij-c3-n1','What does "dua" mean?',['2','1','3','4'],1,'1️⃣'),
      mc('fij-c3-n2','What does "rua" mean?',['1','3','2','4'],2,'2️⃣'),
      mc('fij-c3-n3','What does "tolu" mean?',['4','3','2','5'],1,'3️⃣'),
      mc('fij-c3-n4','What does "vā" mean?',['3','5','4','6'],2,'4️⃣'),
      mc('fij-c3-n5','What does "lima" mean?',['5','4','6','3'],0,'5️⃣'),
      mc('fij-c3-n6','How do you say 6 in Fijian?',['lima','vitu','ono','walu'],2,'6️⃣'),
      mc('fij-c3-n7','How do you say 7 in Fijian?',['ono','walu','vitu','ciwa'],2,'7️⃣'),
      mc('fij-c3-n8','How do you say 10 in Fijian?',['ciwa','tini','dua','rua'],1,'🔟'),
    ],
  },
  // ── FIJIAN — Class 4 ────────────────────────────────────────────────────
  {
    id: 'fijian-c4-family', subject: 'fijian', class: 4, title: 'Family Words 👨‍👩‍👧', emoji: '👨‍👩‍👧',
    color: 'bg-pink-100', levelColor: 'bg-pink-200 text-pink-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('fij-c4-fam1','What does "tamā" mean?',['Mother','Brother','Father','Sister'],2,'👨'),
      mc('fij-c4-fam2','What does "tinā" mean?',['Father','Mother','Sister','Uncle'],1,'👩'),
      mc('fij-c4-fam3','What does "tuaka" mean?',['Younger sibling','Father','Mother','Older sibling'],3,'👫'),
      mc('fij-c4-fam4','What does "tahina" mean?',['Older brother','Younger sibling','Mother','Father'],1,'👶'),
      mc('fij-c4-fam5','How do you say "grandfather" in Fijian?',['Bubu','Tukā','Tamā','Vū'],1,'👴'),
      mc('fij-c4-fam6','What does "bubu" mean?',['Father','Grandmother','Sister','Uncle'],1,'👵'),
      mc('fij-c4-fam7','How do you say "child" in Fijian?',['Gone','Tamā','Veiwekani','Kawa'],0,'👦'),
      mc('fij-c4-fam8','What is the Fijian word for "family"?',['Mataqali','Veiwekani','Tokatoka','Magiti'],1,'👨‍👩‍👧'),
    ],
  },
  {
    id: 'fijian-c4-culture', subject: 'fijian', class: 4, title: 'Fijian Culture 🌴', emoji: '🌴',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('fij-c4-cu1','What is "yaqona"?',['A type of food','A traditional drink made from pepper root','A type of cloth','A dance'],1,'🥣'),
      mc('fij-c4-cu2','What is a "meke"?',['A traditional song and dance performance','A type of food','A canoe','A house'],0,'💃'),
      mc('fij-c4-cu3','What is a "bure"?',['A type of food','A traditional Fijian house','A ceremony','A boat'],1,'🏠'),
      mc('fij-c4-cu4','What is a "sulu"?',['A type of food','A dance','A traditional wraparound cloth','A boat'],2,'👘'),
      mc('fij-c4-cu5','What is a "lovo"?',['A greeting','An underground earth oven','A type of boat','A ceremony'],1,'🔥'),
      mc('fij-c4-cu6','What does "tabua" refer to?',['A type of fish','A whale tooth used in ceremonies','A traditional song','A type of cloth'],1,'🦷'),
      mc('fij-c4-cu7','The traditional Fijian clan group is called…',['Tokatoka','Mataqali','Yavusa','Tikina'],1,'👥'),
      mc('fij-c4-cu8','What is "magiti"?',['A ceremony','Traditional feast or food','A house','A boat'],1,'🍽️'),
    ],
  },
  // ── FIJIAN — Class 5 ────────────────────────────────────────────────────
  {
    id: 'fijian-c5-sentences', subject: 'fijian', class: 5, title: 'Fijian Sentences 📖', emoji: '📖',
    color: 'bg-violet-100', levelColor: 'bg-violet-200 text-violet-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('fij-c5-s1','What does "Au domoni iko" mean?',['I am hungry','I love you','I am happy','Good morning'],1,'❤️'),
      mc('fij-c5-s2','What does "E dua na ka vinaka" mean?',['It is a bad thing','Something good','It is a big thing','It is small'],1,'👍'),
      mc('fij-c5-s3','What does "Ko cei na yacamu?" mean?',['Where are you going?','What is your name?','How old are you?','Are you OK?'],1,'🙋'),
      mc('fij-c5-s4','What does "Au via kana" mean?',['I am sleepy','I want to eat','I am tired','I am happy'],1,'🍽️'),
      mc('fij-c5-s5','What does "E rawa ni ko lako mai?" mean?',['Can you come?','Are you going?','Where are you?','Who are you?'],0,'👋'),
      mc('fij-c5-s6','What does "Vinaka vakalevu" mean?',['Hello','Good morning','Thank you very much','Goodbye'],2,'🙏'),
      mc('fij-c5-s7','What does "Au sa lako" mean?',['I am here','I am going','I am eating','I am sleeping'],1,'🚶'),
      mc('fij-c5-s8','What does "E cava na yacadra?" mean?',['What is their name?','Where is he/she?','How old are they?','Are they OK?'],0,'❓'),
      mc('fij-c5-s9','What does "Io, au kila" mean?',['No, I do not know','Yes, I know','Maybe I know','I forget'],1,'💡'),
      mc('fij-c5-s10','What does "Au sa qai lako tale" mean?',['I just arrived','I will come again','I just ate','I am leaving now'],1,'👋'),
    ],
  },
];

export const UPLOADED_ACTIVITIES_KEY = 'kkz_uploaded_activities';

export function getUploadedActivities(): SubjectActivity[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(UPLOADED_ACTIVITIES_KEY);
    return raw ? (JSON.parse(raw) as SubjectActivity[]) : [];
  } catch { return []; }
}

export function saveUploadedActivity(activity: SubjectActivity): void {
  if (typeof window === 'undefined') return;
  const existing = getUploadedActivities().filter((a) => a.id !== activity.id);
  localStorage.setItem(UPLOADED_ACTIVITIES_KEY, JSON.stringify([activity, ...existing]));
}

export function deleteUploadedActivity(id: string): void {
  if (typeof window === 'undefined') return;
  const filtered = getUploadedActivities().filter((a) => a.id !== id);
  localStorage.setItem(UPLOADED_ACTIVITIES_KEY, JSON.stringify(filtered));
}

export function getAllActivities(subject: SubjectKey, childClass: 3 | 4 | 5): SubjectActivity[] {
  const builtin = BUILTIN_ACTIVITIES.filter((a) => a.subject === subject && a.class === childClass);
  const uploaded = getUploadedActivities().filter((a) => a.subject === subject && a.class === childClass);
  return [...builtin, ...uploaded];
}
