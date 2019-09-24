import store from "@/store"
import {pullLoading,loadingInit} from '@/components/pull-layer/pull-layer.js';//弹窗
function HTTP(obj, config) {

	let defaultConfig = {
		isRes: false,
		loading: true
	}

	config = { ...defaultConfig,
		...config
	}
	if(config.isHeader){
		console.log(store.state.userInfo);
		let reqParam = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'access_token':store.state.token ? store.state.token : '',
		    'mobile_key':store.state.userInfo.UserPhone ? store.state.userInfo.UserPhone : '',
		    'sellerNo_key':store.state.userInfo.SellerNo ? store.state.userInfo.SellerNo : ''
		}
		obj['header'] = {...reqParam};
	}

	// 如果需要显示loading,mask防止点击穿透
	config.loading && uni.showLoading({
		title: '加载中',
		mask: true
	});

	return new Promise((resolve, reject) => {

		let options = {
			url: "",
			data: {},
			dataType: "json",
			header: {},
			success: (res) => {
				// console.log("HTTP请求结果：",res)
				// uni.hideLoading();
				// 状态码为200
				if (res.statusCode == 200) {
					// console.log(res);
					let data = res.data;
					
					// if(!data){
					// 	resolve(true);
					// 	return false;
					// }
					data = typeof(data) == 'object' ? data : JSON.parse(data);
					// console.log(data)
					// console.log(typeof(data));
					//自动校验用户是否登录过期
					if (data.code == "01") {
						store.dispatch("reLogin");
						return;
					}

					//返回 { code:10000,msg:"消息",data:[] }
					if (config.isRes) {
						resolve(data)
					}
					// 返回 data:[]
					else {
						uni.hideLoading();
						// loadingInit();
						if (data.code == 200) {
							resolve(data || true)
						} else {
							uni.showToast({
								title: data.details ? data.details : data.message,
								duration:1500,
								mask:false,
								icon:'none'
							});
							reject(data.details ? data.details : data.message);
						}
					}
				} else {
					reject("HTTP:状态码异常！");
				}
			},
			fail: (err) => {
				uni.hideLoading();
				uni.showToast({
					title: "网络异常，请稍后再试!",
					icon: "none",
				})
				reject("网络异常，请稍后再试!");
			},
			complete: () => {}
		}
		options = { ...options,
			...obj
		};
		if (options.url && options.method) {
			// console.log(options);
			
			uni.request(options);
		} else {
			uni.showToast({
				title: 'HTTP：缺失参数',
				icon: "none",
				duration: 2000
			})
		}
	})
}
const apiUrl = 'https://sclmdrpapi.saselomo.com/';


export default {
	GET(url, data = {}, config) {
		return HTTP({url:apiUrl+url,data,method: "GET"}, config);
	},
	POST(url, data = {}, config) {
		return HTTP({url:apiUrl+url,data,method: "POST",header:{'Content-Type': 'application/x-www-form-urlencoded'}}, config);
	},
	ReqGet(url,data = {},config){
		return HTTP({url:apiUrl+url,data,method: "GET"}, {isHeader:true});
	},
	ReqPOST(url,data = {},config){
		return HTTP({url:apiUrl+url,data,method: "POST"}, {isHeader:true});
	},
	outGet(url,data = {},config){
		return HTTP({url:url,data,method: "GET",header:{'Content-Type': 'application/x-www-form-urlencoded'}}, config);
	},
	outPost(url,data = {},config){
		return HTTP({url:url,data,method: "POST",}, config);
	}
}