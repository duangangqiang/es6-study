/**
 * Generator与状态机:
 *      Generator是实现状态机的最佳结构
 */
var ticking = true;
var clock = function () {
    if (ticking) {
        console.log('Tick');
    } else {
        console.log('Tock!');
    }

    ticking = !ticking;
}

// 如果使用Generator实现,与ES5实现对比,可以看到少了用来保存状态的外部变量ticking,这样就更简洁
// 更安全(状态不会被非法篡改),更符合函数式编程的思想,在写法上也更加优雅,Generator之所以可以不用
// 外部变量保存状态,是因为它本身就包含了一个状态信息,即目前是否处于暂停状态
var clock1 = function* () {
    while (true) {
        console.log('Tick!');
        yield;
        console.log('Tock!');
        yield;
    }
};

/**
 * Generator与协程:
 *      协程是一种程序运行的方式,可以理解为"协作的线程"或"协作的函数". 协程既可以用单线程实现,
 *  也可以使用多线程实现.前者是一种特殊的子例程,后者是一种特殊的线程
 */
