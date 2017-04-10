// Proxy可以设置拦截操作，对于可以设置，但是没有设置拦截的操作，则直接落在目标对象上，按照原来的方式产生结果

// 1.get(target, propKey, receiver)：拦截对象属性的读取，最后一个参数receiver是一个对象，可选。

// 设置属性读取空抛出错误
var person1 = {
    name: '张三'
};

var proxy1 = new Proxy(person1, {
    get: function (target, property) {
        if (property in target) {
            return target[property];
        } else {
            throw new ReferenceError(`Property "${property}" does not exist!`);
        }
    }
});

proxy1.name; // 张三
proxy1.age; //抛出错误


// 将在对象的原型上设置代理
let proto1 = new Proxy({}, {
    get (target, propertyKey, receiver) {
        console.log(`GET: ${propertyKey}`);
        return target[propertyKey];
    }
});

let obj1 = Object.create(proto1);
obj1.xxx; // get "xxx"


// 使用get拦截,实现数组读取负数的索引
function createArray(...elements) {
    let handler = {
        get (target, propKey, receiver) {
            let index = Number(propKey);
            if (index < 0) {
                propKey = String(target.length + index);
            }
            return Reflect.get(target, propKey, receiver);
        }
    }

    let target = [];

    target.push(...elements);

    return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
arr[-1];


// 利用Proxy,可以将读取属性的操作(get),转变为执行某个函数,从而实现属性的链式操作

// 立即执行函数执行完成pipe就是一个函数,其实不使用立即执行函数也可以
var pipe = (function () {

    // 直接使用pipe(3)调用之后就得到了proxy对象, value就是传递进来的3
    return function (value) {

        // 声明一个数组来装链式调用的函数
        var funcStack = [];
        var oproxy = new Proxy({}, {

            // 拦截数据读取操作
            get: function (pipeObject, fnName) {

                // 如果是调用了get,就使用reduce方法执行funcStack中的函数
                if (fnName === 'get') {
                    return funcStack.reduce(function (val, fn) {
                        return fn(val);
                    }, value);
                }

                // 如果没有调用get, 就将window中的属性添加进来,所以下面的函数必须是使用var声明的,不然就读取不到
                funcStack.push(window[fnName]);

                // 返回oproxy可以使得对象可以链式读取属性
                return oproxy;
            }
        });

        // 直接返回当前创建的代理器
        return oproxy;
    };
}());

var double = n => n * 2;
var pow = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get;


// 利用get拦截,实现一个生成各种DOM节点的通用函数dom
const dom = new Proxy({}, {
    get (target, property) {
        return function (attrs = {}, ...children) {
            const el = document.createElement(property);

            for (let prop of Object.keys(attrs)) {
                el.setAttribute(prop, attrs[prop]);
            }

            for (let child of children) {
                if (typeof child === 'string') {
                    child = document.createTextNode(child);
                }
                el.appendChild(child);
            }

            return el;
        }
    }
});

const el = dom.div({},
    'Hello, my name is ',
    dom.a({ href: 'example.com' }, 'Mark'),
    '. I like: ',
    dom.ul({},
        dom.li({}, 'The web'),
        dom.li({}, 'Food'),
        dom.li({}, '...actually that\'s it')
    )
);

// 如果一个属性不可配置(configurable)和不可写(writable),则该属性不能被代理,通过Proxy对象访问该属性会报错
const target = Object.defineProperties({}, {
    foo: {
        value: 123,
        writable: false,
        configurable: false
    },
});

const handler = {
    get (target, propKey) {
        return 'abc';
    }
};

const proxy11 = new Proxy(target, handler);

proxy11.foo;

// 2.set(target, propKey, value, receiver)：拦截对象属性的设置

// 使用set代理来保证人的岁数是合法的
let validator = {
    set (obj, prop, value) {
        if (prop === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError('The age is not a integer');
            }

            if (value > 200) {
                throw new RangeError('The age seems invalid');
            }
        }

        // 对age以外的属性,直接保存
        obj[prop] = value;
    }
}

let person = new Proxy({}, validator);

person.age = 100;

person.age;
person.age = 'young';
person.age = 300;

// 利用set代理,放置内部属性在外部被修改
var handler2 = {
    get (target, key) {
        invariant(key, 'get');
        return target[key];
    },

    set (target, key, value) {
        invariant(key, 'set');
        target[key] = value;
        return true;
    }
};

function invariant (key, action) {
    if (key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${key}" property`);
    }
}

var target2 = {};
var proxy2 = new Proxy(target2, handler2);

proxy2._prop; // 报错

// 3.has(target, propKey)：拦截proyKey in proxy的操作，返回布尔值

//隐藏内部属性,不被in运算符发现
var  handler3 = {
    has (target, key) {
        if (key[0] === '_') {
            return false;
        }
        return key in target;
    }
};

var target3 = { _prop: 'foo', prop: 'too' };
var proxy3 = new Proxy(target3, handler3);
'_prop' in proxy3; // false

// 如果原对象不可配置或者禁止扩展,这是has拦截会报错,
// 如果某个属性不可配置(或者目标对象不可扩展),则has方法就不得"隐藏"(即返回false)目标对象的该属性
// 注意: has方法拦截的是HasProperty操作,而不是HasOwnProperty操作,即has方法不判断一个属性是对象自身的属性,还是继承的属性
var obj3 = { a: 10 };
Object.preventExtensions(obj3);

var proxy33 = new Proxy(obj3, {
    has (target, prop) {
        return false;
    }
});

'a' in proxy33; // TypeError


// 注意: 虽然for ... in循环也用到了in 运算符,但是has拦截对for...in循环不生效



// 4.deleteProperty(target, propKey)：拦截delete proxy[propKey]

// 如果方法抛出错误或者返回false,则当前属性就无法被delete命令删除,目标对象自身的不可配置属性,不能被deleteProperty犯法删除,否则报错
var handler4 = {
    deleteProperty (target, key) {
        invariant4(key, 'delete');
        return true;
    }
}

function invariant4 (key , action) {
    if (key[0] === '_') {
        throw new Error('Invalid Action');
    }
}

var target4 = { _prop: 'foo' };
var proxy4 = new Proxy(target4, handler4);
delete proxy4._prop;

// 5.ownKeys(target)：拦截Object.getOwnPropertyNames(proxy), Object.getOwnPropertySymbols(proxy), Object.keys(proxy)
// 返回一个数组。该方法返回目标对象所有自身的属性的属性名。而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。

// 拦截Object.keys的例子
let target5 = {
    a: 1,
    b: 2,
    c: 3
};

let handler5 = {
    ownKeys (target) {
        return ['a'];
    }
};

let proxy5 = new Proxy(target5, handler5);

Object.keys(proxy5);

// 拦截第一个字符为下划线的属性名
let target55 = {
    _bar: 'foo',
    _prop: 'bar',
    prop: 'baz'
};

let handler55 = {
    ownKeys (target) {
        return Reflect.ownKeys(target).filter(key => key[0] !== '_');
    }
};

let proxy55 = new Proxy(target55, handler55);

for (let key of Object.keys(proxy55)) {
    console.log(target55[key]);
}

// 注意: 使用Object.keys方法时,有三类属性会被ownKeys方法自动过滤,不会返回
    /**
     * 1.目标对象上不存在的属性;
     * 2.属性名为Symbol值
     * 3.不可遍历的属性
     */
let target555 = {
    a: 1,
    b: 2,
    c: 3,
    [Symbol.for('secret')]: '4'
};

Object.defineProperty(target555, 'key', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: 'static'
});

let handler555 = {
    ownKeys (target) {
        return ['a', 'd', Symbol.for('secret'), 'key'];
    }
}

let proxy555 = new Proxy(target555, handler555);

Object.keys(proxy555);


// 6.getOwnPropertyDescriptor(terget, propKey):拦截Object.getOwnPropertyDescriptor(proxy, propKey),返回属性的描述对象.

// 访问对象内部属性返回undefined
var handler6 = {
    getOwnPropertyDescriptor (target, key) {
        if (key[0] === '_') {
            return;
        }
        return Object.getOwnPropertyDescriptor(target, key);
    }
};

var target6 = { _foo: 'bar', baz: 'tar' };
var proxy6 = new Proxy(target6, handler6);

Object.getOwnPropertyDescriptor(proxy6, 'wat'); // undefined 真没有
Object.getOwnPropertyDescriptor(proxy6, '_foo'); // undefined 拦截住
Object.getOwnPropertyDescriptor(proxy6, 'baz'); // 正常返回

// 7.defineProperty(target, propKey, propDesc): 拦截Object.defineProperty和Object.defineProperties
// 注意，如果目标对象不可扩展（extensible），则defineProperty不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（writable）或不可配置（configurable），则defineProperty方法不得改变这两个设置。
var handler7 = {
    defineProperty (target, key, descriptor) {
        return false;
    }
};

var target7 = {};
var proxy7 = new Proxy(target7, handler7);
proxy7.bar = 'bar'; // 不会报错,但是赋值也不会成功

// 8.preventExtensions(target): 拦截Object.preventExtensions(proxy) 使对象变得不可扩展

// 9.getPrototypeOf(target):获取目标的原型,具体来说,拦截以下操作:
    /**
     * Object.prototype.__proto__ 就是直接调用{}.__proto__
     * Object.prototype.isPrototypeOf()
     * Object.getPrototypeOf()
     * Reflect.getPrototypeOf()
     * instanceof
     */
var proto9 = {};
var proxy9 = new Proxy({}, {
    getPrototypeOf (target) {
        return proto9;
    }
});

Object.getPrototypeOf(proxy9) === proto9;

// 10.isExtensible(target): 目标是否可以被继承

// 设置isExtensible方法,在调用Object.isExtensible时会输出called
var proxy10 = new Proxy({}, {

    // 方法只能返回布尔值,否则返回值会被自动转为布尔值
    isExtensible (target) {
        console.log('isExtensible Called');
        return true;
    }
});

Object.isExtensible(proxy10);

// 这个方法有个强显示,它的返回值必须是与目标对象的isExtensible属性保持一致,否则就会报错
var proxy1010 = new Proxy({}, {
    isExtensible (target) {
        return false;
    }
});

Object.isExtensible(proxy1010); // 报错

// 11.setPrototypeOf(target, proto): 设置目标原型

// 如果目标对象是函数,那么嗨有两种额外操作可以拦截:
// 12.apply(target, object, args): 拦截Proxy实际作为函数调用的操作.比如proxy(...args),proxy.call(object, ...args), proxy.apply(...);

// 例子1
var target12 = function () {
    return 'I am the target';
}

var handler12 = {
    apply: function () {
        return 'I am the proxy';
    }
}

var p = new Proxy(target12, handler12);

p();

// 例子2
var twice = {
    apply (target, ctx, args) {

        // 调用原来的sum,然后在结果上乘以2
        return Reflect.apply(...arguments) * 2;
    }
}

function sum (left, right) {
    return left + right;
}

var proxy1212 = new Proxy(sum, twice);
proxy1212(1, 2); // 6
proxy1212.call(null, 5, 6); // 22
proxy1212.apply(null, [7, 8]); // 30

// 直接调用Reflect.apply也会被拦截
Reflect.apply(proxy1212, null, [9, 10]); // 38


// 13.construct(target, args): 拦截Proxy实例作为构造函数调用的操作, 比如new proxy(...args)

// construct方法必须返回一个对象,否则会报错
var proxy13 = new Proxy(function () {}, {
    construct (target, args) {
        console.log('called: ' + args.join(', '));
        return {
            value: args[0] * 10
        }
    }
})
