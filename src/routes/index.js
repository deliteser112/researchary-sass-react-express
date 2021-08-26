/* eslint-disable react-hooks/rules-of-hooks */
import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> }
      ]
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: '/',
          element: <Navigate to="/dashboard/analytics" replace />
        },
        { path: '/analytics', element: <Dashboard /> },
        {
          path: 'papers',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/papers/overview" replace />
            },
            { path: 'overview', element: <PaperOverview /> },
            { path: 'published', element: <PaperPublished /> },
            { path: 'create', element: <PaperCreate /> },
            {
              path: '/:paperId/edit',
              element: (
                <RoleBasedGuard>
                  <PaperCreate />
                </RoleBasedGuard>
              )
            },
            { path: '/:paperId/detail', element: <PaperDetail /> }
          ]
        },
        {
          path: 'proposals',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/proposals/overview" replace />
            },
            { path: 'overview', element: <Maintenance /> },
            { path: 'add', element: <Maintenance /> }
          ]
        },
        {
          path: 'teams',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/teams/overview" replace />
            },
            { path: 'overview', element: <TeamOverview /> },
            { path: 'create', element: <TeamCreate /> },
            { path: '/:teamId/edit', element: <TeamCreate /> }
          ]
        },
        {
          path: 'conferences',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/conferences/overview" replace />
            },
            { path: 'overview', element: <ConferenceOverview /> },
            { path: 'create', element: <ConferenceCreate /> },
            { path: '/:confId/edit', element: <ConferenceCreate /> }
          ]
        },
        {
          path: 'journals',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/journals/overview" replace />
            },
            { path: 'overview', element: <JournalsOverview /> },
            { path: 'add', element: <JournalsAdd /> }
          ]
        },
        {
          path: 'workshops',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/workshops/overview" replace />
            },
            { path: 'overview', element: <Maintenance /> },
            { path: 'add', element: <Maintenance /> }
          ]
        },
        {
          path: 'funding-entities',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/funding-entities/overview" replace />
            },
            { path: 'overview', element: <Maintenance /> },
            { path: 'add', element: <Maintenance /> }
          ]
        },
        {
          path: 'contacts',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/contacts/overview" replace />
            },
            { path: 'overview', element: <Maintenance /> },
            { path: 'add', element: <Maintenance /> }
          ]
        }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [{ path: '/', element: <LandingPage /> }]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS
// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));
// Dashboard
const Dashboard = Loadable(lazy(() => import('../pages/Dashboard')));
const PaperOverview = Loadable(lazy(() => import('../pages/PaperOverview')));
const PaperPublished = Loadable(lazy(() => import('../pages/PaperPublished')));
const PaperCreate = Loadable(lazy(() => import('../pages/PaperCreate')));
const PaperDetail = Loadable(lazy(() => import('../pages/PaperDetail')));

const TeamCreate = Loadable(lazy(() => import('../pages/TeamCreate')));
const TeamOverview = Loadable(lazy(() => import('../pages/TeamOverview')));
// const ProposalsOverview = Loadable(lazy(() => import('../pages/ProposalOverview')));
// const ProposalAdd = Loadable(lazy(() => import('../pages/ProposalAdd')));
const ConferenceOverview = Loadable(lazy(() => import('../pages/ConferenceOverview')));
const ConferenceCreate = Loadable(lazy(() => import('../pages/ConferenceCreate')));
const JournalsOverview = Loadable(lazy(() => import('../pages/JournalsOverview')));
const JournalsAdd = Loadable(lazy(() => import('../pages/JournalsAdd')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
// Main
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
