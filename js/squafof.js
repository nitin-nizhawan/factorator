var squafof=(function(){
  function gcd_big(b,m){
      while(true){
        if(m.compare(BigInteger.ZERO)==0)
            return b;
        var r = b.remainder(m);
        b=m;
        m=r; 
      }
  }
// find if the candidate is perfect square asap
function perfect_sq(candidate){
    var lo = BigInteger.ZERO,
        hi = candidate,
        mid,
        element;
    while (lo.compare(hi) <=0) {
        mid = lo.add(hi).divide(BigInteger.small[2]);
        if (mid.square().compare(candidate)<0) {
            lo = mid.next();
        } else if (mid.square().compare(candidate)>0) {
            hi = mid.prev();
        } else {
            return  mid;
        }
    }
    return false;
}

function integer_sqrt(target){
   var low = BigInteger.ONE;
    /* More efficient bound
     high = pow(10,log10(target)/2+1);
    */
    var high = target;
    var mid;
    while(low.compare(high)<=0) {
       mid = low.add(high).divide(BigInteger.small[2]);
       var currsq = mid.multiply(mid);

       if(currsq.compare(target)==0) {
           return(mid);
       } else if(currsq.compare(target) <0) {
         low =  mid.next();
         if(low.multiply(low).compare(target)>0) {
             return(low.prev());
	     }
       } else if(currsq.compare(target)>0){
          high = mid.prev();
       } 
    }
}
function squafof_internal(N,k){
//  var start_integer_sqrt = new Date().getTime();
  var kN_sqrt = integer_sqrt(N.multiply(k));
//  console.log("Time to integer sqrt "+(Date.now()-start_integer_sqrt));
/*  console.log("kN_sqrt = "+ kN_sqrt.toString());
  console.log("Check kn_sqrt^2= "+kN_sqrt.multiply(kN_sqrt).toString());
  console.log("Check kn_sqrt+1 ^2=)"+kN_sqrt.next().multiply(kN_sqrt.next()).toString());*/
  var pold;
  var P = kN_sqrt;
  var Q0 = BigInteger.ONE;
  var Q1 = N.multiply(k).subtract(P.multiply(P));
  var bi;
  while(!perfect_sq(Q1)){
     pold = P;
     bi = kN_sqrt.add(P).divide(Q1);
     P = bi.multiply(Q1).subtract(P);
     var tmpQ = Q1;
     Q1 = Q0 + bi.multiply(pold.subtract(P));
     Q0 = tmpQ;
  }
 console.log("Found sqrt"); 
  var Q1_sqrt = integer_sqrt(Q1);
  bi = kN_sqrt.subtract(P).divide(Q1_sqrt);
  P = bi.multiply(Q1_sqrt).add(P);
  Q0 = Q1_sqrt;
  Q1 = N.multiply(k).subtract(P.multiply(P)).divide(Q0);
  
 while(pold.compare(P)!=0){
    pold = P;
    bi = kN_sqrt.add(P).divide(Q1);
    P = bi.multiply(Q1).subtract(P);
    var tmpQ = Q1;
    Q1 = Q0 + bi.multiply(pold.subtract(P));
    Q0 = tmpQ;
 } 
 
 var f = gcd_big(N,P);
 console.log("Complete one round");
 if(f.compare(BigInteger.ONE)!=0 && f.compare(N)!=0){
     return f
 }
  
}
/*
* assumes n is composite
*/
function squafof(N){
console.log("Using squafof");
   N = new BigInteger(N);
   var exp=1;
   
   var isPSq=false;
   while((isPSq=perfect_sq(N))){
     if(isPSq!=false){
       exp++;
	   N = isPsq;
	 }
   }
   var f=null;
   var k = BigInteger.small[2];
   var mult = [1, 3, 5, 7, 
				11, 3*5, 3*7, 3*11, 
				5*7, 5*11, 7*11, 
				3*5*7, 3*5*11, 3*7*11, 
				5*7*11, 3*5*7*11];
   var ki=0;
   //console.log("N= "+N.toString());
   var multiplier = 2*mult[mult.length-1-ki];
   //console.log("mult= "+multiplier);
   while(!(f=squafof_internal(N,new BigInteger(multiplier)))){
     k = k.next();ki++;
     multiplier = 2*mult[mult.length-1-ki]; 
   }
   return [{base:f.toString(),exp:exp},{base:N.divide(f),exp:exp}];
}


return squafof;
})();
//fu
