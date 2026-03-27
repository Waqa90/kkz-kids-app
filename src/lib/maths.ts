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
  // ── CLASS 3 extra ─────────────────────────────────────────────────────────
  {
    id: 'c3-fractions', title: 'Simple Fractions 🍕', emoji: '🍕', color: 'bg-pink-100', levelColor: 'bg-pink-200 text-pink-800', class: 3, difficulty: 'Easy', topic: 'multiple-choice',
    questions: [
      q('c3-fr-1','multiple-choice','What is half of 8?',4,{options:['2','3','4','5'],correctIndex:2,emoji:'🍕',hint:'Split 8 into 2 equal parts'}),
      q('c3-fr-2','multiple-choice','What is ½ of 10?',5,{options:['4','5','6','7'],correctIndex:1,emoji:'🎂'}),
      q('c3-fr-3','multiple-choice','What fraction shades 1 out of 4 equal parts?',1,{options:['½','¼','⅓','⅔'],correctIndex:1,emoji:'🍫',hint:'One out of four equal pieces'}),
      q('c3-fr-4','multiple-choice','What is half of 14?',7,{options:['5','6','7','8'],correctIndex:2,emoji:'🍊'}),
      q('c3-fr-5','multiple-choice','Which fraction is bigger?',1,{options:['¼','½','⅛','Both same'],correctIndex:1,emoji:'⭐',hint:'The smaller the bottom number the bigger the piece'}),
      q('c3-fr-6','multiple-choice','What is ¼ of 12?',3,{options:['2','3','4','6'],correctIndex:1,emoji:'🌟',hint:'Divide 12 by 4'}),
      q('c3-fr-7','multiple-choice','A pizza has 8 slices. You eat 4. What fraction did you eat?',4,{options:['¼','⅓','½','¾'],correctIndex:2,emoji:'🍕'}),
      q('c3-fr-8','multiple-choice','½ + ½ = ?',1,{options:['½','1','1½','2'],correctIndex:1,emoji:'🎯',hint:'Two halves make one whole'}),
    ],
  },
  {
    id: 'c3-shapes', title: 'Shapes & Geometry 🔷', emoji: '🔷', color: 'bg-cyan-100', levelColor: 'bg-cyan-200 text-cyan-800', class: 3, difficulty: 'Easy', topic: 'multiple-choice',
    questions: [
      q('c3-sh-1','multiple-choice','How many sides does a triangle have?',3,{options:['2','3','4','5'],correctIndex:1,emoji:'🔺'}),
      q('c3-sh-2','multiple-choice','How many sides does a square have?',4,{options:['3','4','5','6'],correctIndex:1,emoji:'🟦'}),
      q('c3-sh-3','multiple-choice','Which shape has no corners?',0,{options:['Circle','Square','Triangle','Rectangle'],correctIndex:0,emoji:'⭕',hint:'It is perfectly round'}),
      q('c3-sh-4','multiple-choice','How many sides does a rectangle have?',4,{options:['3','4','5','6'],correctIndex:1,emoji:'📄'}),
      q('c3-sh-5','multiple-choice','A shape with 6 sides is called a…',6,{options:['Pentagon','Hexagon','Octagon','Heptagon'],correctIndex:1,emoji:'🔶',hint:'Hex = 6'}),
      q('c3-sh-6','multiple-choice','How many corners does a triangle have?',3,{options:['2','3','4','0'],correctIndex:1,emoji:'🔺'}),
      q('c3-sh-7','multiple-choice','Which 3D shape looks like a ball?',0,{options:['Sphere','Cube','Cylinder','Cone'],correctIndex:0,emoji:'⚽'}),
      q('c3-sh-8','multiple-choice','A cube has how many faces?',6,{options:['4','5','6','8'],correctIndex:2,emoji:'🎲',hint:'Think of a dice'}),
    ],
  },
  {
    id: 'c3-patterns', title: 'Number Patterns 🔢', emoji: '🔢', color: 'bg-indigo-100', levelColor: 'bg-indigo-200 text-indigo-800', class: 3, difficulty: 'Easy', topic: 'multiple-choice',
    questions: [
      q('c3-pt-1','multiple-choice','What comes next? 2, 4, 6, 8, __',10,{options:['9','10','11','12'],correctIndex:1,emoji:'🔢',hint:'Count by 2s'}),
      q('c3-pt-2','multiple-choice','What comes next? 5, 10, 15, 20, __',25,{options:['22','23','25','30'],correctIndex:2,emoji:'⭐',hint:'Count by 5s'}),
      q('c3-pt-3','multiple-choice','What comes next? 10, 20, 30, 40, __',50,{options:['45','48','50','55'],correctIndex:2,emoji:'🌟',hint:'Count by 10s'}),
      q('c3-pt-4','multiple-choice','What is missing? 3, 6, __, 12, 15',9,{options:['7','8','9','10'],correctIndex:2,emoji:'🎯',hint:'Count by 3s'}),
      q('c3-pt-5','multiple-choice','What comes next? 1, 3, 5, 7, __',9,{options:['8','9','10','11'],correctIndex:1,emoji:'🔴',hint:'These are odd numbers'}),
      q('c3-pt-6','multiple-choice','What is missing? 20, 18, 16, __, 12',14,{options:['13','14','15','11'],correctIndex:1,emoji:'📉',hint:'Counting down by 2s'}),
      q('c3-pt-7','multiple-choice','What comes next? 100, 90, 80, 70, __',60,{options:['65','60','55','50'],correctIndex:1,emoji:'🎈',hint:'Counting back by 10s'}),
      q('c3-pt-8','multiple-choice','What is the pattern? 4, 8, 12, 16 — going up by…',4,{options:['2','3','4','5'],correctIndex:2,emoji:'📊'}),
    ],
  },
  {
    id: 'c3-money', title: 'Money Maths 💰', emoji: '💰', color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', class: 3, difficulty: 'Easy', topic: 'multiple-choice',
    questions: [
      q('c3-mo-1','multiple-choice','You have 50c and spend 20c. How much is left?',30,{options:['20c','25c','30c','35c'],correctIndex:2,emoji:'💰'}),
      q('c3-mo-2','multiple-choice','A lolly costs $1.50. You pay $2. What change do you get?',50,{options:['25c','40c','50c','75c'],correctIndex:2,emoji:'🍭'}),
      q('c3-mo-3','multiple-choice','3 items cost 20c each. Total cost?',60,{options:['50c','55c','60c','65c'],correctIndex:2,emoji:'🛒'}),
      q('c3-mo-4','multiple-choice','You have $5 and buy something for $3.50. Change?',150,{options:['$1.00','$1.50','$2.00','$2.50'],correctIndex:1,emoji:'💵'}),
      q('c3-mo-5','multiple-choice','Which coins make 75c?',75,{options:['50c + 25c','50c + 20c','25c + 25c + 10c','40c + 35c'],correctIndex:0,emoji:'🪙',hint:'Look for coins that add to 75'}),
      q('c3-mo-6','multiple-choice','You earn $2 on Monday and $3 on Tuesday. Total earned?',5,{options:['$4','$5','$6','$7'],correctIndex:1,emoji:'🌟'}),
      q('c3-mo-7','multiple-choice','How many 25c coins make $1?',4,{options:['2','3','4','5'],correctIndex:2,emoji:'🪙',hint:'25 + 25 + 25 + 25 = ?'}),
      q('c3-mo-8','multiple-choice','An item costs $4.20. You pay $5. Change?',80,{options:['60c','70c','80c','90c'],correctIndex:2,emoji:'🛍️'}),
    ],
  },
  {
    id: 'c3-time', title: 'Telling the Time ⏰', emoji: '⏰', color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', class: 3, difficulty: 'Easy', topic: 'multiple-choice',
    questions: [
      q('c3-ti-1','multiple-choice','How many minutes are in one hour?',60,{options:['30','45','60','100'],correctIndex:2,emoji:'⏰'}),
      q('c3-ti-2','multiple-choice','How many hours are in one day?',24,{options:['12','20','24','48'],correctIndex:2,emoji:'🌞'}),
      q('c3-ti-3','multiple-choice','School starts at 8:00 am and ends at 3:00 pm. How many hours?',7,{options:['5','6','7','8'],correctIndex:2,emoji:'🏫'}),
      q('c3-ti-4','multiple-choice','It is 2:30 pm. What time will it be in 1 hour?',330,{options:['2:30 pm','3:00 pm','3:30 pm','4:00 pm'],correctIndex:2,emoji:'🕐'}),
      q('c3-ti-5','multiple-choice','How many seconds are in one minute?',60,{options:['30','60','100','120'],correctIndex:1,emoji:'⏱️'}),
      q('c3-ti-6','multiple-choice','Half past 4 is the same as…',430,{options:['4:00','4:15','4:30','4:45'],correctIndex:2,emoji:'🕓'}),
      q('c3-ti-7','multiple-choice','How many days are in one week?',7,{options:['5','6','7','8'],correctIndex:2,emoji:'📅'}),
      q('c3-ti-8','multiple-choice','It is 10:00 am. What time was it 2½ hours ago?',730,{options:['7:00 am','7:30 am','8:00 am','8:30 am'],correctIndex:1,emoji:'🌅',hint:'10:00 minus 2 hours = 8:00, minus 30 min = 7:30'}),
    ],
  },
  // ── CLASS 4 extra ─────────────────────────────────────────────────────────
  {
    id: 'c4-fractions', title: 'Fractions & Decimals 🔢', emoji: '🔢', color: 'bg-pink-100', levelColor: 'bg-pink-200 text-pink-800', class: 4, difficulty: 'Medium', topic: 'multiple-choice',
    questions: [
      q('c4-fr-1','multiple-choice','What is ¾ of 24?',18,{options:['16','18','20','22'],correctIndex:1,emoji:'🍕',hint:'Find ¼ first: 24÷4=6, then ×3'}),
      q('c4-fr-2','multiple-choice','What decimal is the same as ½?',5,{options:['0.1','0.25','0.5','0.75'],correctIndex:2,emoji:'📊'}),
      q('c4-fr-3','multiple-choice','⅓ of 30 = ?',10,{options:['6','8','10','15'],correctIndex:2,emoji:'🍫',hint:'30 ÷ 3'}),
      q('c4-fr-4','multiple-choice','What decimal equals ¼?',25,{options:['0.1','0.20','0.25','0.4'],correctIndex:2,emoji:'⭐'}),
      q('c4-fr-5','multiple-choice','Which fraction is equivalent to 2/4?',2,{options:['⅓','½','¾','⅔'],correctIndex:1,emoji:'🎯',hint:'Simplify 2/4 by dividing both by 2'}),
      q('c4-fr-6','multiple-choice','⅔ of 18 = ?',12,{options:['10','11','12','14'],correctIndex:2,emoji:'🌟',hint:'18÷3=6, then 6×2'}),
      q('c4-fr-7','multiple-choice','0.75 is the same as which fraction?',75,{options:['½','⅔','¾','⅘'],correctIndex:2,emoji:'💫'}),
      q('c4-fr-8','multiple-choice','What is ⅖ of 20?',8,{options:['6','8','10','12'],correctIndex:1,emoji:'🏆',hint:'20÷5=4, then 4×2'}),
    ],
  },
  {
    id: 'c4-area', title: 'Area & Perimeter 📐', emoji: '📐', color: 'bg-cyan-100', levelColor: 'bg-cyan-200 text-cyan-800', class: 4, difficulty: 'Medium', topic: 'multiple-choice',
    questions: [
      q('c4-ar-1','multiple-choice','A rectangle is 5 cm long and 3 cm wide. What is its area?',15,{options:['10','14','15','16'],correctIndex:2,emoji:'📐',hint:'Area = length × width'}),
      q('c4-ar-2','multiple-choice','A square has sides of 4 cm. What is its perimeter?',16,{options:['12','14','16','20'],correctIndex:2,emoji:'🔷',hint:'Perimeter = 4 × side'}),
      q('c4-ar-3','multiple-choice','A rectangle is 8 cm × 3 cm. What is its perimeter?',22,{options:['18','20','22','24'],correctIndex:2,emoji:'📏',hint:'P = 2×(l+w)'}),
      q('c4-ar-4','multiple-choice','A square has a perimeter of 20 cm. What is one side?',5,{options:['4','5','6','8'],correctIndex:1,emoji:'⬛',hint:'20 ÷ 4 sides'}),
      q('c4-ar-5','multiple-choice','Area = 36 cm². The shape is a square. What is one side?',6,{options:['4','5','6','9'],correctIndex:2,emoji:'🟦',hint:'6 × 6 = 36'}),
      q('c4-ar-6','multiple-choice','A rectangle 10 cm long and 2 cm wide. Area = ?',20,{options:['12','16','20','24'],correctIndex:2,emoji:'📄',hint:'10 × 2'}),
      q('c4-ar-7','multiple-choice','A room is 6 m × 4 m. How many square tiles (1m²) are needed to cover the floor?',24,{options:['20','22','24','28'],correctIndex:2,emoji:'🏠',hint:'Area = 6 × 4'}),
      q('c4-ar-8','multiple-choice','What is the area of a square with side 9 cm?',81,{options:['36','72','81','90'],correctIndex:2,emoji:'🌟',hint:'9 × 9'}),
    ],
  },
  {
    id: 'c4-sequences', title: 'Number Sequences 🔢', emoji: '🔢', color: 'bg-indigo-100', levelColor: 'bg-indigo-200 text-indigo-800', class: 4, difficulty: 'Medium', topic: 'multiple-choice',
    questions: [
      q('c4-sq-1','multiple-choice','What comes next? 3, 6, 12, 24, __',48,{options:['36','40','48','50'],correctIndex:2,emoji:'🔢',hint:'Each number doubles'}),
      q('c4-sq-2','multiple-choice','What is missing? 100, 95, 90, __, 80',85,{options:['83','84','85','86'],correctIndex:2,emoji:'📉',hint:'Counting down by 5s'}),
      q('c4-sq-3','multiple-choice','What comes next? 2, 4, 8, 16, __',32,{options:['24','28','30','32'],correctIndex:3,emoji:'⭐',hint:'Each number doubles'}),
      q('c4-sq-4','multiple-choice','What is the 10th term if we start at 7 and add 4 each time?',43,{options:['39','41','43','47'],correctIndex:2,emoji:'🎯',hint:'7 + (9×4) = 7+36'}),
      q('c4-sq-5','multiple-choice','What is missing? 1, 4, 9, 16, __, 36',25,{options:['20','23','25','28'],correctIndex:2,emoji:'🌟',hint:'These are square numbers: 1²,2²,3²...'}),
      q('c4-sq-6','multiple-choice','What comes next? 1000, 900, 800, 700, __',600,{options:['650','600','550','500'],correctIndex:1,emoji:'📊',hint:'Counting back by 100s'}),
      q('c4-sq-7','multiple-choice','What is missing? 5, 10, 20, __, 80',40,{options:['30','35','40','45'],correctIndex:2,emoji:'🎈',hint:'Each number doubles'}),
      q('c4-sq-8','multiple-choice','Start at 3, multiply by 3 each time. What is the 4th term?',81,{options:['27','54','81','243'],correctIndex:2,emoji:'🏆',hint:'3, 9, 27, 81'}),
    ],
  },
  {
    id: 'c4-money', title: 'Money Word Problems 💵', emoji: '💵', color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', class: 4, difficulty: 'Medium', topic: 'multiple-choice',
    questions: [
      q('c4-mo-1','multiple-choice','Karawa saves $4.50 each week for 6 weeks. How much in total?',27,{options:['$24.00','$25.50','$27.00','$28.00'],correctIndex:2,emoji:'💰',hint:'4.50 × 6'}),
      q('c4-mo-2','multiple-choice','A book costs $12.75. Zech has $20. How much change?',725,{options:['$7.00','$7.25','$7.50','$8.00'],correctIndex:1,emoji:'📚'}),
      q('c4-mo-3','multiple-choice','3 friends share $24 equally. How much each?',8,{options:['$6','$7','$8','$9'],correctIndex:2,emoji:'👫',hint:'24 ÷ 3'}),
      q('c4-mo-4','multiple-choice','Kitty earns $15 and spends $8.50. How much remains?',650,{options:['$5.50','$6.00','$6.50','$7.00'],correctIndex:2,emoji:'🐱'}),
      q('c4-mo-5','multiple-choice','5 mangoes cost $2.50 total. How much is one mango?',50,{options:['40c','50c','55c','60c'],correctIndex:1,emoji:'🥭',hint:'$2.50 ÷ 5'}),
      q('c4-mo-6','multiple-choice','A toy costs $18. There is a 50% discount. New price?',9,{options:['$8','$9','$10','$12'],correctIndex:1,emoji:'🏷️',hint:'Half of $18'}),
      q('c4-mo-7','multiple-choice','Total bill is $35.40. Three people split equally. Each pays?',1180,{options:['$11.60','$11.70','$11.80','$12.00'],correctIndex:2,emoji:'🍽️',hint:'35.40 ÷ 3'}),
      q('c4-mo-8','multiple-choice','You have $50. You spend $13.40 then $9.80. How much left?',2680,{options:['$26.20','$26.80','$27.20','$28.00'],correctIndex:1,emoji:'🛒',hint:'50 - 13.40 - 9.80'}),
    ],
  },
  {
    id: 'c4-measurement', title: 'Measurement 📏', emoji: '📏', color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', class: 4, difficulty: 'Medium', topic: 'multiple-choice',
    questions: [
      q('c4-me-1','multiple-choice','How many centimetres are in 1 metre?',100,{options:['10','50','100','1000'],correctIndex:2,emoji:'📏'}),
      q('c4-me-2','multiple-choice','How many metres are in 1 kilometre?',1000,{options:['100','500','1000','10000'],correctIndex:2,emoji:'🏃'}),
      q('c4-me-3','multiple-choice','Convert 250 cm to metres',250,{options:['2 m','2.5 m','25 m','0.25 m'],correctIndex:1,emoji:'📐',hint:'Divide by 100'}),
      q('c4-me-4','multiple-choice','How many grams in 1 kilogram?',1000,{options:['10','100','1000','10000'],correctIndex:2,emoji:'⚖️'}),
      q('c4-me-5','multiple-choice','A bag weighs 2.5 kg. How many grams is that?',2500,{options:['250 g','2500 g','25000 g','250000 g'],correctIndex:1,emoji:'🎒',hint:'2.5 × 1000'}),
      q('c4-me-6','multiple-choice','How many millilitres in 1 litre?',1000,{options:['10','100','1000','10000'],correctIndex:2,emoji:'💧'}),
      q('c4-me-7','multiple-choice','A bottle holds 750 mL. How many mL to fill to 2 litres?',1250,{options:['1000 mL','1200 mL','1250 mL','1500 mL'],correctIndex:2,emoji:'🍶',hint:'2000 - 750'}),
      q('c4-me-8','multiple-choice','A rope is 3.5 m long. Cut off 80 cm. How long remains?',270,{options:['250 cm','270 cm','290 cm','300 cm'],correctIndex:1,emoji:'✂️',hint:'350 cm - 80 cm'}),
    ],
  },
  // ── CLASS 5 extra ─────────────────────────────────────────────────────────
  {
    id: 'c5-fractions', title: 'Fractions & Percentages %', emoji: '💯', color: 'bg-pink-100', levelColor: 'bg-pink-200 text-pink-800', class: 5, difficulty: 'Hard', topic: 'multiple-choice',
    questions: [
      q('c5-fr-1','multiple-choice','25% of 80 = ?',20,{options:['16','20','25','40'],correctIndex:1,emoji:'💯',hint:'25% = ¼, so 80÷4'}),
      q('c5-fr-2','multiple-choice','What is 10% of 350?',35,{options:['30','33','35','40'],correctIndex:2,emoji:'📊',hint:'Divide by 10'}),
      q('c5-fr-3','multiple-choice','What percentage is 3 out of 12?',25,{options:['20%','25%','30%','33%'],correctIndex:1,emoji:'⭐',hint:'3/12 = ¼ = 25%'}),
      q('c5-fr-4','multiple-choice','50% of 240 = ?',120,{options:['100','110','120','130'],correctIndex:2,emoji:'🌟',hint:'Half of 240'}),
      q('c5-fr-5','multiple-choice','A shop gives 20% off $45. What is the discount amount?',9,{options:['$7','$8','$9','$10'],correctIndex:2,emoji:'🏷️',hint:'20% of 45 = 45÷5'}),
      q('c5-fr-6','multiple-choice','⅗ as a percentage is…',60,{options:['50%','55%','60%','65%'],correctIndex:2,emoji:'🎯',hint:'3÷5 = 0.60 = 60%'}),
      q('c5-fr-7','multiple-choice','What is 75% of 200?',150,{options:['100','125','150','175'],correctIndex:2,emoji:'🏆',hint:'75% = ¾, so 200 × ¾'}),
      q('c5-fr-8','multiple-choice','A test has 40 questions. You get 30 correct. Your score as a percentage?',75,{options:['65%','70%','75%','80%'],correctIndex:2,emoji:'📝',hint:'30/40 = ¾ = 75%'}),
    ],
  },
  {
    id: 'c5-geometry', title: 'Geometry & Angles 📐', emoji: '📐', color: 'bg-cyan-100', levelColor: 'bg-cyan-200 text-cyan-800', class: 5, difficulty: 'Hard', topic: 'multiple-choice',
    questions: [
      q('c5-ge-1','multiple-choice','How many degrees in a right angle?',90,{options:['45','90','120','180'],correctIndex:1,emoji:'📐'}),
      q('c5-ge-2','multiple-choice','Angles in a triangle add up to…',180,{options:['90°','180°','270°','360°'],correctIndex:1,emoji:'🔺'}),
      q('c5-ge-3','multiple-choice','A triangle has angles of 60° and 80°. What is the third?',40,{options:['30°','40°','50°','60°'],correctIndex:1,emoji:'📏',hint:'180 - 60 - 80'}),
      q('c5-ge-4','multiple-choice','Angles on a straight line add up to…',180,{options:['90°','180°','270°','360°'],correctIndex:1,emoji:'📏'}),
      q('c5-ge-5','multiple-choice','What is the volume of a box 4 cm × 3 cm × 2 cm?',24,{options:['18','20','24','28'],correctIndex:2,emoji:'📦',hint:'Volume = l × w × h'}),
      q('c5-ge-6','multiple-choice','An acute angle is…',45,{options:['Exactly 90°','Greater than 90°','Less than 90°','180°'],correctIndex:2,emoji:'↗️'}),
      q('c5-ge-7','multiple-choice','The area of a triangle with base 10 cm and height 6 cm is…',30,{options:['30 cm²','40 cm²','50 cm²','60 cm²'],correctIndex:0,emoji:'🔺',hint:'Area = ½ × base × height'}),
      q('c5-ge-8','multiple-choice','Angles around a point add up to…',360,{options:['90°','180°','270°','360°'],correctIndex:3,emoji:'🔄'}),
    ],
  },
  {
    id: 'c5-sequences', title: 'Number Sequences & Rules 🧩', emoji: '🧩', color: 'bg-indigo-100', levelColor: 'bg-indigo-200 text-indigo-800', class: 5, difficulty: 'Hard', topic: 'multiple-choice',
    questions: [
      q('c5-sq-1','multiple-choice','What is the 6th term in: 1, 1, 2, 3, 5, __?',8,{options:['6','7','8','9'],correctIndex:2,emoji:'🔢',hint:'Each term = sum of two before it (Fibonacci)'}),
      q('c5-sq-2','multiple-choice','What is the 10th square number?',100,{options:['81','90','100','121'],correctIndex:2,emoji:'⭐',hint:'10 × 10 = ?'}),
      q('c5-sq-3','multiple-choice','A sequence increases by 7 each time. Starting at 4, what is the 5th term?',32,{options:['28','32','35','39'],correctIndex:1,emoji:'🎯',hint:'4, 11, 18, 25, 32'}),
      q('c5-sq-4','multiple-choice','What is the next prime number after 11?',13,{options:['12','13','14','15'],correctIndex:1,emoji:'🌟',hint:'A prime has exactly 2 factors: 1 and itself'}),
      q('c5-sq-5','multiple-choice','What is the rule for: 3, 9, 27, 81?',3,{options:['Add 6','Add 18','Multiply by 2','Multiply by 3'],correctIndex:3,emoji:'📈'}),
      q('c5-sq-6','multiple-choice','What are the first 4 cube numbers?',64,{options:['1,4,9,16','1,8,27,64','1,3,9,27','2,8,24,64'],correctIndex:1,emoji:'🎲',hint:'1³=1, 2³=8, 3³=27, 4³=64'}),
      q('c5-sq-7','multiple-choice','What is the 7th term? Rule: start 100, subtract 13 each time',22,{options:['18','22','26','30'],correctIndex:1,emoji:'📉',hint:'100,87,74,61,48,35,22'}),
      q('c5-sq-8','multiple-choice','Which of these is a perfect square?',144,{options:['125','134','144','150'],correctIndex:2,emoji:'🏆',hint:'12 × 12 = 144'}),
    ],
  },
  {
    id: 'c5-financial', title: 'Financial Maths 💼', emoji: '💼', color: 'bg-yellow-100', levelColor: 'bg-yellow-200 text-yellow-800', class: 5, difficulty: 'Hard', topic: 'multiple-choice',
    questions: [
      q('c5-fi-1','multiple-choice','A $200 item has 15% GST added. Total price?',230,{options:['$210','$215','$220','$230'],correctIndex:3,emoji:'🧾',hint:'15% of 200 = 30, add to 200'}),
      q('c5-fi-2','multiple-choice','Simple interest on $500 at 4% per year for 3 years = ?',60,{options:['$40','$50','$60','$80'],correctIndex:2,emoji:'🏦',hint:'I = P × R × T = 500 × 0.04 × 3'}),
      q('c5-fi-3','multiple-choice','A worker earns $12.50 per hour. For 8 hours, total = ?',100,{options:['$90','$96','$100','$110'],correctIndex:2,emoji:'💼',hint:'12.50 × 8'}),
      q('c5-fi-4','multiple-choice','$300 is split in ratio 2:1. The larger share = ?',200,{options:['$150','$180','$200','$220'],correctIndex:2,emoji:'⚖️',hint:'Total parts = 3, larger = 2/3 of 300'}),
      q('c5-fi-5','multiple-choice','A shop buys for $40 and sells for $55. Profit percentage?',375,{options:['25%','32.5%','37.5%','40%'],correctIndex:2,emoji:'📈',hint:'Profit=15, %=(15/40)×100'}),
      q('c5-fi-6','multiple-choice','A family budget is $800/month. 25% on food = ?',200,{options:['$150','$175','$200','$250'],correctIndex:2,emoji:'🏠',hint:'25% = ¼ of 800'}),
      q('c5-fi-7','multiple-choice','Zech saves $35 per week. After 12 weeks, total saved = ?',420,{options:['$380','$400','$420','$450'],correctIndex:2,emoji:'🐖',hint:'35 × 12'}),
      q('c5-fi-8','multiple-choice','A phone costs $360. Pay $60 deposit and $60/month. How many months?',5,{options:['4','5','6','7'],correctIndex:1,emoji:'📱',hint:'(360-60) ÷ 60'}),
    ],
  },
  {
    id: 'c5-algebra', title: 'Intro to Algebra 🔡', emoji: '🔡', color: 'bg-orange-100', levelColor: 'bg-orange-200 text-orange-800', class: 5, difficulty: 'Hard', topic: 'multiple-choice',
    questions: [
      q('c5-al-1','multiple-choice','If n + 5 = 12, what is n?',7,{options:['5','6','7','8'],correctIndex:2,emoji:'🔡',hint:'n = 12 - 5'}),
      q('c5-al-2','multiple-choice','If 3x = 18, what is x?',6,{options:['4','5','6','7'],correctIndex:2,emoji:'⭐',hint:'x = 18 ÷ 3'}),
      q('c5-al-3','multiple-choice','If y − 8 = 15, what is y?',23,{options:['7','13','23','24'],correctIndex:2,emoji:'🎯',hint:'y = 15 + 8'}),
      q('c5-al-4','multiple-choice','What is 2a + 3 when a = 5?',13,{options:['10','11','12','13'],correctIndex:3,emoji:'🌟',hint:'2×5 + 3'}),
      q('c5-al-5','multiple-choice','If 4p = 36, what is p?',9,{options:['7','8','9','10'],correctIndex:2,emoji:'🏆',hint:'p = 36 ÷ 4'}),
      q('c5-al-6','multiple-choice','What is the value of 5m − 2 when m = 4?',18,{options:['14','16','18','20'],correctIndex:2,emoji:'💡',hint:'5×4 − 2 = 20 − 2'}),
      q('c5-al-7','multiple-choice','If 2x + 3 = 11, what is x?',4,{options:['3','4','5','6'],correctIndex:1,emoji:'🎈',hint:'2x = 11−3 = 8, so x = 4'}),
      q('c5-al-8','multiple-choice','A number multiplied by 6, then minus 4 equals 20. What is the number?',4,{options:['3','4','5','6'],correctIndex:1,emoji:'🧮',hint:'6n - 4 = 20 → 6n = 24 → n = 4'}),
    ],
  },
];
