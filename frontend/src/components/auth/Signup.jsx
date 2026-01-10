import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Alert, AlertDescription } from "@/components/ui/alert.jsx"

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    const { email, username, password, confirmPassword } = form

    if (!email || !username || !password || !confirmPassword) {
      return setError("All fields are required")
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters")
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    try {
      setLoading(true)
      setError("")

        const response = await axios.post("/auth/signup", form)
        const { token, userId } = response.data.data

        localStorage.setItem("token", token)
        localStorage.setItem("userId", userId)
      navigate("/")

    } catch (err) {
        if (err.response) { 
            console.log(err.response) 
            // Backend responded with 4xx / 5xx 
            setError(err.response.data.message || 'Signup failed') 
        } else if (err.request) { 
            // Request made but no response (server down) 
            setError('Unable to reach server. Please try again.') 
        } else { 
            // Something else broke 
            setError('Something went wrong') 
        }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-4 right-4 p-2 rounded-lg hover:bg-opacity-80 transition-colors ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}
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

      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${darkMode ? 'bg-slate-800' : 'bg-slate-900'}`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className={`text-2xl font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Track2Go</h1>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Version control for modern teams</p>
        </div>

        {/* Main Card */}
        <div className={`rounded-lg border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          {/* Header */}
          <div className={`px-6 py-5 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Create your account
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Join Track2Go to start managing your projects
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <Alert className={darkMode ? 'bg-red-950 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-800'}>
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Username
                </label>
                <Input
                  name="username"
                  placeholder="Choose a username"
                  onChange={handleChange}
                  className={darkMode ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-slate-900'}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email address
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  className={darkMode ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-slate-900'}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    onChange={handleChange}
                    className={`pr-10 ${darkMode ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-slate-900'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Confirm password
                </label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    onChange={handleChange}
                    className={`pr-10 ${darkMode ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-slate-900'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className={`w-full font-medium mt-6 ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            {/* Footer */}
            <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <p className={`text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className={`font-medium hover:underline ${darkMode ? 'text-white' : 'text-slate-900'}`}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p className={`text-center text-xs mt-6 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
          By creating an account, you agree to our{" "}
          <a href="#" className={`hover:underline ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className={`hover:underline ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

export default Signup
