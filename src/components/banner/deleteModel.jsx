import React from 'react';
import { Modal, Button } from 'antd';
import './deleteModel.css';
import  {deleteInvestmentCase} from '@/axios/index.js';


class DeleteModel extends React.Component {
    // constructor(props){
    //     super(props)
    // }

    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        const id = this.props.id;
        var params = new URLSearchParams();
        params.append('id',id);
        // deleteInvestmentCase(params);
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


    render() {
        return (
            <div>
                <a href="javascript:;" style={{  color: 'red'}} onClick={this.showModal}>删除</a>
                <Modal
                    className='deleteModal'
                    title="请确认是否删除这条投资案例？"
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