import { Box, Button, TextField, MenuItem } from "@mui/material";
import * as yup from "yup"; // yup을 사용하여 유효성 검사를 위한 스키마 정의
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import axios from "axios"; // axios 임포트 추가

const EnrollMember = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordMatch, setPasswordMatch] = useState(null);

  const handleChange = (e) => {
    // 이벤트 객체에서 name과 value를 추출
    const { name, value } = e.target;
  
    // 이전 폼 값을 바탕으로 새로운 값을 설정
    setFormValues((prevValues) => ({
      ...prevValues, // 이전 값 복사
      [name]: value, // 변경된 필드의 값을 업데이트
    }));
  
    // 비밀번호 확인 상태 업데이트 만약 변경된 필드가 'confirmPassword'일 경우
    if (name === "confirmPassword") {
      // 비밀번호 확인 필드의 값이 비밀번호 필드의 값과 같은지 확인
      setPasswordMatch(value === formValues.password);
      // 값이 같으면 passwordMatch가 true로 설정되고, 다르면 false로 설정됩니다.
    }
  };  

  const validateForm = () => {
    const schema = yup.object().shape({
      name: yup.string().required("required"),
      email: yup.string().email("invalid email").required("required"),
      password: yup.string().required("required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("required"),
      gender: yup.string().required("required"),
    });

    try {
      schema.validateSync(formValues, { abortEarly: false });
      setErrors({}); // 유효성 검사 통과 시 오류 상태 초기화
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
        const response = await axios.post("http://localhost:8080/api/auth/signup", dataToSubmit); // 데이터 전송
        console.log("User created successfully:", response.data); // 성공 시 응답 확인
      } catch (error) {
        console.error("Error creating user:", error); // 오류 발생 시 로그 출력
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE Member" subtitle="Create a New Member" />

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
            label="이름"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.name}
            name="name"
            error={!!errors.name}
            helperText={errors.name}
            sx={{ gridColumn: "span 4" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="email"
            label="이메일"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.email}
            name="email"
            error={!!errors.email}
            helperText={errors.email}
            sx={{ gridColumn: "span 4" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="password"
            label="비밀번호"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.password}
            name="password"
            error={!!errors.password}
            helperText={errors.password}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="password"
            label="비밀번호 확인"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.confirmPassword}
            name="confirmPassword"
            error={passwordMatch === false}
            helperText={
              passwordMatch === null
                ? ""
                : passwordMatch
                  ? "비밀번호가 일치합니다"
                  : "비밀번호와 다릅니다"
            }
            FormHelperTextProps={{
              style: { color: passwordMatch ? "green" : "red" },
            }}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            select
            label="성별"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.gender}
            name="gender"
            error={!!errors.gender}
            helperText={errors.gender}
            sx={{ gridColumn: "span 4" }}
          >
            <MenuItem value="MALE">MALE</MenuItem>
            <MenuItem value="FEMALE">FEMALE</MenuItem>
            <MenuItem value="MIX">MIX</MenuItem>
          </TextField>
        </Box>


        {/* 멤버 생성 버튼 클릭 핸들러 추가 */}
        <Box display="flex" justifyContent="end" mt="20px">
          <Button
            type="submit" // type을 button으로 변경
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

export default EnrollMember;