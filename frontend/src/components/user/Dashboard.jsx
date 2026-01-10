import { getUser } from '@/api/user.api'
import axios, { all } from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input.jsx"
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import RepositoryCard from './RepositoryCard.jsx'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [repositories, setRepositories] = useState([])
  const [userInfo, setUserInfo] = useState({})
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('repositories')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await getUser()
        console.log('Successfully fetched user data for dashboard:', response)
        setUserInfo(response)
        setRepositories(response.repositories || [])
      } catch (error) {
        console.error('Error fetching user info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  const getDisplayData = () => {
    switch (activeTab) {
      case 'repositories':
        return repositories
      case 'starred':
        return userInfo.staredRepositories || []
      case 'following':
        return userInfo.followedUsers || []
      default:
        return []
    }
  }

  const displayData = getDisplayData()

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <Navbar userInfo={userInfo} darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          darkMode={darkMode}
          repositoryCount={repositories.length}
          starredCount={userInfo.staredRepositories?.length || 0}
          followingCount={userInfo.followedUsers?.length || 0}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {activeTab === 'repositories' && 'Your Repositories'}
                  {activeTab === 'starred' && 'Starred Repositories'}
                  {activeTab === 'following' && 'Following'}
                </h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {displayData.length} {activeTab === 'following' ? 'users' : 'repositories'}
                </p>
              </div>
              {activeTab === 'repositories' && (
                <Button className={darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-900 hover:bg-slate-800'} onClick={() => navigate('/repo/new')}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Repository
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4">
              {displayData.length === 0 ? (
                <div className={`text-center py-12 border rounded-lg ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <svg className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    No {activeTab === 'following' ? 'users' : 'repositories'} yet
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {activeTab === 'repositories' && 'Create your first repository to get started'}
                    {activeTab === 'starred' && 'Star repositories to keep track of projects you find interesting'}
                    {activeTab === 'following' && 'Follow users to see their activity'}
                  </p>
                </div>
              ) : activeTab === 'following' ? (
                // Following users list
                displayData.map((user) => (
                  <div key={user._id} className={`border rounded-lg p-4 flex items-center justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {user.username}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                      Following
                    </Button>
                  </div>
                ))
              ) : (
                // Repositories list
                displayData.map((repo) => (
                  <RepositoryCard 
                    key={repo._id} 
                    repo={repo} 
                    username={activeTab === 'starred' ? repo.owner?.username : userInfo.username}
                    darkMode={darkMode}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard