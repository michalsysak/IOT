import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import TodoPage from './pages/TodoPage'

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) navigate('/todos')
  }, [])

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/todos" element={<TodoPage />} />
    </Routes>
  )
}
