/**
 * Reflect对象一共有13个静态方法。
 * Reflect.apply(target,thisArg,args)
 * Reflect.construct(target,args)
 * Reflect.get(target,name,receiver)
 * Reflect.set(target,name,value,receiver)
 * Reflect.defineProperty(target,name,desc)
 * Reflect.deleteProperty(target,name)
 * Reflect.has(target,name)
 * Reflect.ownKeys(target)
 * Reflect.isExtensible(target)
 * Reflect.preventExtensions(target)
 * Reflect.getOwnPropertyDescriptor(target, name)
 * Reflect.getPrototypeOf(target)
 * Reflect.setPrototypeOf(target, prototype)
 * 上面这些方法的作用，大部分与Object对象的同名方法的作用都是相同的，
 * 而且它与Proxy对象的方法是一一对应的。下面是对它们的解释。
 */

// 1. Reflect.get(target, name, receiver), 如果读取属性部署了读取函数,则读取函数的this绑定receiver
var object = {
    foo: 1,
    bar: 2,
    get baz() {
        return this.foo + this.bar;
    }
};

var receiverObject = {
    foo: 4,
    bar: 4
};

Reflect.get(object, 'baz', receiverObject); // 8

// 如果第一个参数不是对象,Reflect.get方法会报错
Reflect.get(1, 'foo'); // 报错


// 2.Reflect.set(target, name, value, receiver): 如果属性设置了set赋值函数,则赋值函数的this绑定receiver
var myObject = {
    foo: 4,
    set bar(value) {
        return this.foo = value;
    }
};

var myReceiverObject = {
    foo: 0
};

Reflect.set(myObject, 'bar', 1, myReceiverObject);

myObject.foo; // 4
myReceiverObject.foo; // 1

// Reflect.set会触发Proxy.defineProperty拦截
let p = {
    a: 'a'
};

let handler = {
    set (target, key, value, receiver) {
        console.log('set');
        Reflect.set(target, key, value, receiver);
    },

    defineProperty (target, key, attribute) {
        console.log('defineProperty');
        Reflect.defineProperty(target, key, attribute);
    }
};

let obj = new Proxy(p, handler);

obj.a = 'A';

// set
// defineProperty


