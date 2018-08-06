import axios from 'axios';
import Base from '@/commonjs/base.js';

const axiosP = axios.create({
    headers: {
        'SYS-PCSID': Base.getCookie(Base.cookieId)
    }
});


//添加投资案例
export const addInvestmentCase = (params) => axiosP.post('/api/investmentCase/save',params).then(result=>{
    result = result.data;
    (result.code === 0) && window.location.reload(true)
})

//删除投资案例
export const deleteInvestmentCase = (params) => axiosP.post('/api/investmentCase/delete',params).then(result=>{
    result = result.data;
    (result.code === 0) && window.location.reload(true)
})






