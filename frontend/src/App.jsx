import React, { useState } from 'react';
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

  const onCreate = (text) => {
    if (!selectedUser) {
      alert('사용자를 먼저 선택해주세요.');
      return;
    }

    const newTodo = {
      _id: Date.now().toString(),
      text,
      uid: selectedUser.uid,
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const onDelete = (id) => {
    setTodos(prev => prev.filter(todo => todo._id !== id));
  };

  const onUpdate = (id, newText) => {
    setTodos(prev =>
      prev.map(todo =>
        todo._id === id ? { ...todo, text: newText } : todo
      )
    );
  };

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
