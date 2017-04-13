// 调用Iterator接口的场合:

/**
 * 解构赋值: 对数组和Set结构进行解构赋值时,会默认调用Symbol.iterator方法
 */
let set = new Set().add('a').add('b').add('c');

let [x, y] = set; // x = 'a', y='b'

let [first, ...rest] = set; // first = 'a', rest = ['b', 'c'];


/**
 * 扩展运算符: 可以将任何部署了Iterator接口的数据结构,转为数组.
 * 也就是说,只要某个数据结构部署了Iterator接口,就可以对它使用扩展运算符,将其转为数组
 */
var str = 'hello';
[...str];

var arr = ['b', 'c'];
['a', ...arr, 'd'];


