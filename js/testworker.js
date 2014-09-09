importScripts('biginteger.js');
importScripts('primegenerator.js');
importScripts('factorator.js');
importScripts("baillie_psw.js");

var factorator = new Factorator();
factorator.init();
var primegen = new PrimeGenerator();
onmessage=(function(){
    

    function getRandomNumString(){
         var digits = Math.floor(Math.random()*12)+10;
         var val=[];
         for(var i=0;i<digits;i++){
            val[i] = Math.floor(Math.random()*10);
         }
         while(val[0]==0){
             val.shift();
         }
         return val.join("");
    }
    
    function verify(inp,expvec){
        var num = new BigInteger(inp);
        var res=BigInteger.ONE;
        for(var i=0;i<expvec.length;i++){
           var comp = expvec[i];
           res = res.multiply(
                      new BigInteger(comp.base).
                              pow(new BigInteger(comp.exp))
                   );
        }
        return res.toString()==num.toString();
    }
    
    function doTest(testid){
        var num= getRandomNumString();
        postMessage({state:'START',id:testid,inp:num});
		
		if(baillie_psw(new BigInteger(num))){
		  //  console.log(num +" is  prime id="+testid+", pass: "+());
		    var expvec = [{base:num,exp:1}];
		} else {
            var expvec = factorator.factor(num);
		}
       postMessage({state:'TESTCOMPLETE',id:testid,expvec:expvec,inp:num,passed:verify(num,expvec)});
	    
	    //postMessage({state:'TESTCOMPLETE',id:testid,expvec:expvec,inp:num,passed:(bpsw==pr)});
    }


   return function(e){
       doTest(e.data);
   }


})();
