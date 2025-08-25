import './App.css';
import React, { useEffect, useState } from "react";
import { api, ensureGuestAuth } from './lib/api';
import Header from './components/Header';
import BucketForm from './components/BucketForm';
import BucketList from './components/BucketList';

const users = [
  { uid: "user1", name: "최선호" },
  { uid: "user2", name: "하다민" },
  { uid: "user3", name: "홍유민" },
];

function App() {
  const API = '/api/buckets';

  const [todos, setTodos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // 최초 데이터 로딩 및 게스트 인증
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        await ensureGuestAuth();

        const res = await api.get(API);
        const data = Array.isArray(res.data) ? res.data : res.data.buckets ?? [];
        setTodos(data);
        console.log("초기 데이터 로딩:", data);
      } catch (error) {
        console.error("버킷 데이터 불러오기 실패", error);
      }
    };

    fetchBuckets();
  }, []);

  // 사용자 선택 (로컬스토리지 저장 포함)
  useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      console.log("로컬스토리지에서 불러온 사용자:", user);
      setSelectedUser(user);
    }
  }, []);

  const handleUserSelect = (user) => {
    console.log("선택된 유저:", user);
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  // 버킷 생성
  const onCreate = async (text) => {
    if (!selectedUser) {
      console.warn("사용자를 먼저 선택해주세요.");
      return;
    }
    if (!text?.trim()) return;

    const newBucket = {
      name: selectedUser.name,
      goal: text.trim(),
      text: text.trim(),
      uid: selectedUser.uid,
      isCompleted: false,
    };

    try {
      const res = await api.post(API, newBucket);
      const created = res.data?.bucket ?? res.data;

      console.log("생성된 버킷:", created);

      if (Array.isArray(res.data?.buckets)) {
        setTodos(res.data.buckets);
      } else {
        setTodos(prev => [created, ...prev]);
      }
    } catch (error) {
      console.error("버킷 생성 실패", error);
    }
  };

  // 완료 여부 토글
  const onUpdatedChecked = async (id, isCompleted) => {
    try {
      const { data } = await api.patch(`${API}/${id}/check`, { isCompleted });

      if (Array.isArray(data?.buckets)) {
        setTodos(data.buckets);
      } else {
        const updated = data?.bucket ?? data;
        setTodos(prev => prev.map(t => (t._id === updated._id ? updated : t)));
      }
    } catch (error) {
      console.error("체크 상태 업데이트 실패", error);
    }
  };

  // 텍스트 업데이트
  const onUpdateTodo = async (id, newText) => {
    const text = newText?.trim();
    if (!text) return;

    try {
      const { data } = await api.patch(`${API}/${id}/text`, { text });

      if (Array.isArray(data?.buckets)) {
        setTodos(data.buckets);
      } else {
        const updated = data?.bucket ?? data;
        setTodos(prev => prev.map(t => (t._id === updated._id ? updated : t)));
      }
    } catch (error) {
      console.error("버킷 텍스트 업데이트 실패", error);
    }
  };

  // 삭제
  const onDelete = async (id) => {
    try {
      const { data } = await api.delete(`${API}/${id}`);

      if (Array.isArray(data?.buckets)) {
        setTodos(data.buckets);
        return;
      }

      const deletedId = data?.deletedId ?? data?.bucket?._id ?? data?._id ?? id;
      setTodos(prev => prev.filter(t => t._id !== deletedId));
    } catch (error) {
      console.error("버킷 삭제 실패", error);
    }
  };

  // 선택된 유저에 따른 필터링
  const filteredTodos = selectedUser ? todos.filter(t => t.uid === selectedUser.uid) : [];

  // 상태 및 필터 결과 콘솔 출력
  console.log("todos 상태:", todos);
  console.log("filteredTodos:", filteredTodos);

  return (
    <div className="App">
      <Header users={users} selectedUser={selectedUser} onSelectUser={handleUserSelect} />
      <main>
        <BucketForm onCreate={onCreate} selectedUser={selectedUser} />
        <BucketList todos={filteredTodos} onDelete={onDelete} onUpdate={onUpdateTodo} onToggle={onUpdatedChecked} />
      </main>
    </div>
  );
}

export default App;
