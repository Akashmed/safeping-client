import {
  createBrowserRouter,
} from "react-router-dom";
import Main from "../layout/Main";
import React from "react";
import Login from "../pages/login/Login.jsx";
import Signup from "../pages/signup/Signup.jsx";
import Home from "../pages/home/Home.jsx";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Home/>
      }
    ]
  },
  {
    path: 'signup',
    element: <Signup />
  },
  {
    path:'login',
    element: <Login/>
  }
]);