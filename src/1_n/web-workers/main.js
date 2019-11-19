if (window.Worker) {
  // 记录 1...n 的和
  let result = 0;
  // 记录从 worker 拿到消息的次数
  let count = 0;
  // 记录开始时间
  let startTime;
  // 记录所有的 worker 实例
  const workers = [];
  // 定义线程的数量，与 cpu 核心数相等
  const workNums = navigator.hardwareConcurrency;
  // 定义 n 的值
  const n = Math.pow(2, 26);
  // 分解求和的任务
  const perSize = n / workNums;
  const onMessage = function({data}) {
      count++;
      // 这里等待所有 worker 创建好的原因是为了“开始时间”的正确记录，正常情况下无需等待 worker 真正创建好，也能调用 worker.postMessage
      if(data === 'ready'){
          if(count === workNums) {
              count = 0;
              // 向 worker 发送拆解好的任务
              workers.forEach((worker, idx) => {
                  worker.postMessage([idx * perSize, (idx + 1) * perSize]);
              });
              // 在实例化wokrer时（也即创建一个线程）是有一定开销的，所以必须在所有 worker 都真正创建好时才记录开始时间
              startTime = performance.now();
          }
      } else {
          result += data;
          if(count === workNums) {
            console.log('耗时为：', performance.now() - startTime);
          }
      }
  }
  
  for(let i = 0; i < workNums; i++) {
      // 创建 worker ，构造函数接受一个 js 路径
      let myWorker = new Worker('worker.js');
      myWorker.onmessage = onMessage;
      workers.push(myWorker);
  }
} else {
  console.log('Your browser doesn\'t support Web Workers.')
}