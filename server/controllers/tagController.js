const DUMMY_TAG_DATA = {
  upper_div: {
    id: 'upper_div',
    name: 'Upper Division Course',
  },
  ac: {
    id: 'ac',
    name: 'American Cultures',
  },
  rc_a: {
    id: 'rc_a',
    name: 'Reading and Composition Part A',
  },
  rc_b: {
    id: 'rc_b',
    name: 'Reading and Composition Part B',
  },
  ls_arts: {
    id: 'ls_arts',
    name: 'L&S Arts and Literature',
  },
  ls_bio: {
    id: 'ls_bio',
    name: 'L&S Biological Science',
  },
  ls_hist: {
    id: 'ls_hist',
    name: 'L&S Historical Studies',
  },
  ls_inter: {
    id: 'ls_inter',
    name: 'L&S International Studies',
  },
  ls_philo: {
    id: 'ls_philo',
    name: 'L&S Philosophy and Values',
  },
  ls_phys: {
    id: 'ls_phys',
    name: 'L&S Physical Science',
  },
  ls_socio: {
    id: 'ls_socio',
    name: 'L&S Social and Behavioral Sciences',
  },
  eecs_ethics: {
    id: 'eecs_ethics',
    name: 'EECS Ethics Course',
  },
  eecs_upper_div: {
    id: 'eecs_upper_div',
    name: 'EECS Upper Division Course',
  },
  linguis_elective: {
    id: 'linguis_elective',
    name: 'Linguistics Elective',
  },
};

exports.getTags = (req, res) => {
  res.json(DUMMY_TAG_DATA);
};
