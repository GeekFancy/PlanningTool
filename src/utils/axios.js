import axios from "axios"; // 引用axios

const instance = axios.create({
    baseURL: '/api',
    timeout: 1200000,
});
//get请求
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        instance
            .get(url, {
                params: params,
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}