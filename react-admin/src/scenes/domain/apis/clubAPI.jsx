// JSON 파일로부터 매치 정보를 가져와서 여러 가지 함수로 검색 및 필터링하는 모듈
// import clubs from '../data/Club.json';
import axios from 'axios';

// // 생성된 클럽 리스트 가져오기
// export function getClubList() {

//     return clubs;
// }


// // 클럽 코드가 같은 클럽 가져오기
// export function getClub(clubCode) {
//     console.log(clubs);

//     return clubs.filter(club => club.Code === parseInt(clubCode))[0];
// }

// 구단 리스트를 백엔드로부터 가져오는 API 호출 함수
export const getClubList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/clubs', { withCredentials: true });  // 백엔드 API 호출
      return response.data;  // 응답 데이터를 반환
    } catch (error) {
        console.error('클럽 리스트를 불러오는데 실패했습니다:', error);
        throw error;
    }
    };