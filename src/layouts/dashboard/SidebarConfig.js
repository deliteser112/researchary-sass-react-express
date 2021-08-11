// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  papers: getIcon('ic_papers'),
  proposals: getIcon('ic_proposals'),
  teams: getIcon('ic_teams'),
  conferences: getIcon('ic_conferences'),
  journals: getIcon('ic_journals'),
  workshops: getIcon('ic_workshops'),
  dashboard: getIcon('ic_dashboard'),
  entities: getIcon('ic_entities')
};

const sidebarConfig = [
  // DASHBOARD
  // ----------------------------------------------------------------------
  {
    subheader: 'DASHBOARD',
    items: [
      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.analytics,
        icon: ICONS.dashboard
      }
    ]
  },
  // PUBLICATIONS
  // ----------------------------------------------------------------------
  {
    subheader: 'PUBLICATIONS',
    items: [
      {
        title: 'My Papers',
        path: PATH_DASHBOARD.papers.root,
        icon: ICONS.papers,
        children: [
          { title: 'Non-published', path: PATH_DASHBOARD.papers.overview, icon: ICONS.dashboard },
          { title: 'Published', path: PATH_DASHBOARD.papers.published, icon: ICONS.ecommerce },
          { title: 'Add Paper', path: PATH_DASHBOARD.papers.create, icon: ICONS.analytics }
        ]
      },
      {
        title: 'Conferences',
        path: PATH_DASHBOARD.conferences.root,
        icon: ICONS.conferences,
        children: [
          { title: 'Overview', path: PATH_DASHBOARD.conferences.overview, icon: ICONS.dashboard },
          { title: 'Add Conference', path: PATH_DASHBOARD.conferences.create, icon: ICONS.analytics }
        ]
      },
      {
        title: 'Journals',
        path: PATH_DASHBOARD.journals.root,
        icon: ICONS.journals,
        children: [
          { title: 'Overview', path: PATH_DASHBOARD.journals.overview, icon: ICONS.dashboard },
          { title: 'Add Journal', path: PATH_DASHBOARD.journals.add, icon: ICONS.analytics }
        ]
      },
      {
        title: 'Workshops',
        path: PATH_DASHBOARD.workshops.root,
        icon: ICONS.workshops,
        children: [
          { title: 'Overview', path: PATH_DASHBOARD.workshops.overview, icon: ICONS.dashboard },
          { title: 'Add Workshops', path: PATH_DASHBOARD.workshops.add, icon: ICONS.analytics }
        ]
      }
    ]
  },

  // FUNDING
  // ----------------------------------------------------------------------
  {
    subheader: 'FUNDING',
    items: [
      {
        title: 'My Proposals',
        path: PATH_DASHBOARD.proposals.root,
        icon: ICONS.proposals,
        children: [
          { title: 'Overview', path: PATH_DASHBOARD.proposals.overview, icon: ICONS.dashboard },
          { title: 'Add Proposal', path: PATH_DASHBOARD.proposals.add, icon: ICONS.analytics }
        ]
      },
      {
        title: 'Funding entities',
        path: PATH_DASHBOARD.entities.root,
        icon: ICONS.entities,
        children: [
          { title: 'Overview', path: PATH_DASHBOARD.entities.overview, icon: ICONS.dashboard },
          { title: 'Add funding entities', path: PATH_DASHBOARD.entities.add, icon: ICONS.analytics }
        ]
      }
    ]
  },

  // PEOPLE
  // ----------------------------------------------------------------------
  {
    subheader: 'PEOPLE',
    items: [
      {
        title: 'My Teams',
        path: PATH_DASHBOARD.teams.root,
        icon: ICONS.teams,
        children: [
          { title: 'Overview', path: PATH_DASHBOARD.teams.overview, icon: ICONS.dashboard },
          { title: 'Add Team', path: PATH_DASHBOARD.teams.create, icon: ICONS.analytics }
        ]
      },
      {
        title: 'My contacts',
        path: PATH_DASHBOARD.contacts.root,
        icon: ICONS.proposals,
        children: [
          { title: 'Overview', path: PATH_DASHBOARD.contacts.overview, icon: ICONS.dashboard },
          { title: 'Add Contact', path: PATH_DASHBOARD.contacts.add, icon: ICONS.analytics }
        ]
      }
    ]
  }
];

export default sidebarConfig;
