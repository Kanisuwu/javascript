const date = new Date();
const day = date.getDay();

function getWeekdays(day){
    let weekdays;
    switch (day) {
        case 0:
            weekdays = 'Domingo';
            break;
        case 1:
            weekdays = 'Segunda';
            break;
        case 2:
            weekdays = 'Terça';
            break;
        case 3:
            weekdays = 'Quarta';
            break;
        case 4:
            weekdays = 'Quinta';
            break;
        case 5:
            weekdays = 'Sexta';
            break;
        case 6:
            weekdays = 'Sábado';
            break;
        default: 
            weekdays = '';
            break;
    }
    return weekdays;
}

// const semana = [ 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado' ]

// console.log(semana[dia]);

console.log(getWeekdays(day));