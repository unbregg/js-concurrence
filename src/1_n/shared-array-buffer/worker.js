onmessage = function ({data}) {
    const sab = data;
    const countArray = new Int32Array(sab, 0, 1);
    const maxNumArray = new Int32Array(sab, 4, 1);
    const maxNum = maxNumArray[0];
    let result = 0;

    while (true) {
        const count = Atomics.add(countArray, 0, 1);
        if (count <= maxNum) {
            result += count;
        } else {
            break;
        }
    }
    postMessage(result);
};

postMessage('ready');