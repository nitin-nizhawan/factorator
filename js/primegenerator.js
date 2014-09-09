PrimeGenerator=(function(){
 var pg = function(){}
 var primes=[2,3,5,7,11,13,17,19];
 function primeSearch(key){ // binary search into primes array
    var lo = 0,
        hi = primes.length - 1,
        mid,
        element;
    while (lo <= hi) {
        mid = ((lo + hi) >> 1);
        element = primes[mid];
        if (element < key) {
            lo = mid + 1;
        } else if (element > key) {
            hi = mid - 1;
        } else {
            return mid;
        }
    }
    return -1;
 
 }
 function isprime(n){
/*     if(n<=primes[primes.length-1]){
         return primeSearch(n)!=-1;
     }*/
	 if(n==1) return false;
	 if(n==2||n==3) return true;
     var mcheck = Math.floor(Math.sqrt(n))+1;
     if(primes[primes.length-1]<mcheck){
        fillPrimes(mcheck); 
     }
     var i=0;
     while(primes[i]<=mcheck){
         if(n%primes[i]==0){
             return false;
         }
         i++;
     }
     return true;
 }
 function fillPrimes(max){
    for(var d = primes[primes.length-1]+2;d<=max;d+=2){
        if(isprime(d)){
            primes.push(d);
        }
    }
 }
 pg.prototype.isprime=isprime;
 pg.prototype.fill=fillPrimes;
 pg.prototype.primes = primes;

return pg;
})();
