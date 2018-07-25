let root = window,
    Cookie = require('cookie');
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
    browser: function () {
        var ua = navigator.userAgent,
            type,
            version,
            matches;

        if ((matches = us.match(/MicroMessenger\/(\d\.\d)/)) && matches.length) {
            type = 'weixin';
            version = matches[1];
        }

        return {
            isPC: function () {
                var sUserAgent = navigator.userAgent.toLowerCase();
                var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
                var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                var bIsMidp = sUserAgent.match(/midp/i) == "midp";
                var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                var bIsAndroid = sUserAgent.match(/android/i) == "android";
                var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

                if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
                    return true;
                }

                return false;
            }(),
            type: type,
            version: version
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
    cookie: function (key, value, options) {
        var args = Array.prototype.slice.call(arguments);
        if(args.length >= 2){
            args[2] = $.extend({}, {
                domain: root.location.hostname,
                path: '/',
                expires: 90 // 默认90天过期
            }, options);
        }
        return Cookie.apply(null,args);
    },
    getCookieSid: function(key){
        return Cookie.get(this.cookieId);
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
    ueFullScreenHandler(event, isFullScreen) {
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
    alert:function(msg,callback){
    	layui.use('layer', function(){ 
    		var $ = layui.jquery, layer = layui.layer; 
    		layer.msg(msg,{icon:1,time:1500},callback);
    	});
    },

    getHashStr:function(name){
    	 var url = location.hash; //获取url中"?"符后的字串
         var theRequest = new Object();
         if (url.indexOf("?")) {
             var str = url.substr(url.indexOf("?") + 1);
             var strs = str.split("&");
             for (var i = 0; i < strs.length; i++) {
                 theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
             }
         }
         return theRequest[name];
    },

    // orderType:1 升序   orderType :-1 降序
    changeOrder:function (id,orderType,self,cgi) {
        let orderListParams = {id:id ,operType:orderType},
         index = $(event.currentTarget).parent().parent().data("index");
        if(orderType === 1 && index !== 0 || orderType === -1 && index !== 3 ){
            Base.fetch(cgi.saveListOrder,orderListParams).done(function(result){
                if(result.code === 0) {
                    self.loadPageData();
                }
            });
        }
    }

};

export default Base;



