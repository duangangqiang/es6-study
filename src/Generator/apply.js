// Generator可以暂停函数执行,返回任意表达式的值,这种特点使得Generator有多种引用场景

/**
 *  异步操作的同步化表达:
 *      Generator函数的暂停执行的效果,意味着可以把异步操作写在yield语句里面,等到调用next方法时再
 *  往后执行.这实际上等同于不需要些回调函数了,因为异步操作的后续操作可以放到yield语句下面,反正要等
 *  等到调用next方法时再执行.所以Generator函数的一个重要意义就是用来处理异步操作,改写回调函数
 */
function showLoadingScreen() {}
function loadUIDataAsync() {}
function hideLoadingScreen() {}

function* loadUI () {
    showLoadingScreen();

    yield loadUIDataAsync();

    hideLoadingScreen();
}

var loader = loadUI();

// 加载UI
loader.next();

// 卸载UI
loader.next();

/**
 * Ajax是典型的异步操作,通过Generator函数部署Ajax操作,可以用同步的方式表达
 */

function* main () {
    var result = yield request('http://some.url');
    var resp = JSON.parse(result);
    console.log(resp.value);
}

function request (url) {
    fetch(url, {}, function(response) {
        it.next(response);
    });
}

var it = main();
it.next();

/**
 * 使用Generator函数逐行读取文本文件
 */
function* numbers() {
    let file = new FileReader('numbers.txt');
    try {
        while(!file.eof) {
            yield parseInt(file.readLine(), 10);
        }
    } finally {
        file.close();
    }
}



/**
 * 控制流管理
 */

// 如果一个多步操作非常耗时,采用回调函数,可能会写成下面这样
var step1 = function (value) {},
    step2 = function (value) {},
    step3 = function (value) {},
    step4 = function (value) {};
step1(function (value1){
    step2(value1, function (value2) {
        step3(value2, function (value3) {
            step4(value3, function (value4) {
                console.log(value4);
            });
        });
    });
});

// 采用Promise改写上面的代码
Promise.resolve(step1)
    .then(step2)
    .then(step3)
    .then(step4)
    .then(function (value4) {
        console.log(value4);
    })
    .catch(function (error) {
        console.log(error);
    })
    .done();

// Generator继续改善
function* longRunningTask(value1) {
    try {
        var value2 = yield step1(value1);
        var value3 = yield step2(value2);
        var value4 = yield step1(value3);
        var value5 = yield step2(value4);
        console.log(value4);
    } catch (e) {
        console.log(e);
    }
}

// 使用一个函数,按次序自动执行所有步骤
function scheduler (task) {
    var taskObj = task.next(task.value);

    // 如果Generator函数未结束,就继续调用
    if (!taskObj.done) {
        task.value = taskObj.value;
        scheduler(task);
    }
}

// 调用
scheduler(longRunningTask(1));


/**
 * 利用for...of循环会自动一次执行yield命令的特性,提供一种更一般的控制流管理的方法
 */
let steps = [step1, step2, step3, step4];

function* iterateSteps(step) {
    for (var i = 0; i < steps.length; i++) {
        var step = steps[i];
        yield step();
    }
}

/**
 * 将任务分解成步骤之后,还可以将项目分解成多个依次执行的任务
 */
let job1 = {
    steps: [function () {}, function (){}]
}
let job2 = {
    steps: [function () {}, function (){}]
}
let job3 = {
    steps: [function () {}, function (){}]
}

let jobs = [job1, job2, job3];

function* iterateJobs(jobs) {
    for (var i = 0; i < jobs.length; i++) {
        var job = jobs[i];

        // 看清楚了  这个是iterateSteps
        yield* iterateSteps(job.steps);
    }
}

//最后可以用for...of循环一次性依次执行所有任务的所有步骤
for (var step of iterateJobs(jobs)) {
    console.log(step.id);
}

// for...of本质是一个while循环,所以上面的代码实际上执行的下面的逻辑
var it = iterateJobs(jobs);
var res = it.next();

while (!res.done) {
    var result = res.value;
    //...
    res = it.next();
}


/**
 * 部署Iterator接口
 */
function* iterEntries(obj) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        yield [key, obj[key]];
    }
}

let myObj = { foo: 3, bar:7 };

for (let [key, value] of iterEntries(myObj)) {
    console.log(key, value);
}


/**
 * 作为数据结构:
 *      Generator可以看做是数据结构,更确切的说,可以看做是一个数组,因为Generator函数可以返回一系列
 *  的值,这意味着它可以一堆任意表达式,提供类似数组的接口
 */
function* doStuff() {
    yield fs.readLine.bind(null, 'hello.txt');
    yield fs.readLine.bind(null, 'world.txt');
    yield fs.readLine.bind(null, 'aaa.txt');
}

for (let task of doStuff()) {
    // task是一个函数,可以像回调函数那样使用它
}

// 实际上,如果用ES5的表达,完全可以用数组模拟Generator的这种用法
function doStuff1 () {
    return [
        fs.readLine.bind(null, 'hello.txt');
        fs.readLine.bind(null, 'world.txt');
        fs.readLine.bind(null, 'aaa.txt');
    ];
}
