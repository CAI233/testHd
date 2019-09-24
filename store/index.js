import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin:  false,
		userInfo:  {},
		token:  ''
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
		},
		setToken(state, provider){
			state.token = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'token',  
			    data: provider  
			}) 
		},
		loginOut(state) {
			console.log('清除')
			state.hasLogin = false;
			state.userInfo = {};
			state.token = '';
			// uni.removeStorageSync({  
   //              key: 'userInfo' ,
			// 	key:'token'
   //          })
			uni.clearStorageSync()
		}
	},
	actions: {
	
	}
})

export default store
