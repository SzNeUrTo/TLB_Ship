function arrayRemoveAtIndex (arr, index) {
	 console.log("Remove" + arr.splice(index,1));
}    

a = [1,2,3,4,5,6];
console.log(a.length);
arrayRemoveAtIndex(a,5);
console.log(a.length);
