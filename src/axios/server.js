import axios from 'axios';
import qs from 'qs';
import NProgress from 'nprogress';
import { notification, message } from 'antd';
import Base from '@/commonjs/base.js';
import permission from "../commonjs/permission";

//设置全局参数，如响应超市时间，请求前缀等
axios.defaults.timeout = 5000;
// axios.defaults.baseURI = '/api/v1';
axios.defaults.withCredentials = true;


//状态码错误信息
const codeMessage = {
    200: '服务器成功返回请求的数据',
    201: '新建或修改数据成功',
    202: '一个请求已经进入后台排队（异步任务）',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。'
}


// 添加一个请求拦截器，用于设置请求过渡状态
axios.interceptors.request.use((config) => {
    // 请求开始，蓝色过渡滚动条开始出现
    console.log('start');
    NProgress.start();
    return config;
}, (error) => {
    return Promise.reject(error);
});


// 添加一个返回拦截器
axios.interceptors.response.use((response) => {
    // 请求结束，蓝色过渡滚动条消失
    console.log('end');
    NProgress.done();
    return response;
}, (error) => {
    // 请求结束，蓝色过渡滚动条消失
    // 即使出现异常，也要调用关闭方法，否则一直处于加载状态很奇怪
    NProgress.done();
    return Promise.reject(error);
});


export const  http = function(opt){
     opt.data = qs.stringify(opt.data);
    //是否登录的配置
    axios.defaults.headers.common['SYS-PCSID'] = Base.getCookie(Base.cookieId);
    //调用axios api,统一拦截
    return  axios(opt)
        .then((response) => {
            //>>>>>>>>>>>>>> 请求成功 <<<<<<<<<<<<<<
            // console.log(`post ${opt.url}请求成功，响应数据：%0`,response);

            // 打印业务成功或错误提示
            if(response.data && response.data.code === 0){
                if(opt.url === '/api/admin/login'){
                    var obj = {name: response.data.data};
                    var json = JSON.stringify({ data: {permissions: obj}});
                    localStorage.setItem('auth',json);
                    message.success(response.data.msg);
                }else if(opt.url === '/api/admin/logout'){
                    //退出成功提示
                    message.success('退出成功');
                }
            }else if(response.data && response.data.code === 1005){
                //登录失效处理
                //失效时分别跳到不同的路径的登录页面
                message.success(response.data.msg);
                if(process.env.NODE_ENV === 'production'){
                    window.location.href = 'http://www.baidu.com/admin/index.html#/login';
                    return ;
                }else{
                    window.location.href = 'http://localhost:3006/#/login';
                    return ;
                }
            }else{
                message.error(response.data.msg);
            }

            return {...response};
        })
        .catch((error) => {
            //>>>>>>>>>>>>>> 请求失败 <<<<<<<<<<<<<<
            // 请求配置发生的错误
            if(!error.response){
                return console.log('Error', error.message);
            }

            //响应时状态码处理
            const status = error.response.status;
            const errortext = codeMessage[status] || error.response.statusText;

            notification.error({
                message: `请求错误${status}`,
                description: errortext,
            });
        })
}


