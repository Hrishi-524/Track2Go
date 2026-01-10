import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button.jsx"
import { Alert, AlertDescription } from "@/components/ui/alert.jsx"
import { 
  Lock, 
  Globe, 
  Star, 
  GitFork, 
  Code, 
  AlertCircle as IssueIcon,
  Settings,
  AlertCircle,
  ChevronRight,
  File,
  Folder
} from 'lucide-react'

// Navbar Component (reusable)
function Navbar({ darkMode, setDarkMode, onBack }) {
  return (
    <nav className={`border-b ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
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
          </button>
        </div>
      </div>
    </nav>
  )
}

// Repository Header Component
function RepoHeader({ repo, darkMode, onToggleStar, isStarred }) {
  return (
    <div className={`border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{repo.owner?.username}/</span>
                {repo.name}
              </h1>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${
                repo.visibility === 'Public'
                  ? darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-slate-100 border-slate-300 text-slate-700'
                  : darkMode
                  ? 'bg-amber-950 border-amber-800 text-amber-400'
                  : 'bg-amber-50 border-amber-300 text-amber-700'
              }`}>
                {repo.visibility === 'Public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {repo.visibility}
              </span>
            </div>
            
            {repo.description && (
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {repo.description}
              </p>
            )}

            <div className="flex items-center gap-4 mt-4">
              <button className={`flex items-center gap-1 text-sm ${darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}>
                <Star className="w-4 h-4" />
                <span>0 stars</span>
              </button>
              <button className={`flex items-center gap-1 text-sm ${darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}>
                <GitFork className="w-4 h-4" />
                <span>0 forks</span>
              </button>
              <button className={`flex items-center gap-1 text-sm ${darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}>
                <IssueIcon className="w-4 h-4" />
                <span>{repo.issues?.length || 0} issues</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              onClick={onToggleStar}
              className={`${
                isStarred
                  ? darkMode
                    ? 'bg-amber-900 hover:bg-amber-800 text-amber-100'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                  : darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Star className="w-4 h-4 mr-2" />
              {isStarred ? 'Starred' : 'Star'}
            </Button>
            <Button className={darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-900 hover:bg-slate-800'}>
              Clone
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tab Navigation Component
function TabNavigation({ activeTab, setActiveTab, darkMode, issueCount }) {
  const tabs = [
    { id: 'code', label: 'Code', icon: Code },
    { id: 'issues', label: 'Issues', icon: IssueIcon, count: issueCount },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className={`border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'border-slate-500 text-white'
                      : 'border-slate-900 text-slate-900'
                    : darkMode
                    ? 'border-transparent text-slate-400 hover:text-slate-300'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                      : darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// File Browser Component
function FileBrowser({ files, darkMode }) {
  const [currentPath, setCurrentPath] = useState([])

  // Mock file structure (since backend doesn't provide this yet)
  const fileStructure = [
    { name: 'src', type: 'folder' },
    { name: 'README.md', type: 'file' },
    { name: 'package.json', type: 'file' },
    { name: '.gitignore', type: 'file' }
  ]

  return (
    <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
      {/* Breadcrumb */}
      <div className={`px-4 py-3 border-b flex items-center gap-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <Folder className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
        <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          {currentPath.length === 0 ? 'root' : currentPath.join(' / ')}
        </span>
      </div>

      {/* File List */}
      <div>
        {fileStructure.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-opacity-50 cursor-pointer ${
              darkMode
                ? 'border-slate-800 hover:bg-slate-800'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            {item.type === 'folder' ? (
              <Folder className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            ) : (
              <File className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
            )}
            <span className={`text-sm flex-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {item.name}
            </span>
            {item.type === 'folder' && (
              <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// README Viewer Component
function ReadmeViewer({ darkMode }) {
  return (
    <div className={`border rounded-lg p-6 mt-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        README.md
      </h2>
      <div className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none`}>
        <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
          No README file found. Add a README to help others understand your project.
        </p>
      </div>
    </div>
  )
}

// Settings Tab Component
function SettingsTab({ repo, darkMode, onUpdateRepo, onDeleteRepo }) {
  const [form, setForm] = useState({
    name: repo.name || '',
    description: repo.description || '',
    visibility: repo.visibility || 'Public'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await onUpdateRepo(form)
      setSuccess('Repository updated successfully')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update repository')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Update Repository */}
      <div className={`border rounded-lg p-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Repository Settings
        </h3>

        {error && (
          <Alert className={`mb-4 ${darkMode ? 'bg-red-950 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className={`mb-4 ${darkMode ? 'bg-green-950 border-green-800 text-green-400' : 'bg-green-50 border-green-200 text-green-800'}`}>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Repository Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-950 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Description
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-950 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Visibility
            </label>
            <select
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-950 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-900 hover:bg-slate-800'}
          >
            {loading ? 'Updating...' : 'Update Repository'}
          </Button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className={`border rounded-lg p-6 ${darkMode ? 'bg-red-950 border-red-900' : 'bg-red-50 border-red-200'}`}>
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-red-400' : 'text-red-900'}`}>
          Danger Zone
        </h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
          Once you delete a repository, there is no going back. Please be certain.
        </p>
        <Button
          onClick={onDeleteRepo}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Delete Repository
        </Button>
      </div>
    </div>
  )
}

// Main Repository Details Component
function RepositoryDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('code')
  const [repo, setRepo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isStarred, setIsStarred] = useState(false)

  useEffect(() => {
    async function fetchRepo() {
      try {
        const response = await axios.get(`/repo/${id}`)
        setRepo(response.data.data || response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load repository')
      } finally {
        setLoading(false)
      }
    }

    fetchRepo()
  }, [id])

  const handleToggleStar = () => {
    // TODO: Implement star/unstar API call
    setIsStarred(!isStarred)
  }

  const handleUpdateRepo = async (data) => {
    await axios.patch(`/repo/${id}`, data)
    setRepo({ ...repo, ...data })
  }

  const handleDeleteRepo = async () => {
    if (window.confirm('Are you sure you want to delete this repository? This action cannot be undone.')) {
      try {
        await axios.delete(`/repo/${id}`)
        navigate('/')
      } catch (err) {
        alert('Failed to delete repository')
      }
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Loading repository...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <Alert className={darkMode ? 'bg-red-950 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-800'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!repo) return null

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} onBack={() => navigate('/')} />
      <RepoHeader repo={repo} darkMode={darkMode} onToggleStar={handleToggleStar} isStarred={isStarred} />
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode}
        issueCount={repo.issues?.length || 0}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'code' && (
          <div>
            <FileBrowser files={repo.content || []} darkMode={darkMode} />
            <ReadmeViewer darkMode={darkMode} />
          </div>
        )}

        {activeTab === 'issues' && (
          <div className={`text-center py-12 border rounded-lg ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <IssueIcon className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              No issues yet
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Create an issue to track bugs, enhancements, or other requests
            </p>
            <Button
              onClick={() => navigate(`/repo/${id}/issues/new`)}
              className={darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-900 hover:bg-slate-800'}
            >
              New Issue
            </Button>
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            repo={repo}
            darkMode={darkMode}
            onUpdateRepo={handleUpdateRepo}
            onDeleteRepo={handleDeleteRepo}
          />
        )}
      </div>
    </div>
  )
}

export default RepositoryDetails