import React from 'react';
import { Modal, Button, Icon, Input } from 'antd';
import { Menu, Dropdown, message, Upload } from 'antd';
import {
    Form, Select, InputNumber, Switch, Radio,
    Slider,  Rate,
} from 'antd';
import './addOrEditModel.css';
import { http } from '@/axios/server.js';
import MyUpload from '../../Upload';



const FormItem = Form.Item;
const Option = Select.Option;


class AddOrEditModel extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        visible: false,
        type: 'add',
        id: null,
        params: {

        }
    }

    showModal = (type,targetObj,e) => {
        this.setState({
            visible: true,
            type: type
        });

        this.ModelType(type,targetObj);
    }

    // 添加vs编辑模态框模式
    ModelType = (type,targetObj) => {
        const { setFieldsValue } = this.props.form;

        if(type === 'add'){
            setFieldsValue({
                iconPath:''
            });
        }else if(type === 'edit'){
            targetObj = targetObj.targetObj;
            setFieldsValue({
                iconPath:'',
                parnersName: targetObj.parnersName,
                url: targetObj.url,
            });
            this.setState({
                id: targetObj.id
            })
        }

    }


    // 模态框的显示和隐藏
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }


    //表单提交
    handleSubmit = (e) => {
        e.preventDefault();

        // 提交前图片处理一下
        const { setFieldsValue } = this.props.form;
        if(this.child.state.file){
            let upload = this.child.state.file.response.data;
            setFieldsValue({
                iconPath: upload,
            })
        }


        this.props.form.validateFields((err, values) => {
            var type = this.state.type;
            if(type !== 'add'){
                values = Object.assign(values, {id : this.state.id});
            }
            console.log(values,'values');

            if (!err) {
                var opt = {
                    method: 'post',
                    url: type === 'add' ? '' : '',
                    params: values
                }

                http(opt).then((response) => {
                    // console.log(response,'res');
                    window.location.reload();
                })

                this.handleOk();
            }
        });
    }

    // img图片上传处理
    normFileImg = (e) => {
        var response  = e.file.response;
        var obj = '';

        if(response !== undefined){
            obj = response.obj;
        }
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    onRefUpload = (ref) =>{
        this.child = ref;
    }

    componentDidMount(){
        this.props.onRef(this);
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 12}
        }

        return (
            <div>
                <Modal
                    className='modal'
                    title="新增/编辑产业布局"
                    visible={this.state.visible}
                    cancelText='取消'
                    onCancel={this.handleCancel}
                    closable={false}
                >
                    <div className="content">
                        <Form onSubmit={this.handleSubmit}>
                                <FormItem
                                    wrapperCol={{ span: 19, offset: 5 }}
                                >
                                    <Button type="primary" htmlType="submit" style={{position:'absolute',left:'333px',top:'500px',zIndex:'999'}}>
                                        保存
                                    </Button>
                                </FormItem>
                            <div className={this.state.visibleA}>
                                <FormItem
                                    label="产业名称"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('parnersName', {
                                        rules: [{ required: true, message: '请输入案例名称!' }],
                                    })(
                                        <Input placeholder="请选择案例名称!"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="产业图片"
                                >
                                    {getFieldDecorator('iconPath', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.normFileImg,
                                        rules: [{ required: true, message: '请上传图片!' }]
                                    })(
                                        <MyUpload onRefUpload={this.onRefUpload}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="产业链接"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('url', {
                                        rules: [{ required: true, message: '请输入案例名称!' }],
                                    })(
                                        <Input placeholder="请选择案例名称!"/>
                                    )}
                                </FormItem>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

const WrappedApp = Form.create()(AddOrEditModel);

export default WrappedApp;
