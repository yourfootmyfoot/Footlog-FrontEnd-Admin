import { Box, Typography, useTheme } from "@mui/material"; // MUI의 Box, Typography, useTheme 훅을 임포트
import { DataGrid } from "@mui/x-data-grid"; // DataGrid는 MUI의 테이블을 쉽게 구현할 수 있는 컴포넌트
import { tokens } from "../../theme"; // theme.js 파일에서 가져온 tokens로 테마 색상 사용
import { useEffect, useState } from "react"; // React의 useEffect 및 useState 훅 임포트
import axios from "axios"; // axios를 사용하여 API 요청 처리
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined"; // 관리자 아이콘
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined"; // 일반 유저 아이콘
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined"; // 매니저 아이콘
import Header from "../../components/Header"; // 페이지의 제목과 부제목을 보여주는 Header 컴포넌트
import { getClubList } from './apis/clubAPI';

/*
const getCookie = (name) => {
  const value = `; ${document.cookie}`; // 현재 쿠키를 문자열로 가져옴
  const parts = value.split(`; ${name}=`); // 이름으로 쿠키를 찾기 위해 분할
  if (parts.length === 2) return parts.pop().split(';').shift(); // 쿠키 값 반환
};
*/



// Team 컴포넌트: 팀 데이터를 테이블로 보여주는 컴포넌트
const ClubList = () => {

  const theme = useTheme(); // MUI 테마 훅을 사용하여 현재 테마 정보를 가져옴
  const colors = tokens(theme.palette.mode); // 테마 모드 (다크/라이트)에 따라 colors 정의
  const [teams, setTeams] = useState([]); // 팀 데이터를 저장할 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clubList, setClubList] = useState([]);
  const [userInfo, setUserInfo] = useState({});


  // 팀 데이터를 가져오는 useEffect 훅
  useEffect(() => {
    // 로그인 여부 확인 API 호출
    axios.get('http://localhost:8080/api/auth/status', { withCredentials: true })
      .then(response => {
        const data = response.data; // 응답 데이터에서 로그인 정보를 추출
        setIsLoggedIn(data.isLoggedIn); // 로그인 상태를 저장하는 state 업데이트
        setUserInfo({
          email: data.email, // 유저의 이메일을 state에 저장
          authority: data.authority, // 유저의 권한을 state에 저장 (예: 관리자, 일반 사용자 등)
          name: data.name // 유저의 이름을 state에 저장
        });
        console.log(data); // 응답 데이터를 콘솔에 출력하여 디버깅용으로 확인
      })
      .catch(error => {
        console.error("로그인 상태 확인 중 오류 발생:", error); // 오류 발생 시 콘솔에 에러 메시지 출력
      });

    // 구단 리스트 불러오기
    getClubList().then(clubList => {
      console.log(clubList); // 가져온 클럽 리스트 데이터를 확인하기 위해 콘솔에 출력
      setClubList(clubList); // 클럽 리스트 데이터를 state에 저장
      setTeams(clubList); // 팀 상태 업데이트
      setLoading(false);
    })
      .catch(error => {
        console.error("클럽 리스트 불러오기 오류:", error); // 클럽 리스트 불러오기 중 오류 발생 시 콘솔에 에러 메시지 출력
        setLoading(false);
      });
  }, []); // 컴포넌트가 처음 마운트될 때 한 번 실행

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
    // {
    //   field: "accessLevel",
    //   headerName: "Access Level", // 권한 수준 필드
    //   flex: 1, // 열의 크기 유연하게 조정
    //   renderCell: ({ row: { access } }) => { // 각 셀을 커스텀 렌더링
    //     return (
    //       <Box
    //         width="60%" // 셀 너비
    //         m="0 auto" // 자동으로 가로 중앙 정렬
    //         p="5px" // padding 값 설정
    //         display="flex" // 플렉스 박스 레이아웃
    //         justifyContent="center" // 아이템을 중앙에 배치
    //         backgroundColor={
    //           access === "admin"
    //             ? colors.greenAccent[600] // 관리자는 greenAccent 색상
    //             : access === "manager"
    //               ? colors.greenAccent[700] // 매니저는 조금 더 어두운 greenAccent 색상
    //               : colors.greenAccent[700] // 일반 유저도 동일한 색상
    //         }
    //         borderRadius="4px" // 모서리를 둥글게 만듦
    //       >
    //         {/* access 값에 따라 다른 아이콘을 표시 */}
    //         {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
    //         {access === "manager" && <SecurityOutlinedIcon />}
    //         {access === "user" && <LockOpenOutlinedIcon />}
    //         {/* access 텍스트를 표시, 색상은 테마의 grey[100] 사용 */}
    //         <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
    //           {access} {/* access 값 출력 */}
    //         </Typography>
    //       </Box>
    //     );
    //   },
    // }
  ];


  // 로딩 중일 때의 처리
  if (loading) {
    return <Typography>Loading...</Typography>; // 로딩 중일 경우 텍스트 표시
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
        {/* checkboxSelection: 각 행에 체크박스 추가 */}
      </Box>
    </Box>
  );
};

export default ClubList; // Team 컴포넌트를 기본으로 내보냄