
function U_V_subscript(k,n,U,V,P,Q,D){

  var digits = [];
  var tempk = k;
  do{
      digits.push(tempk.remainder(BigInteger.small[2]));
	  tempk = tempk.divide(BigInteger.small[2]);
  }while(!tempk.isZero());
  digits = digits.reverse();
  
  var subscript = BigInteger.ONE;
  for(var i=1;i<digits.length;i++){
      var digit = digits[i];
      U = U.multiply(V).remainder(n);
	  V = V.modPow(BigInteger.small[2],n).subtract(Q.modPow(subscript,n).multiply(BigInteger.small[2])).remainder(n);
	  subscript = subscript.multiply(BigInteger.small[2]);
	  if(digit.compare(BigInteger.ONE)==0){
	      if(P.multiply(U).add(V).remainder(BigInteger.small[2]).isZero()){
		      if(D.multiply(U).add(P.multiply(V)).remainder(BigInteger.small[2]).isZero()){
			      var tu =  P.multiply(U).add(V).divide(BigInteger.small[2]);
			      var tv =  D.multiply(U).add(P.multiply(V)).divide(BigInteger.small[2]);
			      U = tu; V=tv;
			  } else {
			      var tu =  P.multiply(U).add(V).divide(BigInteger.small[2]);
			      var tv =  D.multiply(U).add(P.multiply(V)).add(n).divide(BigInteger.small[2]);
			      U = tu; V=tv;
			  }
		  } else if(D.multiply(U).add(P.multiply(V)).isZero()){
		      var tu =  P.multiply(U).add(V).add(n).divide(BigInteger.small[2]);
			  var tv =  D.multiply(U).add(P.multiply(V)).divide(BigInteger.small[2]);
			  U = tu; V=tv;
		  } else {
		      var tu =  P.multiply(U).add(V).add(n).divide(BigInteger.small[2]);
			  var tv =  D.multiply(U).add(P.multiply(V)).add(n).divide(BigInteger.small[2]);
			  U = tu; V=tv;
		  }
		  subscript = subscript.next();
		  U = U.remainder(n);
		  V = V.remainder(n);
	  }
  }
  
  return [U,V];
}

function lucas_pp(n,D,P,Q){
    var UV = U_V_subscript(n.next(),n,BigInteger.ONE,P,P,Q,D);
	var U = UV[0];
	var V = UV[1];
	if(!U.isZero()){
	    return false;
	}
	var d = n.next();
	var s = BigInteger.ZERO;
	
	while(d.remainder(BigInteger.small[2]).isZero()){
	    d = d.divide(BigInteger.small[2]);
		s = s.next();
	}
	
	UV = U_V_subscript(n.next(),n,BigInteger.ONE,P,P,Q,D);
	U = UV[0];
	V = UV[1];
	
	if(U.isZero()){
	    return true;
	}
	
	for(var r = BigInteger.ZERO;r.compare(s)<0;r = r.next()){
	   var modpow = d;
	   U = U.multiply(V).remainder(n);
	   V = V.modPow(2,n).subtract(Q.modPow(modpow).multiply(BigInteger.small[2])).remainder(n);
	   
	   
	    if(V.isZero()){
		    return true;
		}
	    modpow = modpow.multiply(BigInteger.small[2]);
	}
	
	
	return false;
}


/* pseudoprimes base2
2047, 3277, 4033, 4681, 8321, 15841, 29341, 42799, 49141, 52633, 65281,
74665, 80581, 85489, 88357, 90751, 104653, 130561, 196093, 220729,
233017, 252601, 253241, 256999, 271951, 280601, 314821,
357761, 390937, 458989, 476971, 486737
*/
// miller rabin base 2
function miller_rabin_base_2(n){

  var d = n.subtract(BigInteger.ONE);
  var s = BigInteger.ZERO;
  
  while(d.remainder(BigInteger.small[2]).compare(BigInteger.ZERO)==0){
      d = d.divide(BigInteger.small[2]);
	  s = s.next();
  }

  var x = BigInteger.small[2].modPow(d,n);
  if( x.compare(BigInteger.ONE)==0 || x.compare(n.subtract(BigInteger.ONE))==0){
      return true;
  }
  for(var i=BigInteger.ONE;i.compare(s)<0;i = i.next()){
       x = x.modPow(BigInteger.small[2],n);
	   if(x.compare(BigInteger.ONE) == 0){
	       return false;
	   } else if(x.compare(n.subtract(BigInteger.ONE))==0){
	       return true;
	   }
  }
  return false;

}


//calculate the jacobi symbol (a/n)
function jacobi_symbol(a,n){
  if(a.isZero()){
        return BigInteger.ZERO;
  } else if(a.compare(BigInteger.ONE)==0){
      return BigInteger.ONE;
  } else if(a.compare(BigInteger.small[2])==0){
      var n8rem = n.remainder(BigInteger.small[8]);
	   if(n8rem.compare(BigInteger.small[3]) ==0 || n8rem.compare(BigInteger.small[5])==0){
	          return new BigInteger(-1);
	   } else if(n8rem.compare(BigInteger.ONE)==0 || n8rem.compare(BigInteger.small[7])==0){
	         return BigInteger.ONE;
	   }
  } else if(a.compare(BigInteger.ZERO)<0){
        var powv = n.subtract(BigInteger.ONE).divide(BigInteger.small[2]);
        return new BigInteger(-1).pow(powv).multiply(jacobi_symbol(BigInteger.ZERO.subtract(a),n));
  }
  
  
    if(a.remainder(BigInteger.small[2]).compare(BigInteger.ZERO) == 0){
	     return jacobi_symbol(BigInteger.small[2],n).multiply(jacobi_symbol(a.divide(BigInteger.small[2]),n));
    } else if(a.remainder(n).compare(a)!=0){
	     return jacobi_symbol(a.remainder(n),n);
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
      if(D.compare(BigInteger.ZERO)>0){
        D = D.add(BigInteger.small[2]);
	  } else {
        D = D.subtract(BigInteger.small[2]);
	  }
      D = D.multiply(MINUS_1);
    }
    return D;
}

// Perform the Baillie-PSW probabilistic primality test 
function baillie_psw(candidate){
    var known_primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47];
  //  console.log("Testing candidate ... "+candidate);
   /* for(var i=0;i<known_primes.length;i++){
        var known_prime = new BigInteger(known_primes[i]);
        if(candidate.compare(known_prime)==0){
            return true;
        } else if(candidate.remainder(known_prime).compare(BigInteger.ZERO) ==0){
           return false;
        }
    }*/
 //  console.log("Testing Miller Rabin candidate ... "+candidate);
 //  if(!miller_rabin_base_2(candidate)){
    //   console.log("Testing Miller Rabin candidate ... "+candidate+"iscomposite");
  //     return false;
 //  }
  // console.log("Testing lucas pp candidate ... "+candidate);
   console.log("D_chooser begin candidate "+candidate.toString());
   var D = D_chooser(candidate);
    console.log("D_chooser ="+D.toString());
   if(!lucas_pp(candidate,D,BigInteger.ONE,(BigInteger.ONE.subtract(D).divide(BigInteger.small[4])))){
	    //console.log("Lucas returing false");
        return false;
   }
   // console.log("baillie_psw returing true");
   return true;
}



