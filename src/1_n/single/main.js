(() => {
    const maxNum = Math.pow(2, 26);
    const startTime = performance.now();
    let result = 0;
    for(let i = 1; i <= maxNum; i++) {
        result += i;
    }
    console.log('耗时为：', performance.now() - startTime);
    console.log('和为：', result);
})();
