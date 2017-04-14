/**
 * Generator函数时ES6提供的一种异步编程解决方案,语法行为与传统函数完全不同,
 *
 * Generator函数有多种理解角度,从语法上,首先可以把它理解成,Generator函数
 *      函数时一个状态机,封装了很多内部状态
 *
 * 执行Genetator函数会返回一个遍历器对象,也就是说,Generator函数处理状态机,
 *      还是一个遍历器对象生成函数.返回的遍历器对象,可以依次遍历Generator函数内部的每一个状态
 *
 * 形式上,Generator函数时一个普通函数,但是有两个特征:
 *      1.function关键字与函数名之间有个星号
 *      2.函数体内部使用yield语句,定义不同的内部状态
 */
function* helloWorldGenerator () {
    yield 'hello';
    yield 'world';
    return 'ending';
}

/**
 * helloWorldGenerator 内部有两个yield语句"hello", "world",即该函数有三个状态: hello, world 和
 *      return语句(执行结束)
 *
 * 使用双括号调用generator函数之后,该函数并不执行,返回的也不是函数运行结果
 *      而是一个指向内部状态的指针对象,也就是一个遍历器对象
 */
var hw = helloWorldGenerator();

/**
 * 必须调用遍历器的next方法,使得指针移向下一个状态.也就是说,每次调用next方法,内部指针就从函数头部
 *      或者上一次停下来的地方执行,直到遇到下一个yield语句(或return语句)为止.
 * 换言之,Generator函数时分段执行的,yield语句是暂停执行的标记,而next方法可以恢复执行
 */

// Generator函数开始执行,直到遇到第一个yield语句为止. next方法返回一个对象
hw.next() // { value: 'hello', done: false }

// Generator从上次yield语句停下的地方开始执行,直到遇到第一个yield语句为止. next方法返回一个对象
hw.next() // { value: 'world', done: false }

// Generator函数从上次yield语句停下的地方,一直执行到return语句(如果没有return语句,就执行到函数结束)
hw.next() // { value: 'ending', done: true }

// Generator函数已经运行完毕,next方法返回对象的value为undefined,done为true,以后调用next,也是返回这个值
hw.next() // { value: undefined, done: true }



/**
 * yield语句: 由于Generator函数返回的遍历器对象,只有调用next方法才会遍历下一个内部状态,所以其实提供了一种可以
 *      展厅执行的函数,yield语句就是暂停标志
 *
 * 遍历器对象的next方法的运行逻辑如下:
 *      1.遇到yield语句,就暂停执行后面的操作,并将跟在yield后面的哪个表达式的值,作为返回对象的value属性值
 *      2.下一次调用next方法时, 再继续往下执行,直到遇到下一个yield语句
 *      3.如果没有再遇到新的yield语句,就一直运行到函数结束,知道return语句为止,并将return语句后面的表达式的值
 *          作为返回对象的value属性值
 *      4.如果该函数没有return语句,则返回的对象的value属性值为undefined
 *
 * 注意: yield语句后面的表达式,只有当调用next方法,内部指针指向该语句时才会执行
 *          因此等于为javascript提供了手动的"惰性求值"的语法功能
 */
function* gen() {
    yield 123 + 345;
}

/**
 * yield语句与return语句既有相似之处,也有区别.
 *
 * 相似之处在于,都能返回紧跟在语句后面的哪个表达式的值.区别在于每次遇到yield,函数暂停执行,下一次再从该位置继续
 *      向后执行,而return语句不具备位置记忆功能,
 *
 * 一个函数里面,只能执行一次return语句,但是可以执行多次yield语句.
 *
 * 正常函数只能返回一个值,因为只能执行一次return. Generator函数可以返回一系列的值,
 *      这就是它名称的由来
 */

// Generator函数可以不用yield语句,这时后就变成了一个单纯的暂缓执行函数
function* f() {
    console.log('执行了');
}

var generator = f();

setTimeout(() => {
    generator.next();
});


// yield语句只能在Generator函数里面,用在其他地方都会报错
(function () {
    yield 1; // SyntaxError: Unexpected number
});

/**
 * 下面代码也会产生语法错误,因为forEach方法的参数是一个普通函数,但是在里面使用了yield语句,
 * (这个函数里面还使用了yield* 语句). 一种修改方法是将方法改成for循环
 */
// 修改前
var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
    a.forEach(function (item) {
        if (typeof item !== 'number') {
            yield* flat(item);
        } else {
            yield item;
        }
    });
};

for (var item of flat(arr)) {
    console.log(item);
}

// 修改后
var flat = function* (a) {
    for (var i1 =0; i1 < a.length; i1++) {
        if (typeof a[i1] !== 'number') {
            yield* flat(a[i1]);
        } else {
            yield a[i1];
        }
    }
};

/**
 * yield语句如果在一个表达式之中,必须放在圆括号里面
 */
function* demo () {
    // console.log('Hello' + yield); // 语法错误
    // console.log('Hello' + yield 123); // 语法错误

    console.log('Hello' + (yield));
    console.log('Hello' + (yield 123));
}


/**
 * 于Iterator接口的关系
 *
 * 由于Generator函数就是遍历器生成函数,因此可以吧Generator赋值给对象的Symbol.iterator
 *      属性,从而使得该对象具有Iterator接口
 */
var myIterable = {};
myIterable[Symbol.iterator] = function* (){
    yield 1;
    yield 2;
    yield 3;
};

[...myIterable];

/**
 * Generator函数执行后,返回一个遍历器对象.该对象本身也具有Symbol.iterator属性,执行后返回自身
 */
function* gen () {

}

var g1 = gen();

g[Symbol.iterator]() === g;
