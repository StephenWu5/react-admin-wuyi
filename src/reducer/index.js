
import { combineReducers } from 'redux';
import * as type from '../action/type';

//从localstorage从取值
const defaultData = JSON.parse(localStorage.getItem('auth'));
console.log(defaultData,'defaultData')

const handleData = (state = {isFetching: true, data: defaultData}, action) => {
    switch (action.type) {
        case type.REQUEST_DATA:
            return {...state, isFetching: true,
            };
        case type.RECEIVE_DATA:
            console.log(action.payload,'PAYLOAD')
            return {...state, isFetching: false, ...action.payload};
        default:
            return {...state};
    }
};
//const httpData = (state = {isFetching: true, auth: defaultData}, action) => {
//    switch (action.type) {
//        case type.RECEIVE_DATA:
//        case type.REQUEST_DATA:
//            return {
//                ...state,
//                [action.category]: handleData(state[action.category], action)
//            };
//        default:
//            return {...state};
//    }
//};

export default combineReducers({
   handleData 
});
