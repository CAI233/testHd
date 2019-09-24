<template>
	<view class="content">
		<view class="cont">
			<view class="cont-title cont-search">
				<input class="title-input" type="text" v-model="date"  placeholder="请输入收货人" />
				<button class="title-btn" @click="dateBtn">搜索</button>
			</view>
			<view class="cont-check">
				<view class="check-lis" >
					<text>选择经销商：</text><input type="text" v-model="selRow.ReciverUserText" disabled placeholder="请选择经销商" @tap="toggleList()"/>
					<text class="lis-ck iconfont icon-check" :class="{'active':isSlide}"></text>
				</view>
			</view>
			<view class="cont-title">
				<input class="title-input" type="text" v-model="date" disabled placeholder="请选择时间搜索" />
				<text v-if="date" @click="clear" class="title-clear iconfont icon-close"></text>
				<button class="title-btn" @click="dateBtn">选择时间</button>
			</view>
			<view class="cont-content">
				<view class="cont-list">
					<view class="cont-lis" v-for="(item,index) in recordData" :key="index">
						<view class="lis-li"><text>收货人：</text>{{item.TargetUserName}}<text class="lis-li-r" v-if="item.IsPass7Day == 1">超7天未收货</text><text class="lis-li-r" v-if="item.IsReceived == 1">已收货</text></view>
						<view class="lis-li"><text><text >收货人手机：</text>{{item.TargetUserMobile}}</text></view>
						<view class="lis-li"><text class="lis-li-l" v-if="item.GoodsCode"><text>商品码：</text>{{item.GoodsCode}}</text><text class="lis-li-l" v-if="item.MidBoxCode"><text >中箱码：</text>{{item.MidBoxCode}}</text><text class="lis-li-l" v-if="item.BigBoxCode"><text>大箱码：</text>{{item.BigBoxCode}}</text></view>
						<view class="lis-li"><text v-if="item.ScanTime"><text >扫码时间：</text>{{item.ScanTime}}</text></view>
					</view>
					<view class="cont-ft">
						<view class="ft-y" v-if="recordData.length>0">
							<view v-if="selRow.CurPage < Math.ceil(selRow.allTotal/selRow.PageSize)">下拉加载更多</view>
                            <view v-else>没有更多了</view>
						</view>
						<view class="ft-n" v-else>
							<view class="ft-n-img"><image src="/static/noRecord.png" alt=""></image></view>
                            <view>当前没有记录</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<pull-up step="1" v-if="dealerData.length > 0" :isSlide="true" @conSlide="revSlide" :defaultVal="defaultVal" :defaultName="'RealName'" :defaultWeCat="'WeChat'"  @confirm="onConfirm" ref="picker"  :selectList="dealerData"></pull-up>
		<pull-date @ok="submit" ref="pullDate" :startTime="selRow.StartDate" :endTime="selRow.EndDate"></pull-date>
	</view>	
</template>

<script>
	import {pullToast,pullLoading,loadingInit} from '@/components/pull-layer/pull-layer.js';//弹窗
	import pullDate from '@/components/pull-date.vue';
	import pullUp from '@/components/pull-up.vue';
	export default {
		data() {
			return {
				selRow:{
					searchText:'',
					ReciverUserText:'',
					ReciverUserId:null,
					PageSize:6,
					CurPage:1,
					StartDate:'',
					EndDate:'',
					allTotal:0,
				},
				defaultVal:0,
				dealerData:[],
				date:'',
				recordData:[],
				isSlide:false
			}
		},
		components: {
			pullDate,
			pullUp
		},
		onLoad() {
			this.load(true);
			
			this.getDealer();
		},
		onPullDownRefresh(){//到顶
			// console.log(234);
		},
		onReachBottom(){//到底
			// console.log(123);
			this.load(false);
		},
		onPageScroll(obj){
			// console.log(obj.scrollTop);
		},
		methods: {
			dateBtn(){
				this.$refs.pullDate.show();
			},
			submit(val){
				this.selRow.StartDate = val.startTime.replace(/\//g,"-");
				this.selRow.EndDate = val.endTime.replace(/\//g,"-");;
				this.date = this.selRow.StartDate+'至'+this.selRow.EndDate;
				this.load(true);
			},
			toggleList(){
				this.$refs.picker.show();
			},
			async getDealer(){//获取经销商
				// //pullLoading('('加载中···')
				let res = await this.$http.ReqGet('User/GetAllUserRefereeById');
			
				let nowData = res.data;
				if(nowData.length>0){
					this.dealerData = [...nowData];
				}else{
					this.dealerData = [];
				}
				
				this.dealerData.unshift({
					F_Id:null,
					RealName:'全部'
				})	
			},
			onConfirm(val){//获取选择的数据
				let _this = this;
				_this.selRow.ReciverUserId = val.F_Id;
				_this.selRow.ReciverUserText = val.RealName+ (val.WeChat ? '('+val.WeChat+')' :'');;
				this.load(true);//刷新
			},
			revSlide(val){
				this.isSlide = val;
			},
			clear(){//清除操作
				let that = this;
				that.selRow.StartDate = '';
				that.selRow.EndDate = '';
				that.date = '';
				that.$refs.pullDate.init();
				that.load(true);
			},
			async load(bool){
				let that = this;
				if(bool){
					that.recordData = [];
					that.selRow.PageSize = 6;
					that.selRow.CurPage = 1;
					// pullLoading('订单加载中···');
				}else{
					if(that.selRow.CurPage >= Math.ceil(that.selRow.allTotal/that.selRow.PageSize)){
						return false;
					}else{
						that.selRow.CurPage++;
					} 
				}
				
				let res = await this.$http.ReqPOST('Sale/GetMyTeamReceiverScanCode',that.selRow);
				
				that.recordData.push(...res.data);
				that.selRow.allTotal = res.total;
			}
		}
	}
</script>

<style lang="scss">
	.cont{
		width:100%;
		padding:30upx;
		box-sizing: border-box;
		.cont-title{
			display:flex;
			position: relative;
			height:60upx;
			line-height:60upx;
			.title-input{
				flex:1;
				border: 1px solid #e8eaec;
				padding: 0 72upx 0 10upx;
				background: #e8eaec;
				font-size: 28upx;
				// border-radius: 10upx;
				height:60upx;
				line-height:60upx;
				box-sizing: border-box;
			}
			.title-clear{
				position: absolute;
				right: 170upx;
				padding: 0 20upx;
				z-index: 2;
			}
			.title-btn{
				height:60upx;
				line-height:60upx;
				background:#009788;
				color:#fff;
				font-size: 28upx;
			}
		}
		.cont-search{
			padding:10upx 0;
			.title-input{
				padding:0 20upx;
			}
		}
		.cont-check{
			margin-bottom: 10upx;
			background: #e8eaec;
			.check-lis{
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
		}
		.cont-content{
			.cont-list{
				.cont-lis{
					padding: 10px 0;
					border-bottom: 1px solid #e8eaec;
					.lis-li{
						font-size:28upx;
						text{
							color:#606266;
						}
						overflow: hidden;
						.lis-li-l{
							float: left;
							width: percentage(100/2/100);
						}
						.lis-li-r{
							float: right;
							color: #DF8D15;
						}
					}
				}
				.cont-ft{
					padding: 10upx 0;
					text-align: center;
					font-size:28upx;
					.ft-y{
						
					}
					.ft-n{
						.ft-n-img{
							padding-top: calc(50% - 200upx);
						}
						image{
							width:400upx;
							height:400upx;
						}
					}
				}
			}
		}
	}
</style>
