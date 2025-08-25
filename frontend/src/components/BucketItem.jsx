import React, { useState, useEffect } from "react";
import "./BucketItem.css";

const BucketItem = ({ todo, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // todo.text가 바뀌면 editText도 업데이트 (중요)
  useEffect(() => {
    setEditText(todo.text);
  }, [todo.text]);

  const handleSave = () => {
    if (!editText.trim()) {
      alert("빈 값은 저장할 수 없습니다.");
      return;
    }
    onUpdate(todo._id, editText.trim());
    setIsEditing(false);
  };

  return (
    <div className="bucket-item">
      {isEditing ? (
        <>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <button className="btn btn-save" onClick={handleSave}>
            저장
          </button>
          <button
            className="btn btn-cancel"
            onClick={() => {
              setIsEditing(false);
              setEditText(todo.text);
            }}
          >
            취소
          </button>
        </>
      ) : (
        <>
          <span>{todo.text}</span>
          <div className="btns">
            <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
              수정
            </button>
            <button
              className="btn btn-delete"
              onClick={() => onDelete(todo._id)}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BucketItem;
