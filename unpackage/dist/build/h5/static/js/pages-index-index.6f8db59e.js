(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-index-index"],{"1dae":function(t,n,e){"use strict";var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-uni-view",{staticClass:"content"},[e("v-uni-image",{staticClass:"logo",attrs:{src:"/static/logo.png"}}),e("v-uni-view",{staticClass:"text-area"},[e("v-uni-text",{staticClass:"title"},[t._v(t._s(t.title))])],1),e("v-uni-view",{staticClass:"uni-padding-wrap uni-common-mt"},[e("v-uni-button",{attrs:{type:"primary"},on:{click:function(n){n=t.$handleEvent(n),t.goLogin(n)}}},[t._v("页面主操作 Normal")])],1),e("v-uni-view",{staticClass:"uni-padding-wrap uni-common-mt"},[e("v-uni-button",{attrs:{type:"primary"},on:{click:function(n){n=t.$handleEvent(n),t.goLoading(n)}}},[t._v("页面主操作 Loading")])],1)],1)},a=[];e.d(n,"a",function(){return i}),e.d(n,"b",function(){return a})},"1e24":function(t,n,e){n=t.exports=e("2350")(!1),n.push([t.i,".content[data-v-08ec14b4]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.logo[data-v-08ec14b4]{height:%?200?%;width:%?200?%;margin-top:%?200?%;margin-left:auto;margin-right:auto;margin-bottom:%?50?%}.text-area[data-v-08ec14b4]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.title[data-v-08ec14b4]{font-size:%?36?%;color:#8f8f94}",""])},"3afe":function(t,n,e){"use strict";var i=e("f3e7"),a=e.n(i);a.a},"67fd":function(t,n,e){"use strict";e.r(n);var i=e("1dae"),a=e("d12d");for(var o in a)"default"!==o&&function(t){e.d(n,t,function(){return a[t]})}(o);e("3afe");var c=e("2877"),r=Object(c["a"])(a["default"],i["a"],i["b"],!1,null,"08ec14b4",null);n["default"]=r.exports},"99dc":function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i={data:function(){return{title:"Hello",searchTxt:""}},onLoad:function(){},onNavigationBarButtonTap:function(t){console.log(t)},onNavigationBarSearchInputChanged:function(t){console.log(t),this.searchTxt=t.text},onNavigationBarSearchInputConfirmed:function(t){console.log("输入框提交")},methods:{goLogin:function(){uni.navigateTo({url:"../login/login"})},goLoading:function(){uni.navigateTo({url:"../login/loading"})}}};n.default=i},d12d:function(t,n,e){"use strict";e.r(n);var i=e("99dc"),a=e.n(i);for(var o in i)"default"!==o&&function(t){e.d(n,t,function(){return i[t]})}(o);n["default"]=a.a},f3e7:function(t,n,e){var i=e("1e24");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var a=e("4f06").default;a("7925071d",i,!0,{sourceMap:!1,shadowMode:!1})}}]);