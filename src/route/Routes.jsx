import {
  createBrowserRouter,
} from "react-router-dom";
import Main from "../layout/Main";
import React from "react";
import Login from "../pages/login/Login.jsx";
import Signup from "../pages/signup/Signup.jsx";
import Home from "../pages/home/Home.jsx";
import ErrorPage from "../components/ErrorPage.jsx";
import UserDashboard from "../pages/userDashboard/UserDashboard.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import PlaceDetailPage from "../pages/PlaceDetailPage.jsx";
import HelpPage from "../pages/help/HelpPage.jsx";
import RequestsPage from "../pages/institution/RequestsPage.jsx";
import LiveTrackingPage from "../pages/tracking/LiveTrackingPage.jsx";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      }
    ]
  },
  {
    path: 'signup',
    element: <Signup />
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: 'user-dashboard',
    element: <PrivateRoute><UserDashboard /></PrivateRoute>
  },
  {
    path: "place/:placeId",
    element: <PlaceDetailPage />
  },
  {
    path: 'help/:placeId',
    element: <HelpPage />
  },
  {
    path: 'requests/:placeId',
    element: <PrivateRoute><RequestsPage /></PrivateRoute>
  },
  {
    path: '/track/:sessionId/:senderType', // senderType: 'user' or 'officer'
    element: <PrivateRoute><LiveTrackingPage /></PrivateRoute>
  }
]);