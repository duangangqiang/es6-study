// Reflect对象与Proxy对象一样,也是ES6位了操作对象而提供的新API,其目的如下:

/** 1. 将Object对象的一些明显属于语言内部的方法(比如: Object.defineProperty), 放到Reflect对象上.
 *      现阶段,某些方法同时在Object和Reflect对象上部署,未来的新方法将只部署在Reflect对象上.也就是说
 *      从Reflect对象上可以拿到语言内部的方法.
 */

/**
 *  2.修改某些Object方法的返回结果,让其变得更加合理. 比如: Object.defineProperty(obj, name. desc)
 *      在无法定义属性时,会抛出一个错误,而Reflect.defineProperty(obj, name, desc) 会返回false.
 */

// 老写法
try {
    Object.defineProperty({}, 'name', {
        configurable: false,
        writable: true,
        value: 'duan'
    });

    // success
} catch (e) {

    // failure
}

// 新写法
if (Reflect.defineProperty({}, 'name', {
    configurable: false,
    writable: true,
    value: 'duan'
})) {
    // success
} else {
    // failure
}

/**
 *  3.让Object操作都变成函数行为. 某些Object操作是命令式的, 比如 name in obj 和 delete obj[name],
 *      而Reflect.has(obj, name) 和 Reflect.deleteProperty(obj, name) 让它们变成了函数行为.
 */

// 老写法
'assign' in Object;

// 新写法
Reflect.has(Object, 'assign');

/**
 * 4.Reflect对象的方法与Proxy对象的方法一一对应,只要Proxy对象的方法,就能在Reflect对象上找到对应的方法.这就让
 *      Proxy对象可以方便地调用对应的Reflect方法,完成默认行为,作为修改行为的基础.也就是说卖不管Proxy怎么修改
 *      默认行为,你总可以在Reflect上获取默认行为
 */

// Proxy方法拦截target对象的属性赋值行为。它采用Reflect.set方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。
var proxy = new Proxy({}, {
    set (target, name, value, receiver) {
        let success = Reflect.set(target, name, value, receiver);

        if (success) {
            log(`Property ${name} on ${target} set to ${value}`);
        }

        return success;
    }
});


// 每一个Proxy对象的拦截操作( get, delete, has ),内部都调用对应的Reflect方法.保证原生行为能够正常执行.
// 添加的工作,就是将每一个操作输出一行日志
var loggedObj = new Proxy(obj, {
    get(target, name) {
        console.log('get', target, name);
        return Reflect.get(target, name);
    },
    deleteProperty(target, name) {
        console.log('delete' + name);
        return Reflect.deleteProperty(target, name);
    },
    has(target, name) {
        console.log('has' + name);
        return Reflect.has(target, name);
    }
});


// 有了Reflect对象之后,很多操作会更容易读

// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1

// 新写法
Reflect.apply(Math.floor, undefined, [1.75]); // 1
