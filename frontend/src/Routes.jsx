import React, { useEffect } from 'react'
import { useRoutes, useNavigate } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import Signup from './components/auth/Signup.jsx'
import Dashboard from './components/user/Dashboard.jsx'
import Profile from './components/user/Profile.jsx'
import { useAuth } from './authContext.jsx'

function Routes() {
    const [currentUser, setCurrentUser] = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        const userIdFromStorage = localStorage.getItem('userId')

        if(userIdFromStorage && !currentUser) {
            setCurrentUser(userIdFromStorage)
        }

        if(!userIdFromStorage && !['/login', '/signup'].includes(window.location.pathname)) {
            navigate('/login')
        }   

        if(userIdFromStorage && window.location.pathname === '/login') {
            navigate('/')
        }
    }, [currentUser, navigate, setCurrentUser])

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
        element: <Profile/>
    },]

    const router = useRoutes(routes)

    return router
}

export default Routes