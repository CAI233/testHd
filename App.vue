<script>
	import {mapMutations} from 'vuex';
	export default {
		methods: {
			...mapMutations(['login','setToken'])
		},
		onLaunch: function() {
			let userInfo = uni.getStorageSync('userInfo') || {};
			let token = uni.getStorageSync('token') || '';
			console.log(userInfo)
			if(userInfo.F_Id){
				//更新登陆状态
				uni.getStorage({
					key: 'userInfo',
					success: (res) => {
						this.login(res.data);
					}
				});
				uni.getStorage({
					key: 'token',
					success: (res) => {
						this.setToken(res.data);
					}
				});
			}
			// let tHref = window.location.href;
			// getWxConfig(tHref);
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page{
		background: #fff;
		height: 100%;
	}
</style>
