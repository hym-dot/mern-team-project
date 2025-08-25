const express = require('express');
const router = express.Router();

router.post('/guest', (req, res) => {
  const guestToken = Math.random().toString(36).substring(2);

  res.cookie('guestToken', guestToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  res.status(200).json({ token: guestToken });
});

module.exports = router;
