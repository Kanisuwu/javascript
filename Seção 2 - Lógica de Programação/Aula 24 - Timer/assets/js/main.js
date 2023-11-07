const timer = document.querySelector('.timer');
const start = document.querySelector('.start');
const pause = document.querySelector('.pause');
const clear = document.querySelector('.clear');

let time = {
    hours: 23,
    minutes: 59,
    seconds: 57,
    status: false
}

function formatHours(num){
    if (num < 10){
        return `0${num}`;
    }else{
        return num;
    }
}

function updateContent(hours, minutes, seconds){
    timer.innerHTML = `<p>${hours}:${minutes}:${seconds}</p>`
}
start.addEventListener('click', function(event){
    if (!time.status){
        time.status = true;
        const displaying = setInterval(function(){
            if (time.seconds <= 60){
                time.seconds++
            }
            if (time.seconds >= 60){
                time.minutes++
                time.seconds = 0;
            }
            if (time.minutes > 59){
                time.hours++
                time.minutes = 0;
            }
            const hour = formatHours(time.hours);
            const minute = formatHours(time.minutes);
            const second = formatHours(time.seconds);
            updateContent(hour, minute, second);
        }, 1000)
        timer.style.color = 'black';
        pause.addEventListener('click', function(event){
            setTimeout(function(){
                clearInterval(displaying);
                if (time.status) {
                timer.style.color = 'red';
                }
                time.status = false;
            })
        })
    }
    clear.addEventListener('click', function(event){
        time = {
            hours: 0,
            minutes: 0,
            seconds: 0
        }
        updateContent('00', '00', '00');
        timer.style.color = 'black';
        time.status = false;
    })
})