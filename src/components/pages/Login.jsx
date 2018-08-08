import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';
import axios from 'axios';
import http from '@/axios/server.js';
import Base from '@/commonjs/base.js';

const FormItem = Form.Item;

class Login extends React.Component {
    async login(params){
        const res = await http.post('/api/rbacUser/login',params);
        console.log(res);
        if(res.status === 200){
            Base.setCookie(Base.cookieId,res.data.obj,365*24*60*60*1000);
            this.props.history.push('/app/index');
        }
    }

    componentWillMount() {
    }
 
    componentDidUpdate(prevProps) { // React 16.3+弃用componentWillReceiveProps
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var params = {
                    account: values.account,
                    password: values.password
                }
                this.login(params);
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>体游控股后台管理系统</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('account', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>

        );
    }
}

const mapStateToPorps = state => {
    const { auth } = state.httpData;
    console.log(state.httpData,'state.httpData');
    return { auth };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});


export default connect(mapStateToPorps, mapDispatchToProps)(Form.create()(Login));