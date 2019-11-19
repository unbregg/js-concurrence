if (window.Worker) {
    // 申请一个 12 字节大小的 sab
    const sab = new SharedArrayBuffer(8);
    // 用于记录在计算 1...n 过程中，当前待求和的值
    const countArray = new Int32Array(sab, 0, 1);
    // 记录 1...n 中 n 的值， 由于长度为 1 的 Int32Array 占用了 4 个字节，所以索引要从 4 开始
    const maxNumArray = new Int32Array(sab, 4, 1);
    // 记录 1...n 的和
    let result = 0;
    // 记录从 worker 拿到消息的次数
    let count = 0;
    // 开始时间
    let startTime;
    // 定义线程的数量，与 cpu 核心数相等
    const workNums = 4;
  	// 记录所有 worker 数量
    const workers = [];

    countArray[0] = 0;
    maxNumArray[0] = Math.pow(2, 26);
    const onMessage = function ({data}) {
        count++;
      	// worker 创建完后，会向主线程发送 'ready'
        if(data === 'ready'){
            if(count === workNums) {
                count = 0;
                workers.forEach((worker, idx) => {
                    // 向 worker 发送共享的数据
                    worker.postMessage(sab);
                });
              	// 在这里记录开始时间，可以避免算上线程创建的开销
                startTime = performance.now();
            }
        } else {
            result += data;
            if(count === workNums) {
                console.log('耗时为：', performance.now() - startTime);
                console.log('和为：', result);
            }
        }
    };
    for (let i = 0; i < workNums; i++) {
        let myWorker = new Worker('worker.js');
        myWorker.onmessage = onMessage;
        workers.push(myWorker);
    }
} else {
    console.log('你的浏览器不支持 Web Workers');
}