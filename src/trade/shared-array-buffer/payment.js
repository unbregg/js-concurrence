importScripts("../../lib/lock.js");

onmessage = function (e) {
    const sab = e.data;
    const bankA = new Int32Array(sab, 0, 1);
    const bankB = new Int32Array(sab, 4, 1);
    const syncForBankA = new Int32Array(sab, 16, 1);
    const syncForBankB = new Int32Array(sab, 20, 1);
    const syncForCount = new Int32Array(sab, 24, 1);
    const lock = new Lock(sab, 12);

    lock.lock();
    Atomics.store(syncForBankA, 0, 1);
    Atomics.notify(syncForBankA, 0, 1);
    Atomics.store(syncForBankB, 0, 1);
    Atomics.notify(syncForBankB, 0, 1);

    while (Atomics.load(syncForCount, 0) !== 2) {
    }
    Atomics.store(syncForCount, 0, 0);
    lock.unlock();
    postMessage('done');
};
