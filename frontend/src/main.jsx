import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider, useAuth } from './authContext.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import setupAxiosInterceptors from './utils/setUpAxiosInterceptors.js'

setupAxiosInterceptors()
createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <Router>
            <App />
        </Router>
    </AuthProvider>
)
