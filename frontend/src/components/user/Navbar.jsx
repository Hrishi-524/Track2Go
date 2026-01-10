import { useState, useEffect } from 'react'
import { getUser } from '@/api/user.api'
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input.jsx"

function Navbar({ userInfo, darkMode, setDarkMode }) {
  return (
    <nav className={`border-b ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-slate-800' : 'bg-slate-900'}`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Track2Go
              </span>
            </div>

            {/* Search */}
            <div className="hidden md:block">
              <Input
                placeholder="Search repositories..."
                className={`w-64 ${darkMode ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'}`}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </Button>

            <Button className={darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-900 hover:bg-slate-800'}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New
            </Button>

            {/* User Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
              {userInfo.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar