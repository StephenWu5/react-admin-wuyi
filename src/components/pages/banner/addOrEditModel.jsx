import React from 'react';
import { Modal, Button, Form, Select } from 'antd';
import './addOrEditModel.css';
import { http } from '@/axios/server.js';
import MyUpload from '../../Upload';



const FormItem = Form.Item;
const Option = Select.Option;


class AddOrEditModel extends React.Component {
    constructor(props){
        super(props);
        this.clearUpload = this.clearUpload.bind(this);
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
        const { setFieldsValue,  getFieldValue } = this.props.form;


        if(type === 'add'){
            setFieldsValue({
                banPath: '',
                upload: ''
            });


        }else if(type === 'edit'){
            targetObj = targetObj.targetObj;
            setFieldsValue({
                upload: 9,
                banPath: targetObj.banPath
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
        this.child.removeImg();
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
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
                banPath: upload,
                upload: 1
            })
        }

        this.props.form.validateFields((err, values) => {
            var type = this.state.type;
            if(type !== 'add'){
                values = Object.assign(values, {id : this.state.id});
            }
            //删除对象中的upload属性
            delete values.upload;

            if (!err) {
                var opt = {
                    method: 'post',
                    url: type === 'add' ? '/api/banner/add' : '/api/banner/update',
                    params: values
                }

                http(opt).then((response) => {
                    this.props.fetchList();
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

        return (
            <div>
                <Modal
                    className='modal'
                    title="新增/编辑Banner"
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
                                    <Button type="primary" htmlType="submit" style={{position:'absolute',left:'333px',top:'501px',zIndex:'999'}}>
                                        保存
                                    </Button>
                                </FormItem>
                            <div className={this.state.visibleA}>
                                <FormItem
                                    style={{display:'none'}}
                                    {...formItemLayout}
                                    label="图片"
                                >
                                    {getFieldDecorator('banPath', {
                                        rules: [{ required: true, message: '请上传图片!' }]
                                    })(
                                        <input type="text"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="案例图片"
                                >
                                    {getFieldDecorator('upload',{
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.normFileImg,
                                        rules: [{ required: true, message: '请上传图片!' }]
                                    })(
                                        <MyUpload onRefUpload={this.onRefUpload} px={""} clearUpload={this.clearUpload}/>
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
