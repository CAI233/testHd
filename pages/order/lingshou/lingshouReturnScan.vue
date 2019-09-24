<template>
	<view class="content">
		<view class="cont">
			<view class="cont-scan">
				<view  @click="sureScan"><text>点击扫码</text></view>
			</view>
			<view class="cont-list">
				<view class="list-lis">
					<text>总行数：</text><input type="text" :value="formItem.num" placeholder="0" disabled />
				</view>
				<view class="list-lis">
					<text>输入条码：</text><input type="text" v-model="formItem.scan" placeholder="请扫码或输入条码" /><button class="lis-btn" @click="sureBtn">确认</button>
				</view>
				<view class="list-lis">
					<text>购买人姓名：</text><input type="text" v-model="formItem.BuyName" placeholder="请输入购买人姓名" />
				</view>
				<view class="list-tlis">
					<view class="tlis-li">
						<text class="li-tc">条码</text><text class="li-tc">扫码时间</text><text class="li-tc">操作</text>
					</view>
					<view class="tlis-li" v-if="scanData.length>0">
						<view v-for="(item,index) in scanData" :key="index">
							<text class="li-tc">{{item.GoodsCode}}</text><text class="li-tc">{{item.scan_time}}</text><text class="li-tc" @click="delScan(index)">删除</text>
						</view>
					</view>
					<view class="tlis-li" v-else>
						<view class="li-tf"><text>暂无数据</text></view>
					</view>
				</view>
			</view>
			<view class="cont-foot">
				<button class="foot-btn " @click="submit">提交</button>
				<button class="foot-btn " @click="clear">清除</button>
			</view>
		</view>
	</view>
</template>
	
<script>
	import {scanCode} from '@/api/wxConfig.js';
	import {getCurrentDate} from '@/api/util.js';
	import {pullToast,pullLoading,loadingInit} from '@/components/pull-layer/pull-layer.js';//弹窗
	export default {
		data() {
			return {
				formItem:{
					num:0,
					scan:'',
					BuyName:''
				},
				scanData:[]
			}
		},
		components:{
			
		},
		onLoad() {
			
			// let tHref = window.location.href;
			// getWxConfig(tHref);
			let _this = this;
			uni.getStorage({
				key: 'lingshouReturnScanData',
				success: function (res) {
					let nRes = JSON.parse(res.data);
					_this.scanData.push(...nRes);
				}
			});
			window.addEventListener('keydown', this.getKey);
		},
		computed:{
			
		},
		methods: {
			getKey(ev){
				console.log(ev.keyCode)
				if(ev.keyCode==13) {
					this.sureBtn()
				}
				// console.log(ev.keyCode);
			},
			sureScan(){//扫码
				scanCode(this.getCode)
				
			},
			getCode(result){//扫码回调
				let that = this;
				if(this.scanData.length>0){
					for(let i in this.scanData){
						if(this.scanData[i].GoodsCode == result){
							pullToast('该条码已被扫码！');
							that.formItem.scan = '';
							return false;
						}
					}
				}
				this.scanData.unshift({
					GoodsCode:result,
					scan_time:getCurrentDate(2)
				})
				this.formItem.num = this.scanData.length;
				uni.setStorage({//缓存用户登陆状态
				    key: 'lingshouReturnScanData',  
				    data: JSON.stringify(this.scanData)  
				}) 
			},
			async sureBtn(){//确认输入
				let that = this;
				if(!that.formItem.scan || that.formItem.scan == ''){
					pullToast('条码不能为空！');
					return false;
				}
				if(that.scanData.length>0){
					for(let i in that.scanData){
						if(that.scanData[i].GoodsCode == that.formItem.scan){
							pullToast('该条码已被扫码！');
							that.formItem.scan = '';
							return false;
						}
					}
				}
				if(!that.formItem.BuyName || that.formItem.BuyName == ''){
					pullToast('请输入退货人姓名！',1500,'warning');
					return false;
				}
				//pullLoading('('加载中···');
			    // let res = await that.$http.ReqPOST('User/CheckScanCodeForRetailReturn',{ScanCode:that.formItem.scan,BuyName:that.formItem.BuyName});
				let res = await that.$http.ReqPOST('User/CheckScanCodeForRetailReturn',{ScanCode:that.formItem.scan,BuyName:that.formItem.BuyName});
				
				that.scanData.unshift({
					GoodsCode:res.data,
					scan_time:getCurrentDate(2)
				})
				that.formItem.num = that.scanData.length;
				that.formItem.scan = '';
				uni.setStorage({//缓存用户登陆状态
				    key: 'lingshouReturnScanData',  
				    data: JSON.stringify(that.scanData)  
				});
				
			},
			delScan(index){//删除条码
				this.scanData.splice(index,1);
				this.formItem.num = this.scanData.length;
				uni.setStorage({//缓存用户登陆状态
				    key: 'lingshouReturnScanData',  
				    data: JSON.stringify(this.scanData)  
				}) 
			},
			async submit(){//确认提交
				if(this.scanData.length == 0){
					pullToast('条码不能为空！');
					return false;
				}
				if(!this.formItem.BuyName || this.formItem.BuyName == ''){
					pullToast('请输入退货人姓名！');
					return false;
				}
				//pullLoading('('条码提交中···');
				let res = await this.$http.ReqPOST('User/InsertGoodsByScanCodeByRetailReturn',{BuyName:this.formItem.BuyName,scanCodeJson:JSON.stringify(this.scanData)});
				pullToast('操作成功');
				this.clear();
			},
			clear(){//清除
				this.scanData = [];
				this.formItem.num = 0;
				this.formItem.scan = '';
				this.formItem.BuyName = '';
				uni.removeStorage({  
				    key: 'lingshouReturnScanData' 
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
		.cont-scan{
			padding-top:100upx;//50px
			view{  
				position: relative;
				margin:0 auto;
				box-sizing: border-box;
				width:300upx;//150px
				height:300upx;//150px
				line-height:300upx;
				border:10upx solid #DF8D15;//5px
				text-align:center;
				color:#DF8D15;
				font-size:40upx;//20px
				text{
					position: relative;
					z-index: 999;
				}
				&::before{
					content:'';
					display:block;
					position: absolute;
					width:300upx;
					height:100upx;
					background:#fff;
					left: -10upx;
					top: 90upx;
				}
				&::after{
					content:'';
					display:block;
					position: absolute;
					height:300upx;
					width:100upx;
					background:#fff;
					top: -10upx;
					left: 90upx;
				}
			}
		}
		.cont-list{
			.list-lis{
				display:flex;
				justify-content: start;
				height:60upx;
				line-height:60upx;
				font-size:28upx;
				input{
					flex:1;
					height:60upx;
					line-height:60upx;
					font-size:28upx;
				}
				button{
					height:60upx;
					line-height:60upx;
					font-size:28upx;
					background: #009788;
					color: #fff;
				}
			}
			.list-tlis{
				border:1px solid #e8eaec;
				margin-top: 20upx;
				box-sizing: border-box;
				.tlis-li{
					&:after{
						content: "";
						display: block;
						clear: both;
					}
					border-bottom:1px solid #e8eaec;
					box-sizing: border-box;
					&:nth-child(1){
						padding:20upx 0;
					}
					.li-tc{
						float:left;
						text-align: center;
						font-size: 26upx;
						padding:0 10upx;
						box-sizing: border-box;
						color:#606266;
						word-break: break-all;
						&:nth-child(1){
							width:percentage(85/2/100);
						}
						&:nth-child(2){
							width:percentage(85/2/100);
						}
						&:nth-child(3){
							width:percentage(15/100);
						}
					}
					&>view{
						&:after{
							content: "";
							display: block;
							clear: both;
						}
						&>text{
							vertical-align: middle;
						}
						padding:20upx 0;
						border-bottom:1px solid #e8eaec;
						text-align: center;
						font-size:28upx;
						display: flex;
						align-items: center;
						&.li-tf{
							justify-content: center;
						}
						&:nth-last-child(1){
							border-bottom:none;
							
						}
					}
				}
			}
		}
		.cont-foot{
			.foot-btn{
				background: #009788;
				height: 80upx;
				line-height: 80upx;
				color: #fff;
				border:none;
				&:nth-last-child(1){
					background: #fff;
					color:#101010;
					border:1px solid #009788;
				}
				margin-top: 40upx;
				box-sizing: border-box;
			}
		}
	}
</style>
