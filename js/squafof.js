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
    while(low.compare(high)<0) {
       mid = low.add(high).divide(BigInteger.small[2]);
       var currsq = mid.multiply(mid);

       if(currsq.compare(target)==0) {
           return(mid);
       }
       if(currsq.compare(target) <0) {
         low =  mid.next();
         if(low.multiply(low).compare(target)>0) {
             return(low.prev());
	     }
       } else {
          high = mid.prev();
       }
    }
	if(low.compare(high)==0){
	   if(low.multiply(low).compare(target)==0){
	       return low;
	   }
	}
}
function squafof_internal(N,k){
  var kN_sqrt = integer_sqrt(N.multiply(k));
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
 if(f.compare(BigInteger.ONE)!=0 && f.compare(N)!=0){
     return f
 }
  
}
/*
* assumes n is composite
*/
function squafof(N){
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
   var k = BigInteger.ONE;
   while(!(f=squafof_internal(N,k))){
     k = k.next();
   }
   return [{base:f.toString(),exp:exp},{base:N.divide(f),exp:exp}];
}


return squafof;
})();
//fu