'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.isPc = isPc;
exports.noon = void 0;
exports.throttle = throttle;

var noon = function noon() {};

exports.noon = noon;

function throttle(fn, wait) {
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

function isPc() {
  return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}
