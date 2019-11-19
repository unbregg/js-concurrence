onmessage = function(e) {
    const sab = e.data;
    const bankA = new Int32Array(sab, 0, 1);
    const money = new Int32Array(sab, 8, 1);
    const syncForBankA = new Int32Array(sab, 16, 1);
    const syncForCount = new Int32Array(sab, 24, 1);

    while(true) {
        Atomics.wait(syncForBankA, 0, 0);
        Atomics.sub(bankA, 0, money[0]);
        Atomics.store(syncForBankA, 0, 0);
        Atomics.add(syncForCount, 0, 1);
    }
};
