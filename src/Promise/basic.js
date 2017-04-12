/**
 * ES6规定, Promise对象是一个构造函数, 用来生成Promise实例
 *      Promise构造函数接受一个函数作为参数,该函数的两个参数分别是resolve和reject.
 *      resolve函数: 将Promise对象的状态从Pending变成Resolved,在异步操作成功时调用,
 *                      并将异步操作的结果,作为参数传递出去;
 *      reject函数: 将Promise对象的状态从Pending变为Rejected,在异步操作失败时调用.
 *                      并将异步操作报出的错误,作为参数传递出去.
 */

var promise1 = new Promise(function (resolve, reject) {
    // ... some code

    if (Math.random() > 1) {
        resolve({ value: true });
    } else {
        reject({ value: false });
    }
});


// Promise实例生成以后, 可以用then方法分别制定Resolved状态和Reject状态的回调函数
promise1.then(function (value) {
    // success
}, function (error) {
    // failure
});

// Promise新建后就会立即执行
let promise2 = new Promise(function (resolve, reject) {
    console.log('Promise.');
    resolve();
});

promise2.then(function () {
    console.log('Resolved.');
});

console.log('Hi.');


// 异步加载图片的例子, 使用Promise包装一个图片加载的异步操作。如果加载成功，就调用resolve方法
// 狗则就调用reject方法
function loadImageAsync (url) {
    return new Promise(function (resolve, reject) {
        let image = new Image();

        image.onload = () => resolve(image);

        image.onerror = () => reject(new Error(`Cloud not load image at ${url}`));

        image.src = url;
    });
}


// 使用Promise对象实现Ajax操作的例子
const getJson = function (url) {
    const promise = new Promise(function (resolve, reject) {
        const client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = function () {
            if (this.readyState !== 4) {
                return;
            }

            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };

        client.responseType = 'json';
        client.setRequestHeader('Accept', 'application/json');
        client.send();
    });

    return promise;
};

getJson('/posts.json').then((json) => {
    console.log('Contents: ' + json);
}, (error) => {
    console.log('Error: ' + error);
});


/**
 * 如果调用resolve函数和reject函数时带有参数，那么他们的参数会被传递给回调函数。
 * reject函数的参数通常是Error对象的实例，表示抛出的错误；
 * resolve函数肚饿参数处理正常的值以外，还可以是另一个Promise实例，表示异步操作的结果
 *      有可能是一个值，也有可能是另一个异步操作
 */
var p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail'), 3000));
});

/**
 * p1, p2都是Promise的实例，但是p2的resolve方法将p1作为参数，即一个异步操作的结果是返回另一个异步操作
 *
 * 此时p1的状态就会传递给p2，也就是说p1的状态决定了p2的状态。如果p1的状态是Pending,那么p2的回调函数就会等待p1
 * 的状态改变；如果p1的状态已经是Resolved或者Reject，那么p2的回调函数将会立即执行
 */
var p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000);
});

p2
    .then(result => console.log(result))
    .catch(error => console.log(error));
