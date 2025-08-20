import React from 'react'
import './BucketList.css'
import BucketItem from './BucketItem'
const BucketList = ({todos,onDelete}) => {
  return (
    <div className='BucketList'>
        <h4>Bucket List 🌱</h4>
        <input type="text" placeholder='검색어를 입력하세요' />
        <div className="todos-wrapper">
          {todos.map((todo,i)=>(

            <BucketItem key={i} todo={todo} onDelete={onDelete}/>
          ))}
        
        </div>
    </div>
  )
}

export default BucketList