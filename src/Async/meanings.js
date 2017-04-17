/**
 * ES 2017标准引入了async函数,使得异步操作变得更加方便
 *  async函数定义: 它就是Generator函数的语法糖
 */
var fs = require('fs');
var readFile = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, function (error, data) {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
};

var gen = function* () {
    var f1 = yield readFile('/abc.txt');
    var f2 = yield readFile('/aaa.txt');
    console.log(f1.toString());
    console.log(f2.toString());
};

// 改写成async函数,就是这样:
var asyncReadFile = async function () {
    var f1 = await readFile('/abc.txt');
    var f2 = await readFile('/aaa.txt');
    console.log(f1.toString());
    console.log(f2.toString());
};

/**
 * 比较上面代码会发现, async函数就是将Generator函数的星号(*)替换成async, 将yield替换成await而已
 *
 * async函数对Generator函数的改进,体现在如下四点:
 *  1.内置执行器:
 *      Generator函数的执行必须靠执行器,所以才有个co模块.而async函数自带执行器.也就是说,async函数的执行,与普通函数一模一样,只要一行
 *          var result = asyncReadFile();
 *  2.更好的语义:
 *      async和await,比起星号和yield,语义更加清楚了.async表示函数里面有异步操作,await表示紧跟在后面的表达式需要等待结果
 *  3.更广的适用性:
 *      co模块约定,yield命令后面只能是Thunk函数或Promise对象,而async函数的await命令后面,可以是Promise对象和原始类型的
 *          值(数值,字符串和布尔值,但是这时等于同步操作)
 *  4.返回值是Promise:
 *      async函数的返回值是Promise对象,这比Generator函数的返回值是Iterator对象方便多了.可以使用then方法指定下一步的操作
 *
 *  更进一步的说,async函数完全可以看做多个异步操作,包装成的一个Promise对象,而await命令就是内部then命令的语法糖
 */
