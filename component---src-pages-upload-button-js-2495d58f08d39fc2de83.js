(self.webpackChunkgatsby_test=self.webpackChunkgatsby_test||[]).push([[4252],{92137:function(t,e,n){"use strict";function i(t,e,n,i,r,o,a){try{var s=t[o](a),u=s.value}catch(c){return void n(c)}s.done?e(u):Promise.resolve(u).then(i,r)}function r(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var a=t.apply(e,n);function s(t){i(a,r,o,s,u,"next",t)}function u(t){i(a,r,o,s,u,"throw",t)}s(void 0)}))}}n.d(e,{Z:function(){return r}})},27136:function(t,e,n){"use strict";var i=n(22122),r=n(81253),o=n(67294),a=n(85505),s=n(20638),u=n(81664),c=44,l=o.forwardRef((function(t,e){var n=t.classes,s=t.className,l=t.color,d=void 0===l?"primary":l,f=t.disableShrink,m=void 0!==f&&f,h=t.size,p=void 0===h?40:h,g=t.style,b=t.thickness,v=void 0===b?3.6:b,_=t.value,y=void 0===_?0:_,x=t.variant,E=void 0===x?"indeterminate":x,w=(0,r.Z)(t,["classes","className","color","disableShrink","size","style","thickness","value","variant"]),C={},S={},Z={};if("determinate"===E||"static"===E){var N=2*Math.PI*((c-v)/2);C.strokeDasharray=N.toFixed(3),Z["aria-valuenow"]=Math.round(y),C.strokeDashoffset="".concat(((100-y)/100*N).toFixed(3),"px"),S.transform="rotate(-90deg)"}return o.createElement("div",(0,i.Z)({className:(0,a.Z)(n.root,s,"inherit"!==d&&n["color".concat((0,u.Z)(d))],{determinate:n.determinate,indeterminate:n.indeterminate,static:n.static}[E]),style:(0,i.Z)({width:p,height:p},S,g),ref:e,role:"progressbar"},Z,w),o.createElement("svg",{className:n.svg,viewBox:"".concat(22," ").concat(22," ").concat(c," ").concat(c)},o.createElement("circle",{className:(0,a.Z)(n.circle,m&&n.circleDisableShrink,{determinate:n.circleDeterminate,indeterminate:n.circleIndeterminate,static:n.circleStatic}[E]),style:C,cx:c,cy:c,r:(c-v)/2,fill:"none",strokeWidth:v})))}));e.Z=(0,s.Z)((function(t){return{root:{display:"inline-block"},static:{transition:t.transitions.create("transform")},indeterminate:{animation:"$circular-rotate 1.4s linear infinite"},determinate:{transition:t.transitions.create("transform")},colorPrimary:{color:t.palette.primary.main},colorSecondary:{color:t.palette.secondary.main},svg:{display:"block"},circle:{stroke:"currentColor"},circleStatic:{transition:t.transitions.create("stroke-dashoffset")},circleIndeterminate:{animation:"$circular-dash 1.4s ease-in-out infinite",strokeDasharray:"80px, 200px",strokeDashoffset:"0px"},circleDeterminate:{transition:t.transitions.create("stroke-dashoffset")},"@keyframes circular-rotate":{"0%":{transformOrigin:"50% 50%"},"100%":{transform:"rotate(360deg)"}},"@keyframes circular-dash":{"0%":{strokeDasharray:"1px, 200px",strokeDashoffset:"0px"},"50%":{strokeDasharray:"100px, 200px",strokeDashoffset:"-15px"},"100%":{strokeDasharray:"100px, 200px",strokeDashoffset:"-125px"}},circleDisableShrink:{animation:"none"}}}),{name:"MuiCircularProgress",flip:!1})(l)},49995:function(t,e,n){"use strict";var i=n(81253),r=n(22122),o=n(67294),a=n(85505),s=n(20638),u=n(67055),c=n(81664),l=o.forwardRef((function(t,e){var n=t.children,s=t.classes,l=t.className,d=t.color,f=void 0===d?"default":d,m=t.component,h=void 0===m?"button":m,p=t.disabled,g=void 0!==p&&p,b=t.disableFocusRipple,v=void 0!==b&&b,_=t.focusVisibleClassName,y=t.size,x=void 0===y?"large":y,E=t.variant,w=void 0===E?"round":E,C=(0,i.Z)(t,["children","classes","className","color","component","disabled","disableFocusRipple","focusVisibleClassName","size","variant"]);return o.createElement(u.Z,(0,r.Z)({className:(0,a.Z)(s.root,l,"round"!==w&&s.extended,"large"!==x&&s["size".concat((0,c.Z)(x))],g&&s.disabled,{primary:s.primary,secondary:s.secondary,inherit:s.colorInherit}[f]),component:h,disabled:g,focusRipple:!v,focusVisibleClassName:(0,a.Z)(s.focusVisible,_),ref:e},C),o.createElement("span",{className:s.label},n))}));e.Z=(0,s.Z)((function(t){return{root:(0,r.Z)({},t.typography.button,{boxSizing:"border-box",minHeight:36,transition:t.transitions.create(["background-color","box-shadow","border"],{duration:t.transitions.duration.short}),borderRadius:"50%",padding:0,minWidth:0,width:56,height:56,boxShadow:t.shadows[6],"&:active":{boxShadow:t.shadows[12]},color:t.palette.getContrastText(t.palette.grey[300]),backgroundColor:t.palette.grey[300],"&:hover":{backgroundColor:t.palette.grey.A100,"@media (hover: none)":{backgroundColor:t.palette.grey[300]},"&$disabled":{backgroundColor:t.palette.action.disabledBackground},textDecoration:"none"},"&$focusVisible":{boxShadow:t.shadows[6]},"&$disabled":{color:t.palette.action.disabled,boxShadow:t.shadows[0],backgroundColor:t.palette.action.disabledBackground}}),label:{width:"100%",display:"inherit",alignItems:"inherit",justifyContent:"inherit"},primary:{color:t.palette.primary.contrastText,backgroundColor:t.palette.primary.main,"&:hover":{backgroundColor:t.palette.primary.dark,"@media (hover: none)":{backgroundColor:t.palette.primary.main}}},secondary:{color:t.palette.secondary.contrastText,backgroundColor:t.palette.secondary.main,"&:hover":{backgroundColor:t.palette.secondary.dark,"@media (hover: none)":{backgroundColor:t.palette.secondary.main}}},extended:{borderRadius:24,padding:"0 16px",width:"auto",minHeight:"auto",minWidth:48,height:48,"&$sizeSmall":{width:"auto",padding:"0 8px",borderRadius:17,minWidth:34,height:34},"&$sizeMedium":{width:"auto",padding:"0 16px",borderRadius:20,minWidth:40,height:40}},focusVisible:{},disabled:{},colorInherit:{color:"inherit"},sizeSmall:{width:40,height:40},sizeMedium:{width:48,height:48}}}),{name:"MuiFab"})(l)},43337:function(t,e,n){"use strict";var i=n(22122),r=n(28481),o=n(81253),a=n(67294),s=n(81423),u=n(59355),c=n(19701),l=n(11291);function d(t){return"scale(".concat(t,", ").concat(Math.pow(t,2),")")}var f={entering:{opacity:1,transform:d(1)},entered:{opacity:1,transform:"none"}},m=a.forwardRef((function(t,e){var n=t.children,m=t.disableStrictModeCompat,h=void 0!==m&&m,p=t.in,g=t.onEnter,b=t.onEntered,v=t.onEntering,_=t.onExit,y=t.onExited,x=t.onExiting,E=t.style,w=t.timeout,C=void 0===w?"auto":w,S=t.TransitionComponent,Z=void 0===S?s.ZP:S,N=(0,o.Z)(t,["children","disableStrictModeCompat","in","onEnter","onEntered","onEntering","onExit","onExited","onExiting","style","timeout","TransitionComponent"]),j=a.useRef(),k=a.useRef(),I=(0,u.Z)(),T=I.unstable_strictMode&&!h,O=a.useRef(null),P=(0,l.Z)(n.ref,e),R=(0,l.Z)(T?O:void 0,P),z=function(t){return function(e,n){if(t){var i=T?[O.current,e]:[e,n],o=(0,r.Z)(i,2),a=o[0],s=o[1];void 0===s?t(a):t(a,s)}}},D=z(v),L=z((function(t,e){(0,c.n)(t);var n,i=(0,c.C)({style:E,timeout:C},{mode:"enter"}),r=i.duration,o=i.delay;"auto"===C?(n=I.transitions.getAutoHeightDuration(t.clientHeight),k.current=n):n=r,t.style.transition=[I.transitions.create("opacity",{duration:n,delay:o}),I.transitions.create("transform",{duration:.666*n,delay:o})].join(","),g&&g(t,e)})),M=z(b),A=z(x),F=z((function(t){var e,n=(0,c.C)({style:E,timeout:C},{mode:"exit"}),i=n.duration,r=n.delay;"auto"===C?(e=I.transitions.getAutoHeightDuration(t.clientHeight),k.current=e):e=i,t.style.transition=[I.transitions.create("opacity",{duration:e,delay:r}),I.transitions.create("transform",{duration:.666*e,delay:r||.333*e})].join(","),t.style.opacity="0",t.style.transform=d(.75),_&&_(t)})),V=z(y);return a.useEffect((function(){return function(){clearTimeout(j.current)}}),[]),a.createElement(Z,(0,i.Z)({appear:!0,in:p,nodeRef:T?O:void 0,onEnter:L,onEntered:M,onEntering:D,onExit:F,onExited:V,onExiting:A,addEndListener:function(t,e){var n=T?t:e;"auto"===C&&(j.current=setTimeout(n,k.current||0))},timeout:"auto"===C?null:C},N),(function(t,e){return a.cloneElement(n,(0,i.Z)({style:(0,i.Z)({opacity:0,transform:d(.75),visibility:"exited"!==t||p?void 0:"hidden"},f[t],E,n.props.style),ref:R},e))}))}));m.muiSupportAuto=!0,e.Z=m},8590:function(t,e,n){"use strict";var i=n(67294),r=n(73935),o=n(71474),a=n(11291);var s="undefined"!=typeof window?i.useLayoutEffect:i.useEffect,u=i.forwardRef((function(t,e){var n=t.children,u=t.container,c=t.disablePortal,l=void 0!==c&&c,d=t.onRendered,f=i.useState(null),m=f[0],h=f[1],p=(0,a.Z)(i.isValidElement(n)?n.ref:null,e);return s((function(){l||h(function(t){return t="function"==typeof t?t():t,r.findDOMNode(t)}(u)||document.body)}),[u,l]),s((function(){if(m&&!l)return(0,o.Z)(e,m),function(){(0,o.Z)(e,null)}}),[e,m,l]),s((function(){d&&(m||l)&&d()}),[d,m,l]),l?i.isValidElement(n)?i.cloneElement(n,{ref:p}):n:m?r.createPortal(n,m):m}));e.Z=u},10920:function(t,e,n){"use strict";var i=n(22122),r=n(16180),o=n(69123);e.Z=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return(0,r.Z)(t,(0,i.Z)({defaultTheme:o.Z},e))}},59355:function(t,e,n){"use strict";n.d(e,{Z:function(){return o}});var i=n(73041),r=(n(67294),n(69123));function o(){return(0,i.Z)()||r.Z}},19701:function(t,e,n){"use strict";n.d(e,{n:function(){return i},C:function(){return r}});var i=function(t){return t.scrollTop};function r(t,e){var n=t.timeout,i=t.style,r=void 0===i?{}:i;return{duration:r.transitionDuration||"number"==typeof n?n:n[e.mode]||0,delay:r.transitionDelay}}},88231:function(t,e,n){"use strict";function i(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return e.reduce((function(t,e){return null==e?t:function(){for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];t.apply(this,i),e.apply(this,i)}}),(function(){}))}n.d(e,{Z:function(){return i}})},19123:function(t,e,n){"use strict";n.d(e,{Z:function(){return d}});var i=n(22122),r=n(67294),o=n(81253),a=n(85505),s=n(20638),u=n(81664),c=r.forwardRef((function(t,e){var n=t.children,s=t.classes,c=t.className,l=t.color,d=void 0===l?"inherit":l,f=t.component,m=void 0===f?"svg":f,h=t.fontSize,p=void 0===h?"default":h,g=t.htmlColor,b=t.titleAccess,v=t.viewBox,_=void 0===v?"0 0 24 24":v,y=(0,o.Z)(t,["children","classes","className","color","component","fontSize","htmlColor","titleAccess","viewBox"]);return r.createElement(m,(0,i.Z)({className:(0,a.Z)(s.root,c,"inherit"!==d&&s["color".concat((0,u.Z)(d))],"default"!==p&&s["fontSize".concat((0,u.Z)(p))]),focusable:"false",viewBox:_,color:g,"aria-hidden":!b||void 0,role:b?"img":void 0,ref:e},y),n,b?r.createElement("title",null,b):null)}));c.muiName="SvgIcon";var l=(0,s.Z)((function(t){return{root:{userSelect:"none",width:"1em",height:"1em",display:"inline-block",fill:"currentColor",flexShrink:0,fontSize:t.typography.pxToRem(24),transition:t.transitions.create("fill",{duration:t.transitions.duration.shorter})},colorPrimary:{color:t.palette.primary.main},colorSecondary:{color:t.palette.secondary.main},colorAction:{color:t.palette.action.active},colorError:{color:t.palette.error.main},colorDisabled:{color:t.palette.action.disabled},fontSizeInherit:{fontSize:"inherit"},fontSizeSmall:{fontSize:t.typography.pxToRem(20)},fontSizeLarge:{fontSize:t.typography.pxToRem(35)}}}),{name:"MuiSvgIcon"})(c);function d(t,e){var n=function(e,n){return r.createElement(l,(0,i.Z)({ref:n},e),t)};return n.muiName=l.muiName,r.memo(r.forwardRef(n))}},91510:function(t,e,n){"use strict";function i(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:166;function i(){for(var i=arguments.length,r=new Array(i),o=0;o<i;o++)r[o]=arguments[o];var a=this,s=function(){t.apply(a,r)};clearTimeout(e),e=setTimeout(s,n)}return i.clear=function(){clearTimeout(e)},i}n.d(e,{Z:function(){return i}})},61008:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var i=n(67294);function r(t,e){return i.isValidElement(t)&&-1!==e.indexOf(t.type.muiName)}},70703:function(t,e,n){"use strict";function i(t){return t&&t.ownerDocument||document}n.d(e,{Z:function(){return i}})},67811:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var i=n(70703);function r(t){return(0,i.Z)(t).defaultView||window}},12933:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var i=n(67294);function r(t){var e=t.controlled,n=t.default,r=(t.name,t.state,i.useRef(void 0!==e).current),o=i.useState(n),a=o[0],s=o[1];return[r?e:a,i.useCallback((function(t){r||s(t)}),[])]}},54657:function(t,e,n){"use strict";var i=n(95318),r=n(20862);e.Z=void 0;var o=r(n(67294)),a=(0,i(n(58786)).default)(o.createElement("path",{d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"}),"CloudUpload");e.Z=a},81423:function(t,e,n){"use strict";n.d(e,{ZP:function(){return g}});var i=n(19756),r=n(41788),o=n(67294),a=n(73935),s=!1,u=n(1278),c="unmounted",l="exited",d="entering",f="entered",m="exiting",h=function(t){function e(e,n){var i;i=t.call(this,e,n)||this;var r,o=n&&!n.isMounting?e.enter:e.appear;return i.appearStatus=null,e.in?o?(r=l,i.appearStatus=d):r=f:r=e.unmountOnExit||e.mountOnEnter?c:l,i.state={status:r},i.nextCallback=null,i}(0,r.Z)(e,t),e.getDerivedStateFromProps=function(t,e){return t.in&&e.status===c?{status:l}:null};var n=e.prototype;return n.componentDidMount=function(){this.updateStatus(!0,this.appearStatus)},n.componentDidUpdate=function(t){var e=null;if(t!==this.props){var n=this.state.status;this.props.in?n!==d&&n!==f&&(e=d):n!==d&&n!==f||(e=m)}this.updateStatus(!1,e)},n.componentWillUnmount=function(){this.cancelNextCallback()},n.getTimeouts=function(){var t,e,n,i=this.props.timeout;return t=e=n=i,null!=i&&"number"!=typeof i&&(t=i.exit,e=i.enter,n=void 0!==i.appear?i.appear:e),{exit:t,enter:e,appear:n}},n.updateStatus=function(t,e){void 0===t&&(t=!1),null!==e?(this.cancelNextCallback(),e===d?this.performEnter(t):this.performExit()):this.props.unmountOnExit&&this.state.status===l&&this.setState({status:c})},n.performEnter=function(t){var e=this,n=this.props.enter,i=this.context?this.context.isMounting:t,r=this.props.nodeRef?[i]:[a.findDOMNode(this),i],o=r[0],u=r[1],c=this.getTimeouts(),l=i?c.appear:c.enter;!t&&!n||s?this.safeSetState({status:f},(function(){e.props.onEntered(o)})):(this.props.onEnter(o,u),this.safeSetState({status:d},(function(){e.props.onEntering(o,u),e.onTransitionEnd(l,(function(){e.safeSetState({status:f},(function(){e.props.onEntered(o,u)}))}))})))},n.performExit=function(){var t=this,e=this.props.exit,n=this.getTimeouts(),i=this.props.nodeRef?void 0:a.findDOMNode(this);e&&!s?(this.props.onExit(i),this.safeSetState({status:m},(function(){t.props.onExiting(i),t.onTransitionEnd(n.exit,(function(){t.safeSetState({status:l},(function(){t.props.onExited(i)}))}))}))):this.safeSetState({status:l},(function(){t.props.onExited(i)}))},n.cancelNextCallback=function(){null!==this.nextCallback&&(this.nextCallback.cancel(),this.nextCallback=null)},n.safeSetState=function(t,e){e=this.setNextCallback(e),this.setState(t,e)},n.setNextCallback=function(t){var e=this,n=!0;return this.nextCallback=function(i){n&&(n=!1,e.nextCallback=null,t(i))},this.nextCallback.cancel=function(){n=!1},this.nextCallback},n.onTransitionEnd=function(t,e){this.setNextCallback(e);var n=this.props.nodeRef?this.props.nodeRef.current:a.findDOMNode(this),i=null==t&&!this.props.addEndListener;if(n&&!i){if(this.props.addEndListener){var r=this.props.nodeRef?[this.nextCallback]:[n,this.nextCallback],o=r[0],s=r[1];this.props.addEndListener(o,s)}null!=t&&setTimeout(this.nextCallback,t)}else setTimeout(this.nextCallback,0)},n.render=function(){var t=this.state.status;if(t===c)return null;var e=this.props,n=e.children,r=(e.in,e.mountOnEnter,e.unmountOnExit,e.appear,e.enter,e.exit,e.timeout,e.addEndListener,e.onEnter,e.onEntering,e.onEntered,e.onExit,e.onExiting,e.onExited,e.nodeRef,(0,i.Z)(e,["children","in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","addEndListener","onEnter","onEntering","onEntered","onExit","onExiting","onExited","nodeRef"]));return o.createElement(u.Z.Provider,{value:null},"function"==typeof n?n(t,r):o.cloneElement(o.Children.only(n),r))},e}(o.Component);function p(){}h.contextType=u.Z,h.defaultProps={in:!1,mountOnEnter:!1,unmountOnExit:!1,appear:!1,enter:!0,exit:!0,onEnter:p,onEntering:p,onEntered:p,onExit:p,onExiting:p,onExited:p},h.UNMOUNTED=c,h.EXITED=l,h.ENTERING=d,h.ENTERED=f,h.EXITING=m;var g=h},38889:function(t,e,n){"use strict";n.d(e,{Z:function(){return o}});var i=function(){function t(t,e){this.column_lines=e,this.image_lines=t,this.image_column={},this.image_mapped={};for(var n=0;n<this.column_lines.length;n++)this.image_column[this.column_lines[n]]=n;var i=this.image_column.ImageNumber;for(n=0;n<this.image_lines.length;n++){var r=this.image_lines[n][i].toString();this.image_mapped[r]=n}}var e=t.prototype;return e.find=function(t){var e=this.findIndex(t);return this.indexTableGetRow(e)},e.get=function(t,e){return e in this.image_column&&t<this.getSize()?this.image_lines[t][this.image_column[e]]:-1},e.findIndex=function(t){var e;return t.hasOwnProperty("ImageNumber")&&(e=t.ImageNumber.toString()),e in this.image_mapped?this.image_mapped[e]:-1},e.indexTableGetRow=function(t){var e={};if(-1!=t){for(var n=this.image_lines[t],i=0;i<this.column_lines.length;i++){e[this.column_lines[i]]=n[i]}return e}return t},e.getColumnLines=function(){return this.column_lines},e.getSize=function(){return this.image_lines.length},t}(),r=function(){function t(t,e){this.column_lines=e,this.object_lines=t,this.object_column={},this.object_mapped={},this.imgs_size={};for(var n=0;n<this.column_lines.length;n++)this.object_column[this.column_lines[n]]=n;var i=this.object_column.ObjectNumber,r=this.object_column.ImageNumber,o=0;for(n=0,o=0;n<this.object_lines.length;n++,o++){var a=this.object_lines[n][r].toString(),s=this.object_lines[n][i].toString(),u=a.concat(",",s);this.object_mapped[u]=n,this.imgs_size.hasOwnProperty(a)||(this.imgs_size[a]=0),this.imgs_size[a]++}console.log(this.imgs_size)}var e=t.prototype;return e.returnObjsPerImg=function(t){return t.toString()in this.imgs_size?this.imgs_size[t.toString()]:-1},e.firstObjinImg=function(t){var e=t.toString();if(!this.imgs_size.hasOwnProperty(e))return-1;if(this.imgs_size[e]<=0)return-1;for(var n=1,i=n.toString(),r=e.concat(",",i);!this.object_mapped.hasOwnProperty(r);)i=(++n).toString(),r=e.concat(",",i);return parseInt(i)},e.find=function(t){void 0===t&&(t={});var e=this.findIndex(t);return this.indexTableGetRow(e)},e.get=function(t,e){return e in this.object_column&&t<this.getSize()?this.object_lines[t][this.object_column[e]]:-1},e.findIndex=function(t){var e,n,i;return t.hasOwnProperty("ImageNumber")&&t.hasOwnProperty("ObjectNumber")&&(e=t.ImageNumber.toString(),n=t.ObjectNumber.toString(),i=e.concat(",",n)),i in this.object_mapped?this.object_mapped[i]:-1},e.indexTableGetRow=function(t){var e={};if(-1!=t&&t<this.getSize()){for(var n=this.object_lines[t],i=0;i<this.column_lines.length;i++){e[this.column_lines[i]]=n[i]}return e}return t},e.getColumnLines=function(){return this.column_lines},e.getSize=function(){return this.object_lines.length},t}(),o=function(){function t(t,e){this.testConstructorInputPreconditions(t),this.data={object_data:new r(t.object_table.data,t.object_table.columns),image_data:new i(t.image_table.data,t.image_table.columns)},this.props=e}var e=t.prototype;return e.testConstructorInputPreconditions=function(t){if(null==t)throw new Error("Constructor Error on uniform_data is not defined");if(null==t.image_table.data||null==t.object_table.data||null==t.image_table.columns||null==t.object_table.columns)throw new Error("Constructor Error on uniform_data is missing fields");if(null==t.object_table.data[0][0])throw new Error("Constructor Error on object_data is not a 2d array");if(null==t.image_table.data[0][0])throw new Error("Constructor Error on image_data is not a 2d array");if(t.object_table.data[0].length!==t.object_table.columns.length)throw new Error("Constructor Error on object_data length mismatch with object_columns length");if(t.image_table.data[0].length!==t.image_table.columns.length)throw new Error("Constructor Error on image_data length mismatch with image_columns length");if(!t.object_table.columns.includes("ObjectNumber")||!t.object_table.columns.includes("ImageNumber"))throw new Error("Constructor Error on object_columns doesn't have ObjectNumber and ImageNumber");if(!t.image_table.columns.includes("ImageNumber"))throw new Error("Constructor Error on image_columns doesn't have ImageNumber");if(!t.object_table.columns.includes("Nuclei_Location_CenterX")||!t.object_table.columns.includes("Nuclei_Location_CenterY"))throw new Error("Constructor Error on uniform_data doesn't have Nuclei_Location_CenterX or Nuclei_Location_CenterY")},e.returnAllImgFileNames=function(t){var e=this;return[{file_lookup:"Image_FileNames_Filename_OrigActin",color:"red"},{file_lookup:"Image_FileNames_Filename_OrigpH3",color:"green"},{file_lookup:"Image_FileNames_Filename_OrigDNA",color:"blue"}].map((function(n){var i=e.data.image_data.findIndex({ImageNumber:t});return{filename:e.data.image_data.get(i,n.file_lookup),color:n.color}}))},e.getObjsPerImg=function(t){var e=this.data.object_data.returnObjsPerImg(t);if(e<=0)return-1;for(var n=[],i=this.data.object_data.firstObjinImg(t),r=0;r<e;i++){var o=this.data.object_data.find({ImageNumber:t,ObjectNumber:i});-1!=o&&(r++,n.push(o))}return n},e.getToolTip=function(t){var e=this.data.image_data.findIndex({ImageNumber:t});return"Plate: "+this.data.image_data.get(e,"plate")+" Well: "+this.data.image_data.get(e,"well")+" ImageNumber: "+t},e.getNRandomObjs=function(t){var e,n=this.data.object_data.getSize(),i=[];for(e=0;e<t;e++){var r=Math.floor(Math.random()*n),o=this.data.object_data.indexTableGetRow(r);i.push({ImageNumber:o.ImageNumber,ObjectNumber:o.ObjectNumber})}return i},e.getRow=function(t,e){return this.data.hasOwnProperty(t)?this.data[t].find(e):-1},e.getAllObjRowsIn2DArray=function(t){},e.getCordsforCellDisplay=function(t){var e={},n=this.data.object_data.findIndex(t),i=parseInt(this.data.object_data.get(n,"Nuclei_Location_CenterX")),r=parseInt(this.data.object_data.get(n,"Nuclei_Location_CenterY"));return e.x=Math.max(0,i-20),e.y=Math.max(0,r-20),e},e.getValue=function(t,e){if(!this.data.hasOwnProperty(t))return-1;var n=-1,i=this.data[t].findIndex(e);return-1!==i&&(n=this.data[t].get(i,e.value)),n},e.getColumnLines=function(t){return this.data.hasOwnProperty(t)?this.data[t].getColumnLines():-1},t}()},54179:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var i=n(77847),r=function(){function t(){this.basicPapaConfig={worker:!0,skipEmptyLines:!0,dynamicTyping:!0},this.file_config_options={"per_object.csv":{fastMode:!0,error:function(t){return console.error(t)}},"per_image.csv":{error:function(t){return console.error(t)}},"MyTrainingSet.txt":{delimiter:" ",comments:"#"}},i.parsePromise=function(t,e){return new Promise((function(n,r){i.parse(t,Object.assign({},e,{complete:n,error:r}))}))},Promise.prototype.notify=function(t){return this.then((function(e){return console.log(t),e}))},Promise.prototype.debugPrint=function(){return this.then((function(t){return console.log(t),t}))},i.papaparseFilePromise=function(t,e,n){return void 0===e&&(e={}),void 0===n&&(n=""),i.parsePromise(t,e).then((function(t){return t.data})).notify(n)},i.papaparseFilePromise_noReturn=function(t,e,n){return void 0===e&&(e={}),void 0===n&&(n=""),i.parsePromise(t,e).notify(n)}}return t.prototype.papaTextfromCSV=function(t){var e=t.file,n=Object.assign(this.basicPapaConfig,this.file_config_options[t.name]);return i.papaparseFilePromise(e,n)},t}()},4339:function(t,e,n){"use strict";n.d(e,{Z:function(){return f}});var i=n(41788),r=n(30998),o=n.n(r),a=n(27361),s=n.n(a),u=n(13311),c=n.n(u),l=n(7287),d=n.n(l),f=function(t){function e(e,n){var i;return(i=t.call(this,e,n)||this).training_lines=e,i.features=null,i}(0,i.Z)(e,t);var n=e.prototype;return n.setFeatures=function(t){this.features=t.filter((function(t){return!t.includes("Location")&&"ObjectNumber"!==t&&"ImageNumber"!==t}))},n.getFeatures=function(){return this.features},n.getTrainingLabels=function(){return this.data_table.map((function(t){return"positive"===t.label?1:0}))},e}(function(){function t(t,e){this.data_table=t.map((function(t){return d()(e,t)})),this.column_lines=e}var e=t.prototype;return e.find=function(t){return void 0===t&&(t={}),c()(this.data_table,t)},e.size=function(){return this.data_table.length},e.get=function(t,e){return s()(this.data_table[t],e)},e.findIndex=function(t){return o()(this.data_table,t)},e.indexTable=function(t){return this.data_table[t]},e.getColumnLines=function(){return this.column_lines},e.getSize=function(){return this.data_table.length},e.getDataColumnsPaired=function(){return this.data_table},t}())},48945:function(t,e,n){"use strict";n.d(e,{Z:function(){return l}});var i=n(92137),r=n(87757),o=n.n(r),a=n(54179),s=n(13967),u=n(38889),c=n(4339),l=function(){function t(t){this.sliceArrayByValue=function(t,e,n){var i=t.indexOf(e),r=t.indexOf(n);return-1===e||-1===n?(console.error("Values not found to slice"),null):t.slice(i,r)},this.basicPapaConfig={worker:!0,skipEmptyLines:!0,dynamicTyping:!0},this.getDataHandlerandStartingTrainingSet=(0,i.Z)(o().mark((function t(){var e,n,i,r,a;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return["column_lines","object_data","image_data","training_data"],[],e=this.getFiles(),t.next=5,this.getText(e);case 5:return n=t.sent,i=this.getColumnLines(n[0]),r=new u.Z({object_data:n[1],image_data:n[2],object_columns:i[0],image_columns:i[1]}),a=new c.Z(n[3].slice(1),i[2]),t.abrupt("return",{data_provider:r,training_data:{features:i[0],training_table:a}});case 10:case"end":return t.stop()}}),t,this)}))),this.fileListObject=t}var e=t.prototype;return e.getFiles=function(){var t=new s.Z(this.fileListObject);return["example_SETUP.SQL","per_object.csv","per_image.csv","MyTrainingSet.txt"].map((function(e){return{file:t.findFile(e),name:e}}))},e.getText=function(t){var e=this;return Promise.all(t.map((function(t){if(t.name.endsWith(".csv")||t.name.endsWith(".txt"))return(new a.Z).papaTextfromCSV(t);var n=new s.Z(e.fileListObject);return console.log(t),n.fileReaderPromiseText(t.file)})))},e.getColumnLines=function(t){var e=[],n=t.split("\n").map((function(t){return t.trim()})),i=this.sliceArrayByValue(n,"CREATE TABLE per_object (","PRIMARY KEY  (ImageNumber,ObjectNumber)");e.push(i.map((function(t){return t.split(" ")[0]})).slice(1));var r=this.sliceArrayByValue(n,"CREATE TABLE per_image (","PRIMARY KEY  (ImageNumber)");return e.push(r.map((function(t){return t.split(" ")[0]})).slice(1)),e.push("label imagenum objectnum x y".split(" ")),e},t}()},13967:function(t,e,n){"use strict";n.d(e,{Z:function(){return i}});var i=function(){function t(t){var e=this;this.findFile=function(t){var n=Array.from(e.fileListObject.target.files).findIndex((function(e){return e.name===t}));return e.fileListObject.target.files[n]},this.fileReaderPromiseText=function(t){return new Promise((function(e,n){var i=new FileReader;i.onload=function(){e(i.result)},i.readAsText(t)}))},this.fileListObject=t}var e=t.prototype;return e.findAllFiles=function(t){var e=this;return t.map((function(t){return e.findFile(t)}))},e.fileReaderPromiseImage=function(t){return new Promise((function(e,n){var i=new FileReader;i.onload=function(){e(i.result)},i.readAsDataURL(t)}))},t}()},74298:function(t,e,n){"use strict";n.r(e);var i=n(67294),r=(n(48945),n(85505)),o=n(10920),a=n(27136),s=n(51474),u=n(49995),c=n(54657),l=n(77447),d=(0,o.Z)((function(t){return{root:{display:"flex",alignItems:"center"},wrapper:{position:"relative"},buttonSuccess:{"&:hover":{}},fabProgress:{color:s.Z[500],position:"absolute",top:-6,left:-6,zIndex:1},buttonProgress:{color:s.Z[500],position:"absolute",top:"50%",left:"50%",marginTop:-12,marginLeft:-12}}}));e.default=function(t){var e,n=d(),o=(0,r.Z)(((e={})[n.buttonSuccess]=t.success,e));return i.createElement("div",{className:n.root},i.createElement("div",{className:n.wrapper},i.createElement(l.ZP,{title:"Load Data","aria-label":"load data"},i.createElement(u.Z,{"aria-label":"save",color:"primary",component:"label",className:o,style:{marginRight:5}},(t.success,i.createElement(c.Z,null)),i.createElement("input",{type:"file",hidden:!0,webkitdirectory:"true",mozdirectory:"true",msdirectory:"true",odirectory:"true",directory:"true",multiple:!0,onChange:function(e){t.handleUpload(e)},disabled:!t.uploadButtonEnabled}))),t.uploading&&i.createElement(a.Z,{className:n.fabProgress,size:68})))}},1757:function(t){t.exports=function(t,e,n){for(var i=-1,r=t.length,o=e.length,a={};++i<r;){var s=i<o?e[i]:void 0;n(a,t[i],s)}return a}},7287:function(t,e,n){var i=n(34865),r=n(1757);t.exports=function(t,e){return r(t||[],e||[],i)}}}]);
//# sourceMappingURL=component---src-pages-upload-button-js-2495d58f08d39fc2de83.js.map