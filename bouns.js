
var findKthPositive = function(arr, k) {
    let notexists=[]
    for (let i = 1;notexists.length<k ; i++) {
        if (!arr.includes(i)) {
            notexists.push(i);
        }



    }
    return notexists[k-1];

};
let arr=[2,3,4,7,11]
console.log(findKthPositive(arr,5))