(self.webpackChunkgatsby_test=self.webpackChunkgatsby_test||[]).push([[9310,6414],{6610:function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}n.d(t,{Z:function(){return o}})},32253:function(e,t,n){"use strict";var o=n(22122),i=n(67294),r=n(20638),a=n(80453),l=i.forwardRef((function(e,t){return i.createElement(a.Z,(0,o.Z)({component:"p",variant:"body1",color:"textSecondary",ref:t},e))}));t.Z=(0,r.Z)({root:{marginBottom:12}},{name:"MuiDialogContentText"})(l)},9901:function(e,t,n){"use strict";var o=n(22122),i=n(81253),r=n(67294),a=n(85505),l=n(20638),c=n(80453),s=r.forwardRef((function(e,t){var n=e.children,l=e.classes,s=e.className,p=e.disableTypography,d=void 0!==p&&p,u=(0,i.Z)(e,["children","classes","className","disableTypography"]);return r.createElement("div",(0,o.Z)({className:(0,a.Z)(l.root,s),ref:t},u),d?n:r.createElement(c.Z,{component:"h2",variant:"h6"},n))}));t.Z=(0,l.Z)({root:{margin:0,padding:"16px 24px",flex:"0 0 auto"}},{name:"MuiDialogTitle"})(s)},4513:function(e,t,n){"use strict";n.d(t,{Z:function(){return C}});var o=n(22122),i=n(81253),r=n(96156),a=n(67294),l=n(85505),c=n(20638),s=n(81664),p=n(48649),d=n(28481),u=n(81423),h=n(381),m=n(59355),f=n(19701),y=n(11291),g={entering:{opacity:1},entered:{opacity:1}},v={enter:h.x9.enteringScreen,exit:h.x9.leavingScreen},b=a.forwardRef((function(e,t){var n=e.children,r=e.disableStrictModeCompat,l=void 0!==r&&r,c=e.in,s=e.onEnter,p=e.onEntered,h=e.onEntering,b=e.onExit,x=e.onExited,E=e.onExiting,Z=e.style,k=e.TransitionComponent,w=void 0===k?u.ZP:k,C=e.timeout,W=void 0===C?v:C,B=(0,i.Z)(e,["children","disableStrictModeCompat","in","onEnter","onEntered","onEntering","onExit","onExited","onExiting","style","TransitionComponent","timeout"]),S=(0,m.Z)(),T=S.unstable_strictMode&&!l,D=a.useRef(null),P=(0,y.Z)(n.ref,t),M=(0,y.Z)(T?D:void 0,P),N=function(e){return function(t,n){if(e){var o=T?[D.current,t]:[t,n],i=(0,d.Z)(o,2),r=i[0],a=i[1];void 0===a?e(r):e(r,a)}}},R=N(h),A=N((function(e,t){(0,f.n)(e);var n=(0,f.C)({style:Z,timeout:W},{mode:"enter"});e.style.webkitTransition=S.transitions.create("opacity",n),e.style.transition=S.transitions.create("opacity",n),s&&s(e,t)})),I=N(p),K=N(E),$=N((function(e){var t=(0,f.C)({style:Z,timeout:W},{mode:"exit"});e.style.webkitTransition=S.transitions.create("opacity",t),e.style.transition=S.transitions.create("opacity",t),b&&b(e)})),F=N(x);return a.createElement(w,(0,o.Z)({appear:!0,in:c,nodeRef:T?D:void 0,onEnter:A,onEntered:I,onEntering:R,onExit:$,onExited:F,onExiting:K,timeout:W},B),(function(e,t){return a.cloneElement(n,(0,o.Z)({style:(0,o.Z)({opacity:0,visibility:"exited"!==e||c?void 0:"hidden"},g[e],Z,n.props.style),ref:M},t))}))})),x=a.forwardRef((function(e,t){var n=e.children,r=e.classes,c=e.className,s=e.invisible,p=void 0!==s&&s,d=e.open,u=e.transitionDuration,h=e.TransitionComponent,m=void 0===h?b:h,f=(0,i.Z)(e,["children","classes","className","invisible","open","transitionDuration","TransitionComponent"]);return a.createElement(m,(0,o.Z)({in:d,timeout:u},f),a.createElement("div",{className:(0,l.Z)(r.root,c,p&&r.invisible),"aria-hidden":!0,ref:t},n))})),E=(0,c.Z)({root:{zIndex:-1,position:"fixed",display:"flex",alignItems:"center",justifyContent:"center",right:0,bottom:0,top:0,left:0,backgroundColor:"rgba(0, 0, 0, 0.5)",WebkitTapHighlightColor:"transparent"},invisible:{backgroundColor:"transparent"}},{name:"MuiBackdrop"})(x),Z=n(58063),k={enter:h.x9.enteringScreen,exit:h.x9.leavingScreen},w=a.forwardRef((function(e,t){var n=e.BackdropProps,r=e.children,c=e.classes,d=e.className,u=e.disableBackdropClick,h=void 0!==u&&u,m=e.disableEscapeKeyDown,f=void 0!==m&&m,y=e.fullScreen,g=void 0!==y&&y,v=e.fullWidth,x=void 0!==v&&v,w=e.maxWidth,C=void 0===w?"sm":w,W=e.onBackdropClick,B=e.onClose,S=e.onEnter,T=e.onEntered,D=e.onEntering,P=e.onEscapeKeyDown,M=e.onExit,N=e.onExited,R=e.onExiting,A=e.open,I=e.PaperComponent,K=void 0===I?Z.Z:I,$=e.PaperProps,F=void 0===$?{}:$,L=e.scroll,Y=void 0===L?"paper":L,j=e.TransitionComponent,H=void 0===j?b:j,O=e.transitionDuration,X=void 0===O?k:O,_=e.TransitionProps,z=e["aria-describedby"],J=e["aria-labelledby"],U=(0,i.Z)(e,["BackdropProps","children","classes","className","disableBackdropClick","disableEscapeKeyDown","fullScreen","fullWidth","maxWidth","onBackdropClick","onClose","onEnter","onEntered","onEntering","onEscapeKeyDown","onExit","onExited","onExiting","open","PaperComponent","PaperProps","scroll","TransitionComponent","transitionDuration","TransitionProps","aria-describedby","aria-labelledby"]),q=a.useRef();return a.createElement(p.Z,(0,o.Z)({className:(0,l.Z)(c.root,d),BackdropComponent:E,BackdropProps:(0,o.Z)({transitionDuration:X},n),closeAfterTransition:!0,disableBackdropClick:h,disableEscapeKeyDown:f,onEscapeKeyDown:P,onClose:B,open:A,ref:t},U),a.createElement(H,(0,o.Z)({appear:!0,in:A,timeout:X,onEnter:S,onEntering:D,onEntered:T,onExit:M,onExiting:R,onExited:N,role:"none presentation"},_),a.createElement("div",{className:(0,l.Z)(c.container,c["scroll".concat((0,s.Z)(Y))]),onMouseUp:function(e){e.target===e.currentTarget&&e.target===q.current&&(q.current=null,W&&W(e),!h&&B&&B(e,"backdropClick"))},onMouseDown:function(e){q.current=e.target}},a.createElement(K,(0,o.Z)({elevation:24,role:"dialog","aria-describedby":z,"aria-labelledby":J},F,{className:(0,l.Z)(c.paper,c["paperScroll".concat((0,s.Z)(Y))],c["paperWidth".concat((0,s.Z)(String(C)))],F.className,g&&c.paperFullScreen,x&&c.paperFullWidth)}),r))))})),C=(0,c.Z)((function(e){return{root:{"@media print":{position:"absolute !important"}},scrollPaper:{display:"flex",justifyContent:"center",alignItems:"center"},scrollBody:{overflowY:"auto",overflowX:"hidden",textAlign:"center","&:after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}},container:{height:"100%","@media print":{height:"auto"},outline:0},paper:{margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"}},paperScrollPaper:{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"},paperScrollBody:{display:"inline-block",verticalAlign:"middle",textAlign:"left"},paperWidthFalse:{maxWidth:"calc(100% - 64px)"},paperWidthXs:{maxWidth:Math.max(e.breakpoints.values.xs,444),"&$paperScrollBody":(0,r.Z)({},e.breakpoints.down(Math.max(e.breakpoints.values.xs,444)+64),{maxWidth:"calc(100% - 64px)"})},paperWidthSm:{maxWidth:e.breakpoints.values.sm,"&$paperScrollBody":(0,r.Z)({},e.breakpoints.down(e.breakpoints.values.sm+64),{maxWidth:"calc(100% - 64px)"})},paperWidthMd:{maxWidth:e.breakpoints.values.md,"&$paperScrollBody":(0,r.Z)({},e.breakpoints.down(e.breakpoints.values.md+64),{maxWidth:"calc(100% - 64px)"})},paperWidthLg:{maxWidth:e.breakpoints.values.lg,"&$paperScrollBody":(0,r.Z)({},e.breakpoints.down(e.breakpoints.values.lg+64),{maxWidth:"calc(100% - 64px)"})},paperWidthXl:{maxWidth:e.breakpoints.values.xl,"&$paperScrollBody":(0,r.Z)({},e.breakpoints.down(e.breakpoints.values.xl+64),{maxWidth:"calc(100% - 64px)"})},paperFullWidth:{width:"calc(100% - 64px)"},paperFullScreen:{margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0,"&$paperScrollBody":{margin:0,maxWidth:"100%"}}}}),{name:"MuiDialog"})(w)},80453:function(e,t,n){"use strict";var o=n(22122),i=n(81253),r=n(67294),a=n(85505),l=n(20638),c=n(81664),s={h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",subtitle1:"h6",subtitle2:"h6",body1:"p",body2:"p"},p=r.forwardRef((function(e,t){var n=e.align,l=void 0===n?"inherit":n,p=e.classes,d=e.className,u=e.color,h=void 0===u?"initial":u,m=e.component,f=e.display,y=void 0===f?"initial":f,g=e.gutterBottom,v=void 0!==g&&g,b=e.noWrap,x=void 0!==b&&b,E=e.paragraph,Z=void 0!==E&&E,k=e.variant,w=void 0===k?"body1":k,C=e.variantMapping,W=void 0===C?s:C,B=(0,i.Z)(e,["align","classes","className","color","component","display","gutterBottom","noWrap","paragraph","variant","variantMapping"]),S=m||(Z?"p":W[w]||s[w])||"span";return r.createElement(S,(0,o.Z)({className:(0,a.Z)(p.root,d,"inherit"!==w&&p[w],"initial"!==h&&p["color".concat((0,c.Z)(h))],x&&p.noWrap,v&&p.gutterBottom,Z&&p.paragraph,"inherit"!==l&&p["align".concat((0,c.Z)(l))],"initial"!==y&&p["display".concat((0,c.Z)(y))]),ref:t},B))}));t.Z=(0,l.Z)((function(e){return{root:{margin:0},body2:e.typography.body2,body1:e.typography.body1,caption:e.typography.caption,button:e.typography.button,h1:e.typography.h1,h2:e.typography.h2,h3:e.typography.h3,h4:e.typography.h4,h5:e.typography.h5,h6:e.typography.h6,subtitle1:e.typography.subtitle1,subtitle2:e.typography.subtitle2,overline:e.typography.overline,srOnly:{position:"absolute",height:1,width:1,overflow:"hidden"},alignLeft:{textAlign:"left"},alignCenter:{textAlign:"center"},alignRight:{textAlign:"right"},alignJustify:{textAlign:"justify"},noWrap:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},gutterBottom:{marginBottom:"0.35em"},paragraph:{marginBottom:16},colorInherit:{color:"inherit"},colorPrimary:{color:e.palette.primary.main},colorSecondary:{color:e.palette.secondary.main},colorTextPrimary:{color:e.palette.text.primary},colorTextSecondary:{color:e.palette.text.secondary},colorError:{color:e.palette.error.main},displayInline:{display:"inline"},displayBlock:{display:"block"}}}),{name:"MuiTypography"})(p)},71474:function(e,t,n){"use strict";function o(e,t){"function"==typeof e?e(t):e&&(e.current=t)}n.d(t,{Z:function(){return o}})},57544:function(e,t,n){"use strict";n.d(t,{Z:function(){return r}});var o=n(67294),i="undefined"!=typeof window?o.useLayoutEffect:o.useEffect;function r(e){var t=o.useRef(e);return i((function(){t.current=e})),o.useCallback((function(){return t.current.apply(void 0,arguments)}),[])}},11291:function(e,t,n){"use strict";n.d(t,{Z:function(){return r}});var o=n(67294),i=n(71474);function r(e,t){return o.useMemo((function(){return null==e&&null==t?null:function(n){(0,i.Z)(e,n),(0,i.Z)(t,n)}}),[e,t])}},1278:function(e,t,n){"use strict";var o=n(67294);t.Z=o.createContext(null)},45037:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return l}});var o=n(4513),i=n(32253),r=n(9901),a=n(67294);function l(){var e=(0,a.useState)(!1),t=e[0],n=e[1];return(0,a.useEffect)((function(){"undefined"!=typeof OffscreenCanvas&&"undefined"!=typeof ImageBitmap&&"undefined"!=typeof Worker&&"undefined"!=typeof indexedDB||n(!0)}),[]),a.createElement(o.Z,{fullWidth:1e3,open:t},a.createElement(r.Z,null,"Compatibility Error:"),a.createElement(i.Z,{align:"center",style:{marginLeft:20,marginRight:20}},"Your browser is not compatible with this app. Please use an up-to-date version of Edge or Chrome."))}}}]);
//# sourceMappingURL=component---src-pages-components-compatibility-check-dialog-js-4ceb98cf2d3fb446a69b.js.map