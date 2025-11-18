import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from '@/components/organisms/Layout'

// Lazy load page components
const Homepage = lazy(() => import('@/components/pages/Homepage'))

// Lazy load all page components
const Projects = lazy(() => import("@/components/pages/Projects"));
const Assets = lazy(() => import("@/components/pages/Assets"));
const Timeline = lazy(() => import("@/components/pages/Timeline"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Homepage />
      </Suspense>
    )
  },
  {
    path: "assets",
    path: "",
    index: true,
    element: <Suspense fallback={<LoadingFallback />}><Projects /></Suspense>
  },
  {
    path: "projects",
    element: <Suspense fallback={<LoadingFallback />}><Projects /></Suspense>
  },
  {
    path: "assets",
    element: <Suspense fallback={<LoadingFallback />}><Assets /></Suspense>
  },
  {
    path: "timeline",
    element: <Suspense fallback={<LoadingFallback />}><Timeline /></Suspense>
  },
  {
    path: "*",
    element: <Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);