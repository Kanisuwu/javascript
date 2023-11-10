// const request = obj => {
//     const xhr = new XMLHttpRequest();
//     xhr.open(obj.method, obj.url, true);
//     xhr.send(null);

//     // Mesma coisa que xhr.onload = func...
//     xhr.addEventListener('load', () => {

//         if (xhr.status >= 200 && xhr.status < 300) {
//             obj.success(xhr.responseText);
//         }
//         else {
//             obj.error(xhr.statusText);
//         }

//     });
// };

const request = obj => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(obj.method, obj.url, true);
        xhr.send(null);
        // Mesma coisa que xhr.onload = func...
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
            }
            else {
                reject(xhr.statusText);
            }
        });
    });
};

document.addEventListener('click', e => {
    const el = e.target;
    const tag = el.tagName.toLowerCase();

    if (tag === 'a') {
        e.preventDefault();
        loadPage(el);
    }

});

async function loadPage(el) {
    const href = el.getAttribute('href');

    const config = {
        method: 'GET',
        url: href,
    };

    try {
        const response = await request(config);
        loadResult(response);
    }
    catch (e) {
        console.log(e);
    }

    // request({
    //     method: 'GET',
    //     url: href,
    // }).then(response => {
    //     loadResult(response);
    // }).catch(e => console.log(e));
};

const loadResult = response => {
    const result = document.querySelector('.result');
    result.innerHTML = response;
};