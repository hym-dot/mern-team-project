import React, { useState, useEffect } from "react";
import BucketForm from "./components/BucketForm";
import BucketList from "./components/BucketList";
import Header from "./components/Header";
import { api } from './lib/api';
import "./App.css";

const users = [
  { uid: "user1", name: "최선호" },
  { uid: "user2", name: "하다민" },
  { uid: "user3", name: "홍유민" },
];

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) {
      setSelectedUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  useEffect(() => {
    api.get('/api/buckets')
      .then(res => setTodos(res.data))
      .catch(err => console.error("데이터 불러오기 실패:", err));
  }, []);

  const onCreate = (text) => {
    if (!selectedUser) return;

    const newBucket = {
      name: selectedUser.name,
      goal: text,
      text,
      uid: selectedUser.uid,
      isCompleted: false,
    };

    api.post('/api/buckets', newBucket)
      .then(res => {
        const data = res.data;
        if (!data.uid) data.uid = selectedUser.uid;
        setTodos(prev => [data, ...prev]);
      })
      .catch(err => console.error("버킷 생성 실패:", err));
  };

  const onDelete = (id) => {
    api.delete(`/api/buckets/${id}`)
      .then(() => setTodos(prev => prev.filter(t => t._id !== id)))
      .catch(err => console.error("삭제 실패:", err));
  };

  // ** 여기 핵심 수정 **
  const onUpdate = (id, newText) => {
    api.patch(`/api/buckets/${id}/text`, { text: newText })
      .then(res => {
        const updatedBucket = res.data.bucket;
        if (!updatedBucket) {
          console.error("수정된 데이터가 없습니다!", res.data);
          return;
        }
        setTodos(prev => prev.map(t => (t._id === id ? updatedBucket : t)));
      })
      .catch(err => console.error("수정 실패:", err));
  };

  const filteredTodos = selectedUser
    ? todos.filter(t => t.uid === selectedUser.uid)
    : [];

  return (
    <div className="App">
      <Header users={users} selectedUser={selectedUser} onSelectUser={handleUserSelect} />
      <main>
        <BucketForm onCreate={onCreate} selectedUser={selectedUser} />
        <BucketList todos={filteredTodos} onDelete={onDelete} onUpdate={onUpdate} />
      </main>
    </div>
  );
}

export default App;
