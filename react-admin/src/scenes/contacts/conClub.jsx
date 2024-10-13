import { Box } from "@mui/material"; // MUI의 Box 컴포넌트를 임포트
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // DataGrid와 GridToolbar를 임포트하여 테이블과 툴바를 구현
import { tokens } from "../../theme"; // theme.js 파일에서 색상 토큰을 가져옴
import { mockDataContacts } from "../../data/mockData"; // mock 데이터 (연락처 정보)를 불러옴
import Header from "../../components/Header"; // 페이지 제목과 부제목을 보여주는 Header 컴포넌트를 임포트
import { useTheme } from "@mui/material"; // MUI의 useTheme 훅을 임포트

// ConClub 컴포넌트: 연락처 데이터를 테이블로 보여주는 컴포넌트
const ConClub = () => {
  const theme = useTheme(); // 현재 MUI 테마를 가져옴
  const colors = tokens(theme.palette.mode); // 현재 테마 모드에 따른 색상 설정

  // DataGrid의 컬럼 정의: 각 열의 데이터 필드와 표시 이름을 설정
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 }, // ID 필드: flex 값으로 열의 크기 조정
    { field: "registrarId", headerName: "Registrar ID" }, // 등록자 ID 필드
    {
      field: "name",
      headerName: "Name", // 이름 필드
      flex: 1, // flex 값으로 이 열이 화면에서 더 많은 공간을 차지하도록 설정
      cellClassName: "name-column--cell", // 셀에 특정 CSS 클래스 이름 추가
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
      field: "address",
      headerName: "Address", // 주소 필드
      flex: 1, // flex 값을 사용하여 열의 크기 유연하게 조정
    },
    {
      field: "city",
      headerName: "City", // 도시 필드
      flex: 1, // flex 값을 사용하여 열의 크기 유연하게 조정
    },
    {
      field: "zipCode",
      headerName: "Zip Code", // 우편번호 필드
      flex: 1, // flex 값을 사용하여 열의 크기 유연하게 조정
    },
  ];

  // Contacts 컴포넌트의 JSX 리턴 부분
  return (
    <Box m="20px"> {/* 외부 마진 20px 설정 */}
      <Header
        title="CONTACTS" // 페이지 제목
        subtitle="List of Contacts for Future Reference" // 페이지 부제목
      />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`, // 툴바 버튼 텍스트 색상 설정
          },
        }}
      >
        <DataGrid
          rows={mockDataContacts} // mock 데이터로 행을 설정
          columns={columns} // 정의된 열을 설정
          components={{ Toolbar: GridToolbar }} // 툴바로 GridToolbar 컴포넌트 사용
        />
      </Box>
    </Box>
  );
};

export default ConClub; // ConClub 컴포넌트를 기본 내보내기로 설정