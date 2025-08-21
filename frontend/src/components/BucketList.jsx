import React from "react"
import "./BucketList.css"
import BucketItem from "./BucketItem"

const BucketList = ({ todos, onDelete, onUpdate }) => {
  return (
    <div className="BucketList">
      <h4>Bucket List 🌱</h4>
      <input type="text" placeholder="검색어를 입력하세요" />
      <div className="todos-wrapper">
        {todos.map((todo) => (
          <BucketItem
            key={todo._id}
            todo={todo}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  )
}

export default BucketList
