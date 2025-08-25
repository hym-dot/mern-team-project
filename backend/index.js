const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


const app = express();

// 허용할 출처 리스트
const allowedOrigins = [
  'https://mern-team-project-tau.vercel.app', // 배포 도메인
  'http://localhost:5173'                     // 개발 중인 React 앱 도메인
];

// CORS 설정
app.use(cors({
  origin: function (origin, callback) {
    // origin이 없으면 (curl, Postman 등) 허용
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'CORS 정책 위반: 허용되지 않은 출처입니다.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // 필요하면 true로 설정 (쿠키 등 인증정보 전달용)
}));

// JSON 바디 파서
app.use(express.json());

// 예시 API 엔드포인트: 버킷 리스트 가져오기
app.get('/api/buckets', (req, res) => {
  res.json({
    buckets: [
      { _id: '1', text: '여행 가기', uid: 'user1' },
      { _id: '2', text: '책 읽기', uid: 'user2' },
    ]
  });
});

// 예시 API 엔드포인트: 버킷 생성
app.post('/api/buckets', (req, res) => {
  const { name, goal, text, uid, isCompleted } = req.body;
  if (!text || !uid) {
    return res.status(400).json({ error: 'text와 uid는 필수입니다.' });
  }

  // 여기서는 DB 없이 간단히 새 객체를 생성해서 반환 (임시)
  const newBucket = {
    _id: String(Date.now()),
    name,
    goal,
    text,
    uid,
    isCompleted: !!isCompleted,
  };

  // 보통 DB에 저장 후 반환
  res.status(201).json({ bucket: newBucket });
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
