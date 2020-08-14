let root = window,
    $ = require('jquery');
let Base = {
    cookieId:'SYS-PCSID',
    url: {
        location: root.location,
        cache: null,
        param: function (key) {
            var href = this.location.href,
                hrefWithoutHas = href.indexOf('#') > 0 ? href.substr(0, href.indexOf('#')) : href,
                paramStr = hrefWithoutHas.split('?')[1],
                cache,
                keys;

            if (paramStr) {
                if ((cache = this.cache) === null) {
                    keys = paramStr.split('&');
                    cache = this.cache = {};
                    $.each(keys, function (i, v) {
                        var _flag = v.split('=');
                        cache[_flag[0]] = _flag[1];
                    });
                }

                if (key) {
                    return cache[key];
                } else {
                    return cache;
                }
            }
        },
        hash: function () {
            return this.location.href.replace(/^#/, '');
        },
        toUrl:function (url) {
            let redirectURL = Base.url.param('redirectURL');
            window.location.href = redirectURL ? decodeURIComponent(redirectURL) : url;
        }
    },

    throttle: function (fn,dealy) {
        var timer = null;
        return function () {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context,args);
            },dealy);
        }
    },
    paramJson: function (data) {
        // 格式化后台需要的数据格式
        var returnData = {};
        if(!data) return false;
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                returnData[i] = (typeof data[i] == "object") ? JSON.stringify(data[i]) : data[i]
            }
        }
        return returnData;
    },
    toFixed:function(num,s){
        var times = Math.pow(10, s),
            des = num * times + 0.5;

        des = parseInt(des, 10) / times;
        return des + ''
    },
    //设置cookie
    setCookie: function(name,value,expire){
        var never = new Date();
        //设置never的时间为当前时间加上十年的毫秒值
        never.setTime(never.getTime() + expire);
        var expString = "expires="+ never.toGMTString()+";";
        document.cookie =  name + "=" +escape(value)+"; "+expString;
    },
    //获取cookie
    getCookie: function(name){
        var strcookie = document.cookie;//获取cookie字符串
        var arrcookie = strcookie.split("; ");//分割
        //遍历匹配
        for ( var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name){
                return arr[1];
            }
        }
        return "";
    },
    //清除cookie
    clearCookie:function (name,value,expire) {
        this.setCookie(name,value,expire);
    },
    assignObj: function (vm, firstSource) {
        for (var i = 1; i < arguments.length; i++) {
            var nextSource = arguments[i];
            if (nextSource && typeof nextSource !== "object")
                continue;
            for (var x in vm) {
                if (vm.hasOwnProperty(x) && nextSource.hasOwnProperty(x)) {
                    vm[x] = nextSource[x]
                }
            }
        }
        return vm
    },
    formateTime:function(timestamp){
        var d = new Date(timestamp);
        var hour = d.getHours(),
            minute = d.getMinutes(),
            second = d.getSeconds();
        if(hour<10) {
            hour="0"+hour;
        }
        if(minute<10) {
            minute="0"+minute;
        }
        return [hour, minute].join(':');
    },
    formatDate: function (value, dateStr) {
        var d = new Date(value);
        var year = d.getFullYear(),
            mouth = d.getMonth() + 1,
            date = d.getDate();
        if(mouth<10) {
            mouth="0"+mouth;
        }
        if(date<10) {
            date="0"+date;
        }
        if (dateStr == undefined)
            return [year, mouth, date].join('-');
        else
            return [year, mouth, date].join(dateStr);
    },
    formatDateTime: function (value, dateStr) {

        if(typeof value === 'undefined' || value=='') return "";

        if (value !== null) {
            var d = new Date(value);
            var year = d.getFullYear(),
                mouth = d.getMonth() + 1,
                date = d.getDate(),
                hour = d.getHours(),
                minute = d.getMinutes(),
                second = d.getSeconds();
            if(mouth<10) {
                mouth="0"+mouth;
            }
            if(date<10) {
                date="0"+date;
            }
            if(hour<10) {
                hour="0"+hour;
            }
            if(minute<10) {
                minute="0"+minute;
            }

            if (dateStr == undefined)
                return [year, mouth, date].join('-') + ' ' + [hour, minute].join(':');
            else
                return [year, mouth, date].join(dateStr) + ' ' + [hour, minute].join(':');
        }
    },
    timestampDate: function (value) {
        let timestamp = new Date(value).getTime();
        return timestamp;
    },
    //验证权限
    auth: function(code, permission) { 
      /* if(code>=100) { return true; }
       var flag = false;
       for(let val of permission) {
        if (val == code) {
            flag = true;
            break;
        }
       }
       return flag;*/
      return true
    },
    //富文本编辑器全屏
    ueFullScreenHandler: function(event, isFullScreen) {
        let $backDrop = $('.modal-backdrop'),
            $overflowEls = $('.modal-open, .modal-open .modal'),
            $navbar = $('.navbar-fixed-top'),
            $pagination = $('.pagination');
        if (isFullScreen) {
            $navbar.hide();
            $pagination.hide();
            $backDrop.hide();
            $overflowEls.addClass('visible-important');
        } else {
            $navbar.show();
            $pagination.show();
            $backDrop.show();
            $overflowEls.removeClass('visible-important');
        }
    },
    //给 id:13 改成 user.id : 13 这种形式，方便后台做json=>bean转换，后期考虑去掉
    addPrex:function(params,prex){
        var result={};
        $.each(params, function(key, val) {  
            result[prex+'.'+key] = val;
        }); 
        return result;
    },
    fetch:function (url, params, async = true) {
        var data= [];
        var promise = $.ajax({
            headers: {
                'SYS-PCSID': this.getCookieSid()
            },
            url: url,
            data: params ? params : {},
            async: async,
            dataType: "json",
        });
        if(!async){
            promise.done((result) => {
               data = result;
            });
            return data;
        }else {
            //异步返回 promise,调用者自己实现done();
            return promise;
        }
    },
    post:function (url, params, async = true) {
        var data= [];
        var promise = $.ajax({
            headers: {
                'SYS-PCSID': this.getCookieSid()
            },
            url: url,
            data: params ? params : {},
            async: async,
            dataType: "json",
            type:'post',
        });
        if(!async){
            promise.done((result) => {
               data = result;
            });
            return data;
        }else {
            //异步返回 promise,调用者自己实现done();
            return promise;
        }
       
    },
    uniqueArr: function (arr) {
        var n = {}, r = [], len = arr.length, val, type;
        for (var i = 0; i < len; i++) {
            val = arr[i];
            type = typeof val;
            if (!n[val]) {
                n[val] = [type];
                r.push(val);
            } else if (n[val].indexOf(type) < 0) {
                n[val].push(type);
                r.push(val);
            }
        }
        return r;
    },
    parseArrStr:function(arrStr){
    	//["abc","113"]
    	var arr = JSON.parse('[' + arrStr + '] ');
    	return arr;
    },

};

export default Base;



