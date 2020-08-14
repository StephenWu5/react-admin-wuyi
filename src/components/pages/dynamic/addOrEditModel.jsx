import React from 'react';
import { Modal, Button, Input, Form, Select} from 'antd';
import './addOrEditModel.css';
import { http } from '@/axios/server';
import Kindeditor from '@/components/kindEditor//kindEditor.jsx';
import MyUpload from '../../Upload';
import qs from 'qs';

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
                dynaTitle: '',
                upload: '',
                dynaPath: '',
                dynaUrl: '',
                dynaStatus: '0',
                citation: ''
            });

            setTimeout(() => {
                this.kindeditor.setEditorContent('');
            },1000);
        }else if(type === 'edit'){
            targetObj = targetObj.targetObj;
            setFieldsValue({
                dynaTitle: targetObj.dynaTitle,
                upload: 9,
                dynaPath: targetObj.dynaPath,
                // upload: targetObj.upload,
                dynaUrl: targetObj.dynaUrl,
                dynaStatus: targetObj.dynaStatus,
                citation: targetObj.citation
            });

            this.setState({
                id: targetObj.id
            })

            //百度的富文本编辑器
            setTimeout(() => {
                this.kindeditor.setEditorContent(targetObj.dynaContent);
            },1000);
        }

    }


    //获取kindeditor富文本编辑器的给到form对应的formitem
    handleKindeditorContent(content){
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            dynaContent: content
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
        const { setFieldsValue } = this.props.form;
        if(this.child.state.file){
            let upload = this.child.state.file.response.data;
            setFieldsValue({
                dynaPath: upload,
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
                    method: 'POST',
                    url: type === 'add' ? '/api/dynamic/addDynamic' : '/api/dynamic/updateDynamic',
                    data: values
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
    onRefUpload = (ref) => {
        this.child = ref;
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
                    title="新增/编辑动态"
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
                                    label="动态标题"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('dynaTitle', {
                                        rules: [{ required: true, message: '请输入动态标题!' }],
                                    })(
                                        <Input placeholder="请输入动态标题!"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    style={{display:'none'}}
                                    {...formItemLayout}
                                    label="图片"
                                >
                                    {getFieldDecorator('dynaPath', {
                                        rules: [{ required: true, message: '请上传图片!' }]
                                    })(
                                        <input type="text"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="动态图片"
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
                                    label="链接"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('dynaUrl', {
                                        rules: [{ required: true, message: '请输入链接!' }],
                                    })(
                                        <Input placeholder="请输入链接!"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="动态状态"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('dynaStatus', {
                                        rules: [{ required: true, message: '请输入动态状态!' }],
                                    })(
                                        <Select>
                                            <Option value="0">启用</Option>
                                            <Option value="1">禁用</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="动态简介"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('citation', {
                                        rules: [{ required: true, message: '请输入动态简介!' }],
                                    })(
                                        <TextArea rows={4} placeholder="请输入动态简介!" />
                                    )}
                                </FormItem>
                            </div>
                            <div className={this.state.visibleB +' editor'}>
                                <FormItem
                                    {...formItemLayout_kindeditor}
                                >
                                    {getFieldDecorator('dynaContent', {
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

