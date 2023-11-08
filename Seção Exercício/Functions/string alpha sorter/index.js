const sorter = (string) => {
    const sortedString = string.toLowerCase().split('').sort().join('');
    return sortedString;
};

console.log(sorter('webmaster'));

// Example string : 'webmaster'
// Expected Output : 'abeemrstw'