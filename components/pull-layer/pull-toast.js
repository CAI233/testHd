import Vue from 'vue';

let isActive = false;
function pullToast(msg,durtion,type){
	if(!msg || msg == ''){
		return false;
	}
	let el = '';
	isActive = true;
	let baseExtend = Vue.extend({
		render(h){
			return h('view',{style:''},[
				h('style',{type:'text/css'}),
				h('view',{class:'pull-layer pull-layer-plane'+(isActive? ' active' : '')},[
					h('view',{class:'pull-layer-plane-close pull-layer-toast'}),
					h('view',{class:'pull-layer-plane-content'},[
						h('view',{class:'pull-layer-box '+type},msg)
					])
				])
			])
		}
	})
	let newBaseExtend = new baseExtend();
	let vm = newBaseExtend.$mount();
	el = vm.$el;
	document.body.appendChild(el) // 把生成的提示的dom插入body中
	let set = setTimeout(_=> {
		clearTimeout(set);
		document.body.removeChild(el);
		isActive = false;
		newBaseExtend.$destroy()
		},durtion || 1500)
}

export {pullToast};