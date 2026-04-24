import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:3000/api/v1", // 백엔드 주소로 수정
    headers: {
        "Content-Type": "application/json",
    },
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        const responseData = error.response?.data;

        const customError = new Error(
            responseData?.message || "요청 처리 중 오류가 발생했습니다."
        );

        customError.code = responseData?.code;
        customError.data = responseData?.data;
        customError.status = error.response?.status;

        return Promise.reject(customError);
    }
);

export default client;