import { Box, Button, TextField, MenuItem } from "@mui/material";
import * as yup from "yup"; // yup을 사용하여 유효성 검사를 위한 스키마 정의
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import axios from "axios"; // axios 임포트 추가

const EnrollGuest = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [formValues, setFormValues] = useState({
    memberId: "",
    location: "",
    age: "",
    scheduleDate: "",
    scheduleStartTime: "",
    scheduleEndTime: "",
    specialRequests: "",
    available: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const schema = yup.object().shape({
      memberId: yup.string().required("required"),
      location: yup.string().required("required"),
      age: yup.number().required("required").positive().integer(), // 나이는 양의 정수여야 함
      scheduleDate: yup.date().required("required"), // 날짜 필드 추가
      scheduleStartTime: yup.string().required("required"), // 시간 필드 추가
      scheduleEndTime: yup.string().required("required"), // 시간 필드 추가
      specialRequests: yup.string().nullable(), // 특별 요청은 선택 사항
      available: yup.string().required("required"),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Submitting form with values:", formValues); // 보내려는 값 확인

      // 서버로 POST 요청 보내기
      try {
        const response = await axios.post("http://localhost:8080/api/guests", formValues); // 데이터 전송
        console.log("User created successfully:", response.data); // 성공 시 응답 확인
      } catch (error) {
        console.error("Error creating user:", error); // 오류 발생 시 로그 출력
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE Guest" subtitle="Create a New Guest" />

      <form onSubmit={handleSubmit}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="회원 ID"
            onChange={handleChange}
            value={formValues.memberId}
            name="memberId"
            error={!!errors.memberId}
            helperText={errors.memberId}
            sx={{ gridColumn: "span 4" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="위치"
            onChange={handleChange}
            value={formValues.location}
            name="location"
            error={!!errors.location}
            helperText={errors.location}
            sx={{ gridColumn: "span 4" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="number"
            label="나이"
            onChange={handleChange}
            value={formValues.age}
            name="age"
            error={!!errors.age}
            helperText={errors.age}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="date"
            label="일정 날짜"
            onChange={handleChange}
            value={formValues.scheduleDate}
            name="scheduleDate"
            error={!!errors.scheduleDate}
            helperText={errors.scheduleDate}
            sx={{ gridColumn: "span 2" }}
            InputLabelProps={{
              shrink: true, // 날짜 필드의 레이블을 위로 이동
            }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="time"
            label="시작 시간"
            onChange={handleChange}
            value={formValues.scheduleStartTime}
            name="scheduleStartTime"
            error={!!errors.scheduleStartTime}
            helperText={errors.scheduleStartTime}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="time"
            label="종료 시간"
            onChange={handleChange}
            value={formValues.scheduleEndTime}
            name="scheduleEndTime"
            error={!!errors.scheduleEndTime}
            helperText={errors.scheduleEndTime}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="특별 요청"
            onChange={handleChange}
            value={formValues.specialRequests}
            name="specialRequests"
            error={!!errors.specialRequests}
            helperText={errors.specialRequests}
            sx={{ gridColumn: "span 4" }}
          />

          <TextField
            fullWidth
            variant="filled"
            select
            label="가능 여부"
            onChange={handleChange}
            value={formValues.available}
            name="available"
            error={!!errors.available}
            helperText={errors.available}
            sx={{ gridColumn: "span 4" }}
          >
            <MenuItem value="YES">YES</MenuItem>
            <MenuItem value="NO">NO</MenuItem>
          </TextField>
        </Box>

        <Box display="flex" justifyContent="end" mt="20px">
          <Button
            type="submit"
            color="secondary"
            variant="contained"
          >
            멤버 생성
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EnrollGuest;
