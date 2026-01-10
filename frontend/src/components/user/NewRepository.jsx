import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Alert, AlertDescription } from "@/components/ui/alert.jsx"
import { Lock, Globe, ArrowLeft, AlertCircle } from 'lucide-react'

function NewRepository() {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    visibility: 'Public'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name) {
      return setError('Repository name is required')
    }

    if (form.name.length < 3) {
      return setError('Repository name must be at least 3 characters')
    }

    // Validate repository name (only alphanumeric, hyphens, underscores)
    const nameRegex = /^[a-zA-Z0-9_-]+$/
    if (!nameRegex.test(form.name)) {
      return setError('Repository name can only contain letters, numbers, hyphens, and underscores')
    }

    try {
      setLoading(true)
      setError('')

      await axios.post('/repo', {
        name: form.name,
        description: form.description,
        visibility: form.visibility
      })

      // Navigate to dashboard or the new repository page
      navigate('/')

    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create repository'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Navbar */}
      <nav className={`border-b ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <ArrowLeft className="w-4 h-4" />
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

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Create a new repository
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            A repository contains all project files, including the revision history.
          </p>
        </div>

        <div className={`rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className={darkMode ? 'bg-red-950 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-800'}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Repository Name */}
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Repository name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  placeholder="awesome-project"
                  value={form.name}
                  onChange={handleChange}
                  className={darkMode ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-slate-900'}
                />
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  Great repository names are short and memorable. Need inspiration? How about{' '}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, name: `project-${Math.floor(Math.random() * 1000)}` })}
                    className={`font-medium ${darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    project-{Math.floor(Math.random() * 1000)}
                  </button>
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Description <span className={`text-xs font-normal ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>(optional)</span>
                </label>
                <Input
                  name="description"
                  placeholder="A brief description of your repository"
                  value={form.description}
                  onChange={handleChange}
                  className={darkMode ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-slate-900'}
                />
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <label className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Visibility
                </label>

                {/* Public Option */}
                <div
                  onClick={() => setForm({ ...form, visibility: 'Public' })}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    form.visibility === 'Public'
                      ? darkMode
                        ? 'border-slate-600 bg-slate-800'
                        : 'border-slate-400 bg-slate-50'
                      : darkMode
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        name="visibility"
                        value="Public"
                        checked={form.visibility === 'Public'}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          Public
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Anyone on the internet can see this repository. You choose who can commit.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Private Option */}
                <div
                  onClick={() => setForm({ ...form, visibility: 'Private' })}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    form.visibility === 'Private'
                      ? darkMode
                        ? 'border-slate-600 bg-slate-800'
                        : 'border-slate-400 bg-slate-50'
                      : darkMode
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        name="visibility"
                        value="Private"
                        checked={form.visibility === 'Private'}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          Private
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        You choose who can see and commit to this repository.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className={`border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}></div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => navigate('/')}
                  className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-900 hover:bg-slate-800'} text-white`}
                >
                  {loading ? 'Creating repository...' : 'Create repository'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Box */}
        <div className={`mt-6 p-4 rounded-lg border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-blue-50 border-blue-200'}`}>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-blue-900'}`}>
            💡 <strong>Tip:</strong> You can initialize this repository with files after creation.
          </p>
        </div>
      </main>
    </div>
  )
}

export default NewRepository