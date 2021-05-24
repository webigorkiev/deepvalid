(()=>{"use strict";var u={};(()=>{u.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return u.d(e,{a:e}),e}})(),(()=>{u.d=(t,e)=>{for(var a in e)u.o(e,a)&&!u.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:e[a]})}})(),(()=>{u.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e)})(),(()=>{u.r=t=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}})();var b={};u.r(b),u.d(b,{Validation:()=>x,array:()=>j,boolean:()=>A,dateISO:()=>N,default:()=>H,depends:()=>B,digits:()=>R,email:()=>L,equalTo:()=>V,max:()=>F,maxlength:()=>I,min:()=>D,minlength:()=>q,number:()=>S,object:()=>P,range:()=>k,rangedate:()=>G,rangelength:()=>z,regexp:()=>W,required:()=>C,uaPhone:()=>Z,url:()=>$});const T=require("@jwn-js/easy-ash/isObject");var c=u.n(T);const E=require("@jwn-js/common/ApiError");var s=u.n(E),_=(t,e,a)=>{if(!e.has(t))throw TypeError("Cannot "+a)},i=(t,e,a)=>(_(t,e,"read from private field"),a?a.call(t):e.get(t)),m=(t,e,a)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,a)},g=(t,e,a,r)=>(_(t,e,"write to private field"),r?r.call(t,a):e.set(t,a),a),f,d,y,M,p,w;const O={isFieldNameMode:!0,defaultCode:400},h={required:"the value is empty",boolean:"the value not boolean value",array:"the value not array value",object:"the value not object value",minlength:"the number of characters in the line is less !%",maxlength:"the number of characters in the line is more !%",rangelength:"the number of characters in a line outside the range from !% to !% \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",range:"the value is not in the range from !% to !%",min:"the value less than minimum value !%",max:"the value is greater than the maximum value !%",email:"the email address is not correct",url:"the url is not correct",dateISO:"the ISO date format is not correct",digits:"the value is not an integer",number:"the value is not a decimal number",equalTo:"field values are not equivalent",regexp:"the field value does not match the pattern",phone:"the phone number is not correct",depends:"the custom handler error",rangedate:"the date out of range !% - !%"},C=(t={})=>({param:!0,...t}),A=(t={})=>({param:!0,...t}),S=(t={})=>({param:!0,...t}),j=(t={})=>({param:!0,...t}),P=(t={})=>({param:!0,...t}),q=(t=0,e={})=>({param:t,...e}),I=(t=255,e={})=>({param:t,...e}),z=(t=[0,255],e={})=>({param:t,...e}),k=(t=[0,65535],e={})=>({param:t,...e}),D=(t=0,e={})=>({param:t,...e}),F=(t=65535,e={})=>({param:t,...e}),L=(t={})=>({param:!0,...t}),$=(t={})=>({param:!0,...t}),N=(t={})=>({param:!0,...t}),R=(t={})=>({param:!0,...t}),V=(t,e={})=>({param:t,...e}),W=(t=/\d/i,e={})=>({param:t,...e}),Z=(t={})=>({param:!0,...t}),B=(t=(a,r)=>!0,e={})=>({param:t,...e}),G=(t=[new Date,new Date],e={})=>({param:t,...e});class x{constructor(e={},a={}){m(this,f,void 0),m(this,d,void 0),m(this,y,void 0),m(this,M,void 0),m(this,p,void 0),m(this,w,void 0);const r=Object.assign({},O,a);g(this,p,this.executeFunctionInModel(e)),g(this,f,r.isFieldNameMode),g(this,d,r.defaultStatusCode)}setModel(e={}){g(this,p,this.executeFunctionInModel(e))}executeFunctionInModel(e){for(const a in e)e.hasOwnProperty(a)&&(c()(e[a])&&(e[a]=this.executeFunctionInModel(e[a])),e[a]=typeof e[a]=="function"?e[a]():e[a]);return e}validate(e,a=[]){const r=this.cutTwolastLevel(i(this,p));if(!r)throw new(s())({message:"invalid validation model",code:1,statusCode:i(this,d)});return this.validateRecurcive(r,e,a)}validateRecurcive(e,a,r=[],n=[]){for(const o in e){if(!this.isKeyDeepInFilters([...n,o],r)&&r.length)continue;const l=a[o]??void 0;c()(e[o])?this.validateRecurcive(e[o],l,r,[...n,o]):this.validateParam([...n,o],l,r)}return!0}cutTwolastLevel(e){return this.lastLevelCut(this.lastLevelCut(e))}lastLevelCut(e,a={}){if(!!e){for(const r in e)if(e.hasOwnProperty(r)){const n=e[r];if(c()(n))a[r]=this.lastLevelCut(n);else return}return a}}validateParam(e,a,r){g(this,w,e.join("."));const n=this.getDeepValidators(e);for(const o in n){if(!n.hasOwnProperty(o)||typeof this[o]!="function")throw new(s())({message:`Row ${e.join(".")}: validator ${o} not implemented`,code:2,statusCode:i(this,d)});let l;if(c()(n[o]))l=n[o];else throw new(s())({message:"validator should be function or object",code:1,statusCode:i(this,d)});if(!l.hasOwnProperty("param"))throw new(s())({message:"validator options should have param key",code:1,statusCode:i(this,d)});(a!==""&&a!==void 0&&a!==null&&!Number.isNaN(a)||o==="required")&&this[o](a,l)}}getDeepValidators(e){return e.reduce((a,r)=>{if(!a.hasOwnProperty(r))throw new(s())({message:`There no validators for ${e.join(".")}`,code:1,statusCode:i(this,d)});return a[r]},i(this,p))}isKeyDeepInFilters(e,a,r=0){const n=e[r];if(!n)return!1;let o=a.includes(n);const l=a.filter(v=>c()(v));for(const v of l)v.hasOwnProperty(n)&&(r<e.length-1?o=this.isKeyDeepInFilters(e,v[n],++r):o=!0);return o}getValidatedParams(){return i(this,M)}getInputParams(){return i(this,y)}adaptToErrorMessage(e,a,r,n=[]){const o=Object.assign({message:a,code:r,statusCode:i(this,d)},e);return o.message=this.messageReplace(o.message,n),o}valueLength(e){let a;if(typeof e=="string"||Array.isArray(e))a=e.length;else if(e instanceof Set||e instanceof Map)a=e.size;else throw new(s())({message:"the value has no length",code:3,statusCode:i(this,d)});return a}required(e,a){if(typeof e=="undefined"||Number.isNaN(e))throw new(s())(this.adaptToErrorMessage(a,h.required,4))}boolean(e,a){if(typeof e!="boolean")throw new(s())(this.adaptToErrorMessage(a,h.boolean,5))}array(e,a){if(!Array.isArray(e))throw new(s())(this.adaptToErrorMessage(a,h.array,5))}object(e,a){if(!c()(e))throw new(s())(this.adaptToErrorMessage(a,h.object,5))}minlength(e,a){if(this.valueLength(e)<a.param)throw new(s())(this.adaptToErrorMessage(a,h.minlength,6,[a.param]))}maxlength(e,a){if(this.valueLength(e)>a.param)throw new(s())(this.adaptToErrorMessage(a,h.maxlength,7,[a.param]))}rangelength(e,a){if(!Array.isArray(a.param))throw new(s())({message:"options for rangelength should be an array",code:8,statusCode:i(this,d)});const r=this.valueLength(e);if(r<a.param[0]||r>a.param[1])throw new(s())(this.adaptToErrorMessage(a,h.rangelength,9,[...a.param]))}min(e,a){if(typeof a.param!="number")throw new(s())({message:"options for min should be should be a number",code:10,statusCode:i(this,d)});if(e<a.param)throw new(s())(this.adaptToErrorMessage(a,h.min,11,[String(a.param)]))}max(e,a){if(typeof a.param!="number")throw new(s())({message:"options for max should be should be a number",code:12,statusCode:i(this,d)});if(e>a.param)throw new(s())(this.adaptToErrorMessage(a,h.max,13,[String(a.param)]))}range(e,a){if(!Array.isArray(a.param))throw new(s())({message:"options for range should be should be an array",code:12,statusCode:i(this,d)});if(e<a.param[0]||e>a.param[1])throw new(s())(this.adaptToErrorMessage(a,h.range,15,[...a.param]))}email(e,a){if(!/^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i.test(e))throw new(s())(this.adaptToErrorMessage(a,h.email,16))}url(e,a){if(!/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9]-*)*[a-z0-9]+)(?:\.(?:[a-z0-9]-*)*[a-z0-9]+)*(?:\.(?:[a-z]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(e))throw new(s())(this.adaptToErrorMessage(a,h.url,17))}dateISO(e,a){if(!/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/i.test(e))throw new(s())(this.adaptToErrorMessage(a,h.dateISO,18))}digits(e,a){if(typeof e!="number"||e!==Math.round(e))throw new(s())(this.adaptToErrorMessage(a,h.digits,19))}number(e,a){if(typeof e!="number")throw new(s())(this.adaptToErrorMessage(a,h.number,20))}equalTo(e,a){if(e!==a.param)throw new(s())(this.adaptToErrorMessage(a,h.equalTo,21))}regexp(e,a){if(!(a.param instanceof RegExp))throw new(s())({message:"options for regexp should be should be a regex",code:22,statusCode:i(this,d)});if(!a.param.test(e))throw new(s())(this.adaptToErrorMessage(a,h.regexp,22))}uaPhone(e,a){if(!/^\+380[5-9]{1}[0-9]{1}[0-9]{3}[0-9]{2}[0-9]{2}$/i.test(e))throw new(s())(this.adaptToErrorMessage(a,h.phone,23))}rangedate(e,a){if(!Array.isArray(a.param))throw new(s())({message:"options for rangedate should be should be an array",code:24,statusCode:i(this,d)});const r=new Date(e);let n=!0;if(a.param[0]&&r<new Date(a.param[0])&&(n=!1),a.param[0]&&r>new Date(a.param[1])&&(n=!1),!n)throw new(s())(this.adaptToErrorMessage(a,h.rangedate,25,[...a.param]))}depends(e,a){if(typeof a.param!="function")throw new(s())({message:"options depends should be should be a function",code:24,statusCode:i(this,d)});if(!a.param(e,a))throw new(s())(this.adaptToErrorMessage(a,h.depends,25))}messageReplace(e,a=[]){return a.map(r=>e=e.replace("!%",r)),i(this,f)?`${i(this,w)}: ${e}`:e}}f=new WeakMap,d=new WeakMap,y=new WeakMap,M=new WeakMap,p=new WeakMap,w=new WeakMap;const H=()=>new x;module.exports=b})();
