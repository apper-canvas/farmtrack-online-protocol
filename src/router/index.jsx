import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/organisms/Layout';

// Lazy load page components
const Dashboard = lazy(() => import('@/components/pages/Dashboard'));
const Tasks = lazy(() => import('@/components/pages/Tasks'));
const Crops = lazy(() => import('@/components/pages/Crops'));
const Expenses = lazy(() => import('@/components/pages/Expenses'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));

// Wrap lazy components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading.....</div>}>
    <Component />
  </Suspense>
);

// Main routes configuration
const mainRoutes = [
  {
    path: '',
    index: true,
    element: withSuspense(Dashboard)
  },
  {
    path: 'tasks',
    element: withSuspense(Tasks)
  },
  {
    path: 'crops',
    element: withSuspense(Crops)
  },
  {
    path: 'expenses',
    element: withSuspense(Expenses)
  },
  {
    path: '*',
    element: withSuspense(NotFound)
  }
];

// Router configuration
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);