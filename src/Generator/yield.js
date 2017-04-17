/**
 * 如果在Generator函数内部,调用另一个Generator函数,默认情况下是没有效果的
 */
function* foo() {
    yield 'a';
    yield 'b';
}

function* bar() {
    yield 'x';
    foo();
    yield 'y';
}

for (let v of bar()) {
    console.log(v);
}

// 'x'
// 'y'

/**
 * yield*语句,可以用来在一个Generator函数里面执行另一个Generator函数
 */
function* bar1() {
    yield 'x';
    yield* foo();
    yield 'y';
}

// 等同于
function* bar2() {
    yield 'x';
    yield 'a';
    yield 'b';
    yield 'y';
}

// 等同于
function* bar3() {
    yield 'x';
    for (let v of foo()) {
        yield v;
    }
    yield 'y';
}

for (let v of bar1()) {
    console.log(v);
}

// "x"
// "a"
// "b"
// "y"

/**
 * 从语法角度上讲,如果yield命令后面跟的是一个遍历器对象,需要在yield命令后面加上一个星号
 * 表明它返回的是一个遍历器对象.这被称为yield*语句
 */
let delegatedIterator = (function* () {
    yield 'Hello!';
    yield 'Bye!';
}());

let delegatingIterator = (function* (){
    yield 'Greetings!';
    yield* delegatedIterator;
    yield 'Ok. bye.';
}());

for (let value of delegatingIterator) {
    console.log(value);
}

// "Greetings!
// "Hello!"
// "Bye!"
// "Ok, bye."

/**
 * 如果yield*后面跟着一个数组,由于数组原生支持迭代器,因此就会遍历数组成员
 * 实际上,任何数据结构只要有Iterator接口,就可以被yield* 遍历
 */
let read = (function* () {
    yield 'hello';
    yield* 'hello';
}());

read.next().value; // 'hello';
read.next().value; // 'h';


/**
 * 如果被代理的Generator函数有return语句,那么久可以向代理它的Generator函数返回数据
 */
function* foo () {
    yield 2;
    yield 3;
    return 'foo';
}

function* bar () {
    yield 1;
    var v = yield* foo();
    console.log('v: ' + v);
    yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}

/**
 * 下面的代码中,存在两次遍历,第一次是扩展运算符遍历数函数logReturned返回的遍历器对象,第二次是yield*
 * 语句遍历函数genFuncWithReturn返回的遍历器对象.这两次遍历的效果是叠加的,最终表现为扩展运算符遍历
 * genFUncWithReturn返回的遍历器对象.所以.最后的数据表达式得到的值等于['a', 'b'].但是函数genFuncWithReturn
 * 的return语句返回值会给函数LogReturned内部的result变量,因此最终有输出
 */

function* genFuncWithReturn() {
    yield 'a';
    yield 'b';
    return 'The result';
}

function* logReturned(genObj) {
    let result = yield* genObj;
    console.log(result);
}

[...logReturned(genFuncWithReturn())];


/**
 * yield* 命令可以很方便的取出嵌套数组的所有成员
 */
function* iterTree(tree) {
    if (Array.isArray(tree)) {
        for (let i = 0; i < tree.length; i++) {
            yield* iterTree(tree[i]);
        }
    } else {
        yield tree;
    }
}

const tree = ['a', ['b', 'c'], ['d', 'e']];

for (let x of iterTree(tree)) {
    console.log(x);
}

