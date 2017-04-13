/**
 * Promise.all(): 用于将多个Promise实例,包装成一个新的Promise实例
 *
 * 接受的方法一般是Promise实例,如果不是,就会调用Promise.resolve方法,将参数转为Promise实例,再进一步处理
 *
 * Promise.all方法的参数可以不是数组.但是必须具有Iterator接口,且返回的每个成员都是Promise实例
 */
var all = Promise.all([new Promise(), new Promise(), new Promise()]);


/**
 * all 的状态由三个Promise实例来决定,分成两种情况:
 *
 * 1. 只有三个Promise实例的状态都编程了fulfilled, all的状态才会变成fulfilled, 此时三个Promise的返回值组成
 *      一个数组,传递给p的回调函数
 *
 * 2.只要三个Promise中有一个被rejected, all的状态就变成rejected,此时第一个被reject的实例的返回值,会传递给all
 *      的回调函数
 */
const connectDatabase = function () {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve({ url: 'localhost' })
        }, 3000);
    });
};

const findAllBooks = function () {},
    getCurrentUser = function () {},
    pickTopRecomentations = function (books, user) {};

const databasePromise = connectDatabase();

const booksPromise = databasePromise.then(findAllBooks);

const userPromise = databasePromise.then(getCurrentUser);

Promise.all([
    booksPromise,
    userPromise
]).then(([books, user]) => pickTopRecomentations(books, user));


/**
 * Promise.race(): 将多个Promise实例,包装成一个新的Promise实例
 *
 * 只要三个Promise实例有一个率先改状态, race的状态就跟着改变.那个率先改变的Promise实例的返回值
 *      传递给race的回调函数
 *
 * 同样,如果传递给race的不是Promise实例,则会先使用Promise.resolve转成Promise实例
 */

var race = Promise.race([new Promise(), new Promise(), new Promise()]);


// 如果5秒内fetch方法没有返回结果,变量p的状态就会变成reject,从而触发catch方法指定的回调函数
const p = Promise.race([
    fetch('/resource-that-may-take-a-while'),
    new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error('request timeout')), 5000)
    })
]);

p.then(response => console.log(response))
    .catch(error => console.log(error));


/**
 * Promise.resolve() : 有时需要将现有的对象转为Promise对象, Promise.resolve方法就起到这个作用
 */


// 将jQuery生成的deferred对象,转为一个新的Promise对象
var jsPromise = Promise.resolve($.ajax('/whatever.json'));

// Promise.resolve等价于下面的写法
Promise.resolve('foo');

// 等价于
new Promise(resolve => resolve('foo'));

/**
 * resolve方法的参数分为四种情况
 *
 */

// 1.参数是一个Promise对象, 那么不做任何修改,直接返回该对象.

// 2.参数一个thanable对象(具有then方法的对象)
let thenable = {
    then (resolve, reject) {
        resolve(43);
    }
};

// Promise.resolve方法会将这个对象转为Promise对象,然后就立即执行thenable对象的then方法.
let p1 = Promise.resolve(thenable);
// 执行then方法之后,对象p1的状态就变成resolved,从而立即执行最后那个then方法指定的回调函数
p1.then(function (value) {
    console.log(value);
});

// 3.参数不是具有then方法的对象,或根本不是对象,则Promise.resolve方法返回一个新的Promise对象,状态为Resolved
var p2 = Promise.resolve('Hello');

p2.then(function (s) {
    console.log(s);
});

// 4.不带有任何参数 Promise.resolve方法允许调用时不传递参数, 直接返回一个resolved状态的promise对象

/**
 * Promise.reject() 返回一个新的Promise实例, 该实例的状态为rejected
 */
const thenable2 = {
    then (resolve, reject) {
        reject('出错了')
    }
};

// Promise.reject方法的参数是一个thenable对象，执行以后，后面catch方法的参数不是reject抛出的“出错了”
// 这个字符串，而是thenable对象。
Promise.reject(thenable2)
    .catch(e => {
        console.log( e === thenable2);
    })
