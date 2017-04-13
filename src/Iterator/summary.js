/**
 * Iterator的概念: JavaScript原有的表示集合的数据结构,主要是数组和对象,ES6又增加了Map和Set.这样就有了四种数据集合,用户还可以组合使用它们
 *  定义自己的数据结构,比如数组的成员是Map,Map的成员是对象.这样就需要一种统一的接口机制,来处理所有不同的数据结构
 */

/**
 * 遍历器就是这样一种机制: 它是一种接口,为各种不同的数据结构提供统一的访问机制.任何数据结构只要部署Iterator接口,就可以完成遍历操作
 *
 * Iterator的作用有三个:
 *      1.位各种数据结构,提供一个统一的,便捷的访问接口
 *      2.使得数据结构的成员能够按某种次序排列
 *      3.ES6创建一种新的遍历命令for...of循环,Iterator接口主要供for...of消费
 */

/**
 * Iterator遍历过程是这样的:
 *      1.创建一个指针对象,指向当前数据结构的其实位置.也就是说,遍历器对象本质上,就是一个"指针对象"
 *      2.第一次调用指针对象的next方法,可以将指针指向数据结构的第一个成员
 *      3.第二次调用指针对象的next方法,指针就指向数据结构的第二个成员.
 *      4.不断调用指针对象的next方法,知道它指向数据结构的结束位置
 *
 * 每次调用next方法.都会返回数据结构的当前成员信息.具体来说,就是返回一个包含value和done两个属性的对象.
 *      其中,value属性时当前成员的值,done属性时一个布尔值,表示遍历是否结束
 */

function makeIterator (array) {
    var nextIndex = 0;
    return {
        next: function () {
            return nextIndex < array.length ?
                { value: array[nextIndex++] } :
                { done: true }
        }
    }
}

let it = makeIterator(['a', 'b']);

it.next();
it.next();
it.next();

/**
 * 由于Iterator只是把接口加到数据结构之上,所以遍历器与它所遍历的哪个数据机构实际是分开的,完全可以写出没有对应数据结构
 *      的遍历器对象,或者说用遍历器对象模拟出数据结果
 */
function idMaker() {
    let index = 0;

    return {
        next: function () {
            return { value: index++, done: false }
        }
    }
}

let it1 = idMaker();
it.next().value;

/**
 * ES6中,有些数据结构原生具备Iterator接口,即不用任何处理,就可以被for...of循环遍历.
 *      有些就不行(比如对象).原因在于这些数据结构原生部署了Symbol.iterator属性的数据结构
 *      就成为部署了遍历器接口.调用这个接口,就会返回一个遍历器对象.
 */

// 如果使用TypeScript的写法,遍历器接口(Iterable), 指针对象(Iterator)和next方法返回值的规格描述如下:
// interface Iterable {
//     [Symbol.iterator]() : Iterator
// }

// interface Iterator {
//     next(value?: any) : IterationResult
// }

// interface IterationResult {
//     value: any,
//     done: boolean
// }
