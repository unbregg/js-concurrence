# JavaScript 并发编程

## 安装及运行

通过 `npm i` 安装完依赖之后，运行 `npm start` 即访问。例如 1_n 中的 web workers 版本： http://127.0.0.1:8082/1_n/web-workers/index.html 。

注意：
+ 请务必使用 Chrome 68+ 的版本
+ 所有示例的输出都在 console 中，记得打开调试器

## 目录结构

    |-- js-concurrence
        |-- 1_n // 示例。计算 1...n 的和
        |   |-- shared-array-buffer // 内存共享版本
        |   |-- single // 单线程版本
        |   |-- web-workers // web workers 版本
        |-- lib // 三方库
        |   |-- lock.js // 提供互斥锁
        |-- mandel // 示例。动态生成 Mandelbrot 图像
        |   |-- concurrent // 并发版本
        |   |-- single // 单线程版本
        |-- trade // 示例。订单支付
            |-- shared-array-buffer // 共享内存版本
