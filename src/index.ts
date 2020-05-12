/**
 * 如果传入的参数是一个空的可迭代对象，则返回一个 已完成（already resolved） 状态的 Promise。
 * 如果传入的参数不包含任何 promise，则返回一个 异步完成 （asynchronously resolved）的 Promise。
 * @param promises
 */
function any<T>(
  promises: (T | PromiseLike<T>)[] | Iterable<T | PromiseLike<T>>
): Promise<T | void> {
  let promiseSize: number = 0;
  let selfResolve: (value: T) => void;
  let selfReject: (reason: unknown) => void;
  let rejectedReasons: Array<unknown> = [];

  let anyPromise: Promise<T> = new Promise((resolve, reject) => {
    selfResolve = (value: T) => {
      resolve(value);
    };
    selfReject = (reason: unknown) => {
      if (rejectedReasons.length === promiseSize) {
        reject(rejectedReasons);
      } else {
        rejectedReasons.push(reason);
      }
    };
  });

  for (let p of promises) {
    if (thenable(p)) {
      promiseSize += 1;
      p.then(selfResolve, selfReject);
    }
  }

  if (promiseSize === 0) {
    return Promise.resolve();
  }

  return anyPromise;
}

function thenable(p: any): p is Promise<unknown> {
  return typeof p.then === 'function';
}
