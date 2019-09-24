<template>
	<view class="content">
		<view class="cont">
			<view class="cont-list">
				<view class="list-top">采购扫码</view>
				<view class="list-lis">
					<navigator class="lis-cont" url="./caigou/caigouScan" open-type="navigate" >
						<text class="iconfont icon--7"></text>
						<text>采购扫码</text>
					</navigator>
					
					<navigator class="lis-cont" url="./caigou/caigouScanRecord" open-type="navigate" >
						<text class="iconfont icon--12"></text>
						<text>采购扫码记录</text>
					</navigator>
					<navigator class="lis-cont" url="./caigou/selfScan" open-type="navigate">
						<text class="iconfont icon--7"></text>
						<text>自用扫码</text>
					</navigator>
					<navigator class="lis-cont" url="./caigou/selfScanRecord" open-type="navigate">
						<text class="iconfont icon--12"></text>
						<text>自用扫码记录</text>
					</navigator>
				</view>
			</view>
			<view class="cont-list-line"></view>
			<view class="cont-list primary">
				<view class="list-top">分销扫码</view>
				<view class="list-lis">
					<navigator class="lis-cont" url="./fenxiao/fenxiaoScan" open-type="navigate">
						<text class="iconfont icon--7"></text>
						<text>分销扫码</text>
					</navigator>
					<navigator class="lis-cont" url="./fenxiao/fenxiaoSendRecord" open-type="navigate">
						<text class="iconfont icon--12"></text>
						<text>我的发货记录</text>
					</navigator>
					<navigator class="lis-cont" url="./fenxiao/fenxiaoRturnScan" open-type="navigate">
						<text class="iconfont icon--7"></text>
						<text>分销退货扫码</text>
					</navigator>
				</view>
			</view>
			<view class="cont-list-line"></view>
			<view class="cont-list warn">
				<view class="list-top">零售扫码</view>
				<view class="list-lis">
					<navigator class="lis-cont" url="./lingshou/lingshouScan" open-type="navigate">
						<text class="iconfont icon--7"></text>
						<text>零售扫码</text>
					</navigator>
					<navigator class="lis-cont" url="./lingshou/lingshouReturnScan" open-type="navigate">
						<text class="iconfont icon--7"></text>
						<text>零售退货扫码</text>
					</navigator>
				</view>
			</view>
		</view>
		<button class="foot" @click="loginOut">退出</button>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				
			}
		},
		components:{
			
		},
		onLoad() {
			
		},
		computed:{
			
		},
		methods: {
			async loginOut(){
				await this.$store.commit('loginOut');
				
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		}
	}
</script>

<style lang="scss">
	.cont{
		width:100%;
		padding:30upx;
		box-sizing: border-box;
		// background:#ccc;
		.cont-list{
			// margin: 30upx 0;
			padding-bottom: 30upx;
			background:#fff;
			&.primary{
				color:$uni-color-primary;
			}
			&.warn{
				color:$uni-color-warning;
			}
			.list-top{
				padding:30upx 0;
				font-size:32upx;
			}
			.list-lis{
				&::after{
					content: "";
					display: block;
					clear: both;
				}
				.lis-cont{
					width: 25%;
					float: left;
					text-align: center;
					display:flex;
					justify-content: center;
					flex-direction: column;
					align-items: center;
					text{
						font-size: 24upx;
						&.iconfont{
							font-size: 100upx;
						}
					}
				}
				
			}
		}
		.cont-list-line{
			position: relative;
			width:calc(100% + 60upx);
			margin-left: -30px;
			height:20upx;
			background:#F8F8F8;
		}
	}
	.foot{
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
</style>
