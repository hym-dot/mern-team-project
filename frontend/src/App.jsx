import React, { useState, useEffect } from "react";
import BucketForm from "./components/BucketForm";
import BucketList from "./components/BucketList";
import Header from "./components/Header";
import { api } from './lib/api';  // 인터셉터 포함 axios 인스턴스
import "./App.css";

const users = [
  { uid: "user1", name: "최선호" },
  { uid: "user2", name: "하다민" },
  { uid: "user3", name: "홍유민" },
];

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // 사용자 정보 로컬스토리지에서 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) {
      setSelectedUser(JSON.parse(savedUser));
    }
  }, []);

  // 사용자 선택 시 로컬스토리지에 저장
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  // 전체 데이터 불러오기 (axios api 사용)
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

  const onUpdate = (id, newText) => {
    api.patch(`/api/buckets/${id}/text`, { text: newText })
      .then(res => {
        const updatedBucket = res.data;
        if (!updatedBucket) {
          console.error("수정된 버킷 데이터가 없습니다.");
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
      <Header
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleUserSelect} 
      />
      <main>
        <BucketForm onCreate={onCreate} selectedUser={selectedUser} />
        <BucketList
          todos={filteredTodos}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      </main>
    </div>
  );
}

export default App;
