
var wx = require('jweixin-module') 
import $http from './http.js'
import {pullToast} from '@/components/pull-layer/pull-layer.js';//弹窗

function isWechat(){  
	var ua = window.navigator.userAgent.toLowerCase();  
	if(ua.match(/micromessenger/i) == 'micromessenger'){  
		return true;  
	}else{  
		return false;  
	}  
};

 function getWxConfig(call){//获取微信配置
	let url = location.href;
	let newUrl = url.split("#")[0];
    $http.POST('API/SetWXParam/',{Url:newUrl}).then(res =>{
        if(res.code == 200){
            let nowConfig = res.data;
            wx.config({
                // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                debug: false,
                // 必填，公众号的唯一标识
                appId: nowConfig.appId,
                // 必填，生成签名的时间戳
                timestamp: nowConfig.timestamp,
                // 必填，生成签名的随机串
                nonceStr: nowConfig.nonceStr,
                // 必填，签名，见附录1
                signature: nowConfig.signature,
                // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                jsApiList: ['checkJsApi', 'scanQRCode','chooseImage', 'uploadImage', 'downloadImage','previewImage']
            });
			//配置完成后，再执行分享等功能  
			if(call){  
				call(nowConfig);  
			}  
			
        }else{
            pullToast(res.details);                   
        }
    })
}

export {getWxConfig}
 
function scanCode(call,index){//扫码
	// if(!isWechat()){  
	// 	return false;  
	// } 
	getWxConfig(function(data){
		wx.ready(function(){
		    wx.scanQRCode({
		        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
		        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
		        success: function (res) {
		            let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
					if(result.indexOf('http') > -1){
						if (result.indexOf('EAN_') > -1) {
						    pullToast('二维码无效，请确认后重新扫描:'+ result)
						    return false;
						}
						let isTure = result.indexOf('=') > -1 && (result.indexOf('Code') >-1 || result.indexOf('CODE') >-1 || result.indexOf('?c=') > -1);
						if (!isTure) {
						    pullToast('二维码无效，请确认后重新扫描:'+ result)
						    return false;
						}
						let patrn = /^(http|https)/;
						if (patrn.exec(result)) result = result.slice(result.lastIndexOf('=') + 1);
						var results = result.split(',');
						if (results.length > 1) result = results[1];
					}else{
						if((result.indexOf('CODE') >-1 || result.indexOf('code') >-1 || result.indexOf('Code') >-1) && result.indexOf(',') >-1){
							var results = result.split(',');
							if (results.length > 1) result = results[1];
						}else {
							pullToast('二维码无效，请确认后重新扫描:'+ result)
							return false;
						}
					}
		            
		            call(result,index);
		        }
		    }),
		    wx.error(function(err) {
		      pullToast('请重新刷新页面');//error
		    });
		})
	})
    // wx.ready(function(){
    //     wx.scanQRCode({
    //         needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    //         scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
    //         success: function (res) {
    //             let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
    //             if (result.indexOf('EAN_') > -1) {
    //                 pullToast('二维码无效，请确认后重新扫描:');//3秒后关闭
    //                 return false;
    //             }
    //             if (result.indexOf('=') == -1 && result.indexOf('CODE') == -1) {
    //                 pullToast('二维码无效，请确认后重新扫描:');//3秒后关闭
    //                 return false;
    //             }
    //             let patrn = /^(http|https)/;
    //             if (patrn.exec(result)) result = result.slice(result.lastIndexOf('=') + 1);
    //             var results = result.split(',');
    //             if (results.length > 1) result = results[1];
    //     
    //             call(result,index);
    //         }
    //     }),
    //     wx.error(function(err) {
    //       pullToast('请重新刷新页面');//error
    //     });
    // });       
}

export {scanCode};