//calculate the jacobi symbol (a/n)
function jacobi_symbol(a,n){
  if(a.compare(BigInteger.ZERO)==0){
        return BigInteger.ZERO;
  } else if(a.compare(BigInteger.ONE)){
      return BigInteger.ONE;
  } else if(a.compare(BigInteger.small[2])){
  } else if(a.compare(BigInteger.ZERO)<0){
  }
    if(a.remainder(BigInteger.small[2]).compare(BigInteger.ZERO) == 0){
    } else if(a.remainder(n).compare(a)!=0){
    } else {
        if(a.remainder(BigInteger.small[4]).compare(BigInteger.small[3])==0&&
            n.remainder(BigInteger.small[4]).compare(BigInteger.small[3])==0){
           return jacobi_symbol(n,a).multiply(new BigInteger(-1));
        } else {
           return jacobi_symbol(n,a);
        }
    }
}



//choose a D value suitable for the Baillie-PSW test
function D_chooser(candidate){
    var D = BigInteger.small[5];

    var MINUS_1= new BigInteger(-1);

    while( jacobi_symbol(D,candidate).compare(MINUS_1)!=0){
      if(D.compare(BigInteger.ZERO)>0)
        D = D.add(BigInteger.small[2]);
      else
        D = D.subtract(BigInteger.small[2]);
        D = D.multiply(MINUS_1);
    }
    return D;
}

// Perform the Baillie-PSW probabilistic primality test 
function baillie_psw(candidate){
    var known_primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47];

    for(var i=0;i<known_primes.length;i++){
        var known_prime = new BigInteger(known_primes[i]);
        if(candidate.compare(known_prime)==0){
            return true;
        } else if(candidate.remainder(known_prime).compare(BigInteger.ZERO) ==0){
           return false;
}
    }

   if(!miller_rabin_base_2(candidate)){
       return false;
   }
   var D = D_chooser(candidate);
   if(!lucas_pp(candidate,D,BigInteger.ONE,(BigInteger.ONE.subtract(D).divide(BigInteger.small[4]))
        return false;

   return true;
}



