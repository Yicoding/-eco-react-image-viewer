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

export const isPc = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent,
);
