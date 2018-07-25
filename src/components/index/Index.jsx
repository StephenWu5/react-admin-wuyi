import React from 'react';
import './Index.css';
import logo from  './img/logo.png';

class index extends React.Component {  
    render() {
        return (
            <div className="row">
                <div className="logo-bg">
                    <img src={logo} alt="" style={{width: '161',height: "156"}} />
                </div>
            </div>
        );
    }
}

export default index;