/**
 * Promise.prototype.then()
 *
 * Promise实例具有then方法,也就是说,then方法是定义在原型对象Promise.prototype上的.
 * 作用是为Promise实例添加状态改变时的回调函数.then方法的第一个参数是resolved状态的回调函数,
 * 第二个参数(可选)是Rejected状态的回调函数
 */

// then方法返回的是一个新的Promise实例(注意,不是原来那个Promise实例).因此可以采用链式写法,即
// then方法后面再调用另一个then方法

const getJSON = function (url) {
    const promise = new Promise(function (resolve, reject) {
        const client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = function () {
            if (this.readyState !== 4) {
                return;
            }

            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };

        client.responseType = 'json';
        client.setRequestHeader('Accept', 'application/json');
        client.send();
    });

    return promise;
};

getJSON('/posts.json').then(function (json) {
    return json.posts;
}).then(function (posts) {

    // 第一个then的回调函数调用完成之后,会将返回结果作为参数,传入第二个then的回调函数中
    console.log(posts);
});

// 采用链式的then,可以指定一组按照次序调用的回调函数. 这时, 前一个回调函数,有可能返回的还是一个Promise对象
// (即有异步操作), 这时后一个回调函数,就会等待该Promise对象的状态发生变化,才会被调用
getJSON('/post/1.json').then(function(post) {
    return getJSON(post.commentURL);
}).then(function funcA(comments) {
    console.log(`Resolved: ${comments}`);
}, function funcB(err) {
    console.log(`Rejected: ${err}`);
});



/**
 * Promise.prototype.catch()
 *  此方法是.then(null, rejection)的别名,用于指定发生错误时的回调函数
 */

getJSON('/posts.json').then(function (posts) {
    console.log(posts);
}).catch(function (error) {

    // 处理getJSON 和 前一个回调函数运行时发生的错误, 就是前面个then运行时发生的错误也会被捕获
    console.log('Error: ', error);
});


// 处理前面的错误的例子
var promise1 = new Promise(function (resolve, reject) {
    throw new Error('test');
});

promise1.catch(function (error) {
    console.log(error);
});

// 等价于
var promise2 = new Promise(function(resolve, reject) {
    try {
        throw new Error('test2');
    } catch (e) {
        reject(e);
    }
});

promise2.catch(function (error) {
    console.log(error);
});

// 等价于
var promise3 = new Promise(function (resolve, reject) {
    reject(new Error('test3'));
});

promise3.catch(function (error) {
    console.log(error);
});

/**
 * 如果Promise状态已经变成Resolved,再抛出错误是无效的
 */
var promise4 = new Promise(function (resolve, reject) {
    resolve('ok');
    throw new Error('test4');
});

promise4
    .then(function (value) { console.log(value) })
    .catch(function (error) { console.log(error) });

/**
 * Promise对象的错误具有"冒泡"性质,会一直向后传递,知道被捕获为止.也就是说,
 * 错误总是会被下一个catch语句捕获, 一般来说不要在then方法里面定义reject
 * 状态的回调函数,总是使用catch方法
 */

// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });

// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });

/**
 * 跟传统的try/catch代码块不同的是,如果没有使用catch方法制定错误处理的回调函数
 * Promise对象抛出的错误不会传递到外层代码, 即不会有任何反应
 */
var someAsyncThing = function () {
    return new Promise(function (resolve, reject) {

        // 下面一行肯定报错
        resolve(x + 2);
    });
};

// 谷歌会报错, 其他没有反应
someAsyncThing().then(function() {
    console.log('success')
});


// Promise中制定在下一轮"事件循环"再抛出错误,结果由于没有使用try/catch,就会冒泡到最外层
var promise6 = new Promise(function(resolve, reject) {
    resolve('ok');
    setTimeout(function() { throw new Error('test') }, 0)
});
promise6.then(function(value) { console.log(value) });
