// 使用Proxy实现观察者模式

/**
 * 观察者模式指的是函数自动观察数据对象,一旦对象有变化,函数就会自动执行
 */

// 定义一个将所有观察者函数都放进去的Set
const queueObservers = new Set();

// 添加观察函数
const observe = fn => queueObservers.add(fn);

// 返回代理对象
const observable = obj => new Proxy(obj, { set });

function set (target, key, value, receiver) {

    // 执行默认行为
    const result = Reflect.set(target, key, value, receiver);

    // 执行观察者方法
    queueObservers.forEach(observer => observer());

    return result;
}

// 实际得到代理对象
const person = observable({
    name: 'duan',
    age: 20
});

function print () {
    console.log(`${person.name}, ${person.age}`);
}

// 添加观察函数
observe(print);

person.name = 'gang';
