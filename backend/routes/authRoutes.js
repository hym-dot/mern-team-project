const express = require('express');
const router = express.Router();

router.post('/guest', (req, res) => {
    // 간단한 토큰 생성 (게스트용)
    const guestToken = Math.random().toString(36).substring(2);

    // ✅ 쿠키로 토큰 전송
    res.cookie('guestToken', guestToken, {
        httpOnly: true,      // 자바스크립트에서 접근 불가
        secure: true,        // HTTPS에서만 전달됨 (로컬에서는 http라 안 보일 수 있음)
        sameSite: 'none'     // 크로스 도메인 허용 (프론트와 백이 다른 포트일 때 필수)
    });

    res.status(200).json({ token: guestToken });
});

module.exports = router;
