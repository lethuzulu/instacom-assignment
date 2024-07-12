import './App.css'
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Leads from './components/Leads'
import Header from './components/Header'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/signin',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: 'leads',
        element: <Leads />,
    },
])

function App() {
    return (
        <React.Fragment>
            <Header />
            <RouterProvider router={router} />
        </React.Fragment>
    )
}

export default App
