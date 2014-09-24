var ef=(function(){
var prime=[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271 ];
function getRandomBigInteger(n){
         var nstr = n.toString();
         var digits = Math.floor(Math.random()*nstr.length);
         var val=[];
         for(var i=0;i<digits;i++){
            val[i] = Math.floor(Math.random()*10);
         }
         while(val[0]==0){
             val.shift();
         }
         return new BigInteger(val.join("")).remainder(n);
    }

function extended_gcd(a,b){
  var tmp,q,x=BigInteger.ZERO,
      y=BigInteger.ONE,
      lastx=BigInteger.ONE,
      lasty=BigInteger.ZERO;
  while(!b.isZero()){
      q = a.divide(b);
      tmp = a;
      a = b;
      b = myMod(tmp,b);
      
      tmp = lastx; 
      lastx = x;
      x = tmp.subtract(q.multiply(x));

      tmp = lasty;
      lasty = y;
      y = tmp.subtract(q.multiply(y));
  }
  if(a.compare(BigInteger.ZERO) < 0){
      return [a.negate(),lastx.negate(),lasty.negate()];
  } else {
      return [a,lastx,lasty];
  }
}

function myMod(a,m){
    var rem = a.remainder(m);
    if(rem.compare(BigInteger.ZERO) < 0){
        return rem.add(m);
    } else {
        return rem;
    }
}

function randomCurve(N){
    var A = getRandomBigInteger(N);
    var u = getRandomBigInteger(N);
    var v = getRandomBigInteger(N);
    var B = myMod(
                 v.multiply(v)
                  .subtract(u.multiply(u).multiply(u))
                  .subtract(A.multiply(u)),
            N);
    return [[A,B,N],[u,v]];
}

function addPoint(E,p_1,p_2){
    if(p_1=="Indentity") return [p_2,BigInteger.ONE];
    if(p_2=="Indentity") return [p_1,BigInteger.ONE];
    var a = E[0], b = E[1], n = E[2];
    var x_1 = myMod(p_1[0],n), y_1 = myMod(p_1[1],n);
    var x_2 = myMod(p_2[0],n),y_2 = myMod(p_2[1],n);
    var x_3,y_3,d,u,v;
    if(x_1.compare(x_2)!=0){
        var egcd = extended_gcd(x_1.subtract(x_2),n);
        d = egcd[0],u = egcd[1], v = egcd[2];
        var s = myMod(y_1.subtract(y_2).multiply(u),n);
        x_3 = myMod(s.multiply(s).subtract(x_1).subtract(x_2),n)
        y_3 = myMod(y_1.negate().subtract(
                   s.multiply(
                        x_3.subtract(x_1)
                             )
                               ),n);
 
    } else {
        if(myMod(y_1.add(y_2),n).isZero()) return ["Identity",BigInteger.ONE];
        else {
          var egcd = extended_gcd(y_1.multiply(BigInteger.small[2]),n);
          d = egcd[0],u = egcd[1], v = egcd[2];
          var s = myMod(BigInteger.small[3].multiply(x_1).multiply(x_1).add(a).multiply(u),n);
          x_3 = myMod(s.multiply(s).subtract(x_1.multiply(BigInteger.small[2])),n);
          y_3 = myMod(y_1.negate().subtract(
                   s.multiply(
                        x_3.subtract(x_1)
                             )
                               ),n);
         
        }
    }
    return [[x_3,y_3],d];
   
}

function mulPoint(E,P,m){
   var Ret = "Indentity";
   var d = BigInteger.ONE;
   while(!m.isZero()){
      if(!m.remainder(BigInteger.small[2]).isZero()) {
            var rp = addPoint(E,Ret,P);
            Ret = rp[0]; d = rp[1];
            if(Ret=="Identity") return [Ret,BigInteger.ONE];
      }
      if(d.compare(BigInteger.ONE)!=0) return [Ret,d];
      var rp = addPoint(E,P,P);
      P = rp[0]; d = rp[1];
      if(d.compare(BigInteger.ONE)!=0) return [Ret,d];
      m = m.divide(BigInteger.small[2]);
   } 
   return [Ret,d];
}

function ellipticFactor(N,m,times){
   if(!times) times = BigInteger.small[5];
   for(var i=BigInteger.ZERO;i.compare(times)<0;i=i.next()){
       console.log("Round = "+i.toString());
       var rc = randomCurve(N);
       var E = rc[0];
       var P = rc[1];
       var mr = mulPoint(E,P,m);
       var Q = mr[0];
       var d = mr[1];
       if(d.compare(BigInteger.ONE)!=0) return d;
   }
   return N;
}
 return ellipticFactor;
})();
