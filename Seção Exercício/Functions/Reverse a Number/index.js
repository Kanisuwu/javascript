const num = 32243;

const reverse = (toReverse) => {
    const numString = String(toReverse);
    const stringArray = numString.split('');
    const reversed = stringArray.reverse();
    const fullReverse = reversed.join('');
    console.log(fullReverse);
};

reverse(num);