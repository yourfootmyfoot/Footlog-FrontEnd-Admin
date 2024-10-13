import { Box, Typography, useTheme } from "@mui/material"; // MUI의 Box, Typography, useTheme 훅을 임포트
import { DataGrid } from "@mui/x-data-grid"; // DataGrid는 MUI의 테이블을 쉽게 구현할 수 있는 컴포넌트
import { tokens } from "../../theme"; // theme.js 파일에서 가져온 tokens로 테마 색상 사용
import { mockDataTeam } from "../../data/mockData"; // mock 데이터 (팀원 정보)를 불러옴
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined"; // 관리자 아이콘
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined"; // 일반 유저 아이콘
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined"; // 매니저 아이콘
import Header from "../../components/Header"; // 페이지의 제목과 부제목을 보여주는 Header 컴포넌트

// Team 컴포넌트: 팀 데이터를 테이블로 보여주는 컴포넌트
const Team = () => {
  const theme = useTheme(); // MUI 테마 훅을 사용하여 현재 테마 정보를 가져옴
  const colors = tokens(theme.palette.mode); // 테마 모드 (다크/라이트)에 따라 colors 정의

  // DataGrid의 컬럼 정의: 테이블에서 각 열이 어떻게 표시될지 설정
  const columns = [
    { field: "id", headerName: "ID" }, // ID 필드
    {
      field: "name", 
      headerName: "Name", // 이름 필드
      flex: 1, // flex 값을 사용하여 이 열이 화면에서 더 많은 공간을 차지하도록 설정
      cellClassName: "name-column--cell", // 셀에 특정 CSS 클래스 이름 추가 (이 클래스는 아래 스타일 섹션에서 정의)
    },
    {
      field: "age",
      headerName: "Age", // 나이 필드
      type: "number", // 숫자 타입으로 지정
      headerAlign: "left", // 헤더 텍스트 정렬: 왼쪽
      align: "left", // 셀 내용 정렬: 왼쪽
    },
    {
      field: "phone",
      headerName: "Phone Number", // 전화번호 필드
      flex: 1, // flex 값을 사용하여 열의 크기 유연하게 조정
    },
    {
      field: "email",
      headerName: "Email", // 이메일 필드
      flex: 1, // flex 값을 사용하여 열의 크기 유연하게 조정
    },
    {
      field: "accessLevel",
      headerName: "Access Level", // 권한 수준 필드
      flex: 1, // flex 값을 사용하여 열의 크기 유연하게 조정
      // renderCell: 각 셀을 커스텀 렌더링 (accessLevel에 따라 아이콘과 배경색 다르게 설정)
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%" // 셀 너비
            m="0 auto" // 자동으로 가로 중앙 정렬
            p="5px" // padding 값 설정
            display="flex" // 플렉스 박스 레이아웃
            justifyContent="center" // 아이템을 중앙에 배치
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600] // 관리자는 greenAccent 색상
                : access === "manager"
                ? colors.greenAccent[700] // 매니저는 조금 더 어두운 greenAccent 색상
                : colors.greenAccent[700] // 일반 유저도 동일한 색상
            }
            borderRadius="4px" // 모서리를 둥글게 만듦
          >
            {/* access 값에 따라 다른 아이콘을 표시 */}
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />} 
            {access === "manager" && <SecurityOutlinedIcon />} 
            {access === "user" && <LockOpenOutlinedIcon />} 
            {/* access 텍스트를 표시, 색상은 테마의 grey[100] 사용 */}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}> 
              {access} {/* access 값 출력 */}
            </Typography>
          </Box>
        );
      },
    },
  ];

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
        <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} /> 
        {/* checkboxSelection: 각 행에 체크박스 추가 */}
      </Box>
    </Box>
  );
};

export default Team;