// packages
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom"

// components
import RootLayout from "./Layouts/RootLayout"
import LoadingScreen from "./Components/General/LoadingScreen/LoadingScreen"

// lazy components
const Page404 = React.lazy(() => import("./Pages/Page404"))
const PageLanding = React.lazy(() => import("./Pages/PageLanding"));
const PageGame = React.lazy(() => import("./Pages/PageGame"));
const PageOver = React.lazy(() => import("./Pages/PageOver"));

// styles
import './index.css'


const router = createBrowserRouter(
  createRoutesFromElements(<>
    <Route path="*" element={<React.Suspense fallback={<LoadingScreen text="..." />}><Page404 /></React.Suspense>} />
    <Route path="/" element={<RootLayout />}>
      <Route path="/" element={<React.Suspense fallback={<LoadingScreen text="Landing Page" />}><PageLanding /></React.Suspense>} />
      <Route path="game" element={<React.Suspense fallback={<LoadingScreen text="Game Page" />}><PageGame /></React.Suspense>} />
      <Route path="over" element={<React.Suspense fallback={<LoadingScreen text="Gameover Page" />}><PageOver /></React.Suspense>} />
    </Route>
  </>)
);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
