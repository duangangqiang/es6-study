/**
 * async函数返回一个Promise对象,可以使用then方法添加回调函数.当函数执行的时候,一旦遇到await就先返回
 *      等到异步操作完成,再接着执行函数体内后面的语句
 */
const getStockSymbol = () => {}, getStockPrice = () => {};
async function getStockPriceByName(name) {
    var symbol = await getStockSymbol(name);
    var stockPrice = await getStockPrice(symbol);
    return stockPrice;
}

getStockPriceByName('goog').then(result => {
    console.log(result);
});

// 另一个制定多少毫秒之后输出一个值
function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function asyncPrint(value, ms) {
    await timeout(ms);
    console.log(value);
}

asyncPrint('hello world', 2000);

// 由于async函数返回的是Promise对象,可以作为await命令的参数.所以上面的例子也可以写成下面的形式:
async function timeout1(ms) {
    await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function asyncPrint1(value, ms) {
    await timeout(ms);
    console.log(value);
}

asyncPrint1('hello world', 2000);

/**
 * async函数的多种使用形式
 */

// 函数声明
async function foo() {}

// 函数表达式
const zoo = async function () {};

// 对象的方法
let obj = { async foo() {} };

// Class的方法
class Storage {
    constructor () {

    }

    async geAvatar(name) {

    }
}

// 箭头函数
const koo = async () => {};
