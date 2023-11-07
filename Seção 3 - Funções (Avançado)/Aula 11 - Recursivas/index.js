const recursive = (max) => {
    console.log(max);
    if (max >= 10) return;
    if (max <= -10) return;
    max++;
    recursive(max);
};

recursive(0);