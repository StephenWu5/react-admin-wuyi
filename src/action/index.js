import * as type from './type';
import * as  http from '../axios/server';


const requestData = category => ({
    type: type.REQUEST_DATA,
    payload: {
        category
    }
});

export const receiveData = (auth, category) => ({
    type: type.RECEIVE_DATA,
    payload: {
        auth,
        category
    }
});

/**
 * 请求数据调用方法
 * @param funcName      请求接口的函数
 * @param params        请求接口的参数
 */
//其实不应该把请求接口和dispatch绑定在一处
export const fetchData = ({funcName, params, stateName}) => dispatch => {
    !stateName && (stateName = funcName);
    // dispatch(requestData(stateName));
    return http[funcName](params).then(res => {
        if(res && res.data){
            dispatch(receiveData({ permissions :res.data.data }, stateName));
        }else{
            alert('登录有问题')
        }
        // console.log(receiveData({data:{ permissions :[1,2,4] }}, stateName),'9999');
    });
};
