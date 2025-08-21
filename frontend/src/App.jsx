import { useState, useEffect } from "react"
import axios from "axios"
import "./App.css"
import Header from "./components/Header"
import BucketForm from "./components/BucketForm"
import BucketList from "./components/BucketList"

function App() {
  const [todos, setTodos] = useState([])
  const API = `${import.meta.env.VITE_API_URL}/api/buckets`

  // 📌 데이터 불러오기
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(API)
        const data = Array.isArray(res.data) ? res.data : res.data.todos ?? []
        setTodos(data)
      } catch (error) {
        console.error("가져오기 실패", error)
      }
    }
    fetchTodos()
  }, [])

  // 📌 추가
  const onCreate = async (todoText) => {
    if (!todoText.trim()) return
    try {
      const res = await axios.post(API, { text: todoText.trim() })
      const created = res.data?.todo ?? res.data
      setTodos((prev) => [created, ...prev])
    } catch (error) {
      console.error("추가 실패", error)
    }
  }

  // 📌 삭제
  const onDelete = async (id) => {
    try {
      if (!confirm("정말 삭제할까요?")) return
      const { data } = await axios.delete(`${API}/${id}`)
      const deletedId = data?.deletedId ?? id
      setTodos((prev) => prev.filter((t) => t._id !== deletedId))
    } catch (error) {
      console.error("삭제 실패", error)
    }
  }

  // 📌 수정
  const onUpdate = async (id, newText) => {
    if (!newText.trim()) return
    try {
      const { data } = await axios.put(`${API}/${id}`, { text: newText.trim() })
      const updated = data?.todo ?? data
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, ...updated } : t))
      )
    } catch (error) {
      console.error("수정 실패", error)
    }
  }

  return (
    <div className="App">
      <Header />
      <BucketForm onCreate={onCreate} />
      <BucketList todos={todos} onDelete={onDelete} onUpdate={onUpdate} />
    </div>
  )
}

export default App
