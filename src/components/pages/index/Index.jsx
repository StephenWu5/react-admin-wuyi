import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import {receiveData, fetchData} from "@/action";
import { Row, Col, Card } from 'antd';

import Base from '@/commonjs/base.js';
import styles from './index.module.less';
import './Index.css';
import logo from  './img/logo.png';

class index extends React.Component {
    componentWillMount(){
    }

    render() {
        return (
            <div>
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="豆腐坊子" bordered={false}>
                                <div className="row">
                                    {/*<div className="logo-bg" style={{background: '#001529'}}>*/}
                                        {/*<img src={logo} alt="" style={{width: '161',height: "156",background:"#001529"}} />*/}
                                    {/*</div>*/}
                                    <div>
                                        <p>豆腐坊子</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>

        );
    }
}

//export default index;

const mapStateToPorps = state => {
    const { auth } = state.handleData;
    return { auth };
};

const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default withRouter(connect(mapStateToPorps, mapDispatchToProps)(index));
