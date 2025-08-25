import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 백엔드 주소를 환경변수로 설정
  withCredentials: true, // 쿠키 포함 요청
});

let isAuthing = false;

// 응답 인터셉터: 401 Unauthorized 발생 시 게스트 인증 후 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !isAuthing) {
      try {
        isAuthing = true;
        await ensureGuestAuth();
        isAuthing = false;

        // 실패한 요청 다시 시도
        return api.request(originalRequest);
      } catch (err) {
        isAuthing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export async function ensureGuestAuth() {
  let deviceId = localStorage.getItem('deviceId');

  if (!deviceId) {
    deviceId =
      (crypto?.randomUUID && crypto.randomUUID()) ||
      Math.random().toString(36).slice(2);
    localStorage.setItem('deviceId', deviceId);
  }

  try {
    // 백엔드가 deviceId를 사용하지 않는다면 비워도 무방합니다.
    await api.post('/api/auth/guest', { deviceId });
  } catch (err) {
    console.error('🔒 게스트 인증 실패:', err);
    throw err;
  }
}
