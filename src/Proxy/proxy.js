// Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种
// “元编程”，即对编程语言进行编程。
var obj = new Proxy({}, {
    get: function (target, key, receiver) {
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    },
    set: function (target, key, value, receiver) {
        console.log(`setting ${key}!`);
        return Reflect.set(target, key, value, receiver);
    }
});

obj.count = 1;

++obj.count;

// 上面代码说明，Proxy实际上重载了点运算符，即用自己的定义覆盖了语言上的原始定义

// ES6 原生提供Proxy构造函数，用来生成Proxy实例, handler为空就代表不做任何操作，
// 但是生成的proxy实例依然不是原目标对象
var target = {},
    handler = {};
var proxy = new Proxy(target, handler);

// 拦截读取属性的例子
var proxy1 = new Proxy({}, {
    get: function (target, property) {
        return 35;
    }
});

// 要使得Proxy起作用，必须针对Proxy实例进行操作，而不是针对目标对象进行操作。
proxy1.time;
proxy1.name;
proxy1.title;

// 一个技巧是将Proxy对象，设置到object.proxy属性，从而可以在object对象上调用。
var object = { proxy: new Proxy(target, handler) };

// Proxy实例也可以作为其他对象的原型对象
var proxy2 = new Proxy({}, {
    get: function (target, property) {
        return 35;
    }
});

// Object.create 创建一个新对象，新的对象的原型对象指向proxy2对象。
let obj1 = Object.create(proxy2);
obj1.time; // 35;

// 同一个拦截器函数，可以设置拦截多个操作
var handler1 = {
    get: function (target, name) {
        if (name === 'prototype') {
            return Object.prototype;
        }
        return `Hello, ${name}`;
    },

    apply: function (target, thisBinding, args) {
        return args[0];
    },

    construct: function (target, args) {
        return { value: args[1] };
    }
};

var fproxy = new Proxy(function (x, y) {
    return x + y;
}, handler1);

fproxy(1, 2); // 调用到apply 1
new fproxy(1, 2); // 调用到construct { value: 2 }
fproxy.prototype === Object.prototype; // true
fproxy.foo; // 调用到get "Hello, foo"

