import React, { useState, useEffect } from 'react';
import BucketForm from './components/BucketForm';
import BucketList from './components/BucketList';
import Header from './components/Header';
import './App.css';

const users = [
  { uid: 'user1', name: '최선호' },
  { uid: 'user2', name: '하다민' },
  { uid: 'user3', name: '홍유민' },
];

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // 백엔드에서 데이터 가져오기
  useEffect(() => {
    fetch('http://localhost:3000/api/buckets')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  // 새로운 버킷 생성
  const onCreate = (text) => {
    if (!selectedUser) {
      alert('사용자를 먼저 선택해주세요.');
      return;
    }
    const newBucket = {
      name: selectedUser.name, // 백엔드 schema에 맞게 name 추가
      goal: text,              // 백엔드 schema에 맞게 goal로 사용
      text: text,              // text 필드도 추가 (선택적)
      uid: selectedUser.uid,
      isCompleted: false,
    };
    fetch('http://localhost:3000/api/buckets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBucket)
    })
      .then(res => res.json())
      .then(data => setTodos(prev => [data, ...prev]));
  };

  // 버킷 삭제
  const onDelete = (id) => {
    fetch(`http://localhost:3000/api/buckets/${id}`, {
      method: 'DELETE',
    })
      .then(() => setTodos(prev => prev.filter(todo => todo._id !== id)));
  };

  // 버킷 업데이트 (텍스트 수정)
  const onUpdate = (id, newText) => {
    fetch(`http://localhost:3000/api/buckets/${id}/text`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText })
    })
      .then(res => res.json())
      .then(data => {
        setTodos(prev =>
          prev.map(todo =>
            todo._id === id ? data.bucket : todo
          )
        );
      });
  };

  // 사용자별 필터링
  const filteredTodos = selectedUser
    ? todos.filter(todo => todo.uid === selectedUser.uid)
    : todos;

  return (
    <div className="App">
      <Header
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
      <main>
        <BucketForm onCreate={onCreate} />
        <BucketList todos={filteredTodos} onDelete={onDelete} onUpdate={onUpdate} />
      </main>
    </div>
  );
}

export default App;