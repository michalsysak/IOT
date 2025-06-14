import { useState, useEffect } from 'react'
import { getTodos, createTodo, deleteTodo } from '../services/todoService'

export default function TodoPage() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    getTodos().then(setTodos)
  }, [])

  const handleAdd = async () => {
    if (!newTodo.trim()) return
    const added = await createTodo(newTodo)
    setTodos(prev => [...prev, added])
    setNewTodo('')
  }

  const handleDelete = async (id) => {
    await deleteTodo(id)
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  return (
    <div>
      <h2>Your Todos</h2>
      <input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="New todo" />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => handleDelete(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
