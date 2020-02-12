const mongooseHost = require('../mongooseHost');

db = mongooseHost.db;
const Requirement = require('../models/requirement.model');

const DUMMY_REQUIREMENT_DATA = [
  {
    id: 'uc',
    name: 'University of California',
    parentId: null,
    type: 'unselectable',
    requirementCategories: [
      {
        id: 'uc',
        name: 'UC Requirements',
        type: 'unselectable',
        requirements: [
          {
            id: 'elwr',
            name: 'Entry-Level Writing',
          },
          {
            id: 'ah',
            name: 'American History',
          },
          {
            id: 'ai',
            name: 'American Instutions',
          },
        ],
      },
    ],
  },
  {
    id: 'ucb',
    name: 'UC Berkeley',
    parentId: 'uc',
    type: 'unselectable',
    requirementCategories: [
      {
        id: 'ac',
        name: 'American Cultures',
        requirements: [
          {
            type: 'tag',
            id: 'ac',
            name: 'American Cultures',
            tagId: 'ac',
          },
        ],
      },
    ],
  },
  {
    id: 'coe',
    name: 'College of Engineering',
    parentId: 'ucb',
    type: 'unselectable',
    requirementCategories: [
      {
        id: 'coe_hss',
        name: 'Humanities and Social Sciences',
        type: 'unselectable',
        requirements: [
          {
            type: 'mutex',
            name: 'CoE Humanities and Social Sciences',
            requirements: [
              {
                type: 'tag',
                id: 'coe_r1a',
                name: 'R&C Part A',
                tagId: 'rc_a',
              },
              {
                type: 'tag',
                id: 'coe_r1b',
                name: 'R&C Part B',
                tagId: 'rc_b',
              },
              {
                type: 'poly',
                id: 'coe_hss',
                name: 'H/SS',
                numRequired: 1,
                requirements: [
                  {
                    type: 'tag',
                    id: 'ls_arts',
                    name: 'Arts and Literature',
                    tagId: 'ls_arts',
                  },
                  {
                    type: 'tag',
                    id: 'ls_hist',
                    name: 'Historical Studies',
                    tagId: 'ls_hist',
                  },
                  {
                    type: 'tag',
                    id: 'ls_inter',
                    name: 'International Studies',
                    tagId: 'ls_inter',
                  },
                  {
                    type: 'tag',
                    id: 'ls_philo',
                    name: 'Philosophy and Values',
                    tagId: 'ls_philo',
                  },
                  {
                    type: 'tag',
                    id: 'ls_socio',
                    name: 'Social and Behavioral Science',
                    tagId: 'ls_socio',
                  },
                ],
              },
              {
                type: 'poly',
                id: 'coe_hss',
                name: 'H/SS',
                numRequired: 1,
                requirements: [
                  {
                    type: 'tag',
                    id: 'ls_arts',
                    name: 'Arts and Literature',
                    tagId: 'ls_arts',
                  },
                  {
                    type: 'tag',
                    id: 'ls_hist',
                    name: 'Historical Studies',
                    tagId: 'ls_hist',
                  },
                  {
                    type: 'tag',
                    id: 'ls_inter',
                    name: 'International Studies',
                    tagId: 'ls_inter',
                  },
                  {
                    type: 'tag',
                    id: 'ls_philo',
                    name: 'Philosophy and Values',
                    tagId: 'ls_philo',
                  },
                  {
                    type: 'tag',
                    id: 'ls_socio',
                    name: 'Social and Behavioral Science',
                    tagId: 'ls_socio',
                  },
                ],
              },
              {
                type: 'poly',
                id: 'coe_hss_upper_div',
                name: 'H/SS Upper Division',
                numRequired: 2,
                requirements: [
                  {
                    type: 'poly',
                    id: 'coe_hss',
                    name: 'H/SS',
                    numRequired: 1,
                    requirements: [
                      {
                        type: 'tag',
                        id: 'ls_arts',
                        name: 'Arts and Literature',
                        tagId: 'ls_arts',
                      },
                      {
                        type: 'tag',
                        id: 'ls_hist',
                        name: 'Historical Studies',
                        tagId: 'ls_hist',
                      },
                      {
                        type: 'tag',
                        id: 'ls_inter',
                        name: 'International Studies',
                        tagId: 'ls_inter',
                      },
                      {
                        type: 'tag',
                        id: 'ls_philo',
                        name: 'Philosophy and Values',
                        tagId: 'ls_philo',
                      },
                      {
                        type: 'tag',
                        id: 'ls_socio',
                        name: 'Social and Behavioral Science',
                        tagId: 'ls_socio',
                      },
                    ],
                  },
                  {
                    type: 'tag',
                    id: 'upper_div',
                    name: 'Upper Division Course',
                    tagId: 'upper_div',
                  },
                ],
              },
              {
                type: 'poly',
                id: 'coe_hss_upper_div',
                name: 'H/SS Upper Division',
                numRequired: 2,
                requirements: [
                  {
                    type: 'poly',
                    id: 'coe_hss',
                    name: 'H/SS',
                    numRequired: 1,
                    requirements: [
                      {
                        type: 'tag',
                        id: 'ls_arts',
                        name: 'Arts and Literature',
                        tagId: 'ls_arts',
                      },
                      {
                        type: 'tag',
                        id: 'ls_hist',
                        name: 'Historical Studies',
                        tagId: 'ls_hist',
                      },
                      {
                        type: 'tag',
                        id: 'ls_inter',
                        name: 'International Studies',
                        tagId: 'ls_inter',
                      },
                      {
                        type: 'tag',
                        id: 'ls_philo',
                        name: 'Philosophy and Values',
                        tagId: 'ls_philo',
                      },
                      {
                        type: 'tag',
                        id: 'ls_socio',
                        name: 'Social and Behavioral Science',
                        tagId: 'ls_socio',
                      },
                    ],
                  },
                  {
                    type: 'tag',
                    id: 'upper_div',
                    name: 'Upper Division Course',
                    tagId: 'upper_div',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ls',
    name: 'College of Letters and Sciences',
    parentId: 'ucb',
    type: 'unselectable',
    requirementCategories: [
      {
        id: 'ls_essential',
        name: 'Essential Skills',
        requirements: [
          {
            type: 'tag',
            id: 'ls_r1a',
            name: 'R&C Part A',
            tagId: 'rc_a',
          },
          {
            type: 'tag',
            id: 'ls_r1b',
            name: 'R&C Part B',
            tagId: 'rc_b',
          },
          {
            id: 'ls_quant',
            name: 'Quantitative Reasoning',
          },
          {
            id: 'ls_lang',
            name: 'Foreign Language',
          },
        ],
      },
      {
        id: 'ls_breadth',
        name: 'Breadth Requirements',
        requirements: [
          {
            type: 'mutex',
            id: 'ls_breadth',
            name: 'L&S Breadth Requirements',
            requirements: [
              {
                type: 'tag',
                id: 'ls_arts',
                name: 'Arts and Literature',
                tagId: 'ls_arts',
              },
              {
                type: 'tag',
                id: 'ls_bio',
                name: 'Biological Science',
                tagId: 'ls_bio',
              },
              {
                type: 'tag',
                id: 'ls_hist',
                name: 'Historical Studies',
                tagId: 'ls_hist',
              },
              {
                type: 'tag',
                id: 'ls_inter',
                name: 'International Studies',
                tagId: 'ls_inter',
              },
              {
                type: 'tag',
                id: 'ls_philo',
                name: 'Philosophy and Values',
                tagId: 'ls_philo',
              },
              {
                type: 'tag',
                id: 'ls_phys',
                name: 'Physical Science',
                tagId: 'ls_phys',
              },
              {
                type: 'tag',
                id: 'ls_socio',
                name: 'Social and Behavioral Science',
                tagId: 'ls_socio',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'eecs',
    name: 'EECS Major',
    parentId: 'coe',
    type: 'major',
    requirementCategories: [
      {
        id: 'eecs_math',
        name: 'Math',
        requirements: [
          {
            type: 'course',
            id: 'math1a',
            name: 'MATH 1A',
            courseId: 'math1a',
          },
          {
            type: 'course',
            id: 'math1b',
            name: 'MATH 1B',
            courseId: 'math1b',
          },
          {
            type: 'course',
            id: 'compsci70',
            name: 'COMPSCI 70',
            courseId: 'compsci70',
          },
        ],
      },
      {
        id: 'eecs_physics',
        name: 'Physics',
        requirements: [
          {
            type: 'multi',
            id: 'eecs_physics',
            name: 'EECS Physics',
            numRequired: 1,
            hidden: false,
            requirements: [
              {
                type: 'multi',
                id: 'eecs_physics7',
                name: 'EECS Physics 7A/B',
                numRequired: 2,
                hidden: false,
                requirements: [
                  {
                    type: 'course',
                    id: 'physics7a',
                    name: 'PHYSICS 7A',
                    courseId: 'physics7a',
                  },
                  {
                    type: 'course',
                    id: 'physics7b',
                    name: 'PHYSICS 7B',
                    courseId: 'physics7b',
                  },
                ],
              },
              {
                type: 'multi',
                id: 'eecs_physics5',
                name: 'EECS Physics 5A/B',
                numRequired: 2,
                hidden: false,
                requirements: [
                  {
                    type: 'course',
                    id: 'physics5a',
                    name: 'PHYSICS 5A',
                    courseId: 'physics5a',
                  },
                  {
                    type: 'course',
                    id: 'physics5b',
                    name: 'PHYSICS 5B',
                    courseId: 'physics5b',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'eecs_lower_div',
        name: 'Lower Division',
        requirements: [
          {
            type: 'multi',
            id: 'compsci61a47a',
            name: 'COMPSCI 61A',
            numRequired: 1,
            hidden: true,
            requirements: [
              {
                type: 'course',
                id: 'compsci61a',
                name: 'COMPSCI 61A',
                courseId: 'compsci61a',
              },
              {
                type: 'course',
                id: 'compsci47a',
                name: 'COMPSCI 47A',
                courseId: 'compsci47a',
              },
            ],
          },
          {
            type: 'multi',
            id: 'compsci61b47b',
            name: 'COMPSCI 61B',
            numRequired: 1,
            hidden: true,
            requirements: [
              {
                type: 'course',
                id: 'compsci61b',
                name: 'COMPSCI 61B',
                courseId: 'compsci61b',
              },
              {
                type: 'course',
                id: 'compsci47b',
                name: 'COMPSCI 47B',
                courseId: 'compsci47b',
              },
            ],
          },
          {
            type: 'multi',
            id: 'compsci61c47c',
            name: 'COMPSCI 61C',
            numRequired: 1,
            hidden: true,
            requirements: [
              {
                type: 'course',
                id: 'compsci61c',
                name: 'COMPSCI 61C',
                courseId: 'compsci61c',
              },
              {
                type: 'course',
                id: 'compsci47c',
                name: 'COMPSCI 47C',
                courseId: 'compsci47c',
              },
            ],
          },
          {
            type: 'course',
            id: 'eecs16a',
            name: 'EECS 16A',
            courseId: 'eecs16a',
          },
          {
            type: 'course',
            id: 'eecs16b',
            name: 'EECS 16B',
            courseId: 'eecs16b',
          },
        ],
      },
      {
        id: 'eecs_upper_div',
        name: 'Upper Division',
        requirements: [
          {
            type: 'unit',
            id: 'eecs_upper_div',
            name: 'Upper Division',
            units: 20,
            requirement: {
              type: 'tag',
              id: 'eecs_upper_div_course',
              name: 'EECS Upper Division Course',
              tagId: 'eecs_upper_div',
            },
          },
        ],
      },
      {
        id: 'eecs_ethics',
        name: 'Ethics',
        requirements: [
          {
            type: 'tag',
            id: 'eecs_ethics',
            name: 'EECS Ethics Course',
            tagId: 'eecs_ethics',
          },
        ],
      },
    ],
  },
  {
    id: 'linguis',
    name: 'Linguistics Major',
    parentId: 'ls',
    type: 'major',
    requirementCategories: [
      {
        id: 'linguis100',
        name: 'LINUIGS 100',
        requirements: [
          {
            type: 'course',
            id: 'linguis100',
            name: 'LINGUIS 100',
            courseId: 'linguis100',
          },
        ],
      },
      {
        id: 'linguis_core',
        name: 'Core',
        requirements: [
          {
            type: 'multi',
            id: 'linguis_core',
            name: 'Linguistics Core',
            numRequired: 4,
            requirements: [
              {
                type: 'course',
                id: 'linguis110',
                name: 'LINGUIS 110',
                courseId: 'linguis110',
              },
              {
                type: 'course',
                id: 'linguis111',
                name: 'LINGUIS 111',
                courseId: 'linguis111',
              },
              {
                type: 'course',
                id: 'linguis115',
                name: 'LINGUIS 115',
                courseId: 'linguis115',
              },
              {
                type: 'course',
                id: 'linguis120',
                name: 'LINGUIS 120',
                courseId: 'linguis120',
              },
              {
                type: 'course',
                id: 'linguis130',
                name: 'LINGUIS 130',
                courseId: 'linguis130',
              },
            ],
          },
        ],
      },
      {
        id: 'linguis_electives',
        name: 'Electives',
        requirements: [
          {
            type: 'unit',
            id: 'lingius_electives',
            name: 'Linguistics Electives',
            units: 10,
            requirement: {
              type: 'tag',
              id: 'linguis_elective',
              name: 'Linguistics Elective',
              tagId: 'linguis_elective',
            },
          },
        ],
      },
    ],
  },
];

initializeDBReqs = () => {
  DUMMY_REQUIREMENT_DATA.some((dataPoint) => {
    req = Requirement(dataPoint);
    req.save((err, course) => {
      if (err) {
        console.log(err.errmsg);
        return console.log('One of the requirements being saved is saved already! Aborting...');
      }
      console.log('Requirement saved successfully');
    });
    return false; // find a way to make this return true only when err.
  });
};

/**
queries mongo for any requirement models and calls successCallback on what is returned
@param successCallback a one-argument function which will be called when the query returns, assuming it is successful
*/
queryRequirements = (successCallback) => {
  return User.find().exec((err, requirementList) => {
    if (err) {
      console.log(err.errmsg);
    }
    successCallback(requirementList);
  });
};

exports.initializeDBReqs = initializeDBReqs;
exports.getRequirements = (req, res) => {
  queryRequirements((reqs) => res.json(reqs));
  // res.json(DUMMY_REQUIREMENT_DATA);
};
