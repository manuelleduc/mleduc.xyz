// Compiled by ClojureScript 1.10.520 {}
goog.provide('hello_quil.core');
goog.require('cljs.core');
goog.require('quil.core');
goog.require('quil.middleware');
hello_quil.core.max_itt = (250);
hello_quil.core.width = (740);
hello_quil.core.setup = (function hello_quil$core$setup(){
quil.core.color_mode.call(null,new cljs.core.Keyword(null,"hsb","hsb",-753472031),(360),(100),(100));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"color","color",1011675173),(0),new cljs.core.Keyword(null,"angle","angle",1622094254),(0)], null);
});
hello_quil.core.update_state = (function hello_quil$core$update_state(state){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"itt","itt",-1445690183),(new cljs.core.Keyword(null,"itt","itt",-1445690183).cljs$core$IFn$_invoke$arity$1(state) + (1))], null);
});
hello_quil.core.power_curve = (function hello_quil$core$power_curve(){
var i = (quil.core.random.call(null,(1),(30)) | (0));
if(cljs.core._EQ_.call(null,i,(1))){
return (6);
} else {
if(cljs.core._EQ_.call(null,i,(2))){
return (2);
} else {
if(cljs.core._EQ_.call(null,i,(3))){
return (2);
} else {
if(cljs.core._EQ_.call(null,i,(4))){
return (2);
} else {
return (1);

}
}
}
}
});
hello_quil.core.draw_state = (function hello_quil$core$draw_state(state){
var itt = new cljs.core.Keyword(null,"itt","itt",-1445690183).cljs$core$IFn$_invoke$arity$1(state);
if(cljs.core._EQ_.call(null,itt,(0))){
quil.core.background.call(null,(255));
} else {
}

quil.core.translate.call(null,(0.25 * hello_quil.core.width),(0.25 * hello_quil.core.width));

quil.core.rotate.call(null,((itt * 360.0) / hello_quil.core.max_itt));

quil.core.fill.call(null,(0),(0),(0),0.0);

quil.core.stroke_weight.call(null,hello_quil.core.power_curve.call(null));

quil.core.ellipse.call(null,((50) + quil.core.random.call(null,(0),itt)),(0),(itt * (10)),(itt * (10)));

if((itt > hello_quil.core.max_itt)){
return quil.core.no_loop.call(null);
} else {
return null;
}
});
hello_quil.core.run_sketch = (function hello_quil$core$run_sketch(){
hello_quil.core.hello_quil = (function hello_quil$core$run_sketch_$_hello_quil(){
return quil.sketch.sketch.call(null,new cljs.core.Keyword(null,"host","host",-1558485167),"hello-quil",new cljs.core.Keyword(null,"update","update",1045576396),((cljs.core.fn_QMARK_.call(null,hello_quil.core.update_state))?(function() { 
var G__1830__delegate = function (args){
return cljs.core.apply.call(null,hello_quil.core.update_state,args);
};
var G__1830 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__1831__i = 0, G__1831__a = new Array(arguments.length -  0);
while (G__1831__i < G__1831__a.length) {G__1831__a[G__1831__i] = arguments[G__1831__i + 0]; ++G__1831__i;}
  args = new cljs.core.IndexedSeq(G__1831__a,0,null);
} 
return G__1830__delegate.call(this,args);};
G__1830.cljs$lang$maxFixedArity = 0;
G__1830.cljs$lang$applyTo = (function (arglist__1832){
var args = cljs.core.seq(arglist__1832);
return G__1830__delegate(args);
});
G__1830.cljs$core$IFn$_invoke$arity$variadic = G__1830__delegate;
return G__1830;
})()
:hello_quil.core.update_state),new cljs.core.Keyword(null,"size","size",1098693007),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [hello_quil.core.width,hello_quil.core.width], null),new cljs.core.Keyword(null,"setup","setup",1987730512),((cljs.core.fn_QMARK_.call(null,hello_quil.core.setup))?(function() { 
var G__1833__delegate = function (args){
return cljs.core.apply.call(null,hello_quil.core.setup,args);
};
var G__1833 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__1834__i = 0, G__1834__a = new Array(arguments.length -  0);
while (G__1834__i < G__1834__a.length) {G__1834__a[G__1834__i] = arguments[G__1834__i + 0]; ++G__1834__i;}
  args = new cljs.core.IndexedSeq(G__1834__a,0,null);
} 
return G__1833__delegate.call(this,args);};
G__1833.cljs$lang$maxFixedArity = 0;
G__1833.cljs$lang$applyTo = (function (arglist__1835){
var args = cljs.core.seq(arglist__1835);
return G__1833__delegate(args);
});
G__1833.cljs$core$IFn$_invoke$arity$variadic = G__1833__delegate;
return G__1833;
})()
:hello_quil.core.setup),new cljs.core.Keyword(null,"middleware","middleware",1462115504),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [quil.middleware.fun_mode], null),new cljs.core.Keyword(null,"draw","draw",1358331674),((cljs.core.fn_QMARK_.call(null,hello_quil.core.draw_state))?(function() { 
var G__1836__delegate = function (args){
return cljs.core.apply.call(null,hello_quil.core.draw_state,args);
};
var G__1836 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__1837__i = 0, G__1837__a = new Array(arguments.length -  0);
while (G__1837__i < G__1837__a.length) {G__1837__a[G__1837__i] = arguments[G__1837__i + 0]; ++G__1837__i;}
  args = new cljs.core.IndexedSeq(G__1837__a,0,null);
} 
return G__1836__delegate.call(this,args);};
G__1836.cljs$lang$maxFixedArity = 0;
G__1836.cljs$lang$applyTo = (function (arglist__1838){
var args = cljs.core.seq(arglist__1838);
return G__1836__delegate(args);
});
G__1836.cljs$core$IFn$_invoke$arity$variadic = G__1836__delegate;
return G__1836;
})()
:hello_quil.core.draw_state));
});
goog.exportSymbol('hello_quil.core.hello_quil', hello_quil.core.hello_quil);

if(cljs.core.truth_(cljs.core.some.call(null,(function (p1__1332__1333__auto__){
return cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"no-start","no-start",1381488856),p1__1332__1333__auto__);
}),null))){
return null;
} else {
return quil.sketch.add_sketch_to_init_list.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"fn","fn",-1175266204),hello_quil.core.hello_quil,new cljs.core.Keyword(null,"host-id","host-id",742376279),"hello-quil"], null));
}
});
goog.exportSymbol('hello_quil.core.run_sketch', hello_quil.core.run_sketch);

//# sourceMappingURL=core.js.map
