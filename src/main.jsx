import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './route/Routes.jsx'
import { RouterProvider } from 'react-router-dom'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import AuthProvider from './provider/AuthProvider.jsx'


createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  </HelmetProvider>
)
