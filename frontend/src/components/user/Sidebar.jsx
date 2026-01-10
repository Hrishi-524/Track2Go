import { useState, useEffect } from 'react'
import { getUser } from '@/api/user.api'
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input.jsx"

function Sidebar({ activeTab, setActiveTab, darkMode, repositoryCount, starredCount, followingCount }) {
  const tabs = [
    { id: 'repositories', label: 'Repositories', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', count: repositoryCount },
    { id: 'starred', label: 'Starred', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', count: starredCount },
    { id: 'following', label: 'Following', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', count: followingCount }
  ]

  return (
    <aside className={`w-64 border-r min-h-screen p-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <nav className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? darkMode
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-900'
                : darkMode
                ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === tab.id
                ? darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                : darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar