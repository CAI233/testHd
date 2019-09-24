<template>
	<view class="content">
		<image class="logo" src="/static/login.jpg"></image>
		<view class="cont">
			<view class="input-content">
				<view class="input-item">
					<input type="text" class="lis-in" :value="SellerName" placeholder="请选择对应渠道"  disabled @tap="toggleTab()"/>
					<text class="lis-ck iconfont icon-check" :class="{'active':isSlide}"></text>
				</view>
				<view class="input-item">
					<input type="text" v-model="UserPhone" placeholder="请输入手机号/微信号" maxlength="20" />
				</view>
				<view class="input-item">
					<input type="text" v-model="PassWord" placeholder="请输入密码" placeholder-class="input-empty"  maxlength="20"
						password  @confirm="toLogin"
					/>
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" >登录</button>
			<!-- <button class="confirm-btn" @click="getLogin">获取信息</button> -->
			<!-- <view class="forget-section">
				<text @click="toRevPass">忘记密码?</text>
			</view> -->
		</view>
		<pull-up step="1" v-if="SellerList.length > 0" :isSlide="true" @conSlide="revSlide" :defaultVal="defaultVal" :defaultName="'SellerName'" :current="true" @confirm="onConfirm" ref="picker" themeColor="#f00" :selectList="SellerList"></pull-up>
		<!-- <view class="register-section">
			还没有账号?
			<text @click="toRegist">马上注册</text>
		</view> -->
	</view>
</template>

<script>
	import {mapState,mapMutations } from 'vuex';
	import pullUp from '@/components/pull-up.vue';
	import {pullToast} from '@/components/pull-layer/pull-layer.js';//弹窗
	export default {
		data() {
			return {
				SellerNo:'',
				defaultVal:0,
				SellerName:'',
				UserPhone: '',
				PassWord: '',
				logining: false,
				SellerList:[],
				isSlide:false
			}
		},
		components:{
			pullUp
		},
		onLoad() {
			// this.getSellerList();
			this.isLogin();
		},
		computed:{
			...mapState(['hasLogin','userInfo']),
		},
		methods: {
			...mapMutations(['login','setToken']),
			isLogin(){
				console.log(this.hasLogin)
				if(!this.hasLogin){
					this.getSellerList();
				}else{
					uni.navigateTo ({
						url: '/pages/order/index'
					})
				}
			},
			// 获取品牌渠道信息
			async getSellerList() {
				let _this = this;
				let SellerList = (await this.$http.GET('API/GetSellerList')).data.reverse();
				
				if(SellerList.length > 0){
					_this.SellerName = SellerList[0].SellerName;
					_this.SellerNo = SellerList[0].SellerNo;
				}
				// _this.$emit("SellerList",SellerList);
				_this.SellerList = [...SellerList];
			},
			toggleTab(){//显示底部弹窗
				this.$refs.picker.show();
			},
			onConfirm(val){//获取选择的数据
				let _this = this;
				console.log(val);
				_this.SellerName = val.SellerName;
				_this.SellerNo = val.SellerNo;
			},
			revSlide(val){
				this.isSlide = val;
			},
			// inputChange(e){//小程序上使用
			// 	const key = e.currentTarget.dataset.key;
			// 	this[key] = e.detail.value;
			// },
			async toLogin(){//点击注册
				// this.logining = true;
				const {SellerNo,SellerName,UserPhone, PassWord} = this;
				/* 数据验证模块*/
				let param = {
				  PassWord:PassWord,
				  UserPhone:UserPhone,
				  SellerNo:SellerNo,
				  SellerName:SellerName,
				  OpenId:''
				};
				if(!UserPhone || UserPhone == ''){
					pullToast('手机号/微信号不能为空！');
					return false;
				}
				if(!PassWord || PassWord == ''){
					pullToast('密码不能为空！');
					return false;
				}
				
				param.PassWord = (await this.$http.POST('API/PostEn',{Content:this.PassWord})).details;//加密
				let res = await this.$http.POST('API/SetLogin',param);
				let userInfo = {...res.data.userInfo};
				userInfo.isRecRebate = res.data.isRecRebate;
				userInfo.IsOnlyGrand = res.data.IsOnlyGrand;
				userInfo.IsOrder = res.data.IsOrder;
				userInfo.IsPay = res.data.IsPay;
				this.login(userInfo);//缓存个人信息
				this.setToken(res.details)//缓存token
				uni.navigateTo ({
					url: '/pages/order/index'
				})
			},
			toRevPass(){
				pullToast('修改密码')
			}
		}
	}
</script>

<style lang='scss'>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top:0;
		z-index:999;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}
	.cont{
		width:100%;
		padding:30upx;
		box-sizing: border-box;
	}
	.input-item{
		/* display:flex;
		flex-direction: column;
		align-items:flex-start; */
		position: relative;
		/* justify-content: center; */
		padding: 10upx 30upx 0;
		background:#e8eaec;
		height: 60upx;
		border-radius: 4px;
		margin-bottom: 10upx;
		border-top:1px solid #dcdee2;
		input{
			height: 60upx;
			color: $font-color-dark;
			width: 100%;
			font-size:28upx;
		}
		.lis-in{
			/* border: 1px solid #e8eaec; */
			/* padding: 0 10upx; */
			box-sizing: border-box;
		}
		.lis-ck{
			position: absolute;
			right: 15upx;
			top:20upx;
			color: #009788;
			transform: rotate(90deg);
			transition: all 0.3s ease-in;
			&.active{
				transform: rotate(270deg);
			}
		}	
	}
	.input-item:nth-child(1){
		border-top:0;
	}
	.input-item:last-child(1){
		margin-bottom: 0;
	}
	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
