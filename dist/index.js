/**
 * 如果传入的参数是一个空的可迭代对象，则返回一个 已完成（already resolved） 状态的 Promise。
 * 如果传入的参数不包含任何 promise，则返回一个 异步完成 （asynchronously resolved）的 Promise。
 * @param promises
 */
function any(promises) {
    var iteratorSize = 0;
    var selfResolve;
    var selfReject;
    var rejectedReasons = [];
    var anyPromise = new Promise(function (resolve, reject) {
        selfResolve = function (value) {
            console.log(value);
            resolve(value);
        };
        selfReject = function (reason) {
            console.log(reason);
            if (rejectedReasons.length === iteratorSize) {
                reject(rejectedReasons);
            }
            else {
                rejectedReasons.push(reason);
            }
        };
    });
    console.log('he');
    for (var p in promises) {
        if (thenable(p)) {
            iteratorSize += 1;
            p.then(selfResolve, selfReject);
        }
    }
    if (iteratorSize === 0) {
        return Promise.resolve();
    }
    return anyPromise;
}
function thenable(p) {
    return typeof p.then === 'function';
}
any([Promise.resolve(1), Promise.resolve(2)]).then(function (res) { return console.log(res); });
