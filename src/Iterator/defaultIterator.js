/**
 * ES6规定,默认的Iterator街扩部署在数据结构的Symbol.iterator属性,或者说,一个数据结构只要有Symbol.iterator属性,
 *      就可以认为是"可遍历的(iterable)".Symbol.iterator属性本身是一个函数,就是当前数据结构默认的遍历器生成函数
 *      执行这个函数,就会返回一个遍历器.
 */
const obj = {
    [Symbol.iterator]: function () {
        return {
            next: function () {
                return {
                    value: 1,
                    done: false
                };
            },
        };
    }
};

/**
 * ES6中,有三类数据结构原生具备Iterator接口: 数组, 某些类似数组的对象, Set和Map结构
 */
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next();
iter.next();
iter.next();

/**
 * 对象之所以没有默认部署Iterator接口,是因为对象的哪个属性先遍历,哪个属性后遍历是不确定的,
 *      需要开发者手动制定.
 *
 * 本质上,遍历器是一种现行处理,对于任何非线性数据结构,部署遍历器接口,就等于部署一种线性转换.
 *
 * 严格的说,对象部署遍历器接口并不是很必要, 因为这时对象实际上被当做Map结构使用,ES6已经有Map
 */
class RangeIterator {
    constructor (start, stop) {
        this.value = start;
        this.stop = stop;
    }

    [Symbol.iterator]() {
        return this;
    }

    next() {
        var value = this.value;

        if (value < this.stop) {
            this.value ++;
            return { done: false, value: value };
        }

        return { done: true, value: undefined };
    }
}

function range(start, stop) {
    return new RangeIterator(start, stop);
}

for (let val of range(0, 3)) {
    console.log(val);
}


// 通过遍历器实现指针结果的例子
class Obj {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

Obj.prototype[Symbol.iterator] = function () {
    let current = this;
    return {
        next () {
            if (current) {
                let value = current.value;

                current = current.next;

                return { done: false, value: value };
            } else {
                return { done: true };
            }
        }
    };
};

let one = new Obj(1);
let two = new Obj(2);
let three = new Obj(3);

one.next = two;
two.next = three;

for (let i of one){
    console.log(i);
}

// 为对象添加Iterator接口的例子
let obj1 = {
    data: ['hello', 'world'],
    [Symbol.iterator]() {
        const self = this;
        let index = 0;

        return {
            next () {
                if (index < self.data.length) {
                    return {
                        value: self.data[index++],
                        done: false
                    };
                } else {
                    return {
                        value: undefined,
                        done: true
                    }
                }
            }
        }
    }
}


/**
 * 对于类似数组的对象(存在数值键名和Length属性),部署Iterator接口,有一个简单的方法,就是Symbol.iterator方法直接引用数组的Iterator接口
 *
 */

NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];

[...document.querySelectorAll('div')] // 可以执行了

// 直接部署
let iterable = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
};

for (let item of iterable) {
    console.log(item);
}
