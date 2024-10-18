import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useEffect, useState } from "react"; // React의 useEffect 및 useState 훅 임포트
import axios from "axios"; // axios를 사용하여 API 요청 처리
import Header from "../../components/Header";
import { getMemberList } from './apis/memberAPI';

const Member = () => {
  
  const theme = useTheme(); // MUI 테마 훅을 사용하여 현재 테마 정보를 가져옴
  const colors = tokens(theme.palette.mode); // 테마 모드 (다크/라이트)에 따라 colors 정의
  const [members, setMembers] = useState([]); // 팀 데이터를 저장할 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [memberInfo, setMemberInfo] = useState({});


  // member 데이터를 가져오는 useEffect 훅
  useEffect(() => {

    // 로그인 여부 확인 API 호출
    axios.get('http://localhost:8080/api/auth/status', { withCredentials: true })
      .then(response => {
        const data = response.data; // 응답 데이터에서 로그인 정보를 추출
        setIsLoggedIn(data.isLoggedIn); // 로그인 상태를 저장하는 state 업데이트
        setMemberInfo({
          email: data.email, // 유저의 이메일을 state에 저장
          authority: data.authority, // 유저의 권한을 state에 저장 (예: 관리자, 일반 사용자 등)
          name: data.name // 유저의 이름을 state에 저장
        });
        console.log(data); // 응답 데이터를 콘솔에 출력하여 디버깅용으로 확인
      })
      .catch(error => {
        console.error("로그인 상태 확인 중 오류 발생:", error); // 오류 발생 시 콘솔에 에러 메시지 출력
      });

    // member 리스트 불러오기
    getMemberList().then(memberList => {
      console.log(memberList); // 가져온 클럽 리스트 데이터를 확인하기 위해 콘솔에 출력
      setMemberList(memberList); // 클럽 리스트 데이터를 state에 저장
      setMembers(memberList); // 팀 상태 업데이트
      setLoading(false);
    })
      .catch(error => {
        console.error("매치 리스트 불러오기 오류:", error); // 클럽 리스트 불러오기 중 오류 발생 시 콘솔에 에러 메시지 출력
        setLoading(false);
      });
  }, []); // 컴포넌트가 처음 마운트될 때 한 번 실행

  // DataGrid의 컬럼 정의
  const columns = [
    { field: "guestId", headerName: "Id" },
    {
      field: "clubName",
      headerName: "hostClub",
      flex: 1,
      cellClassName: "name-column--cell",
      // myClub.clubName을 표시
      renderCell: (params) => {
        return params.row.myClub?.clubName || "";
      },
    },
    {
      field: "enemyClub",
      headerName: "guestClub",
      flex: 1,
      // enemyClub.clubName을 표시
      renderCell: (params) => {
        return params.row.enemyClub?.clubName || "";
      },
    },
    {
      field: "fieldLocation",
      headerName: "field", // Match 나이 필드
      flex: 1, // 열의 크기 유연하게 조정
    },
    {
      field: "schedule",
      headerName: "Schedule & Quarters", // 일정 및 쿼터 수
      flex: 1.5,
      renderCell: (params) => {
        const { matchSchedule, quarterQuantity } = params.row; // matchSchedule 및 quarterQuantity 값 가져오기
        return `${matchSchedule.matchDate} ${matchSchedule.matchStartTime}-${matchSchedule.matchEndTime} | ${quarterQuantity}`;
      },
    },
    {
      field: "matchCost",
      headerName: "cost", // Match 나이 필드
      flex: 0.7, // 열의 크기 유연하게 조정
    },
    {
      field: "matchGender",
      headerName: "gender", // Match 레벨 필드
      flex: 0.7, // 열의 크기 유연하게 조정
    },
    {
      field: "matchPlayerQuantity",
      headerName: "PlayerQuantity", // Match 레벨 필드
      flex: 0.5, // 열의 크기 유연하게 조정
    },
    {
      field: "pro",
      headerName: "pro",
      flex: 0.5,
      // enemyClub.clubName을 표시
      renderCell: (params) => {
        return params.row.pro.isPro ? "O" : "X"; // isPro 값에 따라 표시
      },
    },
    {
      field: "matchStatus",
      headerName: "status", // Match 레벨 필드
      flex: 1, // 열의 크기 유연하게 조정
    },
    
  ];


  // 로딩 중일 때의 처리
  if (loading) {
    return <Typography>Member Loading...</Typography>; // 로딩 중일 경우 텍스트 표시
  }


  // Match 컴포넌트의 JSX 리턴 부분
  return (
    <Box m="20px"> {/* 외부 마진 20px */}
      <Header title="Member" subtitle="Managing the Member" /> {/* 제목과 부제목 표시 */}
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
          rows={members} // 가져온 팀 데이터를 행으로 사용
          columns={columns} // 정의한 컬럼을 사용
          getRowId={(row) => row.memberId} // 각 행의 ID로 matchId 사용
        />
        {/* checkboxSelection: 각 행에 체크박스 추가 */}
      </Box>
    </Box>
  );
};

export default Member;