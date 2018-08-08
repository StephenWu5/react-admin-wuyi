import React from 'react';
import { Modal, Button, Icon, Input } from 'antd';
import { Menu, Dropdown, message, Upload } from 'antd';
import {
    Form, Select, InputNumber, Switch, Radio,
    Slider,  Rate,
} from 'antd';
import './addOrEditModel.css';
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

class AddOrEditModel extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        visible: false,
        visibleA: 'active',
        visibleB: 'hidden',
        haha: 'haha666'
    }



    showModal = (type,targetObj,e) => {
        this.setState({
            visible: true
        });

        this.switchToA();
        this.ModelType(type,targetObj);
    }

    // 添加vs编辑模态框模式
    ModelType = (type,targetObj) => {
        const { setFieldsValue } = this.props.form;
        // console.log(targetObj,'targetObj');

        if(type === 'add'){
            setFieldsValue({
                detail: '',
                img: '',
                logo: '',
                name: '',
                style_id: '',
                text: '646446',
                title: '',
                url: ''
            });

            setTimeout(() => {
                this.ueditor.setEditorContent('');
            },1000);
        }else if(type === 'edit'){
            console.log(type,'----edit');
            targetObj = targetObj.targetObj;
            setFieldsValue({
                detail: targetObj.detail,
                // img: targetObj.img,
                // logo: targetObj.logo,
                name: targetObj.name,
                style_id: targetObj.style_id,
                title: targetObj.title,
                url: targetObj.url,
                text: targetObj.text
            });

            //百度的富文本编辑器
            setTimeout(() => {
                this.ueditor.setEditorContent(targetObj.text);
            },1000);
        }

    }

    //获取百度富文本编辑器的给到form对应的formitem
    handleUeditorContent(content){
        console.log(content,'content');
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            text: content
        });
    }

    onRefUeditor = (ref) => {
        this.ueditor = ref
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

    // 切换模态框的内容
    switchToA = () => {
        this.setState({
            visibleA: 'active',
            visibleB: 'hidden'
        });
    }
    switchToB = () => {
        this.setState({
            visibleA: 'hidden',
            visibleB: 'active'
        });
    }

    //表单提交
    handleSubmit = (e) => {
        e.preventDefault();

        // 提交前图片处理一下
        const { setFieldsValue,  getFieldValue } = this.props.form;
        let logo = getFieldValue('logo')[0].response.obj;
        let img = getFieldValue('img')[0].response.obj;
        setFieldsValue({
            logo: logo,
            img: img
        })

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

    // img图片上传处理
    normFileImg = (e) => {
        console.log(e,'e');
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

    // logo图片上传处理
    normFileLogo = (e) => {
        console.log(e,'e');
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



    componentDidMount(){
        this.props.onRef(this);

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
                                        getValueFromEvent: this.normFileImg,
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
                                        getValueFromEvent: this.normFileLogo,
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
                                        <Ueditor  id_content='content' height="200" valuezhi={this.state.haha}   callback={(content)=>{
                                            this.handleUeditorContent(content);
                                        }} onRefUeditor={this.onRefUeditor}/>
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
