import React, { Component } from 'react';
import { Menu, Icon, Layout, Badge, Popover } from 'antd';
import screenfull from 'screenfull';
// import { gitOauthToken, gitOauthInfo } from '../axios';
import Base from '@/commonjs/base.js';
import { queryString } from '@/commonjs/queryString.js';
import avater from '../style/imgs/avator.jpg';
import SiderCustom from './SiderCustom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { http } from '@/axios/server.js';
import {receiveData, fetchData} from "../action";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class HeaderCustom extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: '',
            visible: false,
        };
    }



    screenFull = () => {
        if (screenfull.enabled) {
            screenfull.request();
        }
    };

    menuClick = e => {
        console.log(e);
        e.key === 'logout' && this.logout();
    };

    logout = () => {
        var opt = {
            method: 'post',
            url: '/api/admin/logout'
        }
        const { fetchData } = this.props;
        fetchData({funcName: 'http', params: opt, stateName: 'auth'});
        setTimeout(() => {
            alert('登出操纵')
            let permission = this.props.auth.data.permissions;
            if(permission === null){
                localStorage.removeItem("auth");
                this.props.history.push('/login');
            }
        },1000);
    }


    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };

    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };

    componentDidMount() {
        const QueryString = queryString();
        const _user = JSON.parse(localStorage.getItem('auth')) || '测试';
        const account = _user === '测试' ? '测试' : _user.data.permissions.name.account;
        if (!_user && QueryString.hasOwnProperty('code')) {
            this.setState({
                user: {
                    userName: account
                }
            })
        } else {
            this.setState({
                user: {
                    userName: account
                }
            });
        }
    };

    render() {
        const { responsive, path } = this.props;
        return (
            <Header style={{ background: '#fff', padding: 0, height: 65 }} className="custom-theme" >
                {
                    responsive.data.isMobile ? (
                        <Popover content={<SiderCustom path={path} popoverHide={this.popoverHide} />} trigger="click" placement="bottomLeft" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
                            <Icon type="bars" className="trigger custom-trigger" />
                        </Popover>
                    ) : (
                        <Icon
                            className="trigger custom-trigger"
                            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.props.toggle}
                        />
                    )
                }
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                    onClick={this.menuClick}
                >
                    <Menu.Item key="full" onClick={this.screenFull} >
                        <Icon type="arrows-alt" onClick={this.screenFull} />
                    </Menu.Item>
                    {/*消息管理*/}
                    {/*<Menu.Item key="1">*/}
                        {/*<Badge count={25} overflowCount={11} style={{marginLeft: 10}}>*/}
                            {/*<Icon type="notification" />*/}
                        {/*</Badge>*/}
                    {/*</Menu.Item>*/}
                    <SubMenu title={<span className="avatar"><img src={avater} alt="头像" /><i className="on bottom b-white" /></span>}>
                        <MenuItemGroup title="用户中心">
                            <Menu.Item key="setting:1">您好 - {this.state.user.userName}</Menu.Item>
                            <Menu.Item key="setting:2">个人信息</Menu.Item>
                            <Menu.Item key="logout"><span>退出登录</span></Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                </Menu>
                <style>{`
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -40px;
                    }
                `}</style>
            </Header>
        )
    }
}

const mapStateToProps = state => {
    const { auth = { data: {}}, responsive = {data: {}} } = state.handleData;
    return {auth, responsive};
};


const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderCustom));