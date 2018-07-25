// 提示本地化
function localize() {
    $.extend($.validator.messages, {
        required: "必填选项",
        remote: "请修正该字段",
        email: "请输入正确格式的电子邮件",
        url: "请输入合法的网址 (需要前缀http/https..)",
        date: "请输入合法的日期",
        dateISO: "请输入合法的日期 (ISO).",
        number: "请输入合法的数字",
        digits: "只能输入整数",
        creditcard: "请输入合法的信用卡号",
        equalTo: "请再次输入相同的值",
        accept: "请输入拥有合法后缀名的字符串",
        maxlength: $.validator.format("请输入一个长度最多是 {0} "),
        minlength: $.validator.format("请输入一个长度最少是 {0} "),
        rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间"),
        range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max: $.validator.format("请输入一个最大为 {0} 的值"),
        min: $.validator.format("请输入一个最小为 {0} 的值")
    });
}

// 自定义验证规则
function addMethods() {
    // 不等于
    $.validator.addMethod("notEqualTo",function(value, element, param) {
            return this.optional(element) || value!=$(param).val();
        },"请输入不同的密码"
    );

    // 等于
    $.validator.addMethod("equalTo",function(value, element, param) {
            return this.optional(element) || value==$(param).val();
        },"密码不一致"
    );

    // 邮箱验证
    $.validator.addMethod("email", function(value, element) {
        var length = value.length;
        var email =  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return (value == '' || (email.test(value)));
    }, "请输入合法邮箱");

    // 手机验证
    $.validator.addMethod("mobile", function(value, element) {
        var length = value.length;
        var mobile =  /^(((13[0-9]{1})|(15[0-9]{1})|(17[6-8]{1})|(14[5-7]{1})|(18[0-9]{1}))+\d{8})$/;
        return (value == '' || (length == 11 && mobile.test(value)));
    }, "手机号码格式错误");

    // 只做纯数字和纯字母判断
    $.validator.addMethod("passwordStrength", function(value, element) {
        return (!(/^\d+$/.test(value)) && !(/^[a-zA-Z]+$/.test(value)));
    }, "密码过于简单，请输入数字字母组合");

    // 企业或个人简称验证
    $.validator.addMethod("sname", function(value, element) {
        return ((/^[A-Z0-9]{2,}$/.test(value)));
    }, "分销商简称只能是为大写英文字母和数字，长度需要2个字符以上");

    // 密码
    $.validator.addMethod("password", function(value, element) {
        return ((/^[a-zA-Z0-9_\+\?\!\@\#\$\%\&\*]{6,16}$/.test(value)));
    }, "请输入长度6~16位密码，建议由字母、数字及特殊符号两种以上组成");

    $.validator.addMethod("requireImg", function(value, element) {
        return !!$(element).siblings('.j_imgData').attr('imgurl');
    }, "请上传图片");

    $.validator.addMethod("int", function(value, element) {
        return ((/^[\-1-9]\d*$/.test(value)));
    }, "请输入整数或者负整数");

    $.validator.addMethod("noUrlCharacter", function(value, element) {
        return this.optional(element) || !/[:/@?#]/.test(value);
    }, "请不要使用:/@?#这5个字符");

    // @L: 这个基本是拷贝了jquery validator的remote方法，实现自己的remote，主要是我们返回的数据格式不一样
    $.validator.addMethod('myRemote', function( value, element, param ) {
        if ( this.optional( element ) ) {
            return "dependency-mismatch";
        }

        var previous = this.previousValue( element ),
            validator, data;

        if (!this.settings.messages[ element.name ] ) {
            this.settings.messages[ element.name ] = {};
        }
        previous.originalMessage = this.settings.messages[ element.name ].myRemote;
        this.settings.messages[ element.name ].myRemote = previous.message;

        param = typeof param === "string" && { url: param } || param;

        if ( previous.old === value ) {
            return previous.valid;
        }

        previous.old = value;
        validator = this;
        this.startRequest( element );
        data = {};
        data[ element.name ] = value;
        $.ajax( $.extend( true, {
            url: param,
            mode: "abort",
            port: "validate" + element.name,
            dataType: "json",
            data: data,
            context: validator.currentForm,
            success: function( response ) {
                var valid = response === true || response === "true" || response.errCode === 0,
                    errors, message, submitted;

                validator.settings.messages[ element.name ].myRemote = previous.originalMessage;
                if ( valid ) {
                    submitted = validator.formSubmitted;
                    validator.prepareElement( element );
                    validator.formSubmitted = submitted;
                    validator.successList.push( element );
                    delete validator.invalid[ element.name ];
                    validator.showErrors();
                } else {
                    errors = {};
                    message = response.errMsg || validator.defaultMessage( element, "myRemote" );
                    errors[ element.name ] = previous.message = $.isFunction( message ) ? message( value ) : message;
                    validator.invalid[ element.name ] = true;
                    validator.showErrors( errors );
                }
                previous.valid = valid;
                validator.stopRequest( element, valid );
            }
        }, param ) );
        return "pending";
    }, "请修正该字段");
}

// 设置默认值
function setDefaults() {
    $.validator.setDefaults({
        debug: false,
        ignore: "",
        errorClass: "has-error",
        errorElement:"span",
        //wrapper: "span",
        focusInvalid: false,
        // invalidHandler: function(event, validator) {
        //     // $('.alert-danger', $('.login-form')).show();
        // },
        // showErrors: function(errorMap, errorList) {
        //     //if(errorList.length > 0){
        //     //    forgotPass.showErr(errorList[0].message);
        //     //}
        // },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.closest('.form-group').find('.has-error').remove();
            label.remove();
        },
        highlight: function(element) { // hightlight error inputs
            $(element).closest('.form-group').addClass('has-error');
        },
        errorPlacement: function (error, element) {
            let $parent = $(element).parent();
            let $appendToEl = $parent;
            // @L: 为了处理日期选择datepicker
            if($parent.hasClass('input-group')){
            	$appendToEl = $parent.parent();
            };
            if (element.is(':radio') || element.is(':checkbox')) {
            	$appendToEl = $parent.parent().parent();
            }
            
            error.addClass('help-block help-block-error').appendTo($appendToEl);
            
            return false;
        }
    });
}

export default {
    init: function() {
        // 验证器配置
        if(undefined != $.validator) {
            localize();
            addMethods();
            setDefaults();
        } else {
            alert('请先加载jquery validate');
        }
    }
}
