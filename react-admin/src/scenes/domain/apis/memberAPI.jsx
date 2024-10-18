import axios from 'axios';

export const getMemberList = async () => {
  try {
    const response = await axios.get('http://localhost:8080//api/auth/members', { withCredentials: true });  // 백엔드 API 호출
    return response.data;  // 응답 데이터를 반환
  } catch (error) {
    console.error('유저 리스트를 불러오는데 실패했습니다:', error);
    throw error;
  }
};