export const noon = () => {};

export function throttle(fn: Function, wait: number) {
  var last = 0;
  return function () {
    var args = arguments;
    var now = +new Date();
    if (now - last > wait) {
      // @ts-ignore
      fn.apply(this, args);
      last = now;
    }
  };
}