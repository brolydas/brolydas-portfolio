import {makeScene2D,Rect,Line,Circle} from '@motion-canvas/2d';
import {all,createRef,waitFor,easeInOutCubic} from '@motion-canvas/core';
export default makeScene2D(function*(view){
 const page=createRef<Rect>(),media=createRef<Rect>(),button=createRef<Rect>(),pointer=createRef<Circle>();
 view.add(new Rect({ref:page,width:560,height:390,fill:'#ffffff',stroke:'#17191e',lineWidth:2,x:0,y:0,rotation:-7,shadowColor:'#00000025',shadowBlur:18,shadowOffset:[10,16]}));
 const sheet=page();
 sheet.add(new Line({points:[[-240,-140],[240,-140]],stroke:'#17191e',lineWidth:3}));
 sheet.add(new Line({points:[[-240,-95],[-60,-95]],stroke:'#17191e',lineWidth:12}));
 sheet.add(new Line({points:[[-240,-65],[-100,-65]],stroke:'#a9b1bd',lineWidth:6}));
 sheet.add(new Rect({ref:media,x:-130,y:55,width:220,height:170,fill:'#d0d5dd'}));
 for(let i=0;i<3;i++)sheet.add(new Line({points:[[20,-5+i*32],[210-i*25,-5+i*32]],stroke:i===0?'#17191e':'#a9b1bd',lineWidth:i===0?12:6}));
 sheet.add(new Rect({ref:button,x:90,y:120,width:140,height:38,fill:'#17191e'}));
 view.add(new Circle({ref:pointer,x:330,y:230,width:26,height:26,fill:'#ffffff',stroke:'#17191e',lineWidth:3}));
 yield* all(page().rotation(0,1.3,easeInOutCubic),page().scale(1.08,1.3,easeInOutCubic),media().fill('#17191e',1.3),pointer().position([95,120],1.3,easeInOutCubic));
 yield* all(pointer().scale(.7,.25),button().width(128,.25));
 yield* all(pointer().scale(1,.25),button().width(140,.25),media().width(255,.8,easeInOutCubic),media().x(-112,.8,easeInOutCubic));
 yield* all(page().rotation(5,1.4,easeInOutCubic),pointer().position([295,-205],1.4,easeInOutCubic));
 yield* waitFor(.3);
});