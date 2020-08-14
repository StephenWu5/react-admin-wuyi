import React,{Component} from 'react';
import './kindEditor.css';

var editor = null;


class Kindeditor extends Component {
    constructor(props){
        super(props);
    }

    //打开对话框设置编辑器的值
    setEditorContent(value){
        editor.html(value);
    }

    initEditorContent = () => {
        var that = this;
        //再次初始化有问题  要销毁原来的编辑器
        try {
            window.KindEditor.remove('#'+ this.props.id_content);
        } catch (err) {

        }

        // uploadJson
        // fileManagerJson  服务器文件上传的路径
        var options = {
            autoHeightMode : false,
            minWidth: 400,
            minHeight: 347,
            maxHeight: 347,
            filterMode : true,
            uploadJson : 'http://www.baidu.com/kindEditorUp/fileUpload',
            fileManagerJson : 'http://www.baidu.com/kindEditorUp/fileManager',
            allowFileManager : true,
            //编辑器值改变时的回调函数
            afterChange: function(value){
                this.sync();
                that.props.callback(this.html());
            }
        };

        editor = window.KindEditor.create('#' + this.props.id_content, options);

    }

    componentDidMount(){
        this.initEditorContent();
        //必须在这里声明，所以 ref 回调可以引用它
        this.props.onRefKindeditor(this);
    }

    render(){
        return (
            <textarea id={this.props.id_content} name="content">
            </textarea>
        )
    }
}
export default Kindeditor;