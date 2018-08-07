import React,{Component} from 'react';
class Ueditor extends Component {
    constructor(){
        super();
    }

    componentDidMount(){
        console.log(this.props,'props');
        var UE=new Date().UE;
        try{UE.getEditor(this.props.idEditor).destroy();}catch(err){}//再次初始化有问题  要销毁原来的
        var editor = UE.getEditor(this.props.idEditor, {
            lang:"zh-cn" ,initialFrameHeight: this.props.height , initialFrameWidth: '100%'
        });
        var that = this;
        editor.ready( function( ueditor ) {
            var value = that.props.valuezhi?that.props.valuezhi:'<p></p>';
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
            <div id={this.props.idEditor}></div>
        )
    }
}
export default Ueditor;