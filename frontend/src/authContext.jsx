import React from "react";
import { Children } from "react";
import { createContext, useState, useEffect, useContext } from "react";

//context is such a piece of data that is avialable throughout the app

const authContext = createContext(null)

export const useAuth = () => {
    return useContext(authContext)
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userId = localStorage.getItem("userId")
        if (userId) setUser(userId)
    }, [])

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        setUser(null)
    }

    return (
        <authContext.Provider value={{ user, setUser, logout }}>
        {children}
        </authContext.Provider>
    )
}
