import { useState, useEffect } from 'react'
import { getUser } from '@/api/user.api'
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input.jsx"

function RepositoryCard({ repo, username, darkMode }) {
  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <svg className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{username}/</span>
              {repo.name}
            </h3>
          </div>
          {repo.description && (
            <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {repo.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3">
            {repo.language && (
              <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                {repo.language}
              </span>
            )}
            <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              Updated {new Date(repo.updatedAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

export default RepositoryCard