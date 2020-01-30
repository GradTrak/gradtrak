const DUMMY_COURSE_DATA = [
  {
    units: 4,
    title: 'Foundations of Data Science',
    dept: 'COMPSCI',
    no: 'C8',
    id: 'compscic8',
    tagIds: [],
  },
  {
    units: 4,
    title: 'The Beauty and Joy of Computing',
    dept: 'COMPSCI',
    no: '10',
    id: 'compsci10',
    tagIds: [],
  },
  {
    units: 1,
    title: 'Freshman Seminars',
    dept: 'COMPSCI',
    no: '24',
    id: 'compsci24',
    tagIds: [],
  },
  {
    units: 2,
    title: 'CS Scholars Seminar: The Educational Climate in CS & CS61A technical discussions',
    dept: 'COMPSCI',
    no: '36',
    id: 'compsci36',
    tagIds: [],
  },
  {
    units: 1,
    title: 'Completion of Work in Computer Science 61A',
    dept: 'COMPSCI',
    no: '47A',
    id: 'compsci47a',
    tagIds: [],
  },
  {
    units: 1,
    title: 'Completion of Work in Computer Science 61B',
    dept: 'COMPSCI',
    no: '47B',
    id: 'compsci47b',
    tagIds: [],
  },
  {
    units: 1,
    title: 'Completion of Work in Computer Science 61C',
    dept: 'COMPSCI',
    no: '47C',
    id: 'compsci47c',
    tagIds: [],
  },
  {
    units: 4,
    title: 'The Structure and Interpretation of Computer Programs',
    dept: 'COMPSCI',
    no: '61A',
    id: 'compsci61a',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Data Structures',
    dept: 'COMPSCI',
    no: '61B',
    id: 'compsci61b',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Great Ideas of Computer Architecture (Machine Structures)',
    dept: 'COMPSCI',
    no: '61C',
    id: 'compsci61c',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Discrete Mathematics and Probability Theory',
    dept: 'COMPSCI',
    no: '70',
    id: 'compsci70',
    tagIds: [],
  },
  {
    units: 3,
    title: 'Computational Structures in Data Science',
    dept: 'COMPSCI',
    no: '88',
    id: 'compsci88',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Computer Architecture and Engineering',
    dept: 'COMPSCI',
    no: '152',
    id: 'compsci152',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'User Interface Design and Development',
    dept: 'COMPSCI',
    no: '160',
    id: 'compsci160',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Computer Security',
    dept: 'COMPSCI',
    no: '161',
    id: 'compsci161',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Operating Systems and System Programming',
    dept: 'COMPSCI',
    no: '162',
    id: 'compsci162',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Programming Languages and Compilers',
    dept: 'COMPSCI',
    no: '164',
    id: 'compsci164',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Introduction to the Internet: Architecture and Protocols',
    dept: 'COMPSCI',
    no: '168',
    id: 'compsci168',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Software Engineering',
    dept: 'COMPSCI',
    no: '169',
    id: 'compsci169',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Efficient Algorithms and Intractable Problems',
    dept: 'COMPSCI',
    no: '170',
    id: 'compsci170',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Combinatorics and Discrete Probability',
    dept: 'COMPSCI',
    no: '174',
    id: 'compsci174',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Designing, Visualizing and Understanding Deep Neural Networks',
    dept: 'COMPSCI',
    no: 'L182',
    id: 'compscil182',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Designing, Visualizing and Understanding Deep Neural Networks',
    dept: 'COMPSCI',
    no: 'W182',
    id: 'compsciw182',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Foundations of Computer Graphics',
    dept: 'COMPSCI',
    no: '184',
    id: 'compsci184',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Introduction to Database Systems',
    dept: 'COMPSCI',
    no: 'W186',
    id: 'compsciw186',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Introduction to Artificial Intelligence',
    dept: 'COMPSCI',
    no: '188',
    id: 'compsci188',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Introduction to Machine Learning',
    dept: 'COMPSCI',
    no: '189',
    id: 'compsci189',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 3,
    title: 'Quantum Information Science and Technology',
    dept: 'COMPSCI',
    no: 'C191',
    id: 'compscic191',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 1,
    title: 'Special Topics',
    dept: 'COMPSCI',
    no: '194',
    id: 'compsci194',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 1,
    title: 'Social Implications of Computer Technology',
    dept: 'COMPSCI',
    no: '195',
    id: 'compsci195',
    tagIds: ['eecs_ethics'],
  },
  {
    units: 1,
    title: 'Directed Group Studies for Advanced Undergraduates',
    dept: 'COMPSCI',
    no: '198',
    id: 'compsci198',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Designing Information Devices and Systems I',
    dept: 'EECS',
    no: '16A',
    id: 'eecs16a',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Designing Information Devices and Systems II',
    dept: 'EECS',
    no: '16B',
    id: 'eecs16b',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Introduction to Robotics',
    dept: 'EECS',
    no: 'C106A',
    id: 'eecsc106a',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Robotic Manipulation and Interaction',
    dept: 'EECS',
    no: 'C106B',
    id: 'eecsc106b',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Probability and Random Processes',
    dept: 'EECS',
    no: '126',
    id: 'eecs126',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Optimization Models in Engineering',
    dept: 'EECS',
    no: '127',
    id: 'eecs127',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Introduction to Embedded Systems',
    dept: 'EECS',
    no: '149',
    id: 'eecs149',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 3,
    title: 'Introduction to Digital Design and Integrated Circuits',
    dept: 'EECS',
    no: '151',
    id: 'eecs151',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 2,
    title: 'Application Specific Integrated Circuits Laboratory',
    dept: 'EECS',
    no: '151LA',
    id: 'eecs151la',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 2,
    title: 'Field-Programmable Gate Array Laboratory',
    dept: 'EECS',
    no: '151LB',
    id: 'eecs151lb',
    tagIds: ['eecs_upper_div'],
  },
  {
    units: 4,
    title: 'Reading and Composition',
    dept: 'ENGLISH',
    no: 'R1A',
    id: 'englishr1a',
    tagIds: ['rc_a'],
  },
  {
    units: 4,
    title: 'Reading and Composition',
    dept: 'ENGLISH',
    no: 'R1B',
    id: 'englishr1b',
    tagIds: ['rc_b'],
  },
  {
    units: 4,
    title: 'Natural Language Processing',
    dept: 'INFO',
    no: '159',
    id: 'info159',
    tagIds: ['eecs_upper_div', 'linguis_elective'],
  },
  {
    units: 5,
    title: 'American Sign Language I',
    dept: 'LINGUIS',
    no: '1A',
    id: 'linguis1a',
    tagIds: [],
  },
  {
    units: 5,
    title: 'American Sign Language II',
    dept: 'LINGUIS',
    no: '1B',
    id: 'linguis1b',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Endangered Languages: Why does linguistic diversity matter?',
    dept: 'LINGUIS',
    no: 'R1B',
    id: 'linguisr1b',
    tagIds: ['rc_b'],
  },
  {
    units: 4,
    title: 'Language and Linguistics',
    dept: 'LINGUIS',
    no: '5',
    id: 'linguis5',
    tagIds: ['ls_socio'],
  },
  {
    units: 3,
    title: 'The Sounds of English',
    dept: 'LINGUIS',
    no: '10',
    id: 'linguis10',
    tagIds: ['ls_socio'],
  },
  {
    units: 1,
    title: 'Freshman Seminar',
    dept: 'LINGUIS',
    no: '24',
    id: 'linguis24',
    tagIds: ['ls_socio'],
  },
  {
    units: 3,
    title: 'Language and Communication Disorders',
    dept: 'LINGUIS',
    no: '47',
    id: 'linguis47',
    tagIds: ['ls_socio'],
  },
  {
    units: 4,
    title: 'Introduction to Linguistic Science',
    dept: 'LINGUIS',
    no: '100',
    id: 'linguis100',
    tagIds: ['upper_div', 'ls_socio'],
  },
  {
    units: 4,
    title: 'Metaphor',
    dept: 'LINGUIS',
    no: '106',
    id: 'linguis106',
    tagIds: ['upper_div', 'ls_socio', 'linguis_elective'],
  },
  {
    units: 3,
    title: 'Bilingualism',
    dept: 'LINGUIS',
    no: '109',
    id: 'linguis109',
    tagIds: ['upper_div', 'ls_socio', 'linguis_elective'],
  },
  {
    units: 4,
    title: 'Phonetics',
    dept: 'LINGUIS',
    no: '110',
    id: 'linguis110',
    tagIds: ['upper_div', 'ls_socio'],
  },
  {
    units: 4,
    title: 'Phonology',
    dept: 'LINGUIS',
    no: '111',
    id: 'linguis111',
    tagIds: ['upper_div', 'ls_socio'],
  },
  {
    units: 4,
    title: 'Morphology',
    dept: 'LINGUIS',
    no: '115',
    id: 'linguis115',
    tagIds: ['upper_div', 'ls_socio'],
  },
  {
    units: 4,
    title: 'Syntax',
    dept: 'LINGUIS',
    no: '120',
    id: 'linguis120',
    tagIds: ['upper_div', 'ls_socio'],
  },
  {
    units: 4,
    title: 'Formal Semantics',
    dept: 'LINGUIS',
    no: '121',
    id: 'linguis121',
    tagIds: ['upper_div', 'ls_socio', 'linguis_elective'],
  },
  {
    units: 3,
    title: 'Pragmatics',
    dept: 'LINGUIS',
    no: '123',
    id: 'linguis123',
    tagIds: ['upper_div', 'ls_socio', 'linguis_elective'],
  },
  {
    units: 4,
    title: 'Comparative and Historical Linguistics',
    dept: 'LINGUIS',
    no: '130',
    id: 'linguis130',
    tagIds: ['upper_div', 'ls_socio'],
  },
  {
    units: 3,
    title: 'Field Methods',
    dept: 'LINGUIS',
    no: '140',
    id: 'linguis140',
    tagIds: ['upper_div', 'ls_socio', 'linguis_elective'],
  },
  {
    units: 3,
    title: 'Language and Thought',
    dept: 'LINGUIS',
    no: 'C142',
    id: 'linguisc142',
    tagIds: ['upper_div', 'ls_socio', 'linguis_elective'],
  },
  {
    units: 3,
    title: 'Language Acquisition',
    dept: 'LINGUIS',
    no: 'C146',
    id: 'linguisc146',
    tagIds: ['upper_div', 'ls_socio', 'linguis_elective'],
  },
  {
    units: 3,
    title: 'Phonological Development',
    dept: 'LINGUIS',
    no: '148',
    id: 'linguis148',
    tagIds: ['upper_div', 'ls_socio', 'linguis_elective'],
  },
  {
    units: 3,
    title: 'Sociolinguistics',
    dept: 'LINGUIS',
    no: '150',
    id: 'linguis150',
    tagIds: ['upper_div', 'ls_socio', 'linguis_elective'],
  },
  {
    units: 4,
    title: 'Language in the United States: a Capsule History',
    dept: 'LINGUIS',
    no: '155AC',
    id: 'linguis155ac',
    tagIds: ['upper_div', 'ls_hist', 'ls_socio', 'ac', 'linguis_elective'],
  },
  {
    units: 4,
    title: 'Quantitative Methods in Linguistics',
    dept: 'LINGUIS',
    no: 'C160',
    id: 'linguisc160',
    tagIds: ['upper_div', 'ls_socio', 'linguis_elective'],
  },
  {
    units: 3,
    title: 'History, Structure, and Sociolinguistics of a Particular Language',
    dept: 'LINGUIS',
    no: '170',
    id: 'linguis170',
    tagIds: ['upper_div', 'ls_socio', 'linguis_elective'],
  },
  {
    units: 1,
    title: 'Research Practicum',
    dept: 'LINGUIS',
    no: '197',
    id: 'linguis197',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Calculus',
    dept: 'MATH',
    no: '1A',
    id: 'math1a',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Calculus',
    dept: 'MATH',
    no: '1B',
    id: 'math1b',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Multivariable Calculus',
    dept: 'MATH',
    no: '53',
    id: 'math53',
    tagIds: [],
  },
  {
    units: 4,
    title: 'Physics for Scientists and Engineers',
    dept: 'PHYSICS',
    no: '7A',
    id: 'physics7a',
    tagIds: ['ls_phys'],
  },
  {
    units: 4,
    title: 'Physics for Scientists and Engineers',
    dept: 'PHYSICS',
    no: '7B',
    id: 'physics7b',
    tagIds: ['ls_phys'],
  },
];

exports.getCourses = (req, res) => {
  res.json(DUMMY_COURSE_DATA);
};