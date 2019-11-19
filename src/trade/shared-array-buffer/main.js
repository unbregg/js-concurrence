const lockLoc = 12;
const sab = new SharedArrayBuffer(28);
const bankA = new Int32Array(sab, 0, 1);
const bankB = new Int32Array(sab, 4, 1);
const money = new Int32Array(sab, 8, 1);
const syncForPay = new Int32Array(sab, lockLoc, 1);
const syncForBankA = new Int32Array(sab, 16, 1);
const syncForBankB = new Int32Array(sab, 20, 1);
const syncForCount = new Int32Array(sab, 24, 1);

bankA[0] = 1000;
bankB[0] = 1000;
money[0] = 100;
syncForBankA[0] = 0;
syncForBankB[0] = 0;
syncForCount[0] = 0;
Lock.initialize(sab, lockLoc);

const workerA = new Worker('./bank-a.js');
const workerB = new Worker('./bank-b.js');
workerA.postMessage(sab);
workerB.postMessage(sab);

// 同时发起十笔交易
for (let i = 0; i < 10; i++) {
    const myWorker = new Worker('./payment.js');
    myWorker.onmessage = ({data}) => {
        // 交易完成后销毁线程
        if (data === 'done') {
            myWorker.terminate();
        }
    };
    myWorker.postMessage(sab);
}
