import React, { Component } from 'react';
import { Layout, notification, Icon } from 'antd';
import './style/index.less';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import { receiveData } from './action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Routes from './routes/index';

const { Content, Footer } = Layout;

let user,account;

class App extends Component {
    constructor(props){
        super(props);

    }
    state = {
        collapsed: false,
        user: null
    };
    componentWillMount() {
        const { receiveData } = this.props;
        user = JSON.parse(localStorage.getItem('auth'));
        account = user === null ? '未定义' : user.data.permissions.name.account;
        // 这里写一个接口获取用户名;
        // user && receiveData(user, 'auth');
        //适配屏幕
        this.getClientWidth();
        window.onresize = () => {
            console.log('屏幕变化了');
            this.getClientWidth();
        }
    }
    componentDidMount() {
        //新消息管理
        const openNotification = () => {
            let message = '您好-' + account;
            notification.open({
              message: message,
              description: (
                  <div>
                      <p>
                         欢迎登录!
                      </p>
                  </div>
              ),
              icon: <Icon type="smile-circle" style={{ color: 'red' }} />,
              duration: 0,
            });
            localStorage.setItem('isFirst', JSON.stringify(true));
        };
        const isFirst = JSON.parse(localStorage.getItem('isFirst'));
        !isFirst && openNotification();
    }
    // 获取当前浏览器宽度并设置responsive管理响应式
    getClientWidth = () => {    
        const { receiveData } = this.props;
        const clientWidth = document.body.clientWidth;
        console.log(clientWidth);
        //receiveData({isMobile: clientWidth <= 992}, 'responsive');
    };
    // 侧边栏控制
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        const { auth, responsive } = this.props;
        return (
            <Layout>
                {!responsive.data.isMobile && <SiderCustom collapsed={this.state.collapsed} />}
                <Layout style={{flexDirection: 'column'}}>
                    <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} user={auth || {}} />
                    <Content style={{ margin: '0 16px', overflow: 'initial' }}>
                        <Routes auth={auth} />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        {new Date().getFullYear()} © GMS by 豆腐坊子有限公司
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}


const mapStateToProps = state => {
    console.log(state.handleData,'state.handleData')
    const { auth = {data: {}}, responsive = {data: {}} } = state.handleData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
