import React, { useState } from 'react';

const BucketForm = ({ onCreate }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCreate(input);
    setInput('');
  };

  return (
    <form className="bucket-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="하고 싶은 것을 입력하세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">추가</button>
    </form>
  );
};

export default BucketForm;
