import axios from 'axios';

const header = {
    'Content-Type': 'application/json;charset=UTF-8',
};
// axios 实例
const instance = axios.create({
    timeout: 60000,
    responseType: 'json',
    headers: header,
});

// 添加请求拦截器
instance.interceptors.request.use(
    (request) => {
        const token = window.sessionStorage.getItem('token');
        request.headers = {
            "Authorization": 'Bearer ' + token!,
        };
        return request;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 添加响应拦截器
instance.interceptors.response.use(
    (response) => {
        const errorCode = response?.data?.statusCode;
        return response.data;
    },
    (error) => {
        const response = error.response;
        const data = response.data
        return Promise.reject(response || { message: error.message });
    },
);

export default instance