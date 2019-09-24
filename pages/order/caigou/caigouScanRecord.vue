<template>
	<view class="content">
		<view class="cont">
			<view class="cont-search">
				<input class="search-input" type="text" v-model="date" disabled placeholder="请选择时间搜索" />
				<text v-if="date" @click="clear" class="search-clear iconfont icon-close"></text>
				<button class="search-btn" @click="dateBtn">选择时间</button>
			</view>
			<view class="cont-content">
				<view class="cont-list">
					<view class="cont-lis" v-for="(item,index) in recordData" :key="index">
						<view class="lis-li"><text>条码：</text>{{item.ScanCode}}</view>
						<view class="lis-li"><text>入库时间：</text>{{item.CreatedTime}}</view>
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
		<pull-date @ok="submit" ref="pullDate" :startTime="selRow.StartDate" :endTime="selRow.EndDate"></pull-date>
	</view>	
</template>

<script>
	import {pullToast,pullLoading,loadingInit} from '@/components/pull-layer/pull-layer.js';//弹窗
	import pullDate from '@/components/pull-date.vue';
	export default {
		data() {
			return {
				date:'',
				selRow:{
					StartDate:'',
					EndDate:'',
					PageSize:6,
					CurPage:1,
					allTotal:0
				},
				recordData:[]
			}
		},
		components: {
			pullDate
		},
		onLoad() {
			this.load(true);
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
					//pullLoading('('订单加载中···');
				}else{
					if(that.selRow.CurPage >= Math.ceil(that.selRow.allTotal/that.selRow.PageSize)){
						return false;
					}else{
						that.selRow.CurPage++;
					} 
				}
				
				let res = await this.$http.ReqPOST('User/GetPurchaseScanCode',that.selRow);
				console.log(res);
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
		.cont-search{
			display:flex;
			position: relative;
			height:60upx;
			line-height:60upx;
			.search-input{
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
			.search-clear{
				position: absolute;
				right: 170upx;
				padding: 0 20upx;
				z-index: 2;
			}
			.search-btn{
				height:60upx;
				line-height:60upx;
				background:#009788;
				color:#fff;
				font-size: 28upx;
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
