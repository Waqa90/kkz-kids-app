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
  // ── SCIENCE — Class 3 ────────────────────────────────────────────────────
  {
    id: 'sci-c3-living', subject: 'science', class: 3, title: 'Living & Non-Living 🌱', emoji: '🌱',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('sci-c3-l1','Which of these is a living thing?',['Rock','Tree','Chair','Cloud'],1,'🌳','Living things grow and breathe'),
      mc('sci-c3-l2','Which of these is a non-living thing?',['Dog','Flower','Car','Fish'],2,'🚗','Non-living things do not grow'),
      mc('sci-c3-l3','What do all living things need?',['Television','Food, water and air','Shoes','Money'],1,'💧'),
      mc('sci-c3-l4','Which living thing makes its own food?',['Dog','Cat','Plant','Fish'],2,'🌿','Plants use sunlight to make food'),
      mc('sci-c3-l5','A butterfly starts as a…',['Frog','Caterpillar','Bird','Worm'],1,'🐛','It changes shape — that is called metamorphosis'),
      mc('sci-c3-l6','Which sense do we use to smell flowers?',['Sight','Touch','Hearing','Smell'],3,'👃'),
      mc('sci-c3-l7','What do animals need to survive?',['Nothing','Food, water, shelter and air','Only water','Only food'],1,'🏡'),
      mc('sci-c3-l8','Which of these can grow?',['Toy car','Puppy','Stone','Plastic bottle'],1,'🐶'),
    ],
  },
  {
    id: 'sci-c3-weather', subject: 'science', class: 3, title: 'Weather & Seasons ☀️', emoji: '☀️',
    color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('sci-c3-w1','What do we call the daily conditions of the air outside?',['Climate','Weather','Season','Temperature'],1,'🌤️'),
      mc('sci-c3-w2','What instrument measures how hot or cold it is?',['Ruler','Clock','Thermometer','Scale'],2,'🌡️'),
      mc('sci-c3-w3','What causes rain?',['Clouds full of water droplets','The sun melting ice','Wind blowing dust','People watering plants'],0,'🌧️'),
      mc('sci-c3-w4','What do we use to measure rainfall?',['Thermometer','Rain gauge','Ruler','Clock'],1,'🌧️'),
      mc('sci-c3-w5','In Fiji, which season is the wet and hot season?',['Winter','Dry season','Wet season','Spring'],2,'🌴'),
      mc('sci-c3-w6','What is the name of a very strong spinning windstorm?',['Tsunami','Cyclone','Earthquake','Flood'],1,'🌀','Fiji sometimes gets cyclones'),
      mc('sci-c3-w7','Where does rain water come from?',['Underground only','The ocean evaporates and forms clouds','Trees','Factories'],1,'☁️'),
      mc('sci-c3-w8','What colours are in a rainbow?',['Only red and blue','Red, orange, yellow, green, blue, indigo, violet','Black and white','Only three colours'],1,'🌈'),
    ],
  },
  {
    id: 'sci-c3-body', subject: 'science', class: 3, title: 'Our Body 💪', emoji: '💪',
    color: 'bg-pink-100', levelColor: 'bg-pink-200 text-pink-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('sci-c3-b1','How many senses does the human body have?',['3','10','5','2'],2,'👁️','Sight, hearing, smell, taste, touch'),
      mc('sci-c3-b2','Which organ pumps blood around the body?',['Lung','Brain','Heart','Stomach'],2,'❤️'),
      mc('sci-c3-b3','What do our lungs do?',['Digest food','Pump blood','Help us breathe','Move our legs'],2,'🫁'),
      mc('sci-c3-b4','What does the brain do?',['Pumps blood','Controls the body and helps us think','Breaks down food','Helps us breathe'],1,'🧠'),
      mc('sci-c3-b5','Which part of the body do we use to see?',['Ears','Nose','Eyes','Hands'],2,'👁️'),
      mc('sci-c3-b6','How many bones does an adult human body have?',['About 50','About 100','About 206','About 500'],2,'🦴'),
      mc('sci-c3-b7','What gives our body its shape and support?',['Skin','Bones','Blood','Muscles'],1,'🦴'),
      mc('sci-c3-b8','What should you do to keep your bones strong?',['Eat lots of sweets','Drink milk and eat vegetables','Stay in bed all day','Eat only meat'],1,'🥛','Calcium in milk builds strong bones'),
    ],
  },
  {
    id: 'sci-c3-plants2', subject: 'science', class: 3, title: 'Plants Around Us 🌺', emoji: '🌺',
    color: 'bg-lime-100', levelColor: 'bg-lime-200 text-lime-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('sci-c3-p1','Which part of the plant is usually underground?',['Leaf','Flower','Root','Stem'],2,'🌿'),
      mc('sci-c3-p2','What do plants need to grow?',['Sunshine, water and soil','Only water','Only sunlight','Only soil'],0,'☀️'),
      mc('sci-c3-p3','Which part of the plant makes seeds?',['Root','Stem','Leaf','Flower'],3,'🌸'),
      mc('sci-c3-p4','What is the job of a leaf?',['Hold the plant up','Make food using sunlight','Take in water','Make seeds'],1,'🍃'),
      mc('sci-c3-p5','Which plant is a common food crop in Fiji?',['Wheat','Rice','Dalo (taro)','Corn'],2,'🌾','Dalo is very important in Fiji'),
      mc('sci-c3-p6','Coconut trees are useful because they provide…',['Only shade','Coconut, timber and leaves for weaving','Only wood','Only fruit'],1,'🥥'),
      mc('sci-c3-p7','What does a seed need to start growing?',['Light only','Water, warmth and sometimes soil','Salt water','Darkness only'],1,'🌱'),
      mc('sci-c3-p8','Which type of plant has no leaves?',['Fern','Cactus','Rose','Coconut'],1,'🌵','Cacti have spines instead of leaves'),
    ],
  },
  {
    id: 'sci-c3-animals2', subject: 'science', class: 3, title: 'Animals in Fiji 🐠', emoji: '🐠',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('sci-c3-a1','Which animal lives in the sea and breathes through gills?',['Bird','Fish','Dog','Frog'],1,'🐟'),
      mc('sci-c3-a2','Which of these is found on coral reefs in Fiji?',['Polar bear','Seahorse','Penguin','Camel'],1,'🌊'),
      mc('sci-c3-a3','What do we call animals that eat only plants?',['Carnivores','Omnivores','Herbivores','Scavengers'],2,'🐄'),
      mc('sci-c3-a4','Which bird is the national bird of Fiji?',['Eagle','Parrot','Collared Lory','Dove'],2,'🦜','The Collared Lory is Fiji\'s national bird'),
      mc('sci-c3-a5','Baby frogs are called…',['Kittens','Tadpoles','Calves','Chicks'],1,'🐸'),
      mc('sci-c3-a6','Which animal produces milk for its babies?',['Fish','Bird','Mammal','Reptile'],2,'🐄'),
      mc('sci-c3-a7','Where do sea turtles lay their eggs?',['In the sea','On sandy beaches','In trees','In rivers'],1,'🐢','Sea turtles come ashore to lay eggs'),
      mc('sci-c3-a8','Which animal makes a web to catch food?',['Bee','Spider','Ant','Butterfly'],1,'🕷️'),
    ],
  },

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
  // ── SCIENCE — Class 4 (extra activities) ────────────────────────────────
  {
    id: 'sci-c4-matter', subject: 'science', class: 4, title: 'States of Matter 🧊', emoji: '🧊',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('sci-c4-m1','What are the three states of matter?',['Big, medium, small','Solid, liquid, gas','Hot, warm, cold','Hard, soft, fluffy'],1,'🧪'),
      mc('sci-c4-m2','Which state of matter has a fixed shape?',['Gas','Liquid','Solid','Steam'],2,'🪨'),
      mc('sci-c4-m3','What happens to ice when it is heated?',['It gets harder','It melts into water','It turns into gas immediately','Nothing happens'],1,'🧊→💧'),
      mc('sci-c4-m4','What is water turning into steam called?',['Freezing','Condensation','Evaporation','Melting'],2,'♨️'),
      mc('sci-c4-m5','What state of matter is air?',['Solid','Liquid','Gas','Plasma'],2,'💨'),
      mc('sci-c4-m6','Which of these is a liquid?',['Ice','Wood','Juice','Sand'],2,'🥤'),
      mc('sci-c4-m7','When water vapour cools and becomes liquid it is called…',['Evaporation','Condensation','Freezing','Boiling'],1,'💧'),
      mc('sci-c4-m8','What is the process of liquid turning into solid called?',['Melting','Evaporation','Freezing','Boiling'],2,'❄️'),
    ],
  },
  {
    id: 'sci-c4-electricity', subject: 'science', class: 4, title: 'Light & Sound 🔦', emoji: '🔦',
    color: 'bg-amber-100', levelColor: 'bg-amber-200 text-amber-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('sci-c4-e1','What is the main source of light for Earth?',['Moon','Stars','Sun','Fire'],2,'☀️'),
      mc('sci-c4-e2','Sound is produced when objects…',['Stay still','Vibrate','Get warm','Change colour'],1,'🔊'),
      mc('sci-c4-e3','Which travels faster — light or sound?',['Sound','Both are equal','Light','Neither travels'],2,'⚡'),
      mc('sci-c4-e4','What material does light pass through easily?',['Wood','Brick','Glass','Metal'],2,'🪟','Transparent materials let light through'),
      mc('sci-c4-e5','What do we call a material that blocks all light?',['Transparent','Translucent','Opaque','Reflective'],2,'🚪'),
      mc('sci-c4-e6','How does sound travel?',['Through vibrations in matter','Through light beams','Through radio waves only','Through nothing'],0,'🔉'),
      mc('sci-c4-e7','What do we call the shadow formed behind an opaque object?',['Reflection','Shadow','Echo','Prism'],1,'🌑'),
      mc('sci-c4-e8','Which of these is a source of artificial light?',['Sun','Moon','Light bulb','Stars'],2,'💡'),
    ],
  },
  {
    id: 'sci-c4-earth', subject: 'science', class: 4, title: 'Earth & Sky 🌍', emoji: '🌍',
    color: 'bg-teal-100', levelColor: 'bg-teal-200 text-teal-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('sci-c4-ea1','What shape is the Earth?',['Flat','Square','Sphere (round)','Triangle'],2,'🌐'),
      mc('sci-c4-ea2','How long does Earth take to orbit the Sun?',['1 month','365 days (1 year)','24 hours','7 days'],1,'🔄'),
      mc('sci-c4-ea3','What causes day and night?',['The moon moving','The Earth rotating on its axis','The sun moving','Clouds covering the sun'],1,'🌑🌕'),
      mc('sci-c4-ea4','Which layer of Earth do we live on?',['Core','Mantle','Crust','Magma'],2,'🌍'),
      mc('sci-c4-ea5','What are the large landmasses on Earth called?',['Countries','Continents','Islands','Oceans'],1,'🗺️'),
      mc('sci-c4-ea6','What covers most of the Earth\'s surface?',['Land','Ice','Water (oceans)','Forests'],2,'🌊'),
      mc('sci-c4-ea7','What do we call a rock from space that hits Earth?',['Comet','Asteroid','Meteorite','Planet'],2,'☄️'),
      mc('sci-c4-ea8','How many planets are in our Solar System?',['7','9','8','10'],2,'🪐'),
    ],
  },
  {
    id: 'sci-c4-materials', subject: 'science', class: 4, title: 'Materials & Uses 🔩', emoji: '🔩',
    color: 'bg-gray-100', levelColor: 'bg-gray-200 text-gray-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('sci-c4-mat1','Why is metal used to make pots?',['It is soft','It conducts heat well','It is light','It is cheap'],1,'🍳'),
      mc('sci-c4-mat2','Why is wood used to make furniture?',['It is strong and easy to shape','It is metal','It conducts electricity','It melts easily'],0,'🪵'),
      mc('sci-c4-mat3','Which material is waterproof?',['Paper','Cotton','Plastic','Wood'],2,'🌊'),
      mc('sci-c4-mat4','Glass is made from…',['Metal','Sand','Wood','Plastic'],1,'🪟'),
      mc('sci-c4-mat5','Which material is a good conductor of electricity?',['Wood','Rubber','Metal','Plastic'],2,'⚡'),
      mc('sci-c4-mat6','What is rubber used for in everyday life?',['Making windows','Making tyres and erasers','Building walls','Making metal tools'],1,'🚗'),
      mc('sci-c4-mat7','Why do we use wool for warm clothing?',['It is waterproof','It traps warm air','It is very light','It is made of metal'],1,'🧥'),
      mc('sci-c4-mat8','What are bricks mainly made from?',['Clay and sand baked in heat','Metal and plastic','Wood and glass','Rubber and cotton'],0,'🧱'),
    ],
  },
  {
    id: 'sci-c4-water', subject: 'science', class: 4, title: 'Water Cycle 💧', emoji: '💧',
    color: 'bg-cyan-100', levelColor: 'bg-cyan-200 text-cyan-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('sci-c4-wc1','What is the water cycle?',['The way water moves from a tap','The continuous movement of water on, above and below Earth','How water is cleaned','How fish swim'],1,'🌊'),
      mc('sci-c4-wc2','What causes water to evaporate?',['Cold air','The Sun\'s heat','Wind only','Rain'],1,'☀️'),
      mc('sci-c4-wc3','What is it called when water vapour rises and cools to form clouds?',['Evaporation','Precipitation','Condensation','Runoff'],2,'☁️'),
      mc('sci-c4-wc4','What is precipitation?',['When water evaporates','When clouds form','When water falls from clouds as rain, sleet or snow','When rivers flow'],2,'🌧️'),
      mc('sci-c4-wc5','Where does most of Earth\'s water evaporate from?',['Rivers','Lakes','Oceans','Ice caps'],2,'🌊'),
      mc('sci-c4-wc6','What keeps the water cycle going?',['Wind','The sun\'s energy','Gravity only','Rain only'],1,'☀️'),
      mc('sci-c4-wc7','When rain water soaks into the ground it is called…',['Runoff','Precipitation','Infiltration','Condensation'],2,'🌱'),
      mc('sci-c4-wc8','Why is the water cycle important?',['It is not important','It provides fresh water for all living things','It only helps fish','It makes clouds pretty'],1,'💧'),
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
  // ── SCIENCE — Class 5 (extra activities) ────────────────────────────────
  {
    id: 'sci-c5-cells', subject: 'science', class: 5, title: 'Cells & Living Things 🔬', emoji: '🔬',
    color: 'bg-violet-100', levelColor: 'bg-violet-200 text-violet-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('sci-c5-c1','What is the basic unit of all living things?',['Atom','Cell','Molecule','Organ'],1,'🔬'),
      mc('sci-c5-c2','What controls all activities of a cell?',['Cell wall','Nucleus','Cytoplasm','Membrane'],1,'🧬'),
      mc('sci-c5-c3','Which cells carry oxygen around our body?',['White blood cells','Nerve cells','Red blood cells','Muscle cells'],2,'🩸'),
      mc('sci-c5-c4','What do we use to see cells?',['Telescope','Magnifying glass only','Microscope','Binoculars'],2,'🔭'),
      mc('sci-c5-c5','Plant cells have a cell wall but animal cells do not.  True or false?',['False','True','Only sometimes','Depends on the plant'],1,'🌿'),
      mc('sci-c5-c6','What is the green pigment in plant cells called?',['Haemoglobin','Chlorophyll','Melanin','Collagen'],1,'🍃'),
      mc('sci-c5-c7','Which part of the plant cell captures sunlight?',['Nucleus','Mitochondria','Chloroplast','Cell wall'],2,'☀️'),
      mc('sci-c5-c8','What is the study of living things called?',['Chemistry','Physics','Biology','Geology'],2,'🧬'),
    ],
  },
  {
    id: 'sci-c5-ecosystems', subject: 'science', class: 5, title: 'Ecosystems & Food Webs 🌿', emoji: '🌿',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('sci-c5-e1','What is an ecosystem?',['A single animal','A community of living things and their environment','A type of food','A river only'],1,'🌍'),
      mc('sci-c5-e2','What are producers in a food web?',['Animals that eat other animals','Plants that make their own food','Animals that eat plants only','Decomposers'],1,'🌿'),
      mc('sci-c5-e3','What are decomposers?',['Animals at the top of the food chain','Organisms that break down dead matter','Plants','Large predators'],1,'🍄'),
      mc('sci-c5-e4','What do we call animals that are hunted and eaten?',['Predators','Decomposers','Prey','Producers'],2,'🐇'),
      mc('sci-c5-e5','What is a coral reef?',['A type of rock','An underwater ecosystem home to many sea creatures','A deep sea trench','A type of seaweed'],1,'🪸','Fiji has beautiful coral reefs'),
      mc('sci-c5-e6','Deforestation means…',['Planting trees','Clearing large areas of forest','Watering plants','Studying forests'],1,'🪓'),
      mc('sci-c5-e7','What happens when a species becomes extinct?',['It grows in numbers','It no longer exists anywhere on Earth','It moves to another country','It becomes stronger'],1,'💀'),
      mc('sci-c5-e8','Which human activity causes the most ocean pollution?',['Fishing','Plastic waste and oil spills','Swimming','Sailing'],1,'🌊'),
    ],
  },
  {
    id: 'sci-c5-health', subject: 'science', class: 5, title: 'Human Health & Disease 🏥', emoji: '🏥',
    color: 'bg-red-100', levelColor: 'bg-red-200 text-red-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('sci-c5-h1','What are microorganisms that cause disease called?',['Vitamins','Pathogens','Nutrients','Enzymes'],1,'🦠'),
      mc('sci-c5-h2','Which body system fights disease?',['Digestive system','Immune system','Skeletal system','Muscular system'],1,'🛡️'),
      mc('sci-c5-h3','What is a vaccine?',['A type of food','A medicine that prevents disease','A vitamin supplement','A type of exercise'],1,'💉'),
      mc('sci-c5-h4','Malaria is spread by which insect?',['Fly','Bee','Mosquito','Ant'],2,'🦟'),
      mc('sci-c5-h5','Which nutrient helps build and repair the body?',['Carbohydrates','Fat','Protein','Sugar'],2,'💪'),
      mc('sci-c5-h6','What is the recommended amount of sleep for children?',['4 hours','6 hours','9–11 hours','14 hours'],2,'😴'),
      mc('sci-c5-h7','What does a balanced diet include?',['Only protein','Only fruit','All food groups in the right amounts','Only carbohydrates'],2,'🍽️'),
      mc('sci-c5-h8','Regular exercise is important for our health because…',['It is only for adults','It keeps muscles and heart strong and improves mood','It makes us very tired','It is a hobby only'],1,'🏃'),
    ],
  },
  {
    id: 'sci-c5-environment2', subject: 'science', class: 5, title: 'Environment & Climate 🌏', emoji: '🌏',
    color: 'bg-teal-100', levelColor: 'bg-teal-200 text-teal-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('sci-c5-env1','What is climate change?',['Daily weather changes','Long-term shift in global temperatures and weather patterns','A type of storm','A season change'],1,'🌡️'),
      mc('sci-c5-env2','Which gas is the main cause of the greenhouse effect?',['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'],2,'🌿'),
      mc('sci-c5-env3','What is the greenhouse effect?',['Growing plants in a greenhouse','Trapping of heat in the atmosphere by gases','A type of farming','Cooling of the Earth'],1,'🏭'),
      mc('sci-c5-env4','Which human activity contributes most to carbon dioxide emissions?',['Farming','Burning fossil fuels','Swimming','Walking'],1,'🚗'),
      mc('sci-c5-env5','What is renewable energy?',['Energy from coal','Energy from petrol','Energy from sources that do not run out, like sun and wind','Energy from nuclear power'],2,'☀️'),
      mc('sci-c5-env6','Rising sea levels are a concern for Fiji because…',['They make the water cleaner','Low-lying islands could be flooded','They bring more fish','They stop cyclones'],1,'🌊'),
      mc('sci-c5-env7','What does "reduce, reuse, recycle" help us to do?',['Use more resources','Produce more waste','Reduce waste and protect the environment','Earn more money'],2,'♻️'),
      mc('sci-c5-env8','Solar panels convert what into electricity?',['Wind','Rain','Sunlight','Heat from the ground'],2,'☀️'),
    ],
  },
  {
    id: 'sci-c5-chemistry', subject: 'science', class: 5, title: 'Simple Chemistry 🧪', emoji: '🧪',
    color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('sci-c5-ch1','What is a mixture?',['A pure substance','Two or more substances mixed without a chemical reaction','A new substance formed by a reaction','A type of atom'],1,'🥗'),
      mc('sci-c5-ch2','What is water made of?',['Only oxygen','Hydrogen and oxygen','Only hydrogen','Nitrogen and oxygen'],1,'💧','H₂O = 2 hydrogen + 1 oxygen'),
      mc('sci-c5-ch3','Which of these is a physical change?',['Burning paper','Rusting iron','Cutting cloth','Cooking an egg'],2,'✂️','Physical changes can often be reversed'),
      mc('sci-c5-ch4','When iron reacts with water and oxygen it produces…',['Salt','Rust','Glass','Steam'],1,'🔴'),
      mc('sci-c5-ch5','What is the pH scale used to measure?',['Temperature','Mass','Acidity or alkalinity of a substance','Speed'],2,'🔬'),
      mc('sci-c5-ch6','Vinegar has a pH less than 7. This means it is…',['Neutral','Alkaline','Acidic','Basic'],2,'🍋'),
      mc('sci-c5-ch7','Which of these is a chemical change?',['Tearing paper','Melting ice','Burning wood','Dissolving salt'],2,'🔥','Chemical changes create new substances'),
      mc('sci-c5-ch8','What state of matter does dry ice (frozen carbon dioxide) skip directly to when heated?',['Liquid','Gas','Solid','Plasma'],1,'💨','This is called sublimation'),
    ],
  },

  // ── SOCIAL STUDIES — Class 3 (extra activities) ──────────────────────────
  {
    id: 'ss-c3-family', subject: 'social-studies', class: 3, title: 'Family & School 🏫', emoji: '🏫',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('ss-c3-fa1','Who is the head of a family?',['A child','Parents or guardians','A friend','A stranger'],1,'👨‍👩‍👧'),
      mc('ss-c3-fa2','What is one rule we follow at school?',['Run in the hallways','Listen to the teacher','Talk during lessons','Arrive late'],1,'🏫'),
      mc('ss-c3-fa3','What do we call the person who teaches us at school?',['Doctor','Lawyer','Teacher','Engineer'],2,'👩‍🏫'),
      mc('ss-c3-fa4','How should we treat our classmates?',['Ignore them','Bully them','With kindness and respect','Be rude to them'],2,'🤝'),
      mc('ss-c3-fa5','What is the head of a school called?',['Mayor','Principal','Doctor','President'],1,'🏫'),
      mc('ss-c3-fa6','What do we say when someone helps us?',['Nothing','Thank you','Go away','So what'],1,'🙏'),
      mc('ss-c3-fa7','Which rule helps keep us safe crossing the road?',['Run across quickly','Look left, right, left before crossing','Close your eyes','Cross anywhere'],1,'🚦'),
      mc('ss-c3-fa8','What should you do if you feel unsafe at school?',['Keep quiet','Tell a trusted adult like a teacher','Ignore it','Run away'],1,'🛡️'),
    ],
  },
  {
    id: 'ss-c3-fiji', subject: 'social-studies', class: 3, title: 'Our Fiji 🇫🇯', emoji: '🇫🇯',
    color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('ss-c3-fj1','What is the name of our country?',['Australia','Samoa','Fiji','Tonga'],2,'🇫🇯'),
      mc('ss-c3-fj2','What is the capital city of Fiji?',['Lautoka','Suva','Nadi','Sigatoka'],1,'🏙️'),
      mc('ss-c3-fj3','Which ocean does Fiji lie in?',['Atlantic Ocean','Indian Ocean','Pacific Ocean','Arctic Ocean'],2,'🌊'),
      mc('ss-c3-fj4','What do Fijians say to greet each other?',['Aloha','Hello only','Bula','Kia Ora'],2,'👋'),
      mc('ss-c3-fj5','What colours are on the Fiji flag?',['Red and yellow','Light blue and white with the Union Jack and shield','All green','Black and gold'],1,'🚩'),
      mc('ss-c3-fj6','What is the largest island in Fiji?',['Taveuni','Vanua Levu','Viti Levu','Kadavu'],2,'🏝️'),
      mc('ss-c3-fj7','What do we call the traditional Fijian chiefs?',['Mayors','Turaga','Kings','Generals'],1,'👑'),
      mc('ss-c3-fj8','Which animal is featured on the Fiji coat of arms?',['Eagle','Lion','Dove','Parrot'],1,'🦁','British lions appear on the Fiji coat of arms'),
    ],
  },
  {
    id: 'ss-c3-transport', subject: 'social-studies', class: 3, title: 'Transport & Travel 🚌', emoji: '🚌',
    color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('ss-c3-t1','Which transport do we use on roads?',['Boat','Car and bus','Aeroplane','Submarine'],1,'🚗'),
      mc('ss-c3-t2','Which transport do we use on water?',['Car','Train','Boat or ferry','Bicycle'],2,'⛵'),
      mc('ss-c3-t3','Which transport flies through the air?',['Boat','Train','Car','Aeroplane'],3,'✈️'),
      mc('ss-c3-t4','What do we call the place where aeroplanes land?',['Port','Train station','Airport','Bus stop'],2,'✈️','Nadi International Airport is in Fiji'),
      mc('ss-c3-t5','What is the name of Fiji\'s main airport?',['Suva Airport','Nadi International Airport','Lautoka Airport','Pacific Airport'],1,'✈️'),
      mc('ss-c3-t6','Which type of transport helps people travel between islands in Fiji?',['Train','Underground train','Ferry or boat','Tram'],2,'⛴️'),
      mc('ss-c3-t7','What colour is a traffic light when you must STOP?',['Green','Yellow','Red','Blue'],2,'🔴'),
      mc('ss-c3-t8','What does a seatbelt do?',['Keeps you warm','Keeps you safe in a vehicle','Looks nice','Makes noise'],1,'🚗'),
    ],
  },

  // ── SOCIAL STUDIES — Class 4 (extra activities) ──────────────────────────
  {
    id: 'ss-c4-history', subject: 'social-studies', class: 4, title: 'Fiji\'s History 📜', emoji: '📜',
    color: 'bg-amber-100', levelColor: 'bg-amber-200 text-amber-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('ss-c4-h1','When did Fiji become independent?',['1875','1970','1987','2000'],1,'🎉','10 October 1970'),
      mc('ss-c4-h2','Who were the first people to settle in Fiji?',['Europeans','Indians','Melanesian and Polynesian people','Chinese'],2,'🏝️'),
      mc('ss-c4-h3','Which European explorer is credited with first charting Fiji?',['Christopher Columbus','James Cook','Abel Tasman','Ferdinand Magellan'],2,'⛵'),
      mc('ss-c4-h4','When did Indian labourers first arrive in Fiji?',['1835','1879','1920','1970'],1,'🚢','They came to work on sugarcane plantations'),
      mc('ss-c4-h5','What was Fiji\'s main cash crop during colonial times?',['Cocoa','Coffee','Sugarcane','Wheat'],2,'🎋'),
      mc('ss-c4-h6','Fiji was a colony of which country?',['France','USA','Britain','Australia'],2,'🇬🇧'),
      mc('ss-c4-h7','What is the name of Fiji\'s legislative building in Suva?',['Parliament House','Government House','The Dome','State House'],0,'🏛️'),
      mc('ss-c4-h8','What is the name given to the original Fijian people?',['Indo-Fijian','iTaukei','Rotuman','Melanesian'],1,'👥'),
    ],
  },
  {
    id: 'ss-c4-geography', subject: 'social-studies', class: 4, title: 'Fiji\'s Geography 🗺️', emoji: '🗺️',
    color: 'bg-teal-100', levelColor: 'bg-teal-200 text-teal-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('ss-c4-g1','How many islands make up Fiji?',['About 10','About 50','More than 300','Exactly 100'],2,'🏝️'),
      mc('ss-c4-g2','What is the second largest island in Fiji?',['Taveuni','Kadavu','Vanua Levu','Rotuma'],2,'🏝️'),
      mc('ss-c4-g3','Which mountain is the highest point in Fiji?',['Mount Tomanivi','Mount Victoria','Mount Fiji','Mount Rewa'],0,'⛰️'),
      mc('ss-c4-g4','What is the main river in Viti Levu?',['Sigatoka River','Rewa River','Ba River','Nadi River'],1,'🌊'),
      mc('ss-c4-g5','What type of climate does Fiji have?',['Arctic','Desert','Tropical','Mediterranean'],2,'🌴'),
      mc('ss-c4-g6','Which division of Fiji is Suva in?',['Western','Northern','Central','Eastern'],2,'🏙️'),
      mc('ss-c4-g7','What is the international dialling code for Fiji?',['61','64','679','675'],2,'📞'),
      mc('ss-c4-g8','On which coast of Viti Levu is Nadi located?',['East coast','South coast','West coast','North coast'],2,'✈️'),
    ],
  },
  {
    id: 'ss-c4-economy', subject: 'social-studies', class: 4, title: 'Work & Economy 💼', emoji: '💼',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('ss-c4-ec1','What is Fiji\'s most important industry?',['Mining','Manufacturing','Tourism','Oil production'],2,'🏨'),
      mc('ss-c4-ec2','What is one of Fiji\'s main agricultural exports?',['Wheat','Sugar','Corn','Coffee'],1,'🎋'),
      mc('ss-c4-ec3','What do we call someone who sets up and runs a business?',['Employee','Entrepreneur','Banker','Farmer'],1,'💼'),
      mc('ss-c4-ec4','What is money paid to workers for their work called?',['Tax','Salary or wage','Donation','Rent'],1,'💰'),
      mc('ss-c4-ec5','What is the currency of Fiji?',['Australian dollar','US dollar','Fijian dollar','Pound'],2,'💵','FJD — Fijian Dollar'),
      mc('ss-c4-ec6','What do we call the act of selling goods to other countries?',['Import','Trading locally','Export','Bartering'],2,'📦'),
      mc('ss-c4-ec7','What is subsistence farming?',['Selling all crops for profit','Growing just enough food for your own family','Large scale commercial farming','Fishing'],1,'🌾'),
      mc('ss-c4-ec8','Which sector employs the most workers in Fiji?',['Mining','Agriculture and Tourism','Manufacturing','Finance'],1,'🏗️'),
    ],
  },

  // ── SOCIAL STUDIES — Class 5 (extra activities) ──────────────────────────
  {
    id: 'ss-c5-pacific', subject: 'social-studies', class: 5, title: 'The Pacific Region 🌏', emoji: '🌏',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('ss-c5-p1','Which is the largest ocean in the world?',['Atlantic','Indian','Pacific','Arctic'],2,'🌊'),
      mc('ss-c5-p2','Which Pacific country is closest to Fiji?',['New Zealand','Australia','Tonga','Samoa'],2,'🏝️'),
      mc('ss-c5-p3','What is the Pacific Islands Forum?',['A sport competition','A regional organisation for Pacific nations','A type of food market','A music festival'],1,'🤝'),
      mc('ss-c5-p4','Which Pacific island country is the largest in terms of land size?',['Fiji','Samoa','Papua New Guinea','Solomon Islands'],2,'🗺️'),
      mc('ss-c5-p5','What is the Melanesia sub-region mainly known for?',['Very cold weather','Culturally diverse Pacific islands including Fiji and Solomon Islands','Desert landscapes','Large mountain ranges only'],1,'🏝️'),
      mc('ss-c5-p6','What natural disaster commonly threatens Pacific island nations?',['Earthquakes only','Cyclones, tsunamis and rising sea levels','Blizzards','Volcanic eruptions only'],1,'🌀'),
      mc('ss-c5-p7','What is the shared culture of Pacific peoples often called?',['Euro-Pacific','Pacific Way','Island Life','Pasifika'],3,'🌺'),
      mc('ss-c5-p8','Climate change is particularly threatening to Pacific nations because…',['It makes fishing better','Many islands are low-lying and at risk of rising seas','It creates more tourism','It has no effect'],1,'🌊'),
    ],
  },
  {
    id: 'ss-c5-government', subject: 'social-studies', class: 5, title: 'Government & Citizenship 🏛️', emoji: '🏛️',
    color: 'bg-purple-100', levelColor: 'bg-purple-200 text-purple-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('ss-c5-g1','What type of government does Fiji have?',['Monarchy','Communist state','Democratic republic','Military dictatorship'],2,'🗳️'),
      mc('ss-c5-g2','What is the supreme law of Fiji?',['The parliament act','The Constitution','The president\'s orders','The village rules'],1,'📜'),
      mc('ss-c5-g3','What are the three arms of Fiji\'s government?',['King, Queen and Prime Minister','Executive, Legislature and Judiciary','Police, Army and Navy','President, Vice President and Secretary'],1,'⚖️'),
      mc('ss-c5-g4','What is the role of the judiciary?',['Make laws','Enforce laws','Interpret and apply laws fairly','Collect taxes'],2,'⚖️'),
      mc('ss-c5-g5','What is a citizen\'s responsibility?',['Ignore national issues','Only obey laws that they like','Vote, pay taxes, obey laws and respect others\' rights','Only vote'],2,'🗳️'),
      mc('ss-c5-g6','What does parliament do?',['Run hospitals','Make the country\'s laws','Manage schools only','Control the police'],1,'🏛️'),
      mc('ss-c5-g7','How are members of parliament chosen in Fiji?',['By the military','By the President alone','Through elections voted for by citizens','By the courts'],2,'🗳️'),
      mc('ss-c5-g8','What is the right to vote called?',['Mandate','Suffrage','Veto','Amnesty'],1,'🗳️'),
    ],
  },
  {
    id: 'ss-c5-globalisation', subject: 'social-studies', class: 5, title: 'Globalisation & Trade 🌐', emoji: '🌐',
    color: 'bg-cyan-100', levelColor: 'bg-cyan-200 text-cyan-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('ss-c5-gl1','What is globalisation?',['Trade within one country only','The growing connection between countries in trade, culture and communication','A type of government','A sport'],1,'🌐'),
      mc('ss-c5-gl2','What is an import?',['Goods sold to other countries','Goods bought from other countries','Money earned from tourists','Local products'],1,'📦'),
      mc('ss-c5-gl3','What is the role of the United Nations (UN)?',['To control one country','To promote international peace, cooperation and human rights','To run a single world government','To manage all world trade'],1,'🕊️'),
      mc('ss-c5-gl4','What does GDP stand for?',['Global Development Programme','Gross Domestic Product','Government Daily Plan','General Data Platform'],1,'💰'),
      mc('ss-c5-gl5','Technology has helped globalisation by…',['Slowing communication','Making travel impossible','Connecting people worldwide through internet and phones','Creating more borders'],2,'📱'),
      mc('ss-c5-gl6','What is a tariff?',['A type of map','A tax placed on imported goods','A sport trophy','A government minister'],1,'📊'),
      mc('ss-c5-gl7','Tourism brings what benefit to Fiji?',['Nothing','Foreign income and employment','More pollution only','Less food'],1,'💵'),
      mc('ss-c5-gl8','What is a multinational company?',['A company in one country','A company that operates in many countries','A government business','A small local business'],1,'🏢'),
    ],
  },

  // ── HEALTHY LIVING — Class 4 (extra activities) ──────────────────────────
  {
    id: 'hl-c4-exercise', subject: 'healthy-living', class: 4, title: 'Exercise & Fitness 🏃', emoji: '🏃',
    color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('hl-c4-ex1','How many minutes of physical activity should children aim for each day?',['10 minutes','30 minutes','At least 60 minutes','5 minutes'],2,'⏱️'),
      mc('hl-c4-ex2','Which type of exercise is best for the heart?',['Sleeping','Aerobic exercise like running and swimming','Sitting and reading','Watching TV'],1,'❤️'),
      mc('hl-c4-ex3','What does exercise do for your muscles?',['Makes them weak','Keeps them strong and healthy','Has no effect','Hurts them'],1,'💪'),
      mc('hl-c4-ex4','What should you do before exercising?',['Eat a huge meal','Jump straight in','Warm up with stretching','Drink a fizzy drink'],2,'🤸'),
      mc('hl-c4-ex5','What is the best drink during exercise?',['Soft drink','Energy drink','Water','Juice'],2,'💧'),
      mc('hl-c4-ex6','Good posture means…',['Slouching in your chair','Standing and sitting with your back straight','Leaning to one side','Looking at the floor'],1,'🧍'),
      mc('hl-c4-ex7','Which of these is a water sport popular in Fiji?',['Skiing','Swimming and surfing','Ice skating','Bobsled'],1,'🏄'),
      mc('hl-c4-ex8','Exercise helps improve your…',['Nothing','Strength, flexibility and mental wellbeing','Only physical appearance','Memory only'],1,'🧠'),
    ],
  },
  {
    id: 'hl-c4-safety', subject: 'healthy-living', class: 4, title: 'Safety & First Aid 🩹', emoji: '🩹',
    color: 'bg-red-100', levelColor: 'bg-red-200 text-red-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('hl-c4-sa1','What is the first thing to do if someone is badly injured?',['Ignore them','Call for an adult or emergency services','Run away','Take a photo'],1,'📞'),
      mc('hl-c4-sa2','What do we put on a small cut to stop bleeding?',['Nothing','Mud','Clean cloth or bandage with pressure','Salt'],2,'🩹'),
      mc('hl-c4-sa3','What should you do if there is a fire?',['Hide in a room','Stay calm, leave the building and call for help','Jump out a window','Look for your toys'],1,'🔥'),
      mc('hl-c4-sa4','What is the emergency number in Fiji?',['000','999','911','911 or 917'],1,'📞','Dial 911 or 917 in Fiji'),
      mc('hl-c4-sa5','If someone is choking, what should you do?',['Give them water','Call for help and try to help them cough it out','Do nothing','Give them food'],1,'🫁'),
      mc('hl-c4-sa6','To prevent sunburn in Fiji\'s hot climate you should…',['Spend all day in the sun with no protection','Wear sunscreen and a hat','Avoid going outside completely','Only go out at noon'],1,'☀️'),
      mc('hl-c4-sa7','What does the red cross symbol mean?',['Danger','Medical help or first aid','Stop','No entry'],1,'🏥'),
      mc('hl-c4-sa8','Why should we never swim alone?',['Swimming alone is fine','It is less fun','It is dangerous — someone should always watch','It is against the rules'],2,'🏊'),
    ],
  },
  {
    id: 'hl-c4-nutrition2', subject: 'healthy-living', class: 4, title: 'Nutrition & Growth 🥗', emoji: '🥗',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('hl-c4-n1','Which vitamin does sunlight help our body produce?',['Vitamin A','Vitamin B','Vitamin C','Vitamin D'],3,'☀️'),
      mc('hl-c4-n2','Why do we need fibre in our diet?',['It gives energy','It helps with digestion and prevents constipation','It builds muscles','It fights germs'],1,'🌾'),
      mc('hl-c4-n3','Which mineral helps build strong bones and teeth?',['Iron','Calcium','Sodium','Potassium'],1,'🥛'),
      mc('hl-c4-n4','What does iron in food help our blood do?',['Digest food','Carry oxygen around the body','Fight infection only','Store energy'],1,'🩸'),
      mc('hl-c4-n5','A meal of fish, dalo, cabbage and water is…',['Unhealthy','Balanced and nutritious','Too small','Too big'],1,'🍽️'),
      mc('hl-c4-n6','What are the negative effects of too much salt?',['It has no effect','It can raise blood pressure','It strengthens the heart','It improves sport performance'],1,'🧂'),
      mc('hl-c4-n7','Vitamin C is found mainly in…',['Meat','Dairy products','Fruits like oranges and mangoes','Bread'],2,'🍊'),
      mc('hl-c4-n8','What do carbohydrates provide for the body?',['Building material','Energy','Vitamins','Minerals'],1,'⚡'),
    ],
  },

  // ── HEALTHY LIVING — Class 5 (extra activities) ──────────────────────────
  {
    id: 'hl-c5-puberty', subject: 'healthy-living', class: 5, title: 'Growth & Changes 🌱', emoji: '🌱',
    color: 'bg-pink-100', levelColor: 'bg-pink-200 text-pink-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('hl-c5-p1','What is puberty?',['A type of disease','The stage of physical and emotional changes as children grow into adults','A school exam','A sport competition'],1,'🌱'),
      mc('hl-c5-p2','Personal hygiene is especially important during puberty because…',['It is not important','Body changes including sweating increase','Adults force you to wash','It is cheaper'],1,'🚿'),
      mc('hl-c5-p3','A healthy emotional response to stress includes…',['Keeping everything inside','Talking to a trusted person and deep breathing','Getting angry at others','Giving up'],1,'💬'),
      mc('hl-c5-p4','What is self-esteem?',['Feeling good about yourself and your abilities','Thinking you are better than everyone','Being very shy','Not caring about anything'],0,'💪'),
      mc('hl-c5-p5','Which is a healthy way to deal with peer pressure?',['Always follow what peers do','Say no confidently and walk away','Be aggressive','Ignore your own values'],1,'🛡️'),
      mc('hl-c5-p6','What is mental health?',['Only physical fitness','Our emotional, psychological and social wellbeing','Getting enough sleep only','A type of physical illness'],1,'🧠'),
      mc('hl-c5-p7','Why is it important to talk to a trusted adult if you feel unsafe?',['It makes things worse','Adults can help keep you safe and find solutions','Only teachers can help','You should deal with it alone'],1,'🗣️'),
      mc('hl-c5-p8','A positive way to express emotions is…',['Hurting others','Bottling emotions up','Creative activities, exercise or talking','Shouting at everyone'],2,'🎨'),
    ],
  },
  {
    id: 'hl-c5-diseases', subject: 'healthy-living', class: 5, title: 'Disease Prevention 🛡️', emoji: '🛡️',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('hl-c5-d1','How do vaccines help us?',['They make you sick','They train the immune system to fight specific diseases','They cure all diseases','They replace food'],1,'💉'),
      mc('hl-c5-d2','Dengue fever is spread by which insect?',['Fly','Bee','Mosquito','Ant'],2,'🦟','Common in Fiji'),
      mc('hl-c5-d3','What is the best way to prevent food poisoning?',['Eat food quickly','Keep raw and cooked food separate and store food correctly','Only eat canned food','Eat food at room temperature always'],1,'🍽️'),
      mc('hl-c5-d4','Which practice helps reduce the spread of respiratory diseases?',['Coughing without covering','Sharing utensils','Washing hands and covering coughs','Crowding in small rooms'],2,'🤧'),
      mc('hl-c5-d5','What is diabetes caused by?',['Eating too much fruit','Problems with regulating blood sugar','Drinking too much water','Too much exercise'],1,'🩺'),
      mc('hl-c5-d6','Regular medical check-ups help because…',['They cost too much','They detect health issues early before they become serious','They are compulsory','Doctors like seeing patients'],1,'🏥'),
      mc('hl-c5-d7','What does the immune system do?',['Digests food','Controls breathing','Defends the body against disease','Pumps blood'],2,'🛡️'),
      mc('hl-c5-d8','Which habit most helps prevent typhoid fever?',['Eating spicy food','Drinking safe water and handwashing','Exercising daily','Sleeping well'],1,'💧'),
    ],
  },
  {
    id: 'hl-c5-environment', subject: 'healthy-living', class: 5, title: 'Environment & Health 🌿', emoji: '🌿',
    color: 'bg-teal-100', levelColor: 'bg-teal-200 text-teal-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('hl-c5-en1','How does air pollution affect health?',['It improves lung function','It can cause breathing problems and lung disease','It has no effect','It helps the heart'],1,'🏭'),
      mc('hl-c5-en2','Contaminated water can cause…',['Better health','Waterborne diseases like cholera and typhoid','Stronger muscles','No illness'],1,'💧'),
      mc('hl-c5-en3','What is one way to reduce plastic pollution?',['Use more plastic bags','Buy single-use plastics daily','Use reusable bags and bottles','Throw plastic in rivers'],2,'♻️'),
      mc('hl-c5-en4','How does deforestation affect health?',['It improves air quality','It reduces air quality and increases carbon dioxide','It has no health impact','It only affects animals'],1,'🌳'),
      mc('hl-c5-en5','Exposure to too much sunlight without protection can cause…',['Good Vitamin D levels only','Sunburn, skin damage and skin cancer','Nothing harmful','Better eyesight'],1,'☀️'),
      mc('hl-c5-en6','What is one benefit of living near green spaces like parks?',['More pollution','Improved mental health and opportunities for exercise','Higher noise levels','None'],1,'🌳'),
      mc('hl-c5-en7','What is the main health concern from burning rubbish?',['It helps clear land','It releases toxic fumes that harm lungs','It improves air quality','It has no effect'],1,'🔥'),
      mc('hl-c5-en8','Why is clean drinking water so important for health?',['It tastes better','Water is needed for all body functions and preventing waterborne disease','It is not very important','Only for washing'],1,'💧'),
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
  // ── MCE extra — Class 3 ──────────────────────────────────────────────────
  {
    id: 'mce-c3-conflict', subject: 'mce', class: 3, title: 'Solving Disagreements ✌️', emoji: '✌️',
    color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('mce-c3-cf1','When two friends disagree, the best thing to do is…',['Fight','Talk it out calmly','Ignore each other','Shout'],1,'✌️'),
      mc('mce-c3-cf2','What is a compromise?',['Giving up completely','Each person gives a little to find a fair solution','Letting one person always win','Ignoring the problem'],1,'🤝'),
      mc('mce-c3-cf3','If someone bullies you, you should…',['Bully them back','Tell a trusted adult','Laugh it off','Run away forever'],1,'🛡️'),
      mc('mce-c3-cf4','What is a peaceful way to solve a problem?',['Hitting','Talking and listening','Crying and running','Ignoring'],1,'🕊️'),
      mc('mce-c3-cf5','When is it OK to say "no"?',['Never','When something makes you feel unsafe or wrong','Always say yes to friends','Only to strangers'],1,'🚫'),
      mc('mce-c3-cf6','Good listening means…',['Talking at the same time','Looking at the phone','Paying attention and not interrupting','Nodding but thinking of something else'],2,'👂'),
      mc('mce-c3-cf7','If you hurt someone by accident, you should…',['Pretend it did not happen','Say sorry and check if they are OK','Run away','Blame them'],1,'😔'),
      mc('mce-c3-cf8','Feelings like anger are…',['Always bad','Normal — it is what we do with them that matters','To be ignored','Only for weak people'],1,'😤'),
    ],
  },
  {
    id: 'mce-c3-citizenship', subject: 'mce', class: 3, title: 'Good Citizens 🏅', emoji: '🏅',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'true-false', source: 'builtin', difficulty: 'Easy',
    questions: [
      tf('mce-c3-ct1','A good citizen follows the rules of their community.','True','🏘️'),
      tf('mce-c3-ct2','It is OK to drop rubbish wherever you like.','False','🗑️','A good citizen keeps the environment clean'),
      tf('mce-c3-ct3','We should respect people who are different from us.','True','🌍'),
      tf('mce-c3-ct4','Only adults need to follow community rules.','False','👦','Everyone including children follows rules'),
      tf('mce-c3-ct5','Voting and having a say is an important right.','True','🗳️'),
      tf('mce-c3-ct6','Being a good citizen means thinking only about yourself.','False','🤝','Good citizens think about others too'),
      tf('mce-c3-ct7','We can help our community by doing small kind things.','True','💛'),
      tf('mce-c3-ct8','It does not matter if we respect our neighbours.','False','🏡','Respecting neighbours makes a strong community'),
    ],
  },
  {
    id: 'mce-c3-family', subject: 'mce', class: 3, title: 'Family Roles 👨‍👩‍👧', emoji: '👨‍👩‍👧',
    color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('mce-c3-fa1','What is one way you can help your family at home?',['Make a mess','Do your chores without being asked','Play all day','Demand things'],1,'🏠'),
      mc('mce-c3-fa2','Why is family important?',['Family gives us love, support and a sense of belonging','Family is not important','Only friends matter','Only parents matter'],0,'❤️'),
      mc('mce-c3-fa3','What should you do if a family member is sick?',['Ignore them','Show care and help if you can','Go out and play','Leave them alone'],1,'🤒'),
      mc('mce-c3-fa4','Helping with younger siblings teaches you…',['Nothing useful','Responsibility and care','How to be bossy','How to avoid chores'],1,'👶'),
      mc('mce-c3-fa5','A family rule is…',['Only for parents','Something everyone agrees to follow at home','Not important','Only for naughty children'],1,'📋'),
      mc('mce-c3-fa6','How do we show respect to grandparents?',['Ignore them','Listen to their stories and help them','Talk over them','Only visit for gifts'],1,'👴','Grandparents are treasured in Fijian culture'),
      mc('mce-c3-fa7','A chore is…',['A punishment','A fun game','A household task that helps the family','Something only parents do'],2,'🧹'),
      mc('mce-c3-fa8','Why should we spend time with family?',['We have to by law','It builds love, trust and memories','It is boring','Only on weekends'],1,'🌟'),
    ],
  },
  {
    id: 'mce-c3-caring', subject: 'mce', class: 3, title: 'Caring for Others 💛', emoji: '💛',
    color: 'bg-amber-100', levelColor: 'bg-amber-200 text-amber-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('mce-c3-ca1','Volunteering means…',['Getting paid to work','Giving your time to help others without pay','Only helping family','Doing whatever you want'],1,'🙋'),
      mc('mce-c3-ca2','If a classmate looks sad, a kind thing to do is…',['Tease them','Ask if they are OK','Walk past','Laugh'],1,'😊'),
      mc('mce-c3-ca3','Sharing food with someone who has none shows…',['Weakness','Kindness and generosity','That you have too much','Nothing'],1,'🍱'),
      mc('mce-c3-ca4','What does being inclusive mean?',['Leaving people out','Making sure everyone is included','Only playing with your best friends','Ignoring new students'],1,'🤗'),
      mc('mce-c3-ca5','When you see someone being treated unfairly you should…',['Join in','Do nothing','Speak up or get help','Laugh'],2,'🛡️'),
      mc('mce-c3-ca6','Helping the elderly is an example of…',['Being annoying','Caring for our community','Wasting time','Following orders'],1,'👵'),
      mc('mce-c3-ca7','Kindness is…',['Only shown on special days','Something we practise every day','A weakness','Only for certain people'],1,'💛'),
      mc('mce-c3-ca8','Why is it important to care for animals?',['It is not important','Animals are part of our world and need our protection','Only pets matter','Adults should do it'],1,'🐾'),
    ],
  },
  {
    id: 'mce-c3-earth', subject: 'mce', class: 3, title: 'Caring for Earth 🌍', emoji: '🌍',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'true-false', source: 'builtin', difficulty: 'Easy',
    questions: [
      tf('mce-c3-ev1','We should pick up rubbish even if we did not drop it.','True','🗑️','Good citizens keep places clean'),
      tf('mce-c3-ev2','It is OK to throw rubbish in the ocean.','False','🌊','Rubbish in the ocean harms sea life'),
      tf('mce-c3-ev3','Turning off lights when you leave a room saves electricity.','True','💡'),
      tf('mce-c3-ev4','Planting trees helps the environment.','True','🌳'),
      tf('mce-c3-ev5','Wasting water does not matter because there is always more.','False','💧','Water is precious — we must use it wisely'),
      tf('mce-c3-ev6','Children can help protect the environment too.','True','🌱'),
      tf('mce-c3-ev7','Burning rubbish is good for the air.','False','🔥','It causes air pollution'),
      tf('mce-c3-ev8','Recycling helps reduce waste.','True','♻️'),
    ],
  },
  // ── MCE — Class 4 ────────────────────────────────────────────────────────
  {
    id: 'mce-c4-respect', subject: 'mce', class: 4, title: 'Respect & Dignity 🏆', emoji: '🏆',
    color: 'bg-pink-100', levelColor: 'bg-pink-200 text-pink-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('mce-c4-re1','Dignity means…',['Feeling superior to others','Every person deserves to be treated with worth and respect','Only rich people deserve respect','Being famous'],1,'👑'),
      mc('mce-c4-re2','You disagree with a classmate\'s opinion. You should…',['Mock their idea','Respect that different opinions exist and discuss calmly','Ignore them','Tell others they are silly'],1,'💬'),
      mc('mce-c4-re3','Prejudice means…',['Judging people unfairly based on assumptions','Treating everyone equally','Making good decisions','Listening carefully'],0,'⚖️'),
      mc('mce-c4-re4','How should we treat people from different cultures?',['With suspicion','With the same respect we want for ourselves','Avoid them','Ignore their traditions'],1,'🌏','Fiji is a diverse, multicultural nation'),
      mc('mce-c4-re5','Name-calling is wrong because…',['It is fun','It hurts feelings and damages dignity','It does not matter','Names cannot hurt you'],1,'🚫'),
      mc('mce-c4-re6','Respecting elders in Fijian culture means…',['Doing whatever they say blindly','Listening, speaking politely and helping when needed','Ignoring their opinions','Only speaking when spoken to'],1,'👴'),
      mc('mce-c4-re7','What does it mean to have self-respect?',['Thinking you are better than everyone','Valuing yourself and your own dignity','Being selfish','Not caring about others'],1,'💛'),
      mc('mce-c4-re8','Treating everyone fairly is called…',['Discrimination','Equality','Bullying','Favouritism'],1,'⚖️'),
    ],
  },
  {
    id: 'mce-c4-teamwork', subject: 'mce', class: 4, title: 'Teamwork & Cooperation 🤝', emoji: '🤝',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('mce-c4-tw1','Why is teamwork important?',['It makes tasks harder','It helps achieve goals that are difficult alone','Only leaders should decide','It wastes time'],1,'🏅'),
      mc('mce-c4-tw2','In a team, every person\'s contribution is…',['Unimportant unless they are the leader','Valuable and important','Only valued if they are the best','Ignored'],1,'⭐'),
      mc('mce-c4-tw3','If a teammate makes a mistake, you should…',['Laugh and blame them','Encourage them and help them improve','Remove them from the team','Complain to the teacher'],1,'💪'),
      mc('mce-c4-tw4','What does "collaboration" mean?',['Working alone','Working together toward a shared goal','Competing against each other','Copying someone else\'s work'],1,'🤝'),
      mc('mce-c4-tw5','Being a good team leader means…',['Doing everything yourself','Bossing people around','Listening to others and guiding the group fairly','Taking all the credit'],2,'👑'),
      mc('mce-c4-tw6','During group work, you should…',['Only do your favourite parts','Take over everything','Share tasks fairly and communicate','Let others do all the work'],2,'📋'),
      mc('mce-c4-tw7','When your team wins, you should…',['Boast to the other team','Be a gracious winner and thank your teammates','Not celebrate','Forget about your teammates'],1,'🎉'),
      mc('mce-c4-tw8','When your team loses, you should…',['Blame each other','Accept the result gracefully and learn from it','Give up on teamwork','Refuse to play again'],1,'🤝'),
    ],
  },
  {
    id: 'mce-c4-rights', subject: 'mce', class: 4, title: 'Rights & Responsibilities ⚖️', emoji: '⚖️',
    color: 'bg-purple-100', levelColor: 'bg-purple-200 text-purple-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('mce-c4-rr1','A "right" is something…',['You earn by being good','Every person deserves simply for being human','Only adults have','You buy'],1,'🌟','Human rights are universal'),
      mc('mce-c4-rr2','Which of these is a children\'s right?',['The right to work full-time','The right to education and protection','The right to vote','The right to drive'],1,'📚','Children have the right to education'),
      mc('mce-c4-rr3','With every right comes a…',['Reward','Responsibility','Rule that you can break','Freedom to do anything'],1,'⚖️'),
      mc('mce-c4-rr4','The right to free speech means…',['You can say anything hurtful','You can express ideas respectfully without hurting others','You must say what adults want','Only your opinions matter'],1,'🗣️'),
      mc('mce-c4-rr5','If someone\'s rights are being violated, you should…',['Ignore it','Report it to a trusted adult or authority','Join in','It is none of your business'],1,'🛡️'),
      mc('mce-c4-rr6','The right to privacy means…',['People can look at your personal things','Others should not access your private belongings without permission','You can look at others\' things','Privacy is not important'],1,'🔒'),
      mc('mce-c4-rr7','Every child has the right to…',['Work to earn money for their family','Play and enjoy leisure time','Own a house','Vote in elections'],1,'⚽','The right to play is a children\'s right'),
      mc('mce-c4-rr8','Protecting children from harm is the responsibility of…',['Only parents','All adults and society as a whole','Children themselves','Only teachers'],1,'🛡️'),
    ],
  },
  {
    id: 'mce-c4-decision', subject: 'mce', class: 4, title: 'Making Good Decisions 🧠', emoji: '🧠',
    color: 'bg-rose-100', levelColor: 'bg-rose-200 text-rose-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('mce-c4-de1','Before making a big decision, you should…',['Act immediately without thinking','Think about the consequences for yourself and others','Let someone else decide','Flip a coin'],1,'🤔'),
      mc('mce-c4-de2','Peer pressure means…',['Pressure from a teacher','Friends encouraging you to do something even if it is wrong','Pressure from parents','Pressure to study'],1,'👥'),
      mc('mce-c4-de3','If your friends dare you to steal, you should…',['Do it to fit in','Say no and walk away','Tell everyone','Agree but not follow through'],1,'🚫'),
      mc('mce-c4-de4','A consequence is…',['The beginning of a problem','The result of a decision or action','Always something bad','Only for bad decisions'],1,'⚡'),
      mc('mce-c4-de5','What is an "informed decision"?',['A random choice','A choice made after gathering information and thinking carefully','A choice made quickly','A choice someone else made for you'],1,'💡'),
      mc('mce-c4-de6','You made a bad decision. The best response is to…',['Pretend it did not happen','Blame others','Accept responsibility and learn from it','Repeat the same mistake'],2,'📚'),
      mc('mce-c4-de7','Which is NOT a good way to handle stress?',['Talking to someone','Taking deep breaths','Bullying others','Going for a walk'],2,'😤'),
      mc('mce-c4-de8','Making decisions that are good for others as well as yourself is called…',['Being greedy','Ethical decision-making','Being a leader','Peer pressure'],1,'⚖️'),
    ],
  },
  {
    id: 'mce-c4-community', subject: 'mce', class: 4, title: 'Community Responsibility 🏘️', emoji: '🏘️',
    color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', activityType: 'true-false', source: 'builtin', difficulty: 'Medium',
    questions: [
      tf('mce-c4-co1','Laws protect people and help communities run fairly.','True','⚖️'),
      tf('mce-c4-co2','It is OK to break a law if you think it is unfair.','False','🚫','We work to change unfair laws through proper processes'),
      tf('mce-c4-co3','Paying taxes helps fund schools, hospitals and roads.','True','🏫'),
      tf('mce-c4-co4','Only elected leaders should help their community.','False','🤝','Everyone can contribute'),
      tf('mce-c4-co5','Vandalising public property harms the whole community.','True','🚧'),
      tf('mce-c4-co6','Community service is only for people doing it as punishment.','False','💛','Many people volunteer freely to help others'),
      tf('mce-c4-co7','Every person\'s opinion matters in a democratic community.','True','🗣️'),
      tf('mce-c4-co8','Children cannot make any contribution to their community.','False','🌱','Children can contribute through kind actions and helping others'),
    ],
  },
  // ── MCE — Class 5 ────────────────────────────────────────────────────────
  {
    id: 'mce-c5-leadership', subject: 'mce', class: 5, title: 'Leadership & Service 👑', emoji: '👑',
    color: 'bg-pink-100', levelColor: 'bg-pink-200 text-pink-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('mce-c5-le1','A good leader…',['Gives orders and does not listen','Serves others and leads by example','Only cares about themselves','Takes all the credit'],1,'👑'),
      mc('mce-c5-le2','Servant leadership means…',['Being a servant in a house','Leading by serving and putting others\' needs first','Being weak','Doing everything yourself'],1,'🤝'),
      mc('mce-c5-le3','Which quality is most important in a leader?',['Being the strongest','Integrity — being honest and having strong values','Being the loudest','Being the richest'],1,'✨'),
      mc('mce-c5-le4','A leader shows humility by…',['Never admitting mistakes','Acknowledging errors and accepting feedback','Boasting about achievements','Blaming the team'],1,'🙏'),
      mc('mce-c5-le5','Community service means…',['Working for payment','Volunteering time to improve your community','Only cleaning up parks','Something schools force you to do'],1,'🌟'),
      mc('mce-c5-le6','Leaders inspire others by…',['Threatening consequences','Demonstrating the behaviour they expect from others','Giving rewards only','Doing tasks alone without involving others'],1,'🔥'),
      mc('mce-c5-le7','Which is an example of youth leadership?',['Waiting for adults to solve problems','Organising a school clean-up or charity drive','Playing video games','Studying alone'],1,'🏆'),
      mc('mce-c5-le8','Good leaders accept criticism by…',['Arguing back','Listening, reflecting and improving','Dismissing all criticism','Getting angry'],1,'💡'),
    ],
  },
  {
    id: 'mce-c5-justice', subject: 'mce', class: 5, title: 'Justice & Fairness ⚖️', emoji: '⚖️',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('mce-c5-ju1','Justice means…',['Punishing everyone the same','Each person receives what they are fairly due','Only courts matter','Letting the strong decide'],1,'⚖️'),
      mc('mce-c5-ju2','Discrimination is…',['Treating everyone equally','Treating someone unfairly based on race, gender or religion','Making good decisions','Understanding others'],1,'🚫'),
      mc('mce-c5-ju3','Social justice is concerned with…',['Making profit','Ensuring all people have equal opportunities and rights','Sports competitions','School rules only'],1,'🌍'),
      mc('mce-c5-ju4','What is the role of the law in a just society?',['To control people','To protect rights and ensure fairness for everyone','To benefit those in power','To create fear'],1,'📜'),
      mc('mce-c5-ju5','Restorative justice focuses on…',['Punishing the offender harshly','Repairing harm and restoring relationships','Revenge','Ignoring the victim'],1,'🔄'),
      mc('mce-c5-ju6','Fiji\'s constitution protects…',['Only iTaukei rights','Only government powers','The fundamental rights of all citizens','Only economic rights'],2,'🇫🇯'),
      mc('mce-c5-ju7','Standing up for someone being treated unfairly is called…',['Interference','Being an ally or upstander','Getting into trouble','Minding your own business'],1,'🛡️'),
      mc('mce-c5-ju8','Which is an example of economic injustice?',['Everyone pays for what they buy','Some people cannot afford food due to systemic inequality','Rich people buying more things','Shops charging different prices'],1,'💔'),
    ],
  },
  {
    id: 'mce-c5-tolerance', subject: 'mce', class: 5, title: 'Tolerance & Diversity 🌏', emoji: '🌏',
    color: 'bg-purple-100', levelColor: 'bg-purple-200 text-purple-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('mce-c5-to1','Tolerance means…',['Agreeing with everything','Accepting that others have different views and ways of life even if you disagree','Ignoring differences','Forcing others to change'],1,'🕊️'),
      mc('mce-c5-to2','Fiji is a multicultural society. This means…',['Only one culture exists','Many different cultures, languages and religions coexist','Everyone lives the same way','Only Fijian culture matters'],1,'🌈'),
      mc('mce-c5-to3','Stereotyping is harmful because…',['It is usually true','It judges individuals based on false group assumptions','It helps people understand each other','It has no effect'],1,'⚠️'),
      mc('mce-c5-to4','Religious tolerance means…',['Everyone must follow the same religion','Respecting others\' right to practise their religion','Arguing about which religion is best','Not believing in religion'],1,'🙏'),
      mc('mce-c5-to5','Cultural exchange is…',['Stealing another culture','Learning from and sharing aspects of each other\'s cultures respectfully','Only for tourists','Something governments do'],1,'🌏'),
      mc('mce-c5-to6','How does diversity make a community stronger?',['It causes problems','Different perspectives and skills enrich the community','Only one type of diversity helps','Diversity is unimportant'],1,'💪'),
      mc('mce-c5-to7','Which Fijian phrase captures the spirit of togetherness?',['Moce mada','Sota tale','Veikauwaitaki — looking after each other','Bula vinaka'],2,'🤝','Veikauwaitaki means mutual care'),
      mc('mce-c5-to8','What does "social cohesion" mean?',['People living near each other','A community that is united, trusting and working together','Everyone thinking the same','A government policy'],1,'🏘️'),
    ],
  },
  {
    id: 'mce-c5-democracy', subject: 'mce', class: 5, title: 'Democracy & Governance 🗳️', emoji: '🗳️',
    color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('mce-c5-de1','Democracy means…',['Rule by one powerful leader','A system where citizens choose their leaders and have a say','Decisions made by the military','Rule by the wealthiest'],1,'🗳️'),
      mc('mce-c5-de2','In Fiji, citizens can vote from what age?',['16','21','18','25'],2,'🇫🇯','Fijian citizens can vote at age 18'),
      mc('mce-c5-de3','The Parliament of Fiji is responsible for…',['Running schools','Making and passing laws','Collecting taxes only','Running the army'],1,'🏛️'),
      mc('mce-c5-de4','Freedom of the press means…',['Newspapers are free to buy','The media can report news without government control','Only good news is published','Only government news is shared'],1,'📰'),
      mc('mce-c5-de5','Separation of powers means…',['One person controls everything','Government power is divided among different branches to prevent abuse','Only the president makes decisions','Parliament and courts are the same'],1,'⚖️'),
      mc('mce-c5-de6','A constitution is…',['A type of food','A legal document setting out the fundamental rights and laws of a country','A government minister','A type of vote'],1,'📜'),
      mc('mce-c5-de7','Corruption in government means…',['Leaders working hard for citizens','Officials abusing their power for personal gain','Transparent decision-making','Enforcing laws fairly'],1,'⚠️'),
      mc('mce-c5-de8','Citizens in a democracy have a responsibility to…',['Stay silent about problems','Be informed, vote and hold leaders accountable','Only pay taxes','Do whatever leaders say'],1,'🌟'),
    ],
  },
  {
    id: 'mce-c5-environment', subject: 'mce', class: 5, title: 'Environmental Stewardship 🌿', emoji: '🌿',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('mce-c5-ev1','Environmental stewardship means…',['Using natural resources without limit','Taking responsible care of the environment for future generations','Only planting trees','Leaving all problems for governments'],1,'🌍'),
      mc('mce-c5-ev2','Climate change threatens Pacific islands like Fiji through…',['Increased rainfall only','Rising sea levels and extreme weather events','Better farming conditions','Cooler temperatures'],1,'🌊'),
      mc('mce-c5-ev3','What does "sustainable development" mean?',['Using all resources as fast as possible','Meeting our needs today without harming future generations\'s ability to meet theirs','Only building new things','Stopping all industry'],1,'⚙️'),
      mc('mce-c5-ev4','Which is an example of individual environmental responsibility?',['Expecting only governments to act','Reducing personal plastic use and supporting local green initiatives','Ignoring environmental problems','Believing technology will fix everything'],1,'♻️'),
      mc('mce-c5-ev5','Fiji\'s coral reefs are important because…',['They are only beautiful','They support marine biodiversity, fishing livelihoods and tourism','They are not important','Only scientists care about them'],1,'🐠'),
      mc('mce-c5-ev6','The "3Rs" of sustainability stand for…',['Read, Research, Remember','Reduce, Reuse, Recycle','Rules, Rights, Responsibilities','Run, Rest, Relax'],1,'♻️'),
      mc('mce-c5-ev7','Traditional Fijian conservation practices like "tabu" no-fishing zones are…',['Outdated and not useful','Effective ways of protecting marine resources','Only for ceremonies','Against modern law'],1,'🐟','Traditional tabu zones help fish populations recover'),
      mc('mce-c5-ev8','International agreements like the Paris Agreement aim to…',['Promote more industrial growth','Reduce greenhouse gas emissions to limit global warming','Create global trade rules','Fund island development only'],1,'🌡️'),
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
  // ── FIJIAN extra — Class 3 ───────────────────────────────────────────────
  {
    id: 'fijian-c3-colours', subject: 'fijian', class: 3, title: 'Colours in Fijian 🌈', emoji: '🌈',
    color: 'bg-rose-100', levelColor: 'bg-rose-200 text-rose-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('fij-c3-col1','What colour is "kubu" in Fijian?',['Red','Blue','White','Green'],2,'⬜','Kubu = white'),
      mc('fij-c3-col2','How do you say "blue" in Fijian?',['Damudamu','Karakarawa','Dromodromo','Samasama'],1,'🔵','Karakarawa = blue'),
      mc('fij-c3-col3','What does "damudamu" mean?',['Green','Yellow','Red','Black'],2,'🔴','Damudamu = red'),
      mc('fij-c3-col4','How do you say "yellow" in Fijian?',['Dromodromo','Samasama','Kubu','Karakarawa'],1,'💛','Samasama = yellow'),
      mc('fij-c3-col5','What does "dromodromo" mean?',['Blue','Green','Red','White'],1,'💚','Dromodromo = green'),
      mc('fij-c3-col6','How do you say "black" in Fijian?',['Kubu','Samasama','Loaloa','Damudamu'],2,'⬛','Loaloa = black'),
      mc('fij-c3-col7','What colour is "loa"?',['Orange','Purple','Brown','Pink'],2,'🟫','Loa = brown'),
      mc('fij-c3-col8','How do you say "orange" in Fijian?',['Oreni','Moli','Samasama','Kubu'],0,'🟠','Oreni = orange (borrowed word)'),
    ],
  },
  {
    id: 'fijian-c3-body', subject: 'fijian', class: 3, title: 'Body Parts in Fijian 🫀', emoji: '🫀',
    color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('fij-c3-bo1','What does "mata" mean?',['Ear','Eye','Nose','Mouth'],1,'👁️','Mata = eye'),
      mc('fij-c3-bo2','How do you say "hand" in Fijian?',['Yava','Lima','Ulu','Gusu'],1,'✋','Lima = hand'),
      mc('fij-c3-bo3','What does "ulu" mean?',['Foot','Hand','Head','Ear'],2,'🧢','Ulu = head'),
      mc('fij-c3-bo4','How do you say "foot" in Fijian?',['Gusu','Mata','Yava','Dairo'],2,'🦶','Yava = foot'),
      mc('fij-c3-bo5','What does "gusu" mean?',['Eye','Mouth','Nose','Ear'],1,'👄','Gusu = mouth'),
      mc('fij-c3-bo6','How do you say "ear" in Fijian?',['Dairo','Lima','Ulu','Gusu'],0,'👂','Dairo = ear'),
      mc('fij-c3-bo7','What does "qalo" mean?',['Stomach','Arm','Neck','Leg'],0,'🫃','Qalo = stomach / belly'),
      mc('fij-c3-bo8','How do you say "nose" in Fijian?',['Ulu','Gusu','Qovuto','Mata'],2,'👃','Qovuto = nose'),
    ],
  },
  {
    id: 'fijian-c3-animals', subject: 'fijian', class: 3, title: 'Animals in Fijian 🐾', emoji: '🐾',
    color: 'bg-amber-100', levelColor: 'bg-amber-200 text-amber-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('fij-c3-an1','What does "manumanu" mean?',['Fish','Bird','Animal / creature','Tree'],2,'🐾','Manumanu = animal'),
      mc('fij-c3-an2','How do you say "fish" in Fijian?',['Manumanu','Ika','Toa','Vuaka'],1,'🐟','Ika = fish'),
      mc('fij-c3-an3','What does "toa" mean?',['Pig','Chicken','Dog','Cow'],1,'🐔','Toa = chicken'),
      mc('fij-c3-an4','How do you say "dog" in Fijian?',['Vuaka','Toa','Koli','Ika'],2,'🐕','Koli = dog'),
      mc('fij-c3-an5','What does "vuaka" mean?',['Cow','Pig','Dog','Horse'],1,'🐷','Vuaka = pig'),
      mc('fij-c3-an6','How do you say "cow" in Fijian?',['Toa','Koli','Bulumakau','Ika'],2,'🐄','Bulumakau = cow'),
      mc('fij-c3-an7','What does "ose" mean?',['Sheep','Horse','Goat','Cat'],1,'🐴','Ose = horse'),
      mc('fij-c3-an8','How do you say "bird" in Fijian?',['Manumanu dina','Manumanu livaliva','Ika damu','Koli'],1,'🐦','Manumanu livaliva = bird (flying creature)'),
    ],
  },
  {
    id: 'fijian-c3-food', subject: 'fijian', class: 3, title: 'Food & Drink in Fijian 🍽️', emoji: '🍽️',
    color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('fij-c3-fd1','What does "kana" mean?',['To drink','To eat','To cook','To sleep'],1,'🍽️','Kana = to eat'),
      mc('fij-c3-fd2','How do you say "water" in Fijian?',['Kana','Wai','Magiti','Ika'],1,'💧','Wai = water'),
      mc('fij-c3-fd3','What does "dalo" mean?',['Rice','Taro root vegetable','Fish','Bread'],1,'🌿','Dalo = taro, a staple in Fiji'),
      mc('fij-c3-fd4','How do you say "food" or "meal" in Fijian?',['Kana','Wai','Magiti','Bogi'],2,'🍱','Magiti = food / feast'),
      mc('fij-c3-fd5','What does "uvi" mean?',['Yam','Banana','Coconut','Fish'],0,'🥔','Uvi = yam'),
      mc('fij-c3-fd6','How do you say "coconut" in Fijian?',['Niu','Moli','Uvi','Dalo'],0,'🥥','Niu = coconut'),
      mc('fij-c3-fd7','What does "vudi" mean?',['Mango','Coconut','Banana','Yam'],2,'🍌','Vudi = banana'),
      mc('fij-c3-fd8','How do you say "mango" in Fijian?',['Vudi','Mango','Niu','Uvi'],1,'🥭','Mango = mango (borrowed word)'),
    ],
  },
  {
    id: 'fijian-c3-phrases', subject: 'fijian', class: 3, title: 'Simple Phrases 💬', emoji: '💬',
    color: 'bg-teal-100', levelColor: 'bg-teal-200 text-teal-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('fij-c3-ph1','How do you say "I am happy"?',['Au via kana','Au marau','Au sa rere','Au kua ni'],1,'😊','Au marau = I am happy'),
      mc('fij-c3-ph2','What does "Ko lako i vei?" mean?',['Who are you?','Where are you going?','What do you want?','Are you OK?'],1,'🚶','Ko lako i vei = Where are you going?'),
      mc('fij-c3-ph3','How do you say "I am tired"?',['Au via kana','Au sa oca','Au marau','Au sa rere'],1,'😴','Au sa oca = I am tired'),
      mc('fij-c3-ph4','What does "E vinaka!" mean?',['It is bad!','It is big!','It is good!','It is small!'],2,'👍','E vinaka = It is good!'),
      mc('fij-c3-ph5','How do you say "I am scared"?',['Au sa rere','Au marau','Au via kana','Au sa oca'],0,'😱','Au sa rere = I am scared'),
      mc('fij-c3-ph6','What does "Au sa guilecava" mean?',['I am happy','I forgot','I want to eat','I am going'],1,'😅','Au sa guilecava = I forgot'),
      mc('fij-c3-ph7','How do you ask "Can you help me?" in Fijian?',['O via cakava?','E rawa ni ko veivuke au?','Ko lako i vei?','Ko cei?'],1,'🙏','E rawa ni ko veivuke au = Can you help me?'),
      mc('fij-c3-ph8','What does "Au domoni iko" mean?',['I am hungry','I love you','I am happy','Good morning'],1,'❤️','Au domoni iko = I love you'),
    ],
  },
  // ── FIJIAN extra — Class 4 ───────────────────────────────────────────────
  {
    id: 'fijian-c4-time', subject: 'fijian', class: 4, title: 'Time in Fijian ⏰', emoji: '⏰',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('fij-c4-ti1','What does "nikua" mean?',['Yesterday','Tomorrow','Today','Now'],2,'📅','Nikua = today'),
      mc('fij-c4-ti2','How do you say "yesterday" in Fijian?',['Nikua','Mataka','Nanoa','Sigalevu'],2,'◀️','Nanoa = yesterday'),
      mc('fij-c4-ti3','What does "mataka" mean?',['Evening','Morning / Tomorrow','Night','Afternoon'],1,'🌅','Mataka = morning / tomorrow'),
      mc('fij-c4-ti4','How do you say "week" in Fijian?',['Siga','Macawa','Yabaki','Vakatawa'],1,'📆','Macawa = week'),
      mc('fij-c4-ti5','What does "yabaki" mean?',['Day','Month','Year','Hour'],2,'🗓️','Yabaki = year'),
      mc('fij-c4-ti6','How do you say "night" in Fijian?',['Sigatasa','Bogi','Mataka','Draki'],1,'🌙','Bogi = night'),
      mc('fij-c4-ti7','What does "vakacegu" mean?',['To rest / holiday','To work','To eat','To swim'],0,'🏖️','Vakacegu = rest / holiday'),
      mc('fij-c4-ti8','How do you say "now" in Fijian?',['Nanoa','Mataka','Tiko','Oqo'],2,'⚡','Tiko = now / at the moment'),
    ],
  },
  {
    id: 'fijian-c4-weather', subject: 'fijian', class: 4, title: 'Weather Words ☀️', emoji: '☀️',
    color: 'bg-amber-100', levelColor: 'bg-amber-200 text-amber-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('fij-c4-we1','What does "draki vinaka" mean?',['Bad weather','Good weather','Cloudy weather','Windy weather'],1,'☀️','Draki vinaka = good weather'),
      mc('fij-c4-we2','How do you say "rain" in Fijian?',['Cagi','Uca','Draki','Bula'],1,'🌧️','Uca = rain'),
      mc('fij-c4-we3','What does "cagi" mean?',['Sun','Rain','Wind','Cloud'],2,'🌬️','Cagi = wind'),
      mc('fij-c4-we4','How do you say "hot" in Fijian?',['Batabata','Katakata','Dromodromo','Uca'],1,'🔥','Katakata = hot'),
      mc('fij-c4-we5','What does "batabata" mean?',['Hot','Cold','Cloudy','Rainy'],1,'🥶','Batabata = cold'),
      mc('fij-c4-we6','How do you say "cloud" in Fijian?',['Cagi','Ua','Uca','Draki'],1,'☁️','Ua = cloud'),
      mc('fij-c4-we7','What does "draki ca" mean?',['Good weather','Bad weather','Rainy day','Sunny day'],1,'⛈️','Draki ca = bad weather'),
      mc('fij-c4-we8','How do you say "sun" or "day" in Fijian?',['Siga','Cagi','Bogi','Uca'],0,'☀️','Siga = sun / day'),
    ],
  },
  {
    id: 'fijian-c4-verbs', subject: 'fijian', class: 4, title: 'Action Words 🏃', emoji: '🏃',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('fij-c4-vb1','What does "lako" mean?',['To eat','To go','To sleep','To run'],1,'🚶','Lako = to go'),
      mc('fij-c4-vb2','How do you say "to run" in Fijian?',['Cakacaka','Lako','Cici','Kana'],2,'🏃','Cici = to run'),
      mc('fij-c4-vb3','What does "cakacaka" mean?',['To work','To play','To swim','To rest'],0,'💼','Cakacaka = to work'),
      mc('fij-c4-vb4','How do you say "to swim" in Fijian?',['Lako','Qalo','Vakasama','Moku'],1,'🏊','Qalo = to swim'),
      mc('fij-c4-vb5','What does "vakasama" mean?',['To eat','To think','To sleep','To run'],1,'🧠','Vakasama = to think'),
      mc('fij-c4-vb6','How do you say "to sleep" in Fijian?',['Moce','Cici','Lako','Kana'],0,'😴','Moce = to sleep / also goodbye'),
      mc('fij-c4-vb7','What does "vakarau" mean?',['To rest','To prepare / get ready','To eat','To speak'],1,'✅','Vakarau = to prepare / ready'),
      mc('fij-c4-vb8','How do you say "to talk" in Fijian?',['Talanoa','Kana','Lako','Moce'],0,'🗣️','Talanoa = to talk / have a conversation'),
    ],
  },
  {
    id: 'fijian-c4-school', subject: 'fijian', class: 4, title: 'School Vocabulary 🏫', emoji: '🏫',
    color: 'bg-violet-100', levelColor: 'bg-violet-200 text-violet-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('fij-c4-sc1','How do you say "school" in Fijian?',['Vale','Vuli','Koro','Veivuli'],3,'🏫','Veivuli = school'),
      mc('fij-c4-sc2','What does "vuli" mean?',['To teach','To study / learn','To test','To write'],1,'📚','Vuli = to study / learn'),
      mc('fij-c4-sc3','How do you say "teacher" in Fijian?',['Goneyalewa','Turaga ni vuli','Turaga lailai','Koya ni vale'],1,'👩‍🏫','Turaga ni vuli = teacher'),
      mc('fij-c4-sc4','What does "tovolea" mean?',['To fail','To try / attempt','To copy','To play'],1,'💪','Tovolea = to try'),
      mc('fij-c4-sc5','How do you say "book" in Fijian?',['Vola','Lewa','Isulu','Kato'],0,'📖','Vola = book / to write'),
      mc('fij-c4-sc6','What does "lomana" mean?',['To forget','To understand / know','To guess','To read'],1,'💡','Lomana = to understand'),
      mc('fij-c4-sc7','How do you say "question" in Fijian?',['Taro','Vola','Veisautaki','Cakacaka'],0,'❓','Taro = question / to ask'),
      mc('fij-c4-sc8','What does "bula ni siga" mean?',['Good night','Good morning / Have a good day','See you later','Thank you'],1,'☀️','Bula ni siga = good day'),
    ],
  },
  {
    id: 'fijian-c4-places', subject: 'fijian', class: 4, title: 'Places in Fijian 🗺️', emoji: '🗺️',
    color: 'bg-pink-100', levelColor: 'bg-pink-200 text-pink-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Medium',
    questions: [
      mc('fij-c4-pl1','What does "koro" mean?',['City','Village','Island','Market'],1,'🏘️','Koro = village'),
      mc('fij-c4-pl2','How do you say "island" in Fijian?',['Koro','Wasawasa','Yanuyanu','Tikina'],2,'🏝️','Yanuyanu = island'),
      mc('fij-c4-pl3','What does "wasawasa" mean?',['River','Lake','Sea / ocean','Reef'],2,'🌊','Wasawasa = ocean / sea'),
      mc('fij-c4-pl4','How do you say "river" in Fijian?',['Uciwai','Wasawasa','Burevatu','Yanuyanu'],0,'🌊','Uciwai = river'),
      mc('fij-c4-pl5','What does "vale" mean?',['School','Market','House','Church'],2,'🏠','Vale = house'),
      mc('fij-c4-pl6','How do you say "market" in Fijian?',['Makete','Vale ni tavi','Koro','Veivoli'],0,'🛒','Makete = market'),
      mc('fij-c4-pl7','What does "vale ni lotu" mean?',['Market','Church','School','Hospital'],1,'⛪','Vale ni lotu = church (house of worship)'),
      mc('fij-c4-pl8','How do you say "hospital" in Fijian?',['Vale ni mate','Vale ni lotu','Veivuli','Koro'],0,'🏥','Vale ni mate = hospital'),
    ],
  },
  // ── FIJIAN extra — Class 5 ───────────────────────────────────────────────
  {
    id: 'fijian-c5-environment', subject: 'fijian', class: 5, title: 'Environment Words 🌿', emoji: '🌿',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('fij-c5-en1','What does "veikau" mean?',['Sea','Forest / bush','River','Mountain'],1,'🌳','Veikau = forest'),
      mc('fij-c5-en2','How do you say "coral reef" in Fijian?',['Baravi','Uciwai','Cakau','Veikau'],2,'🐠','Cakau = reef'),
      mc('fij-c5-en3','The Fijian term "vanua" refers to…',['A type of food','Land, community and cultural identity','A ceremony','A government position'],1,'🌏','Vanua = land, people and identity together'),
      mc('fij-c5-en4','How do you say "to protect" in Fijian?',['Taleitaka','Maroroya','Vakaleqa','Tovolea'],1,'🛡️','Maroroya = to protect / preserve'),
      mc('fij-c5-en5','What does "wai" refer to broadly?',['Land only','Water / fluid','Fire','Air'],1,'💧','Wai = water'),
      mc('fij-c5-en6','What does "teitei" mean?',['Fishing','Garden / farming land','Forest','Market'],1,'🌱','Teitei = garden'),
      mc('fij-c5-en7','How do you say "to protect the sea" in Fijian?',['Maroroya na wasawasa','Kana na ika','Lako i wasawasa','Cici ena baravi'],0,'🌊','Maroroya na wasawasa = to protect the sea'),
      mc('fij-c5-en8','What does "baravi" mean?',['Mountain','Beach / shore','River mouth','Deep ocean'],1,'🏖️','Baravi = beach / shore'),
    ],
  },
  {
    id: 'fijian-c5-emotions', subject: 'fijian', class: 5, title: 'Describing Emotions 💭', emoji: '💭',
    color: 'bg-rose-100', levelColor: 'bg-rose-200 text-rose-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('fij-c5-em1','What does "drotaka" mean?',['Love','Sadness / grief','Anger','Happiness'],1,'😢','Drotaka = sadness / grief'),
      mc('fij-c5-em2','How do you say "I am proud"?',['Au sa rere','Au sa marau vakalevu','Au sa vakarokoroko','Au sa drotaka'],2,'😤','Au sa vakarokoroko = I am proud'),
      mc('fij-c5-em3','What does "lomani" mean?',['To fear','To love / care for','To worry','To enjoy'],1,'❤️','Lomani = to love / cherish'),
      mc('fij-c5-em4','What does "vakadei" mean?',['Confident / certain','Fearful','Sad','Angry'],0,'💪','Vakadei = confident / sure'),
      mc('fij-c5-em5','How do you say "grateful" in Fijian?',['Vinaka vakalevu','Vakamolimoliaka','Lomana','Rere'],1,'🙏','Vakamolimoliaka = deeply thankful'),
      mc('fij-c5-em6','What does "loloma" mean?',['Fear','Jealousy','Love / compassion','Anger'],2,'💛','Loloma = love / compassion'),
      mc('fij-c5-em7','How do you say "I am worried"?',['Au sa vakadei','Au sa nanumi','Au sa vakarokoroko','Au sa marau'],1,'😟','Au sa nanumi = I am worried / thinking deeply'),
      mc('fij-c5-em8','What does "marau" mean?',['Tired','Happy / joyful','Angry','Confused'],1,'😊','Marau = happy / joyful'),
    ],
  },
  {
    id: 'fijian-c5-travel', subject: 'fijian', class: 5, title: 'Travel & Transport 🚢', emoji: '🚢',
    color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('fij-c5-tr1','What does "waqa" mean?',['Car','Boat / ship','Plane','Bicycle'],1,'⛵','Waqa = boat / vessel'),
      mc('fij-c5-tr2','How do you say "aeroplane" in Fijian?',['Waqa ni cagi','Waqa ni wai','Karasi','Motosikal'],0,'✈️','Waqa ni cagi = aeroplane (boat of the wind)'),
      mc('fij-c5-tr3','What does "lako mai" mean?',['Go away','Come here','Wait there','Stop now'],1,'👋','Lako mai = come here'),
      mc('fij-c5-tr4','How do you say "road" or "path" in Fijian?',['Sala','Baravi','Koro','Uciwai'],0,'🛣️','Sala = road / path'),
      mc('fij-c5-tr5','What does "lako tani" mean?',['Come back','Go away / leave','Stay here','Turn around'],1,'👋','Lako tani = go away / leave'),
      mc('fij-c5-tr6','How do you say "car" in Fijian?',['Karasi','Motoka','Waqa','Motosikal'],1,'🚗','Motoka = car'),
      mc('fij-c5-tr7','What does "kua ni lako" mean?',['Please go','Do not go','Hurry up and go','Come back later'],1,'🚫','Kua ni lako = do not go'),
      mc('fij-c5-tr8','How do you say "far away" in Fijian?',['Tawa yawa','Voleka','Oqo','Levu sara'],0,'🗺️','Yawa = far away'),
    ],
  },
  {
    id: 'fijian-c5-community', subject: 'fijian', class: 5, title: 'Community & Society 🏛️', emoji: '🏛️',
    color: 'bg-purple-100', levelColor: 'bg-purple-200 text-purple-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('fij-c5-cm1','What does "iTaukei" mean?',['Indo-Fijian people','Indigenous Fijian people','Rotuman people','All Fijians'],1,'👨‍👩‍👧','iTaukei = indigenous Fijian people'),
      mc('fij-c5-cm2','What is a "mataqali"?',['A type of food','A traditional clan group','A government position','A dance'],1,'👥','Mataqali = Fijian clan / landowning group'),
      mc('fij-c5-cm3','What does "turaga" mean?',['Chief / leader','Farmer','Fisherman','Teacher'],0,'👑','Turaga = chief / leader'),
      mc('fij-c5-cm4','What is "veiqaravi"?',['A feast','Service / duty','A ceremony','A song'],1,'🤲','Veiqaravi = service / serving others'),
      mc('fij-c5-cm5','The Fijian concept of "kerekere" refers to…',['Buying and selling','Asking for something with expectation it will be given freely','Fishing rights','Land ownership'],1,'🤝','Kerekere = asking for help / sharing within the community'),
      mc('fij-c5-cm6','What does "loloma" mean as a community value?',['Competition','Love, care and compassion for all','Individual achievement','Economic success'],1,'💛','Loloma as a Fijian value = communal love and care'),
      mc('fij-c5-cm7','What is "veivosaki"?',['To eat together','To discuss / have a conversation','To work alone','To travel'],1,'💬','Veivosaki = to discuss / conversation'),
      mc('fij-c5-cm8','What does "tokatoka" refer to?',['A type of fish','A Fijian meal','A small family household group','A ceremony'],2,'🏠','Tokatoka = the smallest traditional Fijian social unit'),
    ],
  },
  {
    id: 'fijian-c5-proverbs', subject: 'fijian', class: 5, title: 'Fijian Proverbs 📜', emoji: '📜',
    color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Hard',
    questions: [
      mc('fij-c5-pr1','"Na vanua e dau vakaraitaka na tamata" means: The land is known by its people. What does this teach us?',['Land has no value','A community is represented by the character of its people','Only important people matter','Land is for sale'],1,'🌏'),
      mc('fij-c5-pr2','"Bula vinaka" literally means good health and life. It is used as…',['A farewell only','A general greeting wishing well-being','An insult','A command'],1,'👋'),
      mc('fij-c5-pr3','"Veikauwaitaki" is a core Fijian value. What does it mean?',['Competition and winning','Looking after each other / mutual care','Working for payment','Individual success'],1,'🤝','Veikauwaitaki = mutual care'),
      mc('fij-c5-pr4','The greeting "Ni sa yadra" is used…',['At night','In the morning','When leaving','After eating'],1,'🌅','Ni sa yadra = Good morning'),
      mc('fij-c5-pr5','"Tovolea me dina" encourages people to…',['Give up when things are hard','Strive to be truthful and try your best honestly','Compete with others','Follow the crowd'],1,'✨'),
      mc('fij-c5-pr6','What does "sautu" refer to in Fijian culture?',['Poverty','Conflict','Prosperity, peace and well-being','A ceremony'],2,'🌟','Sautu = prosperity and well-being'),
      mc('fij-c5-pr7','The Fijian word "sevusevu" refers to…',['A type of fish','A formal presentation of gifts to show respect when visiting','A traditional game','A type of cloth'],1,'🎁','Sevusevu = formal gift-giving ceremony'),
      mc('fij-c5-pr8','What does "veiwekani" mean in Fijian?',['Enemies','Relatives / kinship relationship','Strangers','Business partners'],1,'👨‍👩‍👧','Veiwekani = kinship / family relationship'),
    ],
  },

  // ── SOCIAL STUDIES — Class 3 ─────────────────────────────────────────────
  {
    id: 'ss-c3-community', subject: 'social-studies', class: 3, title: 'My Community 🏘️', emoji: '🏘️',
    color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('ss-c3-co1','What is a community?',['A type of food','A group of people living together in a place','A type of school','A type of game'],1,'🏘️','Think about where you live'),
      mc('ss-c3-co2','Which of these is a community helper?',['Rock','Policeman','River','Tree'],1,'👮','Community helpers keep us safe'),
      mc('ss-c3-co3','What does a doctor do?',['Fights fires','Teaches children','Helps sick people get better','Delivers mail'],2,'👨‍⚕️'),
      mc('ss-c3-co4','What does a teacher do?',['Puts out fires','Helps people learn','Delivers letters','Fixes broken pipes'],1,'👩‍🏫'),
      mc('ss-c3-co5','Where do sick people go to get help?',['School','Market','Hospital','Church'],2,'🏥'),
      mc('ss-c3-co6','What do we call the person who leads a village in Fiji?',['Mayor','Turaga ni Koro','President','Principal'],1,'👴','Village leaders in Fiji'),
      mc('ss-c3-co7','Which place do children go to learn?',['Hospital','Market','School','Church'],2,'🏫'),
      mc('ss-c3-co8','What is a market?',['A place to play','A place where people buy and sell things','A place to sleep','A place to swim'],1,'🛒'),
    ],
  },
  {
    id: 'ss-c3-environment', subject: 'social-studies', class: 3, title: 'Our Environment 🌿', emoji: '🌿',
    color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('ss-c3-en1','What is the environment?',['Only animals','Everything around us — land, water, air and living things','Only plants','Only buildings'],1,'🌍'),
      mc('ss-c3-en2','Which of these is a natural thing?',['Car','River','School bag','Chair'],1,'🌊','Natural things are not made by humans'),
      mc('ss-c3-en3','How can we keep our environment clean?',['Throw rubbish on the ground','Put rubbish in the bin','Leave plastic in the sea','Burn everything'],1,'🗑️'),
      mc('ss-c3-en4','Why are trees important?',['They give us shade, clean air and food','They make noise','They block roads','They take up space'],0,'🌳'),
      mc('ss-c3-en5','What happens when people throw rubbish in rivers?',['Fish are happier','The water gets dirty and harms fish','The river gets bigger','Nothing happens'],1,'🐟'),
      mc('ss-c3-en6','Which of these is a way to save water?',['Leave the tap running','Turn off the tap when not using it','Water the garden at noon','Use water to play all day'],1,'💧'),
      mc('ss-c3-en7','What is pollution?',['Clean water','When harmful things dirty our air, water or land','A type of plant','A type of animal'],1,'🏭'),
      mc('ss-c3-en8','Fiji is made up of how many islands?',['About 5','About 100','More than 300','Exactly 10'],2,'🏝️','Fiji has over 300 islands'),
    ],
  },

  // ── HEALTHY LIVING — Class 3 ─────────────────────────────────────────────
  {
    id: 'hl-c3-hygiene', subject: 'healthy-living', class: 3, title: 'Keeping Clean 🧼', emoji: '🧼',
    color: 'bg-teal-100', levelColor: 'bg-teal-200 text-teal-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('hl-c3-hy1','When should you wash your hands?',['Only at night','Before eating and after using the toilet','Only in the morning','Whenever you feel like it'],1,'🙌','Handwashing stops germs spreading'),
      mc('hl-c3-hy2','How many times should you brush your teeth each day?',['Once a week','Once a month','Twice a day','Only when they hurt'],2,'🦷'),
      mc('hl-c3-hy3','What do we use to wash our body?',['Mud','Soap and water','Just water only','Dirt'],1,'🚿'),
      mc('hl-c3-hy4','Why is it important to keep clean?',['To look pretty only','To stop germs that cause sickness','Because adults say so','No reason'],1,'🦠','Germs cause illness'),
      mc('hl-c3-hy5','What should you do after sneezing?',['Nothing','Cover your mouth and wash your hands','Run away','Sneeze on your friend'],1,'🤧'),
      mc('hl-c3-hy6','How often should you bath?',['Once a week','Every day','Once a month','When you smell bad'],1,'🛁'),
      mc('hl-c3-hy7','What keeps your nails clean and short?',['Soap','Nail clipper','Comb','Toothbrush'],1,'✂️'),
      mc('hl-c3-hy8','Why should you wear clean clothes?',['To show off','To be comfortable, smell nice and stay healthy','Because school forces you','For no reason'],1,'👕'),
    ],
  },
  {
    id: 'hl-c3-food', subject: 'healthy-living', class: 3, title: 'Healthy Foods 🥦', emoji: '🥦',
    color: 'bg-lime-100', levelColor: 'bg-lime-200 text-lime-800', activityType: 'multiple-choice', source: 'builtin', difficulty: 'Easy',
    questions: [
      mc('hl-c3-fo1','Which food helps our bodies grow strong?',['Lollies','Protein foods like fish, eggs and beans','Soft drinks','Chips'],1,'💪','Protein builds muscles'),
      mc('hl-c3-fo2','Which drink is best for our body?',['Fizzy drink','Juice with lots of sugar','Water','Cordial'],2,'💧'),
      mc('hl-c3-fo3','Fruits and vegetables give us…',['Too much sugar','Important vitamins that keep us healthy','No goodness','Only colour'],1,'🍎'),
      mc('hl-c3-fo4','Which of these is a healthy snack?',['Lollies','A piece of fruit','Chips','A chocolate bar'],1,'🍌'),
      mc('hl-c3-fo5','How many meals should we eat each day?',['Just one big meal','Three regular meals','Eat all day long','Eat only when very hungry'],1,'🍽️'),
      mc('hl-c3-fo6','Why is fish a good food to eat?',['It tastes bad','It gives us protein and healthy fats','It has no goodness','It is only for adults'],1,'🐟','Fiji has lots of healthy fish'),
      mc('hl-c3-fo7','What does too much sugar do to your teeth?',['Makes them stronger','Causes tooth decay','Makes them whiter','Nothing at all'],1,'🦷'),
      mc('hl-c3-fo8','Root crops like dalo and cassava give us…',['Protein','Carbohydrates for energy','Too much fat','Nothing useful'],1,'⚡','Carbohydrates give us energy'),
    ],
  },
];

export const UPLOADED_ACTIVITIES_KEY = 'kkz_uploaded_activities';
const PROFILE_KEY = 'kitty';

// ── Local helpers ──

function getLocalActivities(): SubjectActivity[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(UPLOADED_ACTIVITIES_KEY);
    return raw ? (JSON.parse(raw) as SubjectActivity[]) : [];
  } catch { return []; }
}

function setLocalActivities(activities: SubjectActivity[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(UPLOADED_ACTIVITIES_KEY, JSON.stringify(activities));
}

// ── Row ↔ SubjectActivity mapping ──

function rowToActivity(row: any): SubjectActivity {
  return {
    id: row.activity_id,
    subject: row.subject as SubjectKey,
    class: row.class_level as 3 | 4 | 5,
    title: row.title,
    emoji: row.emoji,
    color: row.color,
    levelColor: row.level_color,
    activityType: row.activity_type as ActivityType,
    questions: row.questions ?? [],
    source: 'uploaded',
    difficulty: row.difficulty as 'Easy' | 'Medium' | 'Hard',
  };
}

// ── Supabase async helpers ──

async function saveActivityToSupabase(activity: SubjectActivity): Promise<void> {
  try {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { error } = await supabase.from('uploaded_activities').upsert({
      activity_id: activity.id,
      profile_key: PROFILE_KEY,
      subject: activity.subject,
      class_level: activity.class,
      title: activity.title,
      emoji: activity.emoji,
      color: activity.color,
      level_color: activity.levelColor,
      activity_type: activity.activityType,
      questions: activity.questions,
      source: activity.source,
      difficulty: activity.difficulty,
    }, { onConflict: 'activity_id' });
    if (error) console.error('[uploadedActivities] Supabase upsert failed:', error.message);
  } catch (err) {
    console.error('[uploadedActivities] Supabase unavailable:', err);
  }
}

async function deleteActivityFromSupabase(id: string): Promise<void> {
  try {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.from('uploaded_activities').delete().eq('activity_id', id);
  } catch { /* localStorage already updated */ }
}

export async function getUploadedActivitiesAsync(): Promise<SubjectActivity[]> {
  try {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data, error } = await supabase
      .from('uploaded_activities')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .order('created_at', { ascending: false });
    if (error || !data) return getLocalActivities();
    const activities = data.map(rowToActivity);
    setLocalActivities(activities);
    return activities;
  } catch { return getLocalActivities(); }
}

// ── Public API ──

export function getUploadedActivities(): SubjectActivity[] {
  return getLocalActivities();
}

export function saveUploadedActivity(activity: SubjectActivity): void {
  if (typeof window === 'undefined') return;
  const existing = getLocalActivities().filter((a) => a.id !== activity.id);
  setLocalActivities([activity, ...existing]);
  // Fire-and-forget Supabase sync
  saveActivityToSupabase(activity).catch(() => {});
}

export function deleteUploadedActivity(id: string): void {
  if (typeof window === 'undefined') return;
  const filtered = getLocalActivities().filter((a) => a.id !== id);
  setLocalActivities(filtered);
  deleteActivityFromSupabase(id).catch(() => {});
}

export function getAllActivities(subject: SubjectKey, childClass: 3 | 4 | 5): SubjectActivity[] {
  const builtin = BUILTIN_ACTIVITIES.filter((a) => a.subject === subject && a.class === childClass);
  const uploaded = getLocalActivities().filter((a) => a.subject === subject && a.class === childClass);
  return [...builtin, ...uploaded];
}
