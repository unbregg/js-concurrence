let paymentWorkers = [];
const channelA = new MessageChannel();
const channelB = new MessageChannel();
const bankA = new Worker('./bank-a.js');
const bankB = new Worker('./bank-b.js');

bankA.postMessage({type: 'init'}, [channelA.port2]);
bankB.postMessage({type: 'init'}, [channelB.port2]);

/*let count = 0;
const success = function () {
    count++;
    if (count === 2) {
        console.log('交易完成');
        count = 0;
    }
};
channelA.port1.onmessage = success;
channelB.port1.onmessage = success;*/
// 同时发起十笔交易
for (let i = 0; i < 10; i++) {
    const myWorker = new Worker('./payment.js');
    paymentWorkers.push(myWorker);
}

const onmessage = function(e){
    // 交易完成后销毁线程
    if (e.data.type === 'done') {
        paymentWorkers[0].terminate();
        paymentWorkers = paymentWorkers.slice(1);
        if(paymentWorkers[0]) {
            paymentWorkers[0].onmessage = onmessage;
            paymentWorkers[0].postMessage({type: 'pay', data: 100}, [e.ports[0], e.ports[1]]);
        }
    }
};
paymentWorkers[0].postMessage({type: 'pay', data: 100}, [channelA.port1, channelB.port1]);
paymentWorkers[0].onmessage = onmessage;
