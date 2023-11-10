// const request = obj => {
//     return new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.open(obj.method, obj.url, true);
//         xhr.send(null);
//         // Mesma coisa que xhr.onload = func...
//         xhr.addEventListener('load', () => {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 resolve(xhr.responseText);
//             }
//             else {
//                 reject(xhr.statusText);
//             }
//         });
//     });
// };

document.addEventListener('click', e => {
    const el = e.target;
    const tag = el.tagName.toLowerCase();

    if (tag === 'a') {
        e.preventDefault();
        loadPage(el);
    }

});

async function loadPage(el) {
    try {
        const href = el.getAttribute('href');
        const response = await fetch(href);
        if (response.status < 200 || response.status > 300) throw new Error(`ERROR >>> ${response.status}`);
        const html = await response.text();
        loadResult(html);
    }
    catch (err) {
        console.warn(err);
    }

    // fetch(href)
    //     .then(response => {
    //         if (response.status < 200 || response.status > 300) throw new Error(`ERROR >>> ${response.status}`);
    //         return response.text();
    //     })
    //     .then(html => loadResult(html))
    //     .catch(e => console.error(e));
}

const loadResult = response => {
    const result = document.querySelector('.result');
    result.innerHTML = response;
};