import { Box, Typography, useTheme } from "@mui/material"; // MUI의 Box, Typography, useTheme 훅을 임포트
import { DataGrid } from "@mui/x-data-grid"; // DataGrid는 MUI의 테이블을 쉽게 구현할 수 있는 컴포넌트
import { tokens } from "../../theme"; // theme.js 파일에서 가져온 tokens로 테마 색상 사용
import { useEffect, useState } from "react"; // React의 useEffect 및 useState 훅 임포트
import axios from "axios"; // axios를 사용하여 API 요청 처리
import Header from "../../components/Header"; // 페이지의 제목과 부제목을 보여주는 Header 컴포넌트
import { getClubList } from './apis/clubAPI';
import api from '../../config/axiosConfig'; // axios 인스턴스

// CLub 컴포넌트: CLub 데이터를 테이블로 보여주는 컴포넌트
const Club = () => {

  const theme = useTheme(); // MUI 테마 훅을 사용하여 현재 테마 정보를 가져옴
  const colors = tokens(theme.palette.mode); // 테마 모드 (다크/라이트)에 따라 colors 정의
  const [teams, setTeams] = useState([]); // 팀 데이터를 저장할 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clubList, setClubList] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  // Club 데이터를 가져오는 useEffect 훅 // 유저 로그인 확인
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 로그인 상태 확인

        const statusResponse = await api.get('/api/auth/status', { withCredentials: true });

        const data = statusResponse.data;

        setIsLoggedIn(data.isLoggedIn);

        setUserInfo({
          email: data.email,
          authority: data.authority,
          name: data.name
        });

        // 2. 로그인된 경우에만 클럽 리스트 조회
        if (data.isLoggedIn) {

          const clubData = await getClubList();

          setClubList(clubData);
          setTeams(clubData);
        }

      } catch (error) {
        console.error("로그인 상태 확인 중 오류 발생: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // DataGrid의 컬럼 정의
  const columns = [
    { field: "clubId", headerName: "Id" }, // ID 필드
    {
      field: "clubName",
      headerName: "clubName", // 이름 필드
      flex: 1, // flex 값을 사용하여 이 열이 화면에서 더 많은 공간을 차지하도록 설정
      cellClassName: "name-column--cell", // 셀에 특정 CSS 클래스 이름 추가
    },
    {
      field: "clubCode",
      headerName: "clubCode", // 플레이어 수 필드
      type: "number", // 숫자 타입으로 지정
      headerAlign: "left", // 헤더 텍스트 정렬: 왼쪽
      align: "left", // 셀 내용 정렬: 왼쪽
    },
    {
      field: "city",
      headerName: "city", // 구단 나이 필드
      flex: 1, // 열의 크기 유연하게 조정
    },
    {
      field: "ageGroup",
      headerName: "age", // 구단 나이 필드
      flex: 1, // 열의 크기 유연하게 조정
    },
    {
      field: "gender",
      headerName: "gender", // 구단 레벨 필드
      flex: 1, // 열의 크기 유연하게 조정
    },
    {
      field: "clubLevel",
      headerName: "clubLevel", // 구단 레벨 필드
      flex: 1, // 열의 크기 유연하게 조정
    },
    {
      field: "createdAt",
      headerName: "createdAt",
      flex: 1,
    }
  ];

  // 로딩 중일 때의 처리
  if (loading) {
    return <Typography>Club Loading...</Typography>;
  }


  // Team 컴포넌트의 JSX 리턴 부분
  return (

    <Box m="20px"> {/* 외부 마진 20px */}

      <Header title="Club" subtitle="Managing the Club" /> {/* 제목과 부제목 표시 */}

      <Box
        m="40px 0 0 0" // 상단 마진 40px, 나머지는 0
        height="75vh" // 높이 75%로 설정
        sx={{
          "& .MuiDataGrid-root": {
            border: "none", // 테이블의 기본 경계선을 제거
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none", // 셀 하단 경계선을 제거
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300], // name 컬럼의 텍스트 색상 변경
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700], // 테이블 헤더의 배경색 설정
            borderBottom: "none", // 헤더 하단 경계선 제거
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400], // 스크롤 영역 배경색 설정
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none", // 푸터 상단 경계선 제거
            backgroundColor: colors.blueAccent[700], // 푸터 배경색 설정
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`, // 체크박스 색상 설정
          },
        }}
      >

        {/* DataGrid 컴포넌트: 테이블 렌더링 */}
        <DataGrid
          checkboxSelection // 각 행에 체크박스를 추가
          rows={teams} // 가져온 팀 데이터를 행으로 사용
          columns={columns} // 정의한 컬럼을 사용
          getRowId={(row) => row.clubId} // 각 행의 ID로 clubId를 사용
        />
      </Box>
    </Box>
  );
};

export default Club; // Team 컴포넌트를 기본으로 내보냄