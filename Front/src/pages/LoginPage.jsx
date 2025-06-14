import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

const handleLogin = async (e) => {
  e.preventDefault()
  try {
    const token = await login(email, password)
    console.log("Zalogowano! Token:", token)
    localStorage.setItem('token', token)
    navigate('/todos')
  } catch (error) {
    console.error("Błąd logowania:", error)
    alert('Logowanie nie powiodło się')
  }
}

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Log in</button>
    </form>
  )
}
