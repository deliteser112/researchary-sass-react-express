import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgCover, mockImgFeed, mockImgAvatar } from '../utils/mockImages';
//
import mock from './mock';

// ----------------------------------------------------------------------

const createId = (index) => `fc68bad5-d430-4033-b8f8-4bc069dc0ba0-${index}`;

// ----------------------------------------------------------------------

mock.onGet('/api/user/profile').reply(() => {
  const profile = {
    id: createId(1),
    cover: mockImgCover(1),
    position: 'UI Designer',
    follower: faker.datatype.number(),
    following: faker.datatype.number(),
    quote: 'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
    country: faker.address.country(),
    email: faker.internet.email(),
    company: faker.company.companyName(),
    school: faker.company.companyName(),
    role: 'Manager',
    facebookLink: `https://www.facebook.com/caitlyn.kerluke`,
    instagramLink: `https://www.instagram.com/caitlyn.kerluke`,
    linkedinLink: `https://www.linkedin.com/in/caitlyn.kerluke`,
    twitterLink: `https://www.twitter.com/caitlyn.kerluke`
  };

  return [200, { profile }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/all').reply(() => {
  const users = [...Array(24)].map((_, index) => {
    const setIndex = index + 1;
    return {
      id: createId(setIndex),
      avatarUrl: mockImgAvatar(setIndex),
      cover: mockImgCover(setIndex),
      name: faker.name.findName(),
      follower: faker.datatype.number(),
      following: faker.datatype.number(),
      totalPost: faker.datatype.number(),
      position: sample([
        'Leader',
        'Hr Manager',
        'UI Designer',
        'UX Designer',
        'UI/UX Designer',
        'Project Manager',
        'Backend Developer',
        'Full Stack Designer',
        'Front End Developer',
        'Full Stack Developer'
      ])
    };
  });

  return [200, { users }];
});

// ----------------------------------------------------------------------

const Names = [
  'Blockchain-based identity and authentication scheme for MQTT protocol',
  'DEV TEST',
  'Toward a Decentralised Identity and Verifiable Credentials Based Scalable and Decentralised Secret Management Solution',
  'Mrs. Desiree Senger Holly Denesik',
  'Julie Haag MD',
  'Mrs. Desiree Senger',
  'Gerardo Gutkowski Mrs. Desiree Senger Holly Denesik'
];

const Authors = [
  [
    { name: 'Remy Sharp', avatarURL: '/static/mock-images/avatars/avatar_1.jpg' },
    { name: 'Travis Howard', avatarURL: '/static/mock-images/avatars/avatar_4.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_6.jpg' },
    { name: 'Cindy Baker', avatarURL: '/static/mock-images/avatars/avatar_11.jpg' },
    { name: 'Trevor Henderson', avatarURL: '/static/mock-images/avatars/avatar_18.jpg' }
  ],
  [
    { name: 'Trevor Henderson', avatarURL: '/static/mock-images/avatars/avatar_13.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_18.jpg' }
  ],
  [
    { name: 'Trevor Henderson', avatarURL: '/static/mock-images/avatars/avatar_5.jpg' },
    { name: 'Travis Howard', avatarURL: '/static/mock-images/avatars/avatar_2.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_4.jpg' },
    { name: 'Cindy Baker', avatarURL: '/static/mock-images/avatars/avatar_1.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_18.jpg' }
  ],
  [
    { name: 'Cindy Baker', avatarURL: '/static/mock-images/avatars/avatar_7.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_18.jpg' }
  ],
  [{ name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_4.jpg' }],
  [
    { name: 'Trevor Henderson', avatarURL: '/static/mock-images/avatars/avatar_5.jpg' },
    { name: 'Travis Howard', avatarURL: '/static/mock-images/avatars/avatar_2.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_4.jpg' },
    { name: 'Cindy Baker', avatarURL: '/static/mock-images/avatars/avatar_1.jpg' },
    { name: 'Cindy Baker', avatarURL: '/static/mock-images/avatars/avatar_7.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_18.jpg' }
  ],
  [
    { name: 'Trevor Henderson', avatarURL: '/static/mock-images/avatars/avatar_5.jpg' },
    { name: 'Cindy Baker', avatarURL: '/static/mock-images/avatars/avatar_1.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_18.jpg' }
  ]
];

const PublishedAuthors = [
  [
    { name: 'Cindy Baker', avatarURL: '/static/mock-images/avatars/avatar_7.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_18.jpg' }
  ],
  [
    { name: 'Trevor Henderson', avatarURL: '/static/mock-images/avatars/avatar_5.jpg' },
    { name: 'Travis Howard', avatarURL: '/static/mock-images/avatars/avatar_2.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_4.jpg' },
    { name: 'Cindy Baker', avatarURL: '/static/mock-images/avatars/avatar_1.jpg' },
    { name: 'Cindy Baker', avatarURL: '/static/mock-images/avatars/avatar_7.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_18.jpg' }
  ],
  [
    { name: 'Trevor Henderson', avatarURL: '/static/mock-images/avatars/avatar_5.jpg' },
    { name: 'Cindy Baker', avatarURL: '/static/mock-images/avatars/avatar_1.jpg' },
    { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_18.jpg' }
  ]
];

const Targets = ['EVO*', 'ICBC', 'ICBC', 'MQW', 'NUSE', 'DESIRE', 'QWUA'];

const Dates = ['10 Apr 2021', '18 Dec 2020', '18 Dec 2020', '4 Apr 2021', '21 Oct 2020', '18 Dec 2020', '18 Dec 2020'];

const Attached = [0, 4, 5, 0, 3, 0, 3];
const View = [5, 4, 0, 0, 2, 1, 5];

const Tasks = ['Submit the paper', 'Complete evaluation section', 'Desiree Senger Holly Denesik'];

const CreatedBy = [
  { name: 'Agnes Walker', avatarURL: '/static/mock-images/avatars/avatar_6.jpg' },
  { name: 'Cindy Baker', avatarURL: '/static/mock-images/avatars/avatar_11.jpg' },
  { name: 'Trevor Henderson', avatarURL: '/static/mock-images/avatars/avatar_18.jpg' }
];

const AssignedBy = [
  { name: 'Remy Sharp', avatarURL: '/static/mock-images/avatars/avatar_1.jpg' },
  { name: 'Travis Howard', avatarURL: '/static/mock-images/avatars/avatar_4.jpg' },
  { name: 'Rugnes Holad', avatarURL: '/static/mock-images/avatars/avatar_13.jpg' }
];

mock.onGet('/api/user/manage-users').reply(() => {
  const users = [...Array(7)].map((_, index) => {
    const setIndex = index + 1;
    return {
      id: createId(setIndex),
      authors: Authors[index],
      title: Names[index],
      target: Targets[index],
      date: Dates[index],
      attached: Attached[index],
      view: View[index],
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      country: faker.address.country(),
      state: faker.address.state(),
      city: faker.address.city(),
      zipCode: faker.address.zipCodeByState(),
      company: faker.company.companyName(),
      isVerified: faker.datatype.boolean(),
      status: sample(['accepted', 'in progress']),
      role: sample([
        'Leader',
        'Hr Manager',
        'UI Designer',
        'UX Designer',
        'UI/UX Designer',
        'Project Manager',
        'Backend Developer',
        'Full Stack Designer',
        'Front End Developer',
        'Full Stack Developer'
      ])
    };
  });

  return [200, { users }];
});

mock.onGet('/api/user/manage-tasks').reply(() => {
  const tasks = [...Array(3)].map((_, index) => {
    const setIndex = index + 1;
    return {
      id: createId(setIndex),
      title: Tasks[index],
      date: Dates[index],
      createdby: CreatedBy[index],
      assignedby: AssignedBy[index],
      status: sample(['accepted', 'in progress'])
    };
  });

  return [200, { tasks }];
});

mock.onGet('/api/user/manage-published').reply(() => {
  const published = [...Array(2)].map((_, index) => {
    const setIndex = index + 1;
    return {
      id: createId(setIndex),
      authors: PublishedAuthors[index],
      title: Names[index],
      target: Targets[index],
      date: Dates[index],
      attached: Attached[index],
      view: View[index],
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      country: faker.address.country(),
      state: faker.address.state(),
      city: faker.address.city(),
      zipCode: faker.address.zipCodeByState(),
      company: faker.company.companyName(),
      isVerified: faker.datatype.boolean(),
      status: sample(['published']),
      role: sample([
        'Leader',
        'Hr Manager',
        'UI Designer',
        'UX Designer',
        'UI/UX Designer',
        'Project Manager',
        'Backend Developer',
        'Full Stack Designer',
        'Front End Developer',
        'Full Stack Developer'
      ])
    };
  });

  return [200, { published }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/social/followers').reply(() => {
  const followers = [...Array(18)].map((_, index) => {
    const setIndex = index + 2;
    return {
      id: createId(setIndex),
      avatarUrl: mockImgAvatar(setIndex),
      name: faker.name.findName(),
      country: faker.address.country(),
      isFollowed: faker.datatype.boolean()
    };
  });

  return [200, { followers }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/social/friends').reply(() => {
  const friends = [...Array(18)].map((_, index) => {
    const setIndex = index + 2;
    return {
      id: createId(setIndex),
      avatarUrl: mockImgAvatar(setIndex),
      name: faker.name.findName(),
      role: sample([
        'Leader',
        'Hr Manager',
        'UI Designer',
        'UX Designer',
        'UI/UX Designer',
        'Project Manager',
        'Backend Developer',
        'Full Stack Designer',
        'Front End Developer',
        'Full Stack Developer'
      ])
    };
  });

  return [200, { friends }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/social/gallery').reply(() => {
  const gallery = [...Array(18)].map((_, index) => {
    const setIndex = index + 2;
    return {
      id: createId(setIndex),
      title: faker.name.title(),
      postAt: faker.date.past(),
      imageUrl: mockImgCover(setIndex)
    };
  });

  return [200, { gallery }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/account/cards').reply(() => {
  const cards = [...Array(2)].map((_, index) => ({
    id: faker.datatype.uuid(),
    cardNumber: (index === 0 && '**** **** **** 1234') || (index === 1 && '**** **** **** 5678'),
    cardType: (index === 0 && 'master_card') || (index === 1 && 'visa')
  }));

  return [200, { cards }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/account/address-book').reply(() => {
  const addressBook = [...Array(4)].map(() => ({
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber(),
    country: faker.address.country(),
    state: faker.address.state(),
    city: faker.address.city(),
    street: faker.address.streetAddress(),
    zipCode: faker.address.zipCode()
  }));

  return [200, { addressBook }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/account/invoices').reply(() => {
  const invoices = [...Array(10)].map(() => ({
    id: faker.datatype.uuid(),
    createdAt: faker.date.past(),
    price: faker.datatype.number({ min: 4, max: 99, precision: 0.01 })
  }));

  return [200, { invoices }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/account/notifications-settings').reply(() => {
  const notifications = {
    activityComments: true,
    activityAnswers: true,
    activityFollows: false,
    applicationNews: true,
    applicationProduct: false,
    applicationBlog: false
  };

  return [200, { notifications }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/posts').reply(() => {
  const posts = [...Array(3)].map((_, index) => {
    const setIndex = index + 1;
    return {
      id: faker.datatype.uuid(),
      author: {
        id: createId(1),
        avatarUrl: mockImgAvatar(1),
        name: 'Caitlyn Kerluke'
      },
      isLiked: true,
      createdAt: faker.date.past(),
      media: mockImgFeed(setIndex),
      message: faker.lorem.sentence(),
      personLikes: [...Array(50)].map((_, index) => ({
        name: faker.name.findName(),
        avatarUrl: mockImgAvatar(index + 2)
      })),
      comments: (setIndex === 2 && []) || [
        {
          id: faker.datatype.uuid(),
          author: {
            id: createId(2),
            avatarUrl: mockImgAvatar(sample([2, 3, 4, 5, 6])),
            name: faker.name.findName()
          },
          createdAt: faker.date.past(),
          message: faker.lorem.sentence()
        },
        {
          id: faker.datatype.uuid(),
          author: {
            id: createId(3),
            avatarUrl: mockImgAvatar(sample([7, 8, 9, 10, 11])),
            name: faker.name.findName()
          },
          createdAt: faker.date.past(),
          message: faker.lorem.sentence()
        }
      ]
    };
  });

  return [200, { posts }];
});
