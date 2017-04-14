/**
 * Generator.prototype.throw() : Generator函数返回的遍历器对象,都有一个throw方法,可以在函数体外
 *      抛出错误,然后在Generator函数体内捕获
 */
var g1 = function* () {
    try {
        yield;
    } catch (e) {
        console.log('内部捕获', e);
    }
};

var i1 = g1();
i1.next();

/**
 * 遍历器对象连续抛出两个错误, 第一个错误被Generator函数体内的catch语句捕获
 * 第二次抛出错误,由于Generator函数内部的catch语句已经执行过了,不会再捕捉到这个错误,
 * 所以这个错误就被抛出了Generator函数体,被函数体外的catch语句捕获
 */
try {
    i1.throw('a');
    i1.throw('b');
} catch (e) {
    console.log('外部捕获', e);
}

/**
 * throw方法可以接受一个参数,该参数会被catch语句接收,建议抛出Error对象的实例
 */
var g2 = function* () {
    try {
        yield;
    } catch (e) {
        console.log(e);
    }
};

var i2 = g2();
i2.next();
i2.throw(new Error('出错了'));

/**
 * 不要混淆遍历器对象的throw方法和全局的throw命令.只有使用迭代器的throw方法抛出的,才会被Generator内部捕获
 * 使用throw命令抛出的,只能被函数体外的catch语句捕获
 *
 * 如果Generator函数内部没有部署try...catch代码块, 那么throw方法抛出的错误将会被外部try...catch代码块捕获
 */
var g3 = function* () {
    while (true) {
        yield;
        console.log('内部错误', e);
    }
};

var i3 = g3();
i3.next();

try {
    i3.throw('a');
    i3.throw('b');
} catch (e) {
    console.log('外部捕获', e);
}

/**
 * throw方法被捕获以后, 会附带执行下一条yield语句. 也就是说,会附带执行一次next方法
 */
var g4 = function* () {
    try {
        yield console.log('a');
    } catch (e) {
        // ...
    }
    yield console.log('b');
    yield console.log('c');
};

var i4 = g4();
i4.next();
i4.throw();
i4.next();


/**
 * Generator函数体外抛出的错误,可以在函数体内捕获;
 * 反过来,Generator函数体内抛出的错误,也可以被函数体外的catch捕获
 */
