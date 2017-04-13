/**
 * ES6的PromiseAPI提供的方法不太多,有些有用的方法还可以自己部署
 */

/**
 * done() Promise对象的回调链, 不管以then方法或catch方法结尾,要是最后一个方法抛出错误,
 *      都可能无法捕捉到(因为Promise内部的错误不会冒泡到全局).因此,我们可以提供一个done
 *      fangfa,总是处于回调链的尾端,保证抛出任何可能出现的错误
 */
Promise.prototype.done = function (onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected)
        .catch(function (reason) {

            // 抛出一个全局错误
            setTimeout(() => { throw reason }, 0);
        });
};

/**
 * finally() 用于不管Promise对象最后状态如何,都会执行的操作.它与done方法的最大区别,它接受一个
 *      普通的回调函数作为参数,该函数不管怎样都必须执行
 */

Promise.prototype.finally = function (callback) {
    let p = this.constructor;
    return this.then(
        value => p.resolve(callback()).then(() => value),
        reason => p.resolve(callback()).then(() => { throw reason })
    );
};


