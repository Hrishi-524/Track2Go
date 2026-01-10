import React, { useEffect } from 'react'
import { useRoutes, useNavigate } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import Signup from './components/auth/Signup.jsx'
import Dashboard from './components/user/Dashboard.jsx'
import Profile from './components/user/Profile.jsx'
import { useAuth } from './authContext.jsx'
import { Navigate } from 'react-router-dom'
import NewRepository from './components/user/NewRepository.jsx'
import RepositoryDetails from './components/repository/RepositoryDetails.jsx'

function App() {
    const ProtectedRoute = ({ children }) => {
        const { user } = useAuth()
        if (!user) return <Navigate to="/login" />
        return children
    }


    const routes = [{
        path: '/login',
        element: <Login/>
    },{
        path: '/signup',
        element: <Signup/>
    },{
        path: '/',
        element: <Dashboard/>
    },{
        path: '/profile',
        element: (<ProtectedRoute><Profile/></ProtectedRoute>)
    },{
        path: '/repo/new',
        element: (<ProtectedRoute><NewRepository/></ProtectedRoute>)
    }, {
        path: '/repository/:id',
        element: (<RepositoryDetails/>)
    }]

    const router = useRoutes(routes)

    return router
}

export default App
