import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userId = await login(username, password)
      console.log("Zalogowano! userId:", userId)
      localStorage.setItem('userId', userId)
      navigate('/todos')
    } catch (error) {
      console.error("Błąd logowania:", error)
      alert('Logowanie nie powiodło się')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Log in</button>
    </form>
  )
}
