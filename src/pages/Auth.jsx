import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

import '../styles/auth.css'

export default function Auth() {
  const { user } = useUser()
  const navigate = useNavigate()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Live password validation feedback
  const [passwordError, setPasswordError] = useState('')

  // If user is already logged in, redirect from /login to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  // Email validation with simple regex
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email)

  // Password strength rules
  const isPasswordStrong = (pw) => {
    const minLength = /.{8,}/
    const upper = /[A-Z]/
    const lower = /[a-z]/
    const number = /[0-9]/
    const special = /[^A-Za-z0-9]/
    return (
      minLength.test(pw) &&
      upper.test(pw) &&
      lower.test(pw) &&
      number.test(pw) &&
      special.test(pw)
    )
  }

  // Live password strength validation (for signup)
  useEffect(() => {
    if (isSignUp && password.length > 0) {
      setPasswordError(
        isPasswordStrong(password)
          ? ''
          : 'weak'
      )
    } else {
      setPasswordError('')
    }
  }, [password, isSignUp])

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Always validate email format
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address.')
      return
    }

    // Only validate password strength when signing up
    if (isSignUp && !isPasswordStrong(password)) {
      setError('Password must be stronger (see requirements).')
      return
    }

    setLoading(true)

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Handle common Supabase auth messages cleanly
      const msg = error.message.toLowerCase()

      if (msg.includes('invalid login credentials')) {
        setError('Invalid email or password.')
      } else if (msg.includes('user not found')) {
        setError('No account found for this email.')
      } else if (msg.includes('email not confirmed')) {
        setError('Please confirm your email before logging in.')
      } else {
        setError(error.message)
      }
    } else {
      if (isSignUp) {
        setError('Check your email to confirm your account before logging in.')
      } else {
        navigate('/dashboard')
      }
    }

    setLoading(false)
  }


  return (
    <div className="container">
      <div className="auth-container">
        <h2 className="auth-title">{isSignUp ? 'Sign Up' : 'Log In'}</h2>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email" className="auth-label">Email</label>
          <input
            id="email"
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="auth-label">Password</label>
          <input
            id="password"
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Password requirement block */}
          {isSignUp && passwordError === 'weak' && (
            <div className="password-requirements">
              <p className="password-requirements-title">Password must include:</p>
              <ul className="password-requirements-list">
                <li>At least 8 characters</li>
                <li>One uppercase letter (A–Z)</li>
                <li>One lowercase letter (a–z)</li>
                <li>One number (0–9)</li>
                <li>One special character (e.g. !@#$%)</li>
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Login'}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <button
          className="auth-toggle"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setEmail('')
            setPassword('')
            setError(null)
            setPasswordError('')
          }}
        >
          {isSignUp ? 'Already have an account?' : 'Create a new account'}
        </button>
      </div>
    </div>
  )
}
