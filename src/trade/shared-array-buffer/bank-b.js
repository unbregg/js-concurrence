onmessage = function(e) {
    const sab = e.data;
    const bankB = new Int32Array(sab, 4, 1);
    const money = new Int32Array(sab, 8, 1);
    const syncForBankB = new Int32Array(sab, 20, 1);
    const syncForCount = new Int32Array(sab, 24, 1);

    while(true) {
        Atomics.wait(syncForBankB, 0, 0);
        Atomics.add(bankB, 0, money[0]);
        Atomics.store(syncForBankB, 0, 0);
        Atomics.add(syncForCount, 0, 1);
    }
};
