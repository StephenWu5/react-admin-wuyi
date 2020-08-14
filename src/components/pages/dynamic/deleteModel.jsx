import React from 'react';
import { Modal, Button } from 'antd';
import './deleteModel.css';
import { http } from '@/axios/server.js';

class DeleteModel extends React.Component {
    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        const id = this.props.id;
        var opt = {
            method: 'post',
            url: '/api/dynamic/delete',
            data: {
                id: id
            }
        }
        http(opt).then(() => {
            this.props.fetchList();
        });
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }


    render() {
        return (
            <div>
                <a href="javascript:;" style={{  color: 'red'}} onClick={this.showModal}>删除</a>
                <Modal
                    className='deleteModal'
                    title="请确认是否删除这条动态吗？"
                    bodyStyle={{height: 0,padding: 0}}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="確定"
                    cancelText="取消"
                >
                </Modal>
            </div>
        );
    }
}

export default  DeleteModel;