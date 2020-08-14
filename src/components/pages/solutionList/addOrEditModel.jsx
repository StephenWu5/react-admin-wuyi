import React from 'react';
import { Modal, Button, Input, Form, Select } from 'antd';
import './addOrEditModel.css';
import { http } from '@/axios/server.js';
import Kindeditor from '@/components/kindEditor//kindEditor.jsx';
import MyUpload from '../../Upload';


const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;


class AddOrEditModel extends React.Component {
    constructor(props){
        super(props);
        this.clearUpload = this.clearUpload.bind(this);
    }

    state = {
        visible: false,
        type: 'add',
        visibleA: 'active',
        visibleB: 'hidden',
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
                planName: '',
                planPath: '',
                upload: '',
                planStatus: '1',
                ptypeId: '1',
                citation: ''
            });

            setTimeout(() => {
                this.kindeditor.setEditorContent('');
            },1000);
        }else if(type === 'edit'){
            targetObj = targetObj.targetObj;
            console.log(targetObj, 'targetObj');
            setFieldsValue({
                planName: targetObj.planName,
                upload: 9,
                planPath: targetObj.planPath,
                planStatus: targetObj.planStatus,
                ptypeId: targetObj.ptypeId + '',
                citation: targetObj.citation
            });

            this.setState({
                id: targetObj.id
            })

            //百度的富文本编辑器
            setTimeout(() => {
                this.kindeditor.setEditorContent(targetObj.planContent);
            },1000);
        }

    }


    //获取kindeditor富文本编辑器的给到form对应的formitem
    handleKindeditorContent(content){
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            planContent: content
        });
    }

    onRefKindeditor = (ref) => {
        this.kindeditor = ref
    }

    // 模态框的显示和隐藏
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.switchToA();
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
        this.switchToA();
    }

    // 切换模态框的内容
    switchToA = () => {
        this.setState({
            visibleA: 'active',
            visibleB: 'hidden'
        });

        this.child.removeImg();
    }
    switchToB = () => {
        this.setState({
            visibleA: 'hidden',
            visibleB: 'active'
        });

        this.child.removeImg();
    }

    //表单提交
    handleSubmit = (e) => {
        e.preventDefault();

        // 提交前图片处理一下
        // 提交前图片处理一下
        const { setFieldsValue } = this.props.form;
        if(this.child.state.file){
            let upload = this.child.state.file.response.data;
            setFieldsValue({
                planPath: upload,
            })
        }

        this.props.form.validateFields((err, values) => {
            var type = this.state.type;
            if(type !== 'add'){
                values = Object.assign(values, {id : this.state.id});
            }
            delete values.upload;

            if (!err) {
                var opt = {
                    method: 'post',
                    url: type === 'add' ? '/api/plan/addPlan' : '/api/plan/updatePlan',
                    params: values
                }

                http(opt).then((response) => {
                    this.props.fetchList();
                    this.handleOk();

                })

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

    //拿到upload子组件的作用域
    onRefUpload = (ref) =>{
        this.child = ref
    }

    clearUpload(){
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            upload: 9
        })
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

        const formItemLayout_kindeditor = {
            labelCol: {span: 5},
            wrapperCol: {span: 24}
        }

        return (
            <div>
                <Modal
                    className='modal'
                    title="新增/编辑  解决方案"
                    visible={this.state.visible}
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
                                    <Button type="primary" htmlType="submit" style={{position:'absolute',left:'333px',top:'501px',zIndex:'999'}}>
                                        保存
                                    </Button>
                                </FormItem>
                            <div className={this.state.visibleA}>
                                <FormItem
                                    label="标题"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('planName', {
                                        rules: [{ required: true, message: '请输入标题!' }],
                                    })(
                                        <Input placeholder="请输入标题!"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    style={{display:'none'}}
                                    {...formItemLayout}
                                    label="图片"
                                >
                                    {getFieldDecorator('planPath', {
                                        rules: [{ required: true, message: '请上传图片!' }]
                                    })(
                                        <input type="text"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="图片"
                                >
                                    {getFieldDecorator('upload', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.normFileImg,
                                        rules: [{ required: true, message: '请上传图片!' }]
                                    })(
                                        <MyUpload onRefUpload={this.onRefUpload} px={""} clearUpload={this.clearUpload}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="类型"
                                >
                                    {getFieldDecorator('ptypeId', {
                                        rules: [{ required: true, message: '请输入链接!' }],
                                    })(
                                        <Select>
                                            <Option value="1">体育公园/户外健身</Option>
                                            <Option value="2">校园体育</Option>
                                            <Option value="3">房地产行业</Option>
                                            <Option value="4">运营管理</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="状态"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('planStatus', {
                                        rules: [{ required: true, message: '请输入状态!' }],
                                    })(
                                        <Select>
                                            <Option value="0">启用</Option>
                                            <Option value="1">禁用</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="简介"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('citation', {
                                        rules: [{ required: true, message: '请输入简介!' }],
                                    })(
                                        <TextArea rows={4} placeholder="请输入简介!" />
                                    )}
                                </FormItem>
                            </div>
                            <div className={this.state.visibleB+' editor'}>
                                <FormItem
                                    {...formItemLayout_kindeditor}
                                >
                                    {getFieldDecorator('planContent', {
                                    })(
                                        <Kindeditor  id_content='content' height="200" valuezhi={this.state.haha}   callback={(content)=>{
                                            this.handleKindeditorContent(content);
                                        }} onRefKindeditor={this.onRefKindeditor}/>
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

