import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { fetchData, receiveData } from '@/action';

import { Form, Icon, Input, Button } from 'antd';
import * as http from '@/axios/server.js';

const FormItem = Form.Item;

class Login extends React.Component {
    async login(params){
        var opt = {
            method: 'post',
            url: '/api/admin/login',
            data : params
        }
        const { fetchData } = this.props;

        var res = await fetchData({funcName: 'http', params: opt, stateName: 'auth'});

        let { auth } = this.props;
        if(auth && auth.data.permissions != null){
            this.props.history.push('/app/index');
        }else{//不管怎么样，给他们做一层放开。
            //receiveData({ permissions : '888',data: {6666: '6666'}},'responsive');
            //定义一个全局Store就可以
            //store.dispatch(receiveData({ permissions :res.data.data }, 'responsive'));
            
            this.props.history.push('/app/index');
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var params = {
                    account: values.account,
                    pwd: values.pwd
                }
                this.login(params);
            }
        });
    };


    componentWillMount() {

    }
 
    componentDidUpdate(prevProps) { // React 16.3+弃用componentWillReceiveProps
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>豆腐坊子后台管理系统</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('account', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名!" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('pwd', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码!" />
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
    const { auth } = state.handleData;
    return { auth };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});


export default connect(mapStateToPorps, mapDispatchToProps)(Form.create()(Login));
