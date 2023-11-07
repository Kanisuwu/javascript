function clock(){
    function getTime(seconds){
        const date = new Date(seconds * 1000);
        return date.toLocaleTimeString('pt-BR', {hour12: false, timeZone: 'GMT'});
    }
    
    let seconds = 0;
    
    function initializeTimer(){
        const timer = setInterval(() => {
            seconds++
            timer.innerHTML = getTime(seconds)
        }, 1000);
    }
    
    document.addEventListener('click', function(e){
        const el = e.target;
        if (el.classList.contains('start')){
            clearInterval(timer)
            initializeTimer();
        }
        if (el.classList.contains('pause')){
            clearInterval(timer)
        }
        if (el.classList.contains('clear')){
            clearInterval(timer)
            timer.innerHTML = '00:00:00'
            segundos = 0;
        }
    })
}

clock();
