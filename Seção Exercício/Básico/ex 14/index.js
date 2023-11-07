const file1 = 'Slug.json';
const file2 = 'Cat.exe';
const file3 = 'Spear.bat';

function getFileExt(file){
    let fileExtension = file.split('.');
    fileExtension = fileExtension.pop();
    return fileExtension;
}

console.log(getFileExt(file1));
console.log(getFileExt(file2));
console.log(getFileExt(file3));