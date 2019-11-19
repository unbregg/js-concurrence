onmessage = function({data}) {
    const min = data[0];
    const max = data[1];
    let result = 0;
    for(let i = min + 1; i <= max; i++) {
        result += i;
    }
    postMessage(result);
}
postMessage('ready');