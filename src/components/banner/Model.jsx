import React from 'react';
import { Modal, Button, Icon, Input } from 'antd';
import { Menu, Dropdown, message, Upload } from 'antd';
import './model.css';


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

class Model extends React.Component {
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
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
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

    componentWillMount(){
        console.log(this.props,'props');
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>添加<Icon type="plus"/></Button>
                <Modal
                    className='modal666'
                    title="新增/编辑投资案例基本信息"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText='保存'
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
                        <div className={this.state.visibleA}>
                            <Input.Group>
                                <div style={{float:'left',width:'20%',lineHeight:'30px'}}>案例名称：</div>
                                <Input placeholder="请输入案例名称" style={{width:'80%',float:'left',marginBottom:'10px'}}/>
                            </Input.Group>
                            <Input.Group>
                                <div style={{float:'left',width:'20%',lineHeight:'30px'}}>所属领域：</div>
                                {/*<Input placeholder="请输入所属领域" style={{width:'80%',float:'left',marginBottom:'10px'}}/>*/}
                                <Dropdown overlay={menu}>
                                    <Button style={{ width:'80%', float:'left',marginBottom:'10px',textAlign: 'left'}}>
                                        Button <Icon type="down" />
                                    </Button>
                                </Dropdown>
                            </Input.Group>
                            <Input.Group>
                                <div style={{float:'left',width:'20%',lineHeight:'30px'}}>案例图片：</div>
                                {/*<Input placeholder="请输入案例图片" style={{width:'80%',float:'left',marginBottom:'10px'}}/>*/}
                                <Upload {...props}>
                                    <Button>
                                        <Icon type="upload" /> Click to Upload
                                    </Button>
                                </Upload>
                            </Input.Group>
                            <Input.Group>
                                <div style={{float:'left',width:'20%',lineHeight:'30px'}}>案例Logo：</div>
                                <Input placeholder="请输入案例Logo" style={{width:'80%',float:'left',marginBottom:'10px'}}/>
                            </Input.Group>
                            <Input.Group>
                                <div style={{float:'left',width:'20%',lineHeight:'30px'}}>案例描述：</div>
                                <Input placeholder="请输入案例描述" style={{width:'80%',float:'left',marginBottom:'10px'}}/>
                            </Input.Group>
                            <Input.Group>
                                <div style={{float:'left',width:'20%',lineHeight:'30px'}}>案例标题：</div>
                                <Input placeholder="请输入案例标题" style={{width:'80%',float:'left',marginBottom:'10px'}}/>
                            </Input.Group>
                            <Input.Group>
                                <div style={{float:'left',width:'20%',lineHeight:'30px'}}>案例官网：</div>
                                <Input placeholder="请输入案例官网" style={{width:'80%',float:'left',marginBottom:'10px'}}/>
                            </Input.Group>
                        </div>
                        <div className={this.state.visibleB}>
                            44
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Model;
