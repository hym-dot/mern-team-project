import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 예: https://your-backend.cloudtype.app
  withCredentials: true, // 쿠키 포함
});

let isAuthing = false;

// 응답 인터셉터: 401일 때 게스트 로그인 후 재시도
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err?.response?.status === 401 && !isAuthing) {
      try {
        isAuthing = true;
        await ensureGuestAuth(); // 아래 함수 실행
        isAuthing = false;
        return api.request(err.config); // 실패했던 요청 재시도
      } catch (e) {
        isAuthing = false;
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

// ✅ 게스트 인증 함수
export async function ensureGuestAuth() {
  let deviceId = localStorage.getItem('deviceId');

  if (!deviceId) {
    deviceId =
      (crypto?.randomUUID && crypto.randomUUID()) ||
      Math.random().toString(36).slice(2);
    localStorage.setItem('deviceId', deviceId);
  }

  // guest 인증 요청
  try {
    await api.post('/api/auth/guest', { deviceId });
  } catch (err) {
    console.error('🔒 게스트 인증 실패:', err);
    throw err;
  }
}
