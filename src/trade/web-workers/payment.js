let portA;
let portB;
let count = 0;
onmessage = function (e) {
    const {type, data} = e.data;
    switch (type) {
        case 'pay': {
            portA = e.ports[0];
            portB = e.ports[1];
            portA.postMessage(data);
            portB.postMessage(data);
            const success = function () {
                count++;
                if (count === 2) {
                    console.log('交易完成');
                    count = 0;
                    postMessage({type: 'done'}, [portA, portB]);
                }
            };
            portA.onmessage = success;
            portB.onmessage = success;
            break;
        }
    }
};
