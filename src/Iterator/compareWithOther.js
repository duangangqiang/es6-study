/**
 * 与其他遍历语法的比较
 */

// for
var arr = [1, 2, 3];
for (var index = 0; index < arr.length; index++) {
    console.log(arr[index]);
}

// forEach, 无法中途跳出forEach循环,break命令或return命令都不能奏效
arr.forEach(function (value) {
    console.log(value);
});

/**
 * for...in循环可以遍历数组的键名
 *
 * 缺点:
 *      1.数组的键名是数字,但是for...in循环是以字符串作为键名'0', '1', '2'
 *      2.for...in循环不仅遍历数字键名,还会遍历手动添加的其他键,甚至包括原型链上的键
 *      3.某些情况下, for...in循环会以任意顺序遍历键名
 *
 * 总结:
 *      for...in循环主要是为遍历对象而设计的,不适用于遍历数组
 */
for (var i in arr) {
    console.log(arr[i]);
}


/**
 * for...of循环相比以上几种做法,有很多优点
 *
 * 优点:
 *      1.有着同for...in一样的简洁语法,但是没有for...in的缺点
 *      2.不同于forEach,它可以与break, continue和return配合使用
 *      3.提供了遍历所有数据结构的统一操作接口
 */

for (let n of arr) {
    if (n > 2)
        break;
    console.log(n);
}

