import axios from 'axios';
import qs from 'qs';

const instance = axios.create({
    baseURL: '', // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    timeout: 20000, // 如果请求时间超过 `timeout` 的值，则请求会被中断
    headers: {
        ['Cache-Control']: 'no-cache',
        ['Content-Type']: 'application/json',
        ['x-requested-with']: 'XMLHttpRequest',
    }, // 自定义请求头
    paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'indices' });
    }, // `paramsSerializer`是可选方法，主要用于序列化`params`
});

// 添加请求拦截器
instance.request.use(
    (config) => {
        // 在发送请求之前
        // 携带用户的token信息
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
instance.response.use(
    (response) => {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        return response;
    },
    (error) => {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default instance;
