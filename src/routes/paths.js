// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_AUTH = '/auth';
// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  analytics: path(ROOTS_DASHBOARD, '/analytics'),
  papers: {
    root: path(ROOTS_DASHBOARD, '/papers'),
    overview: path(ROOTS_DASHBOARD, '/papers/overview'),
    published: path(ROOTS_DASHBOARD, '/papers/published'),
    create: path(ROOTS_DASHBOARD, '/papers/create'),
    detail: path(ROOTS_DASHBOARD, '/papers/detail')
  },
  proposals: {
    root: path(ROOTS_DASHBOARD, '/proposals'),
    overview: path(ROOTS_DASHBOARD, '/proposals/overview'),
    add: path(ROOTS_DASHBOARD, '/proposals/add')
  },
  teams: {
    root: path(ROOTS_DASHBOARD, '/teams'),
    overview: path(ROOTS_DASHBOARD, '/teams/overview'),
    create: path(ROOTS_DASHBOARD, '/teams/create')
  },
  conferences: {
    root: path(ROOTS_DASHBOARD, '/conferences'),
    overview: path(ROOTS_DASHBOARD, '/conferences/overview'),
    create: path(ROOTS_DASHBOARD, '/conferences/create')
  },
  journals: {
    root: path(ROOTS_DASHBOARD, '/journals'),
    overview: path(ROOTS_DASHBOARD, '/journals/overview'),
    add: path(ROOTS_DASHBOARD, '/journals/add')
  },
  workshops: {
    root: path(ROOTS_DASHBOARD, '/workshops'),
    overview: path(ROOTS_DASHBOARD, '/workshops/overview'),
    add: path(ROOTS_DASHBOARD, '/workshops/add')
  },
  entities: {
    root: path(ROOTS_DASHBOARD, '/funding-entities'),
    overview: path(ROOTS_DASHBOARD, '/funding-entities/overview'),
    add: path(ROOTS_DASHBOARD, '/funding-entities/add')
  },
  contacts: {
    root: path(ROOTS_DASHBOARD, '/contacts'),
    overview: path(ROOTS_DASHBOARD, '/contacts/overview'),
    add: path(ROOTS_DASHBOARD, '/contacts/add')
  }
};

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};
