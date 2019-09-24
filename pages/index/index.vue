<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<button type="primary" @click="goLogin">页面主操作 Normal</button>
		</view >
		<view class="uni-padding-wrap uni-common-mt">
			<button type="primary" @click="goLoading">页面主操作 Loading</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				searchTxt:''
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(option) { //按钮点击 
			console.log(option);  
			// console.log(this.searchTxt);
		},
		onNavigationBarSearchInputChanged(index){//输入框值改变
			console.log(index)
			this.searchTxt = index.text;
		},
		onNavigationBarSearchInputConfirmed(index){//
			console.log('输入框提交')
		},
		methods: {
			goLogin(){
				uni.navigateTo({
					url: '../login/login'
				});
			},
			goLoading(){
				uni.navigateTo({
					url: '../login/loading'
				});
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
