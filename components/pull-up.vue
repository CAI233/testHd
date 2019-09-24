<template>
	<view class="w-picker">
		<view class="mask" :class="{'show':showPicker}" @tap="maskTap" @touchmove.stop.prevent catchtouchmove="true"></view>
		<view class="w-picker-cnt" :class="{'show':showPicker}">
			<view class="w-picker-hd" @touchmove.stop.prevent catchtouchmove="true">
			  <view class="w-picker-btn" @tap="pickerCancel">取消</view>
			  <view class="w-picker-btn" :style="{'color':themeColor}" @tap="pickerConfirm">确定</view>
			</view>
			<view class="w-picker-view">
				<picker-view indicator-style="height: 80upx;" :value="pickVal" @change="bindChange">
					<picker-view-column>
						<view class="item" v-for="(item,index) in data" :key="index">{{item[defaultName]+(item[defaultWeCat] ? '('+item[defaultWeCat]+')' :'')}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				result:[],
				data:{},
				checkArr:[],
				pickVal:[],
				showPicker:false,
			};
		},
		computed:{
			
		},
		props:{
			mode:{
				type:String,
				default(){
					return ""
				}
			},
			themeColor:{
				type:String,
				default(){
					return "#f00"
				}
			},
			defaultVal:{
				type:Number,
				default(){
					return 0
				}
			},
			defaultName:{
				type:String,
				default(){
					return ''
				}
			},
			defaultWeCat:{
				type:String,
				default(){
					return ''
				}
			},
			step:{
				type:null,
				default:1
			},
			current:{
				type:Boolean,
				default:false
			},
			selectList:{
				type:Array,
				default(){
					return [];
				}
			},
			isSlide:{
				type:Boolean,
				default(){
					return false;
				}
			}
		},
		watch:{
			selectList(){
				this.initData();
			},
			
		},
		methods:{
			maskTap(){
				this.showPicker = false;
				this.pickerSlide(false);
			},
			show(){
				this.showPicker = true;
				this.pickerSlide(true);
			},
			hide(){
				this.showPicker = false;
				this.pickerSlide(false);
			},
			pickerSlide(bool){
				let _this = this;
				if(!_this.isSlide){
					return false;
				}
				_this.$emit("conSlide",bool);
			},
			pickerCancel(){
				this.$emit("cancel",{
					result:''
				});
				this.showPicker = false;
				this.pickerSlide(false);
			},
			pickerConfirm(e){
				let _this = this;
				let index = _this.pickVal.length > 0 ? _this.pickVal[0] : 0;
				let result = _this.data[index];
				_this.$emit("confirm",result);
				_this.showPicker = false;
				_this.pickerSlide(false);
			},
			bindChange(val){
				let _this=this;
				let arr = val.detail.value;
				// console.log(_this.data);
				_this.$nextTick(()=>{
					_this.pickVal= arr;
					// let result = _this.data[_this.pickVal[0]];
					// _this.$emit("confirm",result);
				})
			},
			initData(){
				let _this=this;
				_this.data = _this.selectList;
				_this.$nextTick(()=>{
					_this.pickVal= [];
				})
			}
		},
		mounted() {
			this.initData();
		}
	}
</script>

<style lang="scss">
	.w-picker{
		position: relative;
		z-index: 999999;
		.mask {
		  position: fixed;
		  z-index: 1000;
		  top: 0;
		  right: 0;
		  left: 0;
		  bottom: 0;
		  background: rgba(0, 0, 0, 0.6);
		  visibility: hidden;
		  opacity: 0;
		  transition: all 0.3s ease;
		}
		.mask.show{
			visibility: visible;
			opacity: 1;
		}
		.w-picker-cnt {
		  position: fixed;
		  bottom: 0;
		  left: 0;
		  width: 100%;
		  transition: all 0.3s ease;
		  transform: translateY(100%);
		  z-index: 3000;
		}
		.w-picker-cnt.show {
		  transform: translateY(0);
		}
		.w-picker-hd {
		  display: flex;
		  align-items: center;
		  padding: 0 30upx;
		  height: 88upx;
		  background-color: #fff;
		  position: relative;
		  text-align: center;
		  font-size: 32upx;
		  justify-content: space-between;
		  .w-picker-btn{
		  	font-size: 30upx;
		  }
		}
		
		.w-picker-hd:after {
		  content: ' ';
		  position: absolute;
		  left: 0;
		  bottom: 0;
		  right: 0;
		  height: 1px;
		  border-bottom: 1px solid #e5e5e5;
		  color: #e5e5e5;
		  transform-origin: 0 100%;
		  transform: scaleY(0.5);
		}
		.item {
		  text-align: center;
		  width: 100%;
		  height: 80upx;
		  line-height: 80upx;
		  text-overflow: ellipsis;
		  white-space: nowrap;
		  font-size: 30upx;
		}
		.w-picker-view {
		  width: 100%;
		  height: 476upx;
		  overflow: hidden;
		  background-color: rgba(255, 255, 255, 1);
		  z-index: 666;
		}
		picker-view{
			height: 100%;
		}
	}
</style>
