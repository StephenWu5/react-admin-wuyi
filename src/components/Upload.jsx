import React,{ Component } from 'react';
import { Upload, Button, Icon, message} from 'antd';
import $ from 'jquery';


//上传组件的默认props的值
const fileList = [];
var props = {
    name: "fileName",
    action: "/api/upload/file",
    listType: "picture",
    defaultFileList: [...fileList]
}

class Upload1 extends Component{
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    state = {
        file: null
    }

    // 清空图片
    removeImg(){
        $('.ant-upload-list .anticon.anticon-cross').click();

        //清空file
        this.setState({
            file: null
        })
    }

    // 监听上传过程的完成
    onChange(info){
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if(info.file.status === 'done' && info.file.response.code === 1005) {
                message.error(`${info.file.response.msg}`);
                setTimeout(()=>{
                    if(process.env.NODE_ENV === 'production'){
                        window.location.href = 'http://www.baidu.com/admin/index.html#/login';
                        return ;
                    }else{
                        window.location.href = 'http://localhost:3006/#/login';
                        return ;
                    }
                },1000);
        }else if(info.file.status === 'done' && info.file.response.code === 0){
            this.setState({
                file: info.file
            })

            this.props.clearUpload();
            message.success(`${info.file.name} file uploaded successfully`);
        }
        else if(info.file.status === 'error'){
            message.error(`${info.file.name} file upload failed.`);
        }


    }

    componentDidMount(){
        this.props.onRefUpload(this);
    }

    render(){
        return(
            <div>
                <Upload {...props} onChange={this.onChange} onRemove={this.onRemove}>
                    <Button>
                        <Icon type="upload" /> 上传图片
                    </Button>
                </Upload>
                <p>{this.props.px}</p>
            </div>
        )
    }
}

export default Upload1;