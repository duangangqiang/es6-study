/**
 * for...of循环可以自动遍历Generator函数时生成的Iterator对象,且此时不再需要调用next方法
 *
 * 注意: 一旦next方法返回对象的done属性为true, for...of循环就会中止,且不包含该返回对象,
 *      所以下面代码return语句返回的6, 不包含在for...of循环中
 */
function* foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}

for (let v of foo()) {
    console.log(v);
}

// 1, 2, 3, 4, 5

/**
 * 使用Generator函数和for...of循环,实现斐波那契数列
 */
function* fibonacci() {
    let [prev, curr] = [0, 1];
    for (;;) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

for (let n of fibonacci()) {
    if (n > 1000) break;
    console.log(n);
}

/**
 * 利用for...of循环,可以写出遍历任意对象的方法,原生的javaScript对象没有遍历接口
 * 无法使用for...of循环,通过Generator函数为它添加上这个接口,就可以使用了
 */
function* objectEntries(obj) {
    let propKeys = Relect.ownKeys(obj);

    for (let propKey of propKeys) {

        // { value: [propKey, obj[propKey]], done: false }
        yield [propKey, obj[propKey]];
    }
}

let jane = { first: 'jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
    console.log(`${key}: ${value}`);
}

/**
 * 将Generator函数加到对象的Symbol.iterator属性上
 */
function* objectEntries1 () {
    let propKeys = Object.keys(this);

    for (let propKey of propKeys) {
        yield [propKey, this[propKey]];
    }
}

let jane1 = { first: 'jane', last: 'Doe' };

jane1[Symbol.iterator] = objectEntries1;

for (let [key, value] of jane1) {
    console.log(`${key}: ${value}`);
}

/**
 * 除了for...of循环外,扩展运算符(...), 解构赋值和Array.from方法内部调用的,都是遍历器接口
 * 这意味着,他们都可以将Generator函数范湖你的Iterator对象,作为参数
 */

function* numbers () {
    yield 1;
    yield 2;
    return 3;
}

// 扩展运算符
[...numbers()];

// Array.from方法
Array.from(numbers);

// 解构赋值
let [x, y] = numbers();

// for...of循环
for (let n of numbers) {
    console.log(n);
}
