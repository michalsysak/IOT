import axios from 'axios'

export const login = async (email, password) => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
    email,
    password
  })
  return res.data.token
}
