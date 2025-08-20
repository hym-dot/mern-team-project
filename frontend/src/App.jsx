import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'
import Header from './components/Header'
import BucketForm from './components/BucketForm'
import BucketList from './components/BucketList'

function App() {

  const [buckets, setBuckets] = useState([])
  const API = `${import.meta.env.VITE_API_URL}/api/buckets`

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const res = await axios.get(API)
        const data = Array.isArray(res.data) ?
          res.data : res.data.buckets ?? []

        setBuckets(data)
        console.log(data)

      } catch (error) {
        console.log("가져오기 실패", error)
      }
    }
    fetchBuckets()
  }, [])


  const onCreate = async (bucketText) => {
    if (!bucketText.trim()) return

    try {
      const res = await axios.post(API, { text: bucketText.trim() })

      const created = res.data?.bucket ?? res.data

      if (Array.isArray(res.data?.buckets)) {
        setBuckets(res.data.buckets)
      } else {
        setBuckets(prev => [created, ...prev])
      }

    } catch (error) {
      console.log("추가 실패", error)
    }
  }

  const onDelete = async (id) => {
    try {
      if (!confirm("정말 삭제할까요?")) return

      const { data } = await axios.delete(`${API}/${id}`)

      if (Array.isArray(data?.buckets)) {
        setBuckets(data.buckets)
        return
      }

      const deletedId = data?.deletedId ?? data?.bucket?._id ?? data?._id ?? id
      setBuckets((prev) => prev.filter((t) => t._id !== deletedId))
    } catch (error) {
      console.error("삭제 실패", error)
    }
  }

  return (
    <div className='App'>
      <Header />
      <BucketForm onCreate={onCreate}/>
      <BucketList buckets={buckets} onDelete={onDelete}/>
    </div>
  )
}

export default App
