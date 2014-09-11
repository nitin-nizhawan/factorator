var Factorator=(function(){
  var MAX_JS_INT = 9007199254740992;
  var MAX_32_BIT  = 65000*65000;
  var pg = new PrimeGenerator();
  pg.fill(65000);
  var primes=pg.primes;
  function gcd(b,m){
      while(true){
        if(m==0)
            return b;
        var r = b%m;
        b=m;
        m=r; 
      }
  }
  function rabinMiller(n){
    
  }
  function gcd_big(b,m){
      while(true){
        if(m.compare(BigInteger.ZERO)==0)
            return b;
        var r = b.remainder(m);
        b=m;
        m=r; 
      }
  }

  function f(x,n){
     return (x*x + 1)%n;
  }
  function f_big(x,n){
      return x.multiply(x).next().remainder(n);
  }
  function mergeExpVec(expvec1,expvec2){
      var expmap1 ={};
      for(var i=0;i<expvec1.length;i++){
          expmap1[expvec1[i].base]=expvec1[i].exp;
      }
      for(var j=0;j<expvec2.length;j++){
          expmap2[expvec2[j].base]=expvec2[j].exp;
      }
         
  }
  function min_big(a,b){
      if(a.compare(b)<0) return a;
      return b;
  }
  function fpr(x,n,k){
     // return (modProd(x,x,n)%n + k)%n;
      var xb = new BigInteger(x);
       return parseInt(xb.multiply(xb).add(new BigInteger(k)).remainder(new BigInteger(n)).toString(),10);
     // return (modPow(x,2,n)+k)%n;
    //  return ((((x*x)>>>0)+k)>>>0)%n;
  }
  function fpr_big(x,n,k){
      return x.multiply(x).add(BigInteger.ONE.negate()).remainder(n);
  }
  function pollardRho(n){
     var x = 2;
     var y = 2;
     var d = 1;
     var k = 1;
  do {
     while(d==1){
         x = fpr(x,n,k);
         y = fpr(fpr(y,n,k),n,k);
         d = gcd(Math.abs(x-y),n);
     }
     k = k+1;
  }while(d == n && k < 4);
     if(d == n){
         return [{base:1,exp:1}];
     }
     return [{base:d,exp:1},{base:n/d,exp:1}];
          
  } 
  function factor(n){
     var n_int = parseInt(n+"",10);
	 //console.log("factor () "+n_int+" , "+(n_int < MAX_32_BIT));
      if((n_int+"")==n){
          if(n_int<MAX_32_BIT){
             return factorUsingPrimeNumber(n_int);
          } else {
             return pollardRho_big(n_int+"");
          }
      } else {

          return squafof(n);//pollardRho_big(n);
          //return rbfactor_big(n);
      }
  }
  function factorUsingPollardRhoBig(num){
     //console.log("Start Factoring "+num);
     var map={};
	 var expvec = [{base:num,exp:1}];
     while(expvec.length>0){
	    // console.log(expvec);
		// console.log(map);
	     var ecomp = expvec.shift();
		 //console.log("ecomp = "+ecomp.base+" , "+ecomp.exp);
		 var base = ecomp.base;
		 var exp = ecomp.exp;
		 if(baillie_psw(new BigInteger(base))){ // is prime?
		     map[base+""] = map[base+""]?(map[base+""]+exp):exp;
			/// console.log("num ("+num+")= "+base);
		 } else {
		     var nv = factor(base);
			 //console.log(nv);
			 for(var k=0;k<nv.length;k++){
			    nv[k].exp*=exp;
			   expvec.push(nv[k]);
			 }
			 
		 }
	 }


	 var ret=[];
	 for(var base in map){
	    ret.push({base:base,exp:map[base]});
	 }
	 //console.log(ret);
	 		// console.log(map);
	 return ret;
  }
  function pollardRho_big(n){
     
     n = new BigInteger(n);
	// console.log("pollardRho_big "+n.toString());
     var x = new BigInteger(2);
     var y = new BigInteger(2);
     var d = BigInteger.ONE;
     var k = BigInteger.ONE;
  do {
     while(d.compare(BigInteger.ONE)==0){
         x = fpr_big(x,n,k);
         y = fpr_big(fpr_big(y,n,k),n,k);
         d = gcd_big(x.subtract(y).abs(),n);
     }
     k = k.next(); 
  }while(d.compare(n)==0);
     if(d.compare(n)==0){
         return [{base:1,exp:1}];
     }
     return [{base:d.toString(),exp:1},{base:n.divide(d).toString(),exp:1}];
          
  }
  
  function rbfactor_big(n){
      n = new  BigInteger(n);
      var rand_big1 = new BigInteger(Math.floor(Math.random()*100));
      var rand_big2 = new BigInteger(Math.floor(Math.random()*100));

      var y = rand_big1.multiply(n).divide(new BigInteger(100));//new BigInteger(Math.floor((Math.floor((Math.random()*100))*n)/100));
      var m = rand_big2.multiply(n).divide(new BigInteger(100));//new BigInteger(Math.floor((Math.floor((Math.random()*100))*n)/100));
      var g=BigInteger.ZERO;
      var r = BigInteger.ONE; var q =BigInteger.ONE,k=BigInteger.ZERO,
                          x=BigInteger.ZERO,
                          y=BigInteger.ZERO,
                          ys=BigInteger.ZERO;
      do{
      x = y;
      for(var i=BigInteger.ONE;i.compare(r)<=0;i=i.next()) {
         y  = f_big(y,n);
      }
      k = BigInteger.ZERO;
        do{
          ys =y;
          for(var j =BigInteger.ONE;j.compare(min_big(r.subtract(k),m))<=0;j=j.next()){
              y = f_big(y,n);
              q = q.multiply(x.subtract(y).abs()).remainder(n);
          }
          g = gcd_big(q,n);
          k=k.add(m);
          }while(k.compare(r) <0 && g.compare(BigInteger.ONE) <=0);
       }while(g.compare(BigInteger.ONE) <=0);
       if(g.compare(n)==0){
          do{
              ys=f_big(ys,n);
              g = gcd_big(x.subtract(xs).abs(),n);
           }while(g.compare(BigInteger.ONE) <=0);
       }
       return [{base:g.toString(),exp:1},{base:n.divide(g).toString(),exp:1}]

  }
  function rbfactor(n){
      var y = Math.floor((Math.floor((Math.random()*100))*n)/100);
      var m = Math.floor((Math.floor((Math.random()*100))*n)/100);
      var g=0;
      var r = 1; var q =1,k=0,x=0,y=0,ys=0;
      do{
      x = y;
      for(var i=1;i<=r;i++) {
         y  = f(y,n);
      }
      k = 0;
        do{
          ys =y;
          for(var j =1;j<=Math.min(r-k,m);j++){
              y = f(y,n);
              q = (q*Math.abs(x-y))%n;
          }
          g = gcd(q,n);
          k+=m;
          }while(k<r && g<=1);
       }while(g<=1);
       if(g==n){
          do{
              ys=f(ys,n);
              g = gcd(Math.abs(x-xs),n);
           }while(g<=1);
       }
       return [{base:g,exp:1},{base:n/g,exp:1}]
  }
  function isPrime(n){
    var testn  = Math.floor(Math.sqrt(n))+1;
    for(var i=0;i<primes.length&&primes[i]<=testn;i++){
        if(n%primes[i]==0){
            return false;
        }
    }
    return true;
  }
  function modProd(a,b,n){
  if(b==0) return 0;
  if(b==1) return a%n;
  return (modProd(a,(b-b%10)/10,n)*10+(b%10)*a)%n;
}
function modPow(a,b,n){
  if(b==0) return 1;
  if(b==1) return a%n;
  if(b%2==0){
    var c=modPow(a,b/2,n);
    return modProd(c,c,n);
  }
  return modProd(a,modPow(a,b-1,n),n);
}
function millerRabinPrime(n){
  if(n==2||n==3||n==5) return true;
  if(n%2==0||n%3==0||n%5==0) return false;
  if(n<25) return true;
  for(var a=[2,3,5,7,11,13,17,19],b=n-1,d,t,i,x;b%2==0;b/=2);
  for(i=0;i<a.length;i++){
    x=modPow(a[i],b,n);
    if(x==1||x==n-1) continue;
    for(t=true,d=b;t&&d<n-1;d*=2){
      x=modProd(x,x,n); if(x==n-1) t=false;
    }
    if(t) return false;
  }
  return true;
}
  function fillPrimes(){
     var n = 3;
     var MAX_PRIME_BOUND=Math.floor(Math.sqrt(MAX_32_BIT)+2);
     while(n<=MAX_PRIME_BOUND){
        
        if(isPrime(n)){
            primes.push(n);
        } 
        n+=2;
     }
  }
  function factorUsingBigInteger(n){
      var num = new BigInteger(n);
      var expvec=[]; 
      for(var d = BigInteger.small[2];d.compare(num)<=0;d = d.next()){
          var pow = BigInteger.small[0];
          while(num.remainder(d).compare(BigInteger.ZERO)==0){
              pow = pow.next();
              num = num.divide(d);
          }
          if(pow.compare(BigInteger.ZERO)>0){
              expvec.push({base:d.toString(),exp:pow.toString()}); 
          }
      }
      return expvec;
  }
  function factorUsingPrimeNumber(n){
     var expvec=[];
     for(var i=0;i<primes.length&(primes[i]*primes[i])<=n;i++){
         var pow=0;
         while(n%primes[i]==0){
              pow++;
              n=n/primes[i];
         }
         if(pow>0){
            expvec.push({base:primes[i],exp:pow});
         }
     }
      if(n>1){
           expvec.push({base:n,exp:1});
      }
      return expvec;
  }
  function factorUsingNativeNumber(n){
      var expvec=[];
      for(var d=2;d<=n;d++){
         var pow=0;
         while(n%d==0){
            pow++;
            n = n/d;
         }
         if(pow>0){
            expvec.push({base:d,exp:pow});
         }
         
      }  
      return expvec;
  }
  var tp =  function(){
     
  }
  tp.prototype.init=function(){
    if(primes.length<2){
       fillPrimes();
    }    
  }
  tp.prototype.factor=function(n){
      return factorUsingPollardRhoBig(n);
  }
  return tp;
})();
