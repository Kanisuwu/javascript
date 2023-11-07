function getDate(time){
    const date = new Date(time);

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }

    const dateTimeFormat = Intl.DateTimeFormat('pt-BR', options);
    const dateFormatted = dateTimeFormat.format(date);

    return dateFormatted
}

function display(content){
    const title = document.querySelector('#title');
    title.innerHTML = content;
}

function main(){
    const date = getDate('2019-10-07T22:52:00');
    display(date);
    console.log(date)   
}

main();

/* ERA PRA USAR SWITCH E CASE
 * MAS PELO VISTO NÃO FOI NECESSÁRIO
 * JAVA SCRIPT JÁ TEM UM OBJETO SÓ PRA ISSOKKKKK
 */