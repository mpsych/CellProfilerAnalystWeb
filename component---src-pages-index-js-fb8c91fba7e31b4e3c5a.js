(self.webpackChunkgatsby_test=self.webpackChunkgatsby_test||[]).push([[678],{97704:function(e,t,n){"use strict";n.r(t);var r=n(85061),a=n(92137),i=n(87757),l=n.n(i),o=n(67294),s=n(96667),c=n(47798),u=n(23729),m=n(80838),d=n(83332),g=n(85080),f=n(90058),p=n(91666),v=n(80633),b=n(79312),E=n(98910),y=n(22019),h=n(68396),Z=n(13967),k=(n(37107),n(39331)),w=n(59274),C=n(31261),N=n(8441),P=n(96531),x=n(48498);t.default=function(){var e,t=o.useState(null),n=t[0],i=t[1],I=o.useState(null),S=I[0],R=I[1],L=o.useState(null),j=L[0],D=L[1],B=o.useState(null),T=B[0],A=B[1],U=o.useState(pe([])),_=U[0],O=U[1],z=o.useState(null),F=z[0],$=z[1],H=o.useState(null),M=(H[0],H[1]),q=o.useState(null),G=q[0],J=q[1],K=o.useState(!1),Q=K[0],V=K[1],W=o.useState(!1),X=W[0],Y=W[1],ee=o.useState(!1),te=ee[0],ne=(ee[1],o.useState(!1)),re=ne[0],ae=ne[1],ie=o.useState(!0),le=ie[0],oe=ie[1],se=function(e){i(null),void 0!==e&&me(e)},ce=function(){V(!1),Y(!1),ae(!1)},ue=function(){V(!0),Y(!0),ae(!0)},me=function(){var e=(0,a.Z)(l().mark((function e(t){var n,r,a,i,o,s,c,u,m,d,g;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return ce(),O({unclassified:[],positive:[],negative:[]}),n=new y.$(S,j),e.next=6,n.initTrainPromise();case 6:if(M(t),console.log("fetch "+t),r=n.fetchUpToNCellPairsByClass(t,20),a=new h.p,i=null,"random"!==t){e.next=23;break}return o=r.map((function(e){var t=S.returnAllImgFileNames(e.ImageNumber).map((function(e){return T.findFile(e)})).map((function(e){return T.fileReaderPromiseImage(e)}));return Promise.all(t).then((function(t){var n=S.getCordsforCellDisplay(e);return a.getDataURLPromise(t,n)}))})),e.next=15,Promise.all(o);case 15:return s=e.sent,c=pe(s),O(c),console.log(c),console.log(s),$(new k.e(r,s)),ue(),e.abrupt("return");case 23:if("positive"!==t){e.next=35;break}return i=r.map((function(e){var t=S.returnAllImgFileNames(e.ImageNumber).map((function(e){return T.findFile(e)})).map((function(e){return T.fileReaderPromiseImage(e)}));return Promise.all(t).then((function(t){var n=S.getCordsforCellDisplay(e);return a.getDataURLPromise(t,n)}))})),e.next=27,Promise.all(i);case 27:return u=e.sent,m=pe(u),O(m),console.log(m),console.log(u),$(new k.e(r,u)),ue(),e.abrupt("return");case 35:if("negative"!==t){e.next=47;break}return i=r.map((function(e){var t=S.returnAllImgFileNames(e.ImageNumber).map((function(e){return T.findFile(e)})).map((function(e){return T.fileReaderPromiseImage(e)}));return Promise.all(t).then((function(t){var n=S.getCordsforCellDisplay(e);return a.getDataURLPromise(t,n)}))})),e.next=39,Promise.all(i);case 39:return d=e.sent,g=pe(d),O(g),console.log(g),console.log(d),$(new k.e(r,d)),ue(),e.abrupt("return");case 47:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),de=function(){var e=(0,a.Z)(l().mark((function e(){var t,n,a,i,o,s,c,u,m,d,g,f;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:ce(),t=_.negative.map((function(e){return e.id})),n=_.positive.map((function(e){return e.id})),console.log(t,_),F.setClassByIndexArray("negative",t),F.setClassByIndexArray("positive",n),a=F.getPairsByClass("negative"),i=F.getPairsByClass("positive"),o=a.map((function(e){return S.getRow("object_data",{ImageNumber:e.ImageNumber,ObjectNumber:e.ObjectNumber})})),s=i.map((function(e){return S.getRow("object_data",{ImageNumber:e.ImageNumber,ObjectNumber:e.ObjectNumber})})),c=[].concat((0,r.Z)(o),(0,r.Z)(s)),u=new Array(o.length).fill(0),m=new Array(s.length).fill(1),d=u.concat(m),g={classifierType:"LogisticRegression",trainingData:[].concat((0,r.Z)(c),(0,r.Z)(j.trainingData)),trainingLabels:[].concat((0,r.Z)(d),(0,r.Z)(j.trainingLabels)),featuresToUse:G},console.log(g),D(g),f={unclassified:_.unclassified,positive:[],negative:[]},O(f),console.log("finished train"),ue();case 21:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ge=function(){var e=(0,a.Z)(l().mark((function e(t){var n,r,a,i,o,s,c,u,m,d;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return oe(!1),n=new Z.Z(t),A(n),r=new E.Z(t),e.next=6,r.getDataHandlerandStartingTrainingSet();case 6:a=e.sent,i=a.data_provider,R(i),o=a.training_data.training_table,s=o.getDataColumnsPaired(),c=o.getTrainingLabels(),u=s.map((function(e){var t=e.objectnum,n=e.imagenum;return i.getRow("object_data",{ObjectNumber:t,ImageNumber:n})})),m=a.training_data.features,d=m.filter((function(e){return!e.includes("Location")&&"ObjectNumber"!==e&&"ImageNumber"!==e})),J(d),console.log("finished data initialization"),D({classifierType:"LogisticRegression",trainingData:u,trainingLabels:c,featuresToUse:d}),V(!0),Y(!0),ae(!0),console.log("finished upload");case 23:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),fe=function(){var e=(0,a.Z)(l().mark((function e(){var t;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return ce(),t=new y.$(S,j),e.next=4,t.initTrainPromise();case 4:t.userDownloadClassifierSpecPromise(),ue();case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();function pe(e){return{unclassified:e.map((function(e,t){return{id:t,address:e}})),positive:[],negative:[]}}return o.createElement("div",{style:{resize:"horizontal"}},o.createElement(s.Z,null,o.createElement(c.Z,null,o.createElement(v.Z,{src:p.Z,style:{marginRight:"40%",height:"90px"}})),o.createElement(c.Z,null,o.createElement(u.Z,{style:{color:"black",marginLeft:"50%"}}," ",o.createElement(b.Z,null)))),o.createElement(s.Z,null,o.createElement(m.Z,{container:!0,justify:"center",spacing:2,style:{marginBottom:15}},o.createElement(m.Z,{key:0,item:!0},o.createElement(d.Z,{disabled:!Q,variant:"contained","aria-controls":"simple-menu","aria-haspopup":"true",onClick:function(e){i(e.currentTarget)}},"Fetch"),o.createElement(g.Z,{id:"simple-menu",anchorEl:n,keepMounted:!0,open:Boolean(n),onClose:se},o.createElement(f.Z,{onClick:function(){return se("random")}},"Random"),o.createElement(f.Z,{onClick:function(){return se("positive")}},"Positive"),o.createElement(f.Z,{onClick:function(){return se("negative")}},"Negative"))),o.createElement(m.Z,{key:1,item:!0},o.createElement(d.Z,{disabled:!X,variant:"contained",onClick:de},"Train")),o.createElement(m.Z,{key:2,item:!0},o.createElement(d.Z,{disabled:!te,variant:"contained",onClick:function(){}},"Evaluate")),o.createElement(m.Z,{key:3,item:!0},o.createElement(d.Z,{disabled:!re,variant:"contained",onClick:fe},"Download")),o.createElement(m.Z,{key:4,item:!0},o.createElement(d.Z,{disabled:!le,variant:"contained",component:"label",onClick:function(){return console.log("Upload!")}},"Upload",o.createElement("input",{type:"file",hidden:!0,webkitdirectory:"true",mozdirectory:"true",msdirectory:"true",odirectory:"true",directory:"true",multiple:!0,onChange:function(e){ge(e)}}))))),o.createElement(N.d,{onChange:function(e,t,n,r){var a;if(r){var i,l=(0,w.p)(_[e],_[r],t,n);return O(Object.assign({},_,((i={})[e]=l[0],i[r]=l[1],i)))}var o=(0,C.L)(_[e],t,n);return O(Object.assign({},_,((a={})[e]=o,a)))}},o.createElement("div",null,o.createElement("label",{style:{textAlign:"left",backgroundColor:"white",paddingLeft:"10%",marginBottom:.5}},"Unclassified"),o.createElement("div",{className:"topContainer"},o.createElement(P.$,{className:"dropzone ",id:"unclassified",boxesPerRow:8,rowHeight:70},_.unclassified.map((function(e){return o.createElement(x.P,{key:e.id},o.createElement("div",{className:"grid-item"},o.createElement("div",{className:"grid-item-content",style:{backgroundImage:"url("+e.address+")"}})))})))),o.createElement(s.Z,null,o.createElement("label",{style:{textAlign:"left",backgroundColor:"white",paddingLeft:"11%",userSelect:"none",marginBottom:"0.5%"}},"Positive"),o.createElement("label",{style:(e={textAlign:"left",backgroundColor:"white",paddingRight:"8%",marginBottom:0,userSelect:"none",margin:"auto"},e.marginBottom="0.5%",e)},"Negative")),o.createElement(s.Z,null,o.createElement(P.$,{className:"dropzone positive",id:"positive",boxesPerRow:4,rowHeight:70},_.positive.map((function(e){return o.createElement(x.P,{key:e.id},o.createElement("div",{className:"grid-item"},o.createElement("div",{className:"grid-item-content",style:{backgroundImage:"url("+e.address+")"}})))}))),o.createElement(P.$,{className:"dropzone negative",id:"negative",boxesPerRow:4,rowHeight:70},_.negative.map((function(e){return o.createElement(x.P,{key:e.id},o.createElement("div",{className:"grid-item"},o.createElement("div",{className:"grid-item-content",style:{backgroundImage:"url("+e.address+")"}})))})))))))}}}]);
//# sourceMappingURL=component---src-pages-index-js-fb8c91fba7e31b4e3c5a.js.map