import { Box, Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, Select, InputLabel, FormControl } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import axios from "axios";


const EnrollClub = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [formValues, setFormValues] = useState({
    clubName: "",
    clubIntroduction: "",
    clubCode: "",
    memberCount: "",
    days: [],
    times: [],
    skillLevel: "",
    stadiumName: "",
    city: "",
    region: "",
    ageGroup: "",
    gender: ""
  });
  const [errors, setErrors] = useState({});
  const [openDaysDialog, setOpenDaysDialog] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [openTimesDialog, setOpenTimesDialog] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);

  // 지역 데이터 정의
  const regions = {
    서울: ['강남구', '서초구', '마포구'],
    경기: ['성남시', '수원시', '고양시'],
    인천: ['남동구', '연수구', '부평구'],
  };

  // 요일 선택/해제를 처리하는 함수
// day: 선택/해제할 요일
// 이미 선택된 요일이면 제거하고, 선택되지 않은 요일이면 추가함
const handleDaySelect = (day) => {
  setSelectedDays((prevSelected) => {
    if (prevSelected.includes(day)) {
      return prevSelected.filter((d) => d !== day);
    }
    return [...prevSelected, day];
  });
};

// 시간대 선택/해제를 처리하는 함수
// time: 선택/해제할 시간대
// 이미 선택된 시간대면 제거하고, 선택되지 않은 시간대면 추가함
const handleTimeSelect = (time) => {
  setSelectedTimes((prevSelected) => {
    if (prevSelected.includes(time)) {
      return prevSelected.filter((t) => t !== time);
    }
    return [...prevSelected, time];
  });
};

// 폼 입력값 변경을 처리하는 함수
// e: 이벤트 객체
// 입력 필드의 name과 value를 추출하여 formValues 상태를 업데이트
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormValues((prevValues) => ({
    ...prevValues,
    [name]: value,
  }));
};

// 요일 선택 다이얼로그를 여는 함수
// 현재 선택된 요일들을 다이얼로그에 표시하고 다이얼로그를 엶
const openDaysDialogHandler = () => {
  setSelectedDays(formValues.days);
  setOpenDaysDialog(true);
};

// 요일 선택 다이얼로그를 닫는 함수
const closeDaysDialogHandler = () => setOpenDaysDialog(false);

// 선택한 요일들을 저장하는 함수
// 선택된 요일들을 formValues에 업데이트하고 다이얼로그를 닫음
const handleDaysSave = () => {
  setFormValues((prevValues) => ({
    ...prevValues,
    days: selectedDays
  }));
  closeDaysDialogHandler();
};

// 시간대 선택 다이얼로그를 여는 함수
// 현재 선택된 시간대들을 다이얼로그에 표시하고 다이얼로그를 엶
const openTimesDialogHandler = () => {
  setSelectedTimes(formValues.times);
  setOpenTimesDialog(true);
};

// 시간대 선택 다이얼로그를 닫는 함수
const closeTimesDialogHandler = () => setOpenTimesDialog(false);

// 선택한 시간대들을 저장하는 함수
// 선택된 시간대들을 formValues에 업데이트하고 다이얼로그를 닫음
const handleTimesSave = () => {
  setFormValues((prevValues) => ({
    ...prevValues,
    times: selectedTimes
  }));
  closeTimesDialogHandler();
};

// 폼 유효성 검사를 수행하는 함수
// Yup 스키마를 사용하여 각 필드의 유효성을 검사
// 유효성 검사 실패 시 에러 메시지를 설정하고 false 반환
// 성공 시 true 반환
const validateForm = () => {
  // Yup 스키마 정의 - 각 필드의 유효성 검사 규칙 설정
  const schema = yup.object().shape({
    clubName: yup.string().required("구단 이름은 필수입니다."),
    clubIntroduction: yup.string().max(255, "구단 소개글은 255자 이하로 입력해야 합니다."),
    clubCode: yup.string()
      .required("구단 코드는 필수입니다.")
      .matches(/^[a-zA-Z0-9]+$/, "구단 코드는 영문과 숫자로만 구성되어야 합니다."),
    memberCount: yup.number().required("구단원 수는 필수입니다."),
    days: yup.array().of(yup.string()).required("운동하는 요일을 선택해야 합니다."),
    times: yup.array().of(yup.string()).required("운동하는 시간대를 선택해야 합니다."),
    skillLevel: yup.string().required("실력 등급은 필수입니다."),
    stadiumName: yup.string().required("주 활동 구장은 필수입니다."),
    city: yup.string().required("활동 도시를 입력해야 합니다."),
    region: yup.string().required("활동 지역을 입력해야 합니다."),
    ageGroup: yup.string().required("연령대를 입력해야 합니다."),
    gender: yup.string().required("성별은 필수입니다."),
  });

  try {
    schema.validateSync(formValues, { abortEarly: false });
    setErrors({});
    return true;
  } catch (error) {
    const validationErrors = {};
    error.inner.forEach((err) => {
      validationErrors[err.path] = err.message;
    });
    setErrors(validationErrors);
    return false;
  }
};

// 폼 제출을 처리하는 함수
// e: 이벤트 객체
// 폼 유효성 검사 후 API로 데이터를 전송
const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    console.log("버튼 누름");
    console.log("Submitting form with values:", formValues); // 보내려는 값 확인

    // 비밀번호 확인을 제외한 폼 값 준비
    const {...dataToSubmit } = formValues;

    // 비밀번호가 올바르게 설정되어 있는지 확인
    if (!dataToSubmit.password) {
      console.error("비밀번호가 설정되지 않았습니다."); // 비밀번호가 없을 경우 경고
      return;
    }

    // 서버로 POST 요청 보내기
    try {
      const response = await axios.post("http://localhost:8080/api/clubs", dataToSubmit); // 데이터 전송
      console.log("User created successfully:", response.data); // 성공 시 응답 확인
    } catch (error) {
      console.error("Error creating user:", error); // 오류 발생 시 로그 출력
    }
  }
};
  return (
    <Box m="20px">
      <Header title="CREATE Club" subtitle="Create a New Club" />

      <form onSubmit={handleSubmit}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {/* 기존 필드들 */}
          <TextField
            fullWidth
            variant="filled"
            label="구단 이름"
            onChange={handleChange}
            value={formValues.clubName}
            name="clubName"
            error={!!errors.clubName}
            helperText={errors.clubName}
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="구단 코드"
            onChange={handleChange}
            value={formValues.clubCode}
            name="clubCode"
            error={!!errors.clubCode}
            helperText={errors.clubCode}
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="구단 소개글"
            onChange={handleChange}
            value={formValues.clubIntroduction}
            name="clubIntroduction"
            error={!!errors.clubIntroduction}
            helperText={errors.clubIntroduction}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="number"
            label="구단원 수"
            onChange={handleChange}
            value={formValues.memberCount}
            name="memberCount"
            error={!!errors.memberCount}
            helperText={errors.memberCount}
            sx={{ gridColumn: "span 1" }}
          />

          {/* 요일 선택 버튼 */}
          <Button
            variant="contained"
            onClick={openDaysDialogHandler}
            sx={{ gridColumn: "span 1" }}
          >
            자주 운동하는 요일 선택: {formValues.days.join(", ") || "없음"}
          </Button>

          {/* 시간대 선택 버튼 */}
          <Button
            variant="contained"
            onClick={openTimesDialogHandler}
            sx={{ gridColumn: "span 1" }}
          >
            자주 운동하는 시간대 선택: {formValues.times.join(", ") || "없음"}
          </Button>

          <TextField
            fullWidth
            variant="filled"
            label="주 활동 구장"
            onChange={handleChange}
            value={formValues.stadiumName}
            name="stadiumName"
            error={!!errors.stadiumName}
            helperText={errors.stadiumName}
            sx={{ gridColumn: "span 1" }}
          />

          {/* 활동 도시 드롭다운 */}
          <FormControl variant="filled" fullWidth sx={{ gridColumn: "span 1" }}>
            <InputLabel id="city-label">활동 도시</InputLabel>
            <Select
              labelId="city-label"
              value={formValues.city}
              name="city"
              onChange={handleChange}
              error={!!errors.city}
            >
              {["서울", "경기", "인천"].map(city => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
            {errors.city && <div style={{ color: "red" }}>{errors.city}</div>}
          </FormControl>

          {/* 활동 지역 드롭다운 */}
          <FormControl variant="filled" fullWidth sx={{ gridColumn: "span 1" }}>
            <InputLabel id="region-label">활동 지역</InputLabel>
            <Select
              labelId="region-label"
              value={formValues.region}
              name="region"
              onChange={handleChange}
              error={!!errors.region}
            >
              {regions[formValues.city]?.map(region => (
                <MenuItem key={region} value={region}>{region}</MenuItem>
              )) || <MenuItem value="">도시를 선택하세요</MenuItem>}
            </Select>
            {errors.region && <div style={{ color: "red" }}>{errors.region}</div>}
          </FormControl>

          {/* 연령대 드롭다운 */}
          <FormControl variant="filled" fullWidth sx={{ gridColumn: "span 1" }}>
            <InputLabel id="ageGroup-label">연령대</InputLabel>
            <Select
              labelId="ageGroup-label"
              value={formValues.ageGroup}
              name="ageGroup"
              onChange={handleChange}
              error={!!errors.ageGroup}
            >
              {["20대", "30대", "40대", "50대", "60대"].map(ageGroup => (
                <MenuItem key={ageGroup} value={ageGroup}>{ageGroup}</MenuItem>
              ))}
            </Select>
            {errors.ageGroup && <div style={{ color: "red" }}>{errors.ageGroup}</div>}
          </FormControl>

          {/* 성별 드롭다운 */}
          <FormControl variant="filled" fullWidth sx={{ gridColumn: "span 1" }}>
            <InputLabel id="gender-label">성별</InputLabel>
            <Select
              labelId="gender-label"
              value={formValues.gender}
              name="gender"
              onChange={handleChange}
              error={!!errors.gender}
            >
              {["남성", "여성", "혼성"].map(gender => (
                <MenuItem key={gender} value={gender}>{gender}</MenuItem>
              ))}
            </Select>
            {errors.gender && <div style={{ color: "red" }}>{errors.gender}</div>}
          </FormControl>
        </Box>

        {/* 요일 선택 다이얼로그 */}
        <Dialog open={openDaysDialog} onClose={closeDaysDialogHandler}>
          <DialogTitle>운동하는 요일 선택</DialogTitle>
          <DialogContent>
            {["월", "화", "수", "목", "금", "토", "일"].map(day => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDaySelect(day)}
                  />
                }
                label={day}
                key={day}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDaysDialogHandler}>취소</Button>
            <Button onClick={handleDaysSave}>저장</Button>
          </DialogActions>
        </Dialog>

        {/* 시간대 선택 다이얼로그 */}
        <Dialog open={openTimesDialog} onClose={closeTimesDialogHandler}>
          <DialogTitle>운동하는 시간대 선택</DialogTitle>
          <DialogContent>
            {["아침", "낮", "저녁", "심야"].map(time => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTimes.includes(time)}
                    onChange={() => handleTimeSelect(time)}
                  />
                }
                label={time}
                key={time}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeTimesDialogHandler}>취소</Button>
            <Button onClick={handleTimesSave}>저장</Button>
          </DialogActions>
        </Dialog>

        {/* 멤버 생성 버튼 클릭 핸들러 추가 */}
        <Box display="flex" justifyContent="end" mt="20px">
          <Button
            type="submit" // type을 button으로 변경
            color="secondary"
            variant="contained"
          >
            구단 생성
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EnrollClub;
