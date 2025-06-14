import axios from 'axios'

export const login = async (username, password) => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
    username,
    password
  })
  return res.data.userId 
}
