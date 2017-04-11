// this 问题

// 虽然Proxy可以代理针对目标对象的访问, 但它不是目标对象的透明代理,即不做任何拦截的情况下,
// 也无法保证与目标对象的行为一致. 主要原因就是在Proxy代理的情况下,目标对象内部的this指针会
// 指向Proxy代理
const target = {
    m () {
        console.log(this === proxy);
    }
};

const handler = {};

const proxy = new Proxy(target, handler);

target.m(); // false
proxy.m(); // true



// 由于this指向的变化,导致Proxy无法代理目标对象.
const _name = new WeekMap();

class Person {
    constructor (name) {
        _name.set(this, name);
    }

    get name () {
        return _name.get(this);
    }
}

const jane = new Person('Jane');
jane.name; // 'Jane'

const proxy1 = new Proxy(jane, {});

proxy.name // undefined   使用proxy的this在weekmap中找不到键值对



// 有些原生对象的内部属性,只有通过正确的this才能拿到,所以Proxy无法代理这些原生对象的属性
const target3 = new Date();
const handler3 = {};
const proxy3 = new Proxy(target3, handler3);

proxy3.getDate(); // Uncaught TypeError: this is not a Date object.


// this绑定原始对象,就可以解决这个问题
const target4 = new Date();

const handler4 = {
    get (target, prop) {
        if (prop === 'getDate') {
            return target.getDate.bind(target4);
        }
        return Reflect.get(target, prop);
    }
};

const proxy4 = new Proxy(target4, handler4);

proxy4.getDate();
