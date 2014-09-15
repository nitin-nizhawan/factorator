// curve y^2 = x^3 + ax +b (mod m) -> [a,b,m]
function ecm_mod(a,m){
    var rem = a.remainder(m);
    if(rem.compare(BigInteger.ZERO)<0){
          return rem.add(m);
    }
    return rem;
}
function getRandomBigInteger(n){
         var nstr = n.toString();
         var digits = Math.floor(nstr.length);
         var val=[];
         for(var i=0;i<digits;i++){
            val[i] = Math.floor(Math.random()*10);
         }
         while(val[0]==0){
             val.shift();
         }
         return new BigInteger(val.join("")).remainder(n);
    }

function egcd(a,b){
   var s = BigInteger.ZERO;
   var t = BigInteger.ONE;
   var r = b;
   var old_s = BigInteger.ONE;
   var old_t = BigInteger.ZERO;
   var old_r = a;
   var quotient;
   var tmp;
   while(!r.isZero()){
      quotient = old_r.divide(r);
      tmp = old_r;
      old_r = r;
      r = tmp.subtract(quotient.multiply(r));
    
      tmp = old_s;
      old_s = s;
      s = tmp.subtract(quotient.multiply(s));
 
      tmp = old_t;
      old_t = t;
      t = tmp.subtract(quotient.multiply(t)); 
   }
   return [old_r,old_s,old_t,t,s];
}
/*
  return [gcd,modinv]
*/
function modInv(a,n){
    var t = BigInteger.ZERO;
    var r = n;
    var newt = BigInteger.ONE;
    var newr = a;
    var tmp, quotient;
    while(!newr.isZero()){
        quotient = r.divide(newr);
        tmp = t;
        t = newt;
        newt = tmp.subtract(quotient.multiply(newt));

        tmp = r;
        r = newr;
        newr = tmp.subtract(quotient.multiply(newr));
    }
    if(r.compare(BigInteger.ONE)>0){
       return [r];
    }
    if(t.compare(BigInteger.ZERO)<0){
        t = t.add(n);
    }
    return [r,t];
}
function modMult(a,b,m){
   return (a*b)%m;
}
// given the curve add, returns p1+p2
function ecm_plus(ecm,p1,p2){
    var a = ecm[0];
    var b = ecm[1];
    var m = ecm[2];
    var infinity = [BigInteger.ZERO,BigInteger.ONE,BigInteger.ZERO];
    var num, den;
    if(p1[2].isZero()) return p2;
    if(p2[2].isZero()) return p1;
    if(p1[0].compare(p2[0])==0){
        if(p1[1].add(p2[1]).remainder(m).isZero()){
            return infinity;
        } else {
            num = p1[0].multiply(p1[0]).multiply(BigInteger.small[3]).add(a);
            den = p1[1].multiply(BigInteger.small[2]);
        }
    } else {
       num = p2[1].subtract(p1[1]);
       den = p2[0].subtract(p1[0]);   
    }
   // console.log("num = "+num.toString());
   // console.log("den = "+den.toString());
    var modInv_ret = modInv(den,m);
    if(modInv_ret[0].abs().compare(BigInteger.ONE)!=0&&modInv_ret[0].compare(m)!=0){
        throw new Error(modInv_ret[0].toString()+","+den.toString());
    }else {
        var iden = modInv_ret[1];
   //console.log("gcd : "+modInv_ret[0].toString());
     //   console.log("iden="+iden.toString());  
        var s = num.multiply(iden);
      //   console.log("s = "+s.toString());
        var x3 = ecm_mod(s.multiply(s).subtract(p1[0]).subtract(p2[0]),m);
        var y3 = ecm_mod(s.multiply(p1[0].subtract(x3)).subtract(p1[1]),m);
        return [x3,y3,BigInteger.ONE]; 
    }
}

function ecm_negate(ecm,p){
   return  [p[0], 
            ecm_mod(p[1].negate(),ecm[2]),
            p[2]];
}

function ecm_double(ecm,p){
    return ecm_plus(ecm,p,p);
}
function ecm_minus(ecm,p1,p2){
  return  ecm_plus(ecm,p1,ecm_negate(ecm,p2));
}

function ecm_times(ecm,n,p){
  if(n==1)   return p;
  if(n%2==1){
    return ecm_plus(ecm,p,ecm_times(ecm,n.divide(BigInteger.small[2]),ecm_double(ecm,p)));      
  } else {
    return ecm_times(ecm,n.divide(BigInteger.small[2]),ecm_double(ecm,p));   
  }
}


var tecm = [BigInteger.small[4],BigInteger.small[4],BigInteger.small[5]];
var p1 = [BigInteger.small[1],BigInteger.small[2],BigInteger.small[1]]; 
var p2 = [BigInteger.small[4],BigInteger.small[3],BigInteger.small[1]];

function  log_point(p,msg){
    msg = msg|| "point";
    var s=[];
    for(var i=0;i<p.length;i++){
        s.push(p[i].toString());
    }
     console.log(msg+" : "+s.join());
}
function ecm_factor(n){
 var iter = 15;
 while(iter>0){
    var a = getRandomBigInteger(n);
    var p = [getRandomBigInteger(n),getRandomBigInteger(n),BigInteger.ONE];
    var ax = ecm_mod(a.multiply(p[0]),n);
    var xcube = ecm_mod(p[0].multiply(p[0]).multiply(p[0]),n);
    var b = ecm_mod(ecm_mod(p[1].multiply(p[1]),n).subtract(xcube).subtract(ax),n); 
    var ecm = [a,b,n];
    var fact = BigInteger.small[2];
    var newp = p;
 try{
    while(fact.compare(new BigInteger("2000"))<0){
       var newp = ecm_times(ecm,fact,newp);

//log_point(newp,"factoring"+iter);
       fact = fact.next();
    }
  }catch(e){
      console.log(e);
      var fs = e.message.split(",");
      var b = new BigInteger( fs[0]);
      return b;
  }
 iter--;
}  
console.log("returning without factor");
     
}
var p3 = ecm_plus(tecm,p1,p2);
log_point(p3);
var p3neg = ecm_negate(tecm,p1);
log_point(p3neg);
var p3dub = ecm_double(tecm,p1);
log_point(p3dub);
var p4 = ecm_minus(tecm,p3,p2);
log_point(p4);
var p3p = ecm_times(tecm,BigInteger.small[3],p1);
log_point(p3p);
var p4p = ecm_times(tecm,BigInteger.small[4],p1);
log_point(p4p);
var p5p = ecm_times(tecm,BigInteger.small[5],p1);
log_point(p5p);
//var f2p = ecm_factor(new BigInteger(455839));
var f2p1 = ecm_factor(new BigInteger("4863307462164497"));
 console.log(f2p1.toString());
