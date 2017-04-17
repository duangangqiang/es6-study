/**
 * Generator函数的this:
 *      Generator函数总是返回一个遍历器,ES6规定这个遍历器是Generator函数的实例,也继承了Generator
 *  函数的prototype对象上的方法
 */
function* g() {}

g.prototype.hello = function () {
    return 'hi!';
};

let obj = g();

obj instanceof g // true
obj.hello(); // 'hi!'

/**
 * 如果把g当做普通的构造函数,并不会生效,因为g返回的总是遍历器对象,而不是this对象
 */
function* g1() {
    this.a = 11;
}

let obj1 = g1();
obj.a; // undefined

/**
 * Generator函数也不能跟new命令一起用,会报错
 */
function* F() {
    yield this.x = 2;
    yield this.y = 3;
}

new F(); // TypeError

/**
 * 让Generator函数返回一个正常对象实例,即可以用next方法,也可以获取正常的this
 */
function* F1() {
    this.a = 1;

    yield this.b = 2;
    yield this.c = 3;
}

var obj2 = {};
var f1 = F1.call(obj);

f1.next(); // value = 2
f1.next(); // value = 3
f1.next(); // value = undefined

obj.a; // 1
obj.b; // 2
obj.c; // 3
