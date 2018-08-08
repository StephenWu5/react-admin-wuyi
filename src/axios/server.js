import axios from 'axios';
import qs from 'qs';
import Base from '@/commonjs/base.js';

const axiosH = axios.create({
    headers: {
        'SYS-PCSID': Base.getCookie(Base.cookieId)
    }
});

let http = {
    post : '',
    get: ''
}

http.post = function(api,data){
    let params = qs.stringify(data)
    return new Promise((resolve,rejected) => {
        axiosH.post(api,params).then((res) => {
            resolve(res);
        })
    })
}

http.get = function(api,data){
    let params = qs.stringify(data)
    return new Promise((resolve,rejected) => {
        axiosH.get(api,params).then((res) => {
            resolve(res);
        })
    })
}

export default http;