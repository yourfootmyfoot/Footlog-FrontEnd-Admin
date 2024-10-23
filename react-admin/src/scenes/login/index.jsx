import { Box, Button, TextField, Typography } from "@mui/material";
import * as yup from "yup"; // yup을 사용하여 유효성 검사를 위한 스키마 정의
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트
import api from '../../config/axiosConfig'

const Login = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [formValues, setFormValues] = useState({
        email: "test@example.com",
        password: "password123"
    });

    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState(""); // 로그인 실패 시 오류 메시지를 담을 상태 추가
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const schema = yup.object().shape({
            email: yup.string().email("유효한 이메일을 입력해주세요").required("이메일을 입력해주세요"),
            password: yup.string().required("비밀번호를 입력해주세요"),
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
            console.log("로그인 폼 제출 :", formValues);

            try {
                const response = await api.post("/api/auth/login", formValues);

                // json 응답에서 토큰 정보 추출
                const accessToken = response.data.accessToken;
                localStorage.setItem('accessToken',accessToken);

                // 로그인 성공 시 루트 페이지로 이동
                navigate("../domain/member");

            } catch (error) {
                console.error("로그인 오류 발생:", error);
                // 로그인 실패 시 오류 메시지 설정
                setLoginError("로그인에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };

    return (
        <Box m="20px">
            <Header title="ADMIN LOGIN" subtitle="로그인 화면" />

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
                        type="email"
                        label="이메일"
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
                        onChange={handleChange}
                        value={formValues.password}
                        name="password"
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={{ gridColumn: "span 4" }}
                    />
                </Box>

                {/* 로그인 실패 시 오류 메시지 표시 */}
                {loginError && (
                    <Typography color="error" sx={{ mt: 2, gridColumn: "span 4" }}>
                        {loginError}
                    </Typography>
                )}

                <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="submit" color="secondary" variant="contained">
                        로그인
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default Login;