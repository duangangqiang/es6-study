/**
 * Generator函数返回的遍历器对象,还有个return方法,可以返回给定的值,并且终结遍历Generator函数
 *
 * 遍历器对象g1调用return方法后,返回值的value属性就是return方法的参数foo.
 * 并且, Generator函数的遍历就终止了,返回值的done属性为true,以后再调用next方法,done属性总是返回true
 * 如果return方法调用的时候, 不提供参数,则返回值的value属性为undefined
 */
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}

var g1 = gen();

g1.next(); // { value: 1, done: false }
g1.return('foo'); // { value: 'foo', done: true }
g1.next(); // { value: undefined, done: true }


/**
 * 如果Generator函数内部有try...finally代码块,那么return方法会推迟到finally代码块执行完成再执行
 */
function* numbers() {
    yield 1;
    try {
        yield 2;
        yield 3;
    } finally {
        yield 4;
        yield 5;
    }
    yield 6;
}

var g2 = numbers();

g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
