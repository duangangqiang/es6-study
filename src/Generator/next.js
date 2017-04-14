/**
 * next方法的参数
 *
 * yield句本身没有返回值,或者说总是返回undefined, next方法可以带一个参数,该参数就会被当做上一个yield语句的返回值
 */
function* f1() {
    for (var i = 0; true; i++) {

        // 不带参数的时候reset总是等于yield语句的返回值undefined
        // 带了参数的时候,reset则带入next方法的参数true,作为yield语句的返回值赋值给reset
        var reset = yield i;
        if (reset) {
            i = -1;
        }
    }
}

var g1 = f1();

g1.next(); // { value: 0, done: false }
g1.next(); // { value: 1, done: false }
g1.next(true); // { value: 0, done: false }

/**
 * 这个功能有很重要的语法意义. Generator函数从暂停状态到恢复运行,它的上下文状态是不变的
 *      通过next方法的参数,就有办法在Generator函数开始运行后,继续向函数体内部注入值.
 *      也就是说,可以在Generator函数运行的不同阶段,从外部向内部注入不同的值,从而改变函数的行为
 */

function* foo (x) {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
    return (x + y + z);
}

var a1 = foo(5);
a1.next(); // {value: 6, done: false} 5 + 1
a1.next(); // {value: NaN, done: false}
a1.next(); // {value: NaN, done: true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }

/**
 * 由于next方法的参数表示上一个yield语句的返回值,所以第一次使用next方法时,不能带有参数.
 * V8引擎直接忽略第一次使用next方法时的参数,只有从第二次使用next方法开始,参数是有效的
 * 从语义上讲,第一个next方法用来启动遍历器对象,所以不用带有参数
 */

// 如果想要第一次调用next方法时,就能够输入值,可以在Generator函数外再包一层
function wrapper (generatorFunction) {
    return function (...args) {
        let generatorObject = generatorFunction(...args);
        generatorObject.next();
        return generatorObject;
    }
}

const wrapped = wrapper(function* () {
    console.log(`First input: ${yield}`);

    return 'DONE';
})

wrapped().next('hello!');

/**
 * 通过next方法的参数,向Generator函数内部输入值
 */
function* dataConsumer() {
    console.log('Start');
    console.log(`1. ${yield}`);
    console.log(`2. ${yield}`);
    return 'result';
}

let genObj = dataConsumer();

genObj.next(); // Start
genObj.next('a'); // 1.a
genObj.next('b'); // 2.b
