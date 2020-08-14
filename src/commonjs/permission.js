import Base from '@/commonjs/base.js';

let permission = {};
//登录验证
function checkLogin(){
    if(Base.getCookie(Base.cookieId) !== ''){
        // this.props.history.push('/login');
        // 以后的权限数组放这里
        permission = ['login','/app/auth/routerEnter','auth/authPage/visit','auth/authPage/edit']
    }else{
        // 这里空数组是一个对象，不是false
        permission = false
    }
}

checkLogin();

export default  permission;
