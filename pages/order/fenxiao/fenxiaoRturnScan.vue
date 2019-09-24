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
				<view class="list-lis" style="margin-top:20upx;">
					<text>输入名字：</text><input type="text" v-model="formItem.searchText" placeholder="请输入名字/微信号快速检索" /><button class="lis-btn" @click="searchBtn">查询</button>
				</view>
				<view class="list-lis" style="margin-top:20upx;">
					<text>选择经销商：</text><input class="lis-in" type="text" v-model="formItem.dealerText" disabled placeholder="请选择经销商" @tap="toggleList()"/>
					<text class="lis-ck iconfont icon-check" :class="{'active':isSlide}"></text>
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
		<pull-up step="1" v-if="dealerData.length > 0" :isSlide="true" @conSlide="revSlide" :defaultVal="defaultVal" :defaultName="'RealName'" :defaultWeCat="'WeChat'" :current="true" @confirm="onConfirm" ref="picker" themeColor="#f00" :selectList="dealerData"></pull-up>
	</view>
</template>
	
<script>
	import {scanCode} from '@/api/wxConfig.js';
	import {getCurrentDate} from '@/api/util.js';
	import {pullToast,pullLoading,loadingInit} from '@/components/pull-layer/pull-layer.js';//弹窗
	import pullUp from '@/components/pull-up.vue';
	export default {
		data() {
			return {
				formItem:{
					num:0,
					scan:'',
					searchText:'',
					dealerText:''
				},
				scanData:[],
				dealerData:[],
				defaultVal:0,
				isSlide:false
			}
		},
		components:{
			pullUp
		},
		onLoad() {
			// let tHref = window.location.href;
			// getWxConfig(tHref);
			let _this = this;
			uni.getStorage({
				key: 'fenxiaoReturnScanData',
				success: function (res) {
					let nRes = JSON.parse(res.data);
					_this.scanData.push(...nRes);
				}
			});
			this.getDealer();
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
			async getDealer(){//获取经销商
				// //pullLoading('('加载中···')
				let res = await this.$http.ReqGet('User/GetAllUserRefereeById');

				let nowData = res.data;
				if(nowData.length>0){//默认第一个
				    this.formItem.dealerText = nowData[0].RealName+ (nowData[0].WeChat ? '('+nowData[0].WeChat+')' :'');
				    this.formItem.dealerId = nowData[0].F_Id;
					this.dealerData = [...nowData];
				}else{
					this.formItem.dealerText = '';
				    this.formItem.dealerId = null;
					this.dealerData = [];
				}
				
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
				    key: 'fenxiaoReturnScanData',  
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
				
				// //pullLoading('('加载中···')
			    let res = await this.$http.ReqPOST('User/CheckScanCodeForUndertakesReturn',{ScanCode:that.formItem.scan,UserCode:that.formItem.dealerId});
				
				that.scanData.unshift({
					GoodsCode:res.data,
					scan_time:getCurrentDate(2)
				})
				that.formItem.num = that.scanData.length;
				that.formItem.scan = '';
				uni.setStorage({//缓存用户登陆状态
				    key: 'fenxiaoReturnScanData',  
				    data: JSON.stringify(that.scanData)  
				});
				
			},
			async searchBtn(){//查询
				let res = await this.$http.ReqGet('User/GetAllUserRefereeByIdAndKeyWord/'+this.formItem.searchText);
				console.log(res);

				let nowData = res.data;
				
				if(nowData.length>0){//默认第一个
				    this.formItem.dealerText = nowData[0].RealName+ (nowData[0].WeChat ? '('+nowData[0].WeChat+')' :'');
				    this.formItem.dealerId = nowData[0].F_Id;
					this.dealerData = [...nowData];
				}else{
					this.formItem.dealerText = '';
				    this.formItem.dealerId = null;
					this.dealerData = [];
				}
			},
			toggleList(){//弹起弹窗
				this.$refs.picker.show();
			},
			onConfirm(val){//获取选择的数据
				let _this = this;
				console.log(val);
				_this.formItem.dealerId = val.F_Id;
				_this.formItem.dealerText = val.RealName+ (val.WeChat ? '('+val.WeChat+')' :'');;
			},
			revSlide(val){
				this.isSlide = val;
			},
			delScan(index){//删除条码
				this.scanData.splice(index,1);
				this.formItem.num = this.scanData.length;
				uni.setStorage({//缓存用户登陆状态
				    key: 'fenxiaoReturnScanData',  
				    data: JSON.stringify(this.scanData)  
				}) 
			},
			async submit(){//确认提交
				if(this.scanData.length == 0){
					that.$Message.warning('条码不能为空！');
					return false;
				}
				let res = await this.$http.ReqPOST('User/InsertGoodsByScanCodeByUndertakesReturn',{scanCodeJson:JSON.stringify(this.scanData),UserCode:this.formItem.dealerId});
				pullToast('操作成功');
				this.clear();
			},
			clear(){//清除
				this.scanData = [];
				this.formItem.num = 0;
				this.formItem.scan = '';
				uni.removeStorage({  
				    key: 'fenxiaoReturnScanData' 
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
				position: relative;
				height:60upx;
				line-height:60upx;
				font-size:28upx;
				input{
					flex:1;
					height:60upx;
					line-height:60upx;
					font-size:28upx;
				}
				.lis-in{
					border: 1px solid #e8eaec;
					padding: 0 10upx;
					box-sizing: border-box;
				}
				button{
					height:60upx;
					line-height:60upx;
					font-size:28upx;
					background: #009788;
					color: #fff;
				}
				.lis-ck{
					position: absolute;
					right: 15upx;
					color: #009788;
					transform: rotate(90deg);
					transition: all 0.3s ease-in;
					&.active{
						transform: rotate(270deg);
					}
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
