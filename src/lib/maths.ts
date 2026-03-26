// Maths sets — 15 total, 5 per class (3, 4, 5)

export type MathsOp = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'multiple-choice' | 'mixed';

export interface MathsQuestion {
  id: string;
  type: MathsOp;
  display: string;
  options?: [string, string, string, string];
  correctAnswer: number;
  correctIndex?: 0 | 1 | 2 | 3;
  emoji?: string;
  hint?: string;
}

export interface MathsSet {
  id: string;
  title: string;
  emoji: string;
  color: string;
  levelColor: string;
  class: 3 | 4 | 5;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: MathsOp;
  questions: MathsQuestion[];
}

function q(id: string, type: MathsOp, display: string, correctAnswer: number, opts?: { options?: [string,string,string,string]; correctIndex?: 0|1|2|3; emoji?: string; hint?: string }): MathsQuestion {
  return { id, type, display, correctAnswer, ...opts };
}

export const MATHS_SETS: MathsSet[] = [
  // ── CLASS 3 ──────────────────────────────────────────────────────────────
  {
    id: 'c3-adding', title: 'Fun with Adding! ➕', emoji: '➕', color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', class: 3, difficulty: 'Easy', topic: 'addition',
    questions: [
      q('c3-add-1','addition','3 + 4 = ?',7,{emoji:'🍎',hint:'Count on your fingers!'}),
      q('c3-add-2','addition','7 + 2 = ?',9,{emoji:'🍊'}),
      q('c3-add-3','addition','5 + 6 = ?',11,{emoji:'🍋',hint:'5 + 5 = 10, then one more'}),
      q('c3-add-4','addition','8 + 1 = ?',9,{emoji:'🍇'}),
      q('c3-add-5','addition','4 + 4 = ?',8,{emoji:'🌟'}),
      q('c3-add-6','addition','6 + 3 = ?',9,{emoji:'🐸'}),
      q('c3-add-7','addition','9 + 2 = ?',11,{emoji:'🦊',hint:'9 + 1 = 10, then one more'}),
      q('c3-add-8','addition','5 + 5 = ?',10,{emoji:'🐱'}),
    ],
  },
  {
    id: 'c3-subtraction', title: 'Take It Away! ➖', emoji: '➖', color: 'bg-red-100', levelColor: 'bg-red-200 text-red-800', class: 3, difficulty: 'Easy', topic: 'subtraction',
    questions: [
      q('c3-sub-1','subtraction','9 − 3 = ?',6,{emoji:'🍌'}),
      q('c3-sub-2','subtraction','8 − 5 = ?',3,{emoji:'🍉'}),
      q('c3-sub-3','subtraction','7 − 4 = ?',3,{emoji:'🍓',hint:'Count back from 7'}),
      q('c3-sub-4','subtraction','10 − 6 = ?',4,{emoji:'🌴'}),
      q('c3-sub-5','subtraction','6 − 2 = ?',4,{emoji:'🐶'}),
      q('c3-sub-6','subtraction','9 − 7 = ?',2,{emoji:'🐼'}),
      q('c3-sub-7','subtraction','5 − 3 = ?',2,{emoji:'🦁'}),
      q('c3-sub-8','subtraction','8 − 4 = ?',4,{emoji:'🐯'}),
    ],
  },
  {
    id: 'c3-times', title: 'Times Tables 1–5 ✖️', emoji: '✖️', color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', class: 3, difficulty: 'Easy', topic: 'multiplication',
    questions: [
      q('c3-times-1','multiple-choice','3 × 4 = ?',12,{options:['10','12','11','14'],correctIndex:1,emoji:'⭐'}),
      q('c3-times-2','multiple-choice','2 × 5 = ?',10,{options:['8','9','10','11'],correctIndex:2,emoji:'🌟'}),
      q('c3-times-3','multiple-choice','4 × 3 = ?',12,{options:['11','13','12','14'],correctIndex:2,emoji:'🔢'}),
      q('c3-times-4','multiple-choice','5 × 2 = ?',10,{options:['9','10','11','12'],correctIndex:1,emoji:'🎯'}),
      q('c3-times-5','multiple-choice','3 × 3 = ?',9,{options:['6','7','8','9'],correctIndex:3,emoji:'💫'}),
      q('c3-times-6','multiple-choice','4 × 4 = ?',16,{options:['14','15','16','17'],correctIndex:2,emoji:'🎲'}),
      q('c3-times-7','multiple-choice','5 × 3 = ?',15,{options:['13','14','15','16'],correctIndex:2,emoji:'🏆'}),
      q('c3-times-8','multiple-choice','2 × 4 = ?',8,{options:['6','7','8','9'],correctIndex:2,emoji:'✨'}),
      q('c3-times-9','multiple-choice','5 × 5 = ?',25,{options:['20','23','25','27'],correctIndex:2,emoji:'🎉'}),
      q('c3-times-10','multiple-choice','3 × 5 = ?',15,{options:['12','14','15','16'],correctIndex:2,emoji:'🌈'}),
    ],
  },
  {
    id: 'c3-division', title: 'Easy Division ➗', emoji: '➗', color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', class: 3, difficulty: 'Easy', topic: 'division',
    questions: [
      q('c3-div-1','division','10 ÷ 2 = ?',5,{emoji:'🍎',hint:'How many groups of 2 in 10?'}),
      q('c3-div-2','division','15 ÷ 3 = ?',5,{emoji:'🍊'}),
      q('c3-div-3','division','20 ÷ 4 = ?',5,{emoji:'🍋'}),
      q('c3-div-4','division','12 ÷ 3 = ?',4,{emoji:'🌟',hint:'3 × ? = 12'}),
      q('c3-div-5','division','8 ÷ 2 = ?',4,{emoji:'🐸'}),
      q('c3-div-6','division','16 ÷ 4 = ?',4,{emoji:'🦊'}),
      q('c3-div-7','division','25 ÷ 5 = ?',5,{emoji:'⭐',hint:'5 × 5 = ?'}),
      q('c3-div-8','division','18 ÷ 3 = ?',6,{emoji:'🎯'}),
    ],
  },
  {
    id: 'c3-mixed', title: 'Maths Mix-Up! 🎲', emoji: '🎲', color: 'bg-purple-100', levelColor: 'bg-purple-200 text-purple-800', class: 3, difficulty: 'Easy', topic: 'mixed',
    questions: [
      q('c3-mix-1','addition','6 + 7 = ?',13,{emoji:'🍎'}),
      q('c3-mix-2','subtraction','9 − 4 = ?',5,{emoji:'🌟'}),
      q('c3-mix-3','multiple-choice','2 × 3 = ?',6,{options:['4','5','6','7'],correctIndex:2,emoji:'⭐'}),
      q('c3-mix-4','division','12 ÷ 4 = ?',3,{emoji:'🎯'}),
      q('c3-mix-5','addition','4 + 8 = ?',12,{emoji:'🐸'}),
      q('c3-mix-6','subtraction','10 − 3 = ?',7,{emoji:'🦊'}),
      q('c3-mix-7','multiple-choice','3 × 2 = ?',6,{options:['5','6','7','8'],correctIndex:1,emoji:'💫'}),
      q('c3-mix-8','division','20 ÷ 5 = ?',4,{emoji:'🏆'}),
      q('c3-mix-9','multiple-choice','4 × 5 = ?',20,{options:['16','18','20','22'],correctIndex:2,emoji:'🎉'}),
      q('c3-mix-10','addition','7 + 8 = ?',15,{emoji:'🌈'}),
    ],
  },

  // ── CLASS 4 ──────────────────────────────────────────────────────────────
  {
    id: 'c4-adding', title: 'Two-Digit Adding ➕', emoji: '➕', color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', class: 4, difficulty: 'Medium', topic: 'addition',
    questions: [
      q('c4-add-1','addition','34 + 47 = ?',81,{emoji:'🍎',hint:'Add tens first: 30+40=70, then 4+7=11'}),
      q('c4-add-2','addition','56 + 28 = ?',84,{emoji:'🍊'}),
      q('c4-add-3','addition','43 + 39 = ?',82,{emoji:'🍋'}),
      q('c4-add-4','addition','72 + 18 = ?',90,{emoji:'🌟',hint:'72 + 18 = 72 + 20 − 2'}),
      q('c4-add-5','addition','65 + 27 = ?',92,{emoji:'🐸'}),
      q('c4-add-6','addition','38 + 46 = ?',84,{emoji:'🦊'}),
      q('c4-add-7','addition','54 + 33 = ?',87,{emoji:'⭐'}),
      q('c4-add-8','addition','67 + 24 = ?',91,{emoji:'🎯'}),
    ],
  },
  {
    id: 'c4-subtraction', title: 'Two-Digit Takeaway ➖', emoji: '➖', color: 'bg-red-100', levelColor: 'bg-red-200 text-red-800', class: 4, difficulty: 'Medium', topic: 'subtraction',
    questions: [
      q('c4-sub-1','subtraction','73 − 28 = ?',45,{emoji:'🍌',hint:'73 − 30 = 43, then add 2'}),
      q('c4-sub-2','subtraction','81 − 46 = ?',35,{emoji:'🍉'}),
      q('c4-sub-3','subtraction','92 − 37 = ?',55,{emoji:'🍓'}),
      q('c4-sub-4','subtraction','65 − 29 = ?',36,{emoji:'🌴',hint:'65 − 30 = 35, then add 1'}),
      q('c4-sub-5','subtraction','84 − 56 = ?',28,{emoji:'🐶'}),
      q('c4-sub-6','subtraction','70 − 33 = ?',37,{emoji:'🐼'}),
      q('c4-sub-7','subtraction','96 − 48 = ?',48,{emoji:'🦁'}),
      q('c4-sub-8','subtraction','53 − 27 = ?',26,{emoji:'🐯'}),
    ],
  },
  {
    id: 'c4-times', title: 'Times Tables 1–10 ✖️', emoji: '✖️', color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', class: 4, difficulty: 'Medium', topic: 'multiplication',
    questions: [
      q('c4-times-1','multiple-choice','6 × 7 = ?',42,{options:['40','41','42','43'],correctIndex:2,emoji:'⭐'}),
      q('c4-times-2','multiple-choice','8 × 9 = ?',72,{options:['70','71','72','73'],correctIndex:2,emoji:'🌟'}),
      q('c4-times-3','multiple-choice','7 × 6 = ?',42,{options:['39','40','42','44'],correctIndex:2,emoji:'🔢'}),
      q('c4-times-4','multiple-choice','9 × 8 = ?',72,{options:['63','70','72','74'],correctIndex:2,emoji:'🎯'}),
      q('c4-times-5','multiple-choice','6 × 8 = ?',48,{options:['42','45','48','50'],correctIndex:2,emoji:'💫'}),
      q('c4-times-6','multiple-choice','7 × 9 = ?',63,{options:['56','60','63','65'],correctIndex:2,emoji:'🎲'}),
      q('c4-times-7','multiple-choice','8 × 7 = ?',56,{options:['48','54','56','58'],correctIndex:2,emoji:'🏆'}),
      q('c4-times-8','multiple-choice','9 × 6 = ?',54,{options:['48','52','54','56'],correctIndex:2,emoji:'✨'}),
      q('c4-times-9','multiple-choice','10 × 8 = ?',80,{options:['70','75','80','85'],correctIndex:2,emoji:'🎉'}),
      q('c4-times-10','multiple-choice','7 × 7 = ?',49,{options:['42','46','49','52'],correctIndex:2,emoji:'🌈'}),
    ],
  },
  {
    id: 'c4-division', title: 'Division Detectives 🔍', emoji: '🔍', color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', class: 4, difficulty: 'Medium', topic: 'division',
    questions: [
      q('c4-div-1','division','17 ÷ 3 = ?',5,{emoji:'🍎',hint:'5 × 3 = 15, remainder 2'}),
      q('c4-div-2','division','23 ÷ 4 = ?',5,{emoji:'🍊',hint:'5 × 4 = 20, remainder 3'}),
      q('c4-div-3','division','19 ÷ 5 = ?',3,{emoji:'🍋',hint:'3 × 5 = 15, remainder 4'}),
      q('c4-div-4','division','31 ÷ 6 = ?',5,{emoji:'🌟',hint:'5 × 6 = 30, remainder 1'}),
      q('c4-div-5','division','27 ÷ 4 = ?',6,{emoji:'🐸',hint:'6 × 4 = 24, remainder 3'}),
      q('c4-div-6','division','22 ÷ 7 = ?',3,{emoji:'🦊',hint:'3 × 7 = 21, remainder 1'}),
      q('c4-div-7','division','35 ÷ 6 = ?',5,{emoji:'⭐',hint:'5 × 6 = 30, remainder 5'}),
      q('c4-div-8','division','41 ÷ 8 = ?',5,{emoji:'🎯',hint:'5 × 8 = 40, remainder 1'}),
    ],
  },
  {
    id: 'c4-word', title: 'Word Problems 📝', emoji: '📝', color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', class: 4, difficulty: 'Medium', topic: 'multiple-choice',
    questions: [
      q('c4-word-1','multiple-choice','Kitty has 24 mangoes. She gives 6 to each friend. How many friends get mangoes?',4,{options:['3','4','5','6'],correctIndex:1,emoji:'🥭'}),
      q('c4-word-2','multiple-choice','There are 48 fish in 6 equal groups. How many fish in each group?',8,{options:['6','7','8','9'],correctIndex:2,emoji:'🐟'}),
      q('c4-word-3','multiple-choice','Karawa picks 37 taro and then picks 28 more. How many in total?',65,{options:['55','60','65','70'],correctIndex:2,emoji:'🌿'}),
      q('c4-word-4','multiple-choice','Zech has 72 pencils and shares them into 8 equal boxes. How many pencils per box?',9,{options:['7','8','9','10'],correctIndex:2,emoji:'✏️'}),
      q('c4-word-5','multiple-choice','A school has 56 students in 7 equal classes. How many per class?',8,{options:['6','7','8','9'],correctIndex:2,emoji:'🏫'}),
      q('c4-word-6','multiple-choice','There are 45 coconuts on 9 trees. The same number on each tree. How many per tree?',5,{options:['4','5','6','7'],correctIndex:1,emoji:'🥥'}),
      q('c4-word-7','multiple-choice','Kitty saves $34 in January and $47 in February. How much total?',81,{options:['71','76','81','86'],correctIndex:2,emoji:'💰'}),
      q('c4-word-8','multiple-choice','63 children go on a trip in buses of 9. How many buses are needed?',7,{options:['5','6','7','8'],correctIndex:2,emoji:'🚌'}),
    ],
  },

  // ── CLASS 5 ──────────────────────────────────────────────────────────────
  {
    id: 'c5-adding', title: 'Big Number Adding ➕', emoji: '➕', color: 'bg-green-100', levelColor: 'bg-green-200 text-green-800', class: 5, difficulty: 'Hard', topic: 'addition',
    questions: [
      q('c5-add-1','addition','456 + 287 = ?',743,{emoji:'🍎',hint:'Add hundreds, then tens, then ones'}),
      q('c5-add-2','addition','734 + 198 = ?',932,{emoji:'🍊'}),
      q('c5-add-3','addition','523 + 349 = ?',872,{emoji:'🍋'}),
      q('c5-add-4','addition','642 + 275 = ?',917,{emoji:'🌟'}),
      q('c5-add-5','addition','817 + 164 = ?',981,{emoji:'🐸'}),
      q('c5-add-6','addition','395 + 428 = ?',823,{emoji:'🦊'}),
      q('c5-add-7','addition','671 + 253 = ?',924,{emoji:'⭐'}),
      q('c5-add-8','addition','548 + 376 = ?',924,{emoji:'🎯'}),
    ],
  },
  {
    id: 'c5-subtraction', title: 'Big Number Takeaway ➖', emoji: '➖', color: 'bg-red-100', levelColor: 'bg-red-200 text-red-800', class: 5, difficulty: 'Hard', topic: 'subtraction',
    questions: [
      q('c5-sub-1','subtraction','800 − 347 = ?',453,{emoji:'🍌',hint:'800 − 300 = 500, then 500 − 47'}),
      q('c5-sub-2','subtraction','523 − 186 = ?',337,{emoji:'🍉'}),
      q('c5-sub-3','subtraction','741 − 258 = ?',483,{emoji:'🍓'}),
      q('c5-sub-4','subtraction','906 − 437 = ?',469,{emoji:'🌴'}),
      q('c5-sub-5','subtraction','615 − 279 = ?',336,{emoji:'🐶'}),
      q('c5-sub-6','subtraction','832 − 465 = ?',367,{emoji:'🐼'}),
      q('c5-sub-7','subtraction','700 − 253 = ?',447,{emoji:'🦁'}),
      q('c5-sub-8','subtraction','984 − 596 = ?',388,{emoji:'🐯'}),
    ],
  },
  {
    id: 'c5-times', title: 'Multiplication Masters ✖️', emoji: '✖️', color: 'bg-blue-100', levelColor: 'bg-blue-200 text-blue-800', class: 5, difficulty: 'Hard', topic: 'multiplication',
    questions: [
      q('c5-times-1','multiple-choice','34 × 6 = ?',204,{options:['200','202','204','206'],correctIndex:2,emoji:'⭐'}),
      q('c5-times-2','multiple-choice','47 × 8 = ?',376,{options:['370','374','376','380'],correctIndex:2,emoji:'🌟'}),
      q('c5-times-3','multiple-choice','25 × 7 = ?',175,{options:['165','170','175','180'],correctIndex:2,emoji:'🔢'}),
      q('c5-times-4','multiple-choice','63 × 4 = ?',252,{options:['244','248','252','256'],correctIndex:2,emoji:'🎯'}),
      q('c5-times-5','multiple-choice','38 × 9 = ?',342,{options:['332','338','342','346'],correctIndex:2,emoji:'💫'}),
      q('c5-times-6','multiple-choice','52 × 6 = ?',312,{options:['302','308','312','316'],correctIndex:2,emoji:'🎲'}),
      q('c5-times-7','multiple-choice','74 × 5 = ?',370,{options:['360','365','370','375'],correctIndex:2,emoji:'🏆'}),
      q('c5-times-8','multiple-choice','86 × 3 = ?',258,{options:['250','254','258','262'],correctIndex:2,emoji:'✨'}),
      q('c5-times-9','multiple-choice','29 × 7 = ?',203,{options:['196','200','203','207'],correctIndex:2,emoji:'🎉'}),
      q('c5-times-10','multiple-choice','45 × 8 = ?',360,{options:['352','356','360','364'],correctIndex:2,emoji:'🌈'}),
    ],
  },
  {
    id: 'c5-division', title: 'Long Division Challenge ➗', emoji: '🏆', color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', class: 5, difficulty: 'Hard', topic: 'division',
    questions: [
      q('c5-div-1','division','156 ÷ 7 = ?',22,{emoji:'🍎',hint:'7 × 22 = 154... close!'}),
      q('c5-div-2','division','243 ÷ 9 = ?',27,{emoji:'🍊',hint:'9 × 27 = 243'}),
      q('c5-div-3','division','184 ÷ 8 = ?',23,{emoji:'🍋',hint:'8 × 23 = 184'}),
      q('c5-div-4','division','315 ÷ 6 = ?',52,{emoji:'🌟',hint:'6 × 52 = 312... almost!'}),
      q('c5-div-5','division','252 ÷ 7 = ?',36,{emoji:'🐸',hint:'7 × 36 = 252'}),
      q('c5-div-6','division','378 ÷ 9 = ?',42,{emoji:'🦊',hint:'9 × 42 = 378'}),
      q('c5-div-7','division','224 ÷ 8 = ?',28,{emoji:'⭐',hint:'8 × 28 = 224'}),
      q('c5-div-8','division','336 ÷ 6 = ?',56,{emoji:'🎯',hint:'6 × 56 = 336'}),
    ],
  },
  {
    id: 'c5-mixed', title: 'Mixed Maths Champ 🏆', emoji: '🎖️', color: 'bg-purple-100', levelColor: 'bg-purple-200 text-purple-800', class: 5, difficulty: 'Hard', topic: 'mixed',
    questions: [
      q('c5-mix-1','addition','467 + 358 = ?',825,{emoji:'🍎'}),
      q('c5-mix-2','subtraction','900 − 463 = ?',437,{emoji:'🍊'}),
      q('c5-mix-3','multiple-choice','56 × 7 = ?',392,{options:['378','385','392','399'],correctIndex:2,emoji:'⭐'}),
      q('c5-mix-4','division','288 ÷ 9 = ?',32,{emoji:'🎯',hint:'9 × 32 = 288'}),
      q('c5-mix-5','addition','584 + 297 = ?',881,{emoji:'🌟'}),
      q('c5-mix-6','subtraction','750 − 384 = ?',366,{emoji:'🦊'}),
      q('c5-mix-7','multiple-choice','43 × 8 = ?',344,{options:['336','340','344','348'],correctIndex:2,emoji:'💫'}),
      q('c5-mix-8','division','405 ÷ 9 = ?',45,{emoji:'🏆',hint:'9 × 45 = 405'}),
      q('c5-mix-9','multiple-choice','Karawa has 252 shells in 7 equal jars. How many per jar?',36,{options:['32','34','36','38'],correctIndex:2,emoji:'🐚'}),
      q('c5-mix-10','multiple-choice','A boat carries 48 passengers each trip. After 9 trips, how many passengers total?',432,{options:['386','400','432','450'],correctIndex:2,emoji:'⛵'}),
    ],
  },
];
