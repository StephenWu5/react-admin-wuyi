import React,{Component} from 'react';

import './ueditor.css';


var editor = null;


class Ueditor extends Component {
    constructor(){
        super();
    }

    state = {
        editor: null
    }

    setEditorContent(value){
        editor.setContent(value);
    }

    initEditorContent = () => {
        console.log(this.props.id_content,'props66565');
        var UE=new Date().UE;
        //再次初始化有问题  要销毁原来的
        try {
            UE.getEditor(this.props.id_content).destroy();
            console.log(UE.getEditor(this.props.id_content),'99999');
        } catch (err) {

        }

        var that = this;
        editor = UE.getEditor(this.props.id_content, {
            lang:"zh-cn" ,initialFrameHeight: this.props.height , initialFrameWidth: '100%'
        });
        editor.ready( function( ueditor ) {
            var value = that.props.valuezhi ? that.props.valuezhi : '<p></p>';
            editor.setContent(value);
        });

        editor.addListener('selectionchange', function(type) {
            that.props.callback(this.getContent());
        });

    }

    componentDidMount(){
        //必须在这里声明，所以 ref 回调可以引用它
        this.props.onRefUeditor(this);

        this.initEditorContent();
    }


    componentWillUnmount() {

    }

    componentDidUpdate(){

    }



    render(){
        return (
            <div id={this.props.id_content}></div>
        )
    }
}
export default Ueditor;