const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ✅ 추가

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 미들웨어 등록 (라우터보다 먼저)
app.use(express.json());
app.use(cookieParser()); // ✅ 추가
app.use(cors({
    origin: process.env.FRONT_ORIGIN,
    credentials: true
}));

// ✅ MongoDB 연결
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 연결 성공"))
    .catch((err) => console.log("연결 실패", err));

// ✅ 라우터 등록
const bucketRoutes = require('./routes/bucketRoutes');
app.use('/api/buckets', bucketRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ✅ 기본 라우트
app.get('/', (req, res) => {
    res.send("Hello Express");
});

// ✅ 헬스 체크 라우트
app.get('/healthz', (_req, res) => res.sendStatus(200));

// ✅ 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
