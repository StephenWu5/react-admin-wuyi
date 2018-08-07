import React from 'react';
import { Modal, Button, Icon, Input } from 'antd';
import { Menu, Dropdown, message, Upload } from 'antd';
import {
    Form, Select, InputNumber, Switch, Radio,
    Slider,  Rate,
} from 'antd';
import './addModel.css';
import {addInvestmentCase} from '@/axios/index.js';
import Ueditor from '@/components/ueditor/ueditor.jsx';


const FormItem = Form.Item;
const Option = Select.Option;

//图片上传的开始
const props = {
    name: 'file',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info){
        if(info.file.status !== 'uploading'){
            console.log(info.file, info.fileList);
        }
        if(info.file.status === 'done'){
            message.success(`${info.file.name} file uploaded successfully`);
        }else if(info.file.status === 'error'){
            message.error(`${info.file.name} file upload failed.`);
        }
    }
}
//图片上传的结束

//下拉菜单的开始
function handleButtonClick(e) {
    message.info('Click on left button.');
    console.log('click left button', e);
}

function handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
}

const menu =  (
    <Menu onClick={handleMenuClick}>
        <Menu.Item key="1"><Icon type="user" />1st menu item</Menu.Item>
        <Menu.Item key="2"><Icon type="user" />2nd menu item</Menu.Item>
        <Menu.Item key="3"><Icon type="user" />3rd item</Menu.Item>
    </Menu>
)
//下拉菜单的结束

class AddModel extends React.Component {
    constructor(props){
        super(props);
        this.switchToA = this.switchToA.bind(this);
        this.switchToB = this.switchToB.bind(this);
    }

    state = {
        visible: false,
        visibleA: 'active',
        visibleB: 'hidden'
    }



    showModal = () => {
        this.setState({
            visible: true,
        });
    }

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

    // 切换模态框的内容
    switchToA(){
        this.setState({
            visibleA: 'active',
            visibleB: 'hidden'
        });
    }
    switchToB(){
        this.setState({
            visibleA: 'hidden',
            visibleB: 'active'
        });
    }

    //表单提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var params = new URLSearchParams();
                for(var k in values){
                    console.log(k+':',values[k],'5555');
                    params.append('investmentCase.'+k,values[k]);
                }

                addInvestmentCase(params);
                this.handleOk();
            }
        });
    }

    handleSelectChange = (value) => {
        // console.log(value);
        // this.props.form.setFieldsValue({
        //     note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
        // });
    }

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    //获取百度富文本编辑器的值
    handleUeditorContent(content){
        console.log(content,'content');
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            text: content
        });
    }

    componentDidMount(){
        this.props.onRef(this)
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 12}
        }
        const formItemLayout_ueditor = {
            labelCol: {span: 5},
            wrapperCol: {span: 24}
        }
        return (
            <div>
                <Modal
                    className='modal666'
                    title="新增/编辑投资案例基本信息"
                    visible={this.state.visible}
                    // onOk={this.handleOk}
                    // okText='保存'
                    cancelText='取消'
                    onCancel={this.handleCancel}
                    closable={false}
                >
                    <div className="title">
                        <ul>
                            <li className={this.state.visibleB} onClick={this.switchToB}>案例内容</li>
                            <li className={this.state.visibleA}  onClick={this.switchToA}>基本信息</li>
                        </ul>
                    </div>
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
                                    label="案例名称"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: '请输入案例名称!' }],
                                    })(
                                        <Input placeholder="请选择案例名称!"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="所属领域"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('style_id', {
                                        rules: [{ required: true, message: '请选择所属领域!' }],
                                    })(
                                        <Select
                                            placeholder="请选择所属领域!"
                                            onChange={this.handleSelectChange}
                                        >
                                            <Option value="8">体游</Option>
                                            <Option value="13">旅游</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="案例图片"
                                >
                                    {getFieldDecorator('img', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.normFile,
                                    })(
                                        <Upload name="logo" action="/api/upload/handle?type=img" listType="picture">
                                            <Button>
                                                <Icon type="upload" /> 上传图片
                                            </Button>
                                        </Upload>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="案例logo"
                                >
                                    {getFieldDecorator('logo', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.normFile,
                                    })(
                                        <Upload name="logo" action="/api/upload/handle?type=img" listType="picture">
                                            <Button>
                                                <Icon type="upload" /> 上传图片
                                            </Button>
                                        </Upload>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="案例描述"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('detail', {
                                    })(
                                        <Input placeholder="请选择案例描述!"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="案例标题"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('title', {
                                    })(
                                        <Input placeholder="请选择案例标题!"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="案例官网"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('url', {
                                    })(
                                        <Input placeholder="请选择案例官网!"/>
                                    )}
                                </FormItem>
                            </div>
                            <div className={this.state.visibleB}>
                                <FormItem
                                    {...formItemLayout_ueditor}
                                >
                                    {getFieldDecorator('text', {
                                    })(
                                        <Ueditor  id_content='content' height="200" valuezhi="value" callback={(content)=>{
                                            this.handleUeditorContent(content);
                                        }}/>
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

const WrappedApp = Form.create()(AddModel);

export default WrappedApp;
