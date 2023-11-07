let a = 5, b = 6, c = 7;
const semi = (a + b + c) / 2;
const area = Math.sqrt(semi * (semi - a) * (semi - b) * (semi - c));

console.log(area);