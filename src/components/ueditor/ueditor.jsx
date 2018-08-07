import React,{Component} from 'react';
class Ueditor extends Component {
    constructor(){
        super();
    }

    componentDidMount(){
        console.log(this.props.id_content,'props');
        var UE=new Date().UE;
        //再次初始化有问题  要销毁原来的
        try{UE.getEditor(this.props.id_content).destroy();}catch(err){}
        var that = this;
        var editor = null;
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

    componentWillUnmount() {

    }

    render(){
        return (
            <div id={this.props.id_content}></div>
        )
    }
}
export default Ueditor;