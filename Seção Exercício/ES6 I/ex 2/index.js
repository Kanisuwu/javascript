const string = 'String';

function toClipboard(text){
    navigator.clipboard.writeText(text).then(
        () => {
            console.log('Done');
        },
        () => {
            console.log('Failed')
        }
    );
}

navigator.permissions.query({name: 'clipboard-write'}).then((result) => {
    if (result.state === 'granted' || result.state === 'prompt'){
        toClipboard(string);
    }
})
