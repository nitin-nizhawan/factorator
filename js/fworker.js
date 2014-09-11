importScripts('biginteger.js');
importScripts("baillie_psw.js");
importScripts('primegenerator.js');
importScripts('factorator.js');
importScripts("squafof.js");

var factorator = new Factorator();
factorator.init();
onmessage=function(msg){
  postMessage({state:'START'});
  var start_time = new Date().getTime();
  var result = factorator.factor(msg.data);
  var end_time = new Date().getTime();
  postMessage({state:'DONE',result:result,time:(end_time-start_time)});
}

