const nums = [1, 2, 3, 4, 5];

// for (let i = 0; i < nums.length; i++){
//     console.log(nums[i])
// }

for (let index in nums) {
    console.log(nums[index])
}

const object = {
    name: 'Kanisu',
    age: 20,
    pow: 'Possession'
}

for (let key in object) {
    console.log(key, '=', object[key])
}