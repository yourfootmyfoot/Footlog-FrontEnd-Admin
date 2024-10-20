import { Box, Button, TextField, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import * as yup from "yup"; // yup을 사용하여 유효성 검사를 위한 스키마 정의
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import axios from "axios"; // axios 임포트 추가

const EnrollMatch = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [formValues, setFormValues] = useState({
    matchEnrollUserId: "",  // Long 타입으로 처리할 값
    myClubId: "",
    matchPhoto: "",
    matchIntroduce: "",
    matchDate: "",
    matchStartTime: "",
    matchEndTime: "",
    MatchPlayerQuantity: "",
    QuarterQuantity: "",
    fieldLocation: "",
    matchCost: "",
    pro: {
      isPro: false, // 프로 여부 체크박스 상태 추가
      proCount: "", // 프로의 수를 입력할 필드
    },
    clubLevel: "",
    matchGender: "",
    matchStatus: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // pro 객체의 속성을 변경할 경우 처리
    if (name.startsWith("pro.")) {
      const proKey = name.split(".")[1]; // pro.isPro 또는 pro.proCount 구분
      setFormValues((prevValues) => ({
        ...prevValues,
        pro: {
          ...prevValues.pro,
          [proKey]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // formValues에 맞는 yup 스키마 생성
  const validateForm = () => {
    const schema = yup.object().shape({
      matchEnrollUserId: yup.number().required("필수 입력 항목입니다").integer("정수여야 합니다").positive("양수만 가능합니다"),
      myClubId: yup.string().required("필수 입력 항목입니다"),
      matchIntroduce: yup.string().required("필수 입력 항목입니다"),
      matchDate: yup.date().required("필수 입력 항목입니다"),
      matchStartTime: yup.string().required("필수 입력 항목입니다"),
      matchEndTime: yup.string().required("필수 입력 항목입니다"),
      MatchPlayerQuantity: yup.number().required("필수 입력 항목입니다").positive("양수만 가능합니다"),
      QuarterQuantity: yup.number().required("필수 입력 항목입니다").positive("양수만 가능합니다"),
      fieldLocation: yup.string().required("필수 입력 항목입니다"),
      matchCost: yup.number().required("필수 입력 항목입니다").positive("양수만 가능합니다"),
      clubLevel: yup.string().required("필수 입력 항목입니다"),
      matchGender: yup.string().required("필수 입력 항목입니다"),
      matchStatus: yup.string().required("필수 입력 항목입니다"),
      // 프로 수 유효성 검사
      // proCount: formValues.pro.isPro ? yup.number().required("필수 입력 항목입니다").positive("양수만 가능합니다") : yup.number().notRequired(),
      MatchPlayerQuantity: yup.number().required("필수 입력 항목입니다").positive("양수만 가능합니다"),

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
      console.log("버튼 누름");
      console.log("Submitting form with values:", formValues); // 보내려는 값 확인

      // 프로 객체를 포함하여 데이터 전송
      const { pro, ...dataToSubmit } = formValues;
      const dataToSend = {
        ...dataToSubmit,
        pro: {
          isPro: pro.isPro,
          proCount: pro.proCount,
        },
      };

      // 서버로 POST 요청 보내기
      try {
        const response = await axios.post("http://localhost:8080/api/v1/matches", dataToSend); // 데이터 전송
        console.log("User created successfully:", response.data); // 성공 시 응답 확인
      } catch (error) {
        console.error("Error creating user:", error); // 오류 발생 시 로그 출력
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE Match" subtitle="Create a New Match" />

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
            type="number" // Long 타입으로 처리할 숫자 입력 필드
            label="사용자 ID"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.matchEnrollUserId}
            name="matchEnrollUserId"
            error={!!errors.matchEnrollUserId}
            helperText={errors.matchEnrollUserId}
            sx={{ gridColumn: "span 1" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="클럽 ID"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.myClubId}
            name="myClubId"
            error={!!errors.myClubId}
            helperText={errors.myClubId}
            sx={{ gridColumn: "span 1" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="사진 URL"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.matchPhoto}
            name="matchPhoto"
            error={!!errors.matchPhoto}
            helperText={errors.matchPhoto}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="소개"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.matchIntroduce}
            name="matchIntroduce"
            error={!!errors.matchIntroduce}
            helperText={errors.matchIntroduce}
            sx={{ gridColumn: "span 4" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="date"
            label="경기 날짜"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.matchDate}
            name="matchDate"
            error={!!errors.matchDate}
            helperText={errors.matchDate}
            sx={{ gridColumn: "span 1" }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="time"
            label="경기 시작 시간"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.matchStartTime}
            name="matchStartTime"
            error={!!errors.matchStartTime}
            helperText={errors.matchStartTime}
            sx={{ gridColumn: "span 1" }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="time"
            label="경기 종료 시간"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.matchEndTime}
            name="matchEndTime"
            error={!!errors.matchEndTime}
            helperText={errors.matchEndTime}
            sx={{ gridColumn: "span 1" }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="number"
            label="참여 인원"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.MatchPlayerQuantity}
            name="MatchPlayerQuantity"
            error={!!errors.MatchPlayerQuantity}
            helperText={errors.MatchPlayerQuantity}
            sx={{ gridColumn: "span 1" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="number"
            label="쿼터 수"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.QuarterQuantity}
            name="QuarterQuantity"
            error={!!errors.QuarterQuantity}
            helperText={errors.QuarterQuantity}
            sx={{ gridColumn: "span 1" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="장소"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.fieldLocation}
            name="fieldLocation"
            error={!!errors.fieldLocation}
            helperText={errors.fieldLocation}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="number"
            label="비용"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.matchCost}
            name="matchCost"
            error={!!errors.matchCost}
            helperText={errors.matchCost}
            sx={{ gridColumn: "span 1" }}
          />

          <TextField
            fullWidth
            variant="filled"
            select
            label="클럽 레벨"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.clubLevel}
            name="clubLevel"
            error={!!errors.clubLevel}
            helperText={errors.clubLevel}
            sx={{ gridColumn: "span 1" }}
          >
            {/* 클럽 레벨 선택지 추가 */}
            <MenuItem value="프로">프로</MenuItem>
            <MenuItem value="아마추어">아마추어</MenuItem>
            <MenuItem value="입문자">입문자</MenuItem>
            <MenuItem value="세미프로">세미프로</MenuItem>
            <MenuItem value="월드클래스">월드클래스</MenuItem>
          </TextField>

          <TextField
            fullWidth
            variant="filled"
            select
            label="성별"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.matchGender}
            name="matchGender"
            error={!!errors.matchGender}
            helperText={errors.matchGender}
            sx={{ gridColumn: "span 1" }}
          >
            {/* 성별 선택지 추가 */}
            <MenuItem value="MALE">MALE</MenuItem>
            <MenuItem value="FEMALE">FEMALE</MenuItem>
          </TextField>

          <TextField
            fullWidth
            variant="filled"
            select
            label="상태"
            onBlur={handleChange}
            onChange={handleChange}
            value={formValues.matchStatus}
            name="matchStatus"
            error={!!errors.matchStatus}
            helperText={errors.matchStatus}
            sx={{ gridColumn: "span 1" }}
          >
            {/* 상태 선택지 추가 */}
            <MenuItem value="WAITING">WAITING</MenuItem>
            <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
            <MenuItem value="FINISHED">FINISHED</MenuItem>
          </TextField>

          {/* 프로 여부 체크박스 추가 */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formValues.pro.isPro}
                onChange={handleChange}
                name="pro.isPro"
              />
            }
            label="프로인가요?"
          />

          {/* 프로 수 입력 필드 추가 */}
          {formValues.pro.isPro && (
            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="프로 수"
              onBlur={handleChange}
              onChange={handleChange}
              value={formValues.pro.proCount}
              name="pro.proCount"
              error={!!errors.proCount}
              helperText={errors.proCount}
              sx={{ gridColumn: "span 1" }}
            />
          )}
        </Box>

        <Button
          type="submit"
          sx={{
            backgroundColor: "#00C2CB",
            color: "white",
            padding: "15px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "#009B9C",
            },
          }}
        >
          Create New Match
        </Button>
      </form>
    </Box>
  );
};

export default EnrollMatch;
