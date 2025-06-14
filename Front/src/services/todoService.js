import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const getTodos = async () => {
  const res = await api.get('/todos')
  return res.data
}

export const createTodo = async (title) => {
  const res = await api.post('/todos', { title })
  return res.data
}

export const deleteTodo = async (id) => {
  await api.delete(`/todos/${id}`)
}
