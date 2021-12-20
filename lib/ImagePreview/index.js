'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'));

var _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'));

var _react = _interopRequireWildcard(require('react'));

var _anyTouch = _interopRequireDefault(require('any-touch'));

var _classnames4 = _interopRequireDefault(require('classnames'));

var _image = _interopRequireDefault(require('./image'));

var _tools = require('../utils/tools');

require('./styles.less');

var prefixCls = 'eco-image-viewer';
var config = {
  x: 0,
  y: 0,
  axis: {
    x: 0,
    y: 0,
  },
  scale: 1,
  doubleScale: 2,
  slide: 1 / 3,
  maxScale: 4,
  minScale: 0.5,
  mobileWidth: 420,
};

var _default = function _default(props) {
  var refRoot = (0, _react.useRef)();
  var refScale = (0, _react.useRef)(config.scale);
  var refTrans = (0, _react.useRef)(config.axis);
  var refStart = (0, _react.useRef)(config.axis);
  var refTimer = (0, _react.useRef)();
  var _props$onClose = props.onClose,
    onClose = _props$onClose === void 0 ? _tools.noon : _props$onClose,
    _props$index = props.index,
    index = _props$index === void 0 ? 0 : _props$index,
    _props$urls = props.urls,
    urls = _props$urls === void 0 ? [] : _props$urls;

  var _useState = (0, _react.useState)(index),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    currentIndex = _useState2[0],
    setCurrentIndex = _useState2[1];

  var _useState3 = (0, _react.useState)(config.axis),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    transInfo = _useState4[0],
    setTransInfo = _useState4[1];

  var _useState5 = (0, _react.useState)(config.scale),
    _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
    scaleRate = _useState6[0],
    setScaleRate = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
    isChange = _useState8[0],
    setIsChange = _useState8[1];

  var _useState9 = (0, _react.useState)(false),
    _useState10 = (0, _slicedToArray2.default)(_useState9, 2),
    isPc = _useState10[0],
    setIsPc = _useState10[1];

  var _useState11 = (0, _react.useState)({
      width: 1,
      height: 1,
    }),
    _useState12 = (0, _slicedToArray2.default)(_useState11, 2),
    innerInfo = _useState12[0],
    setInnerInfo = _useState12[1];

  var ablePrev = currentIndex > 0;
  var ableNext = currentIndex < urls.length - 1; // 防止触摸穿透

  (0, _react.useEffect)(function () {
    document.body.classList.add('fixed-body');
    return function () {
      document.body.classList.remove('fixed-body');
    };
  }, []); // 添加过渡效果

  var dealChange = function dealChange() {
    setIsChange(true);
    setTimeout(function () {
      setIsChange(false);
    }, 200);
  }; // 切换index

  var onChangeCurrentIndex = function onChangeCurrentIndex(i) {
    setCurrentIndex(i);
    dealChange();
  }; // 恢复初始状态

  var onReset = function onReset() {
    refStart.current = config.axis;
    setTransInfo(config.axis);
    refTrans.current = config.axis;
    setScaleRate(config.scale);
    refScale.current = config.scale;
  }; // 监听移动事件

  (0, _react.useEffect)(
    function () {
      onReset();
      var at = new _anyTouch.default(refRoot.current); // 单击事件

      at.on('tap', function (e) {
        // console.log('tap事件', e);
        var target = e.target;

        if (/point|tools/.test(target.className)) {
          return;
        } // 双击事件

        if (refTimer.current) {
          clearTimeout(refTimer.current);
          refTimer.current = null;

          if (refScale.current === config.scale) {
            refScale.current = config.doubleScale;
            return setScaleRate(config.doubleScale);
          }

          return onReset();
        }

        refTimer.current = setTimeout(function () {
          onClose();
        }, 200);
      });
      at.on('swipe', function (e) {
        // console.log('swipe事件', e)
        if (e.direction === 'left' && ableNext) {
          onChangeCurrentIndex(currentIndex + 1);
        }

        if (e.direction === 'right' && ablePrev) {
          onChangeCurrentIndex(currentIndex - 1);
        }
      });
      at.on('panmove', function (e) {
        // console.log('pan事件', e.displacementX);
        var endX = parseInt((refStart.current.x + e.displacementX).toFixed(0)),
          endY = parseInt((refStart.current.y + e.displacementY).toFixed(0));
        var item = {
          x: endX,
          y: endY,
        };
        setTransInfo(item);
        refTrans.current = item;
      });
      at.on('panend', function (e) {
        // console.log('pan事件', e.x);
        var x = e.displacementX,
          y = e.displacementY;

        if (refScale.current !== config.scale) {
          refStart.current = {
            x: refStart.current.x + x,
            y: refStart.current.y + y,
          };
        }

        setTimeout(function () {
          setTransInfo({
            x: refScale.current === config.scale ? 0 : refTrans.current.x,
            y: refScale.current === config.scale ? 0 : refTrans.current.y,
          });
        }, 100);

        if (Math.abs(x) / window.innerWidth > config.slide && refScale.current === config.scale) {
          if (x <= 0 && ableNext) {
            onChangeCurrentIndex(currentIndex + 1);
          } else if (x > 0 && ablePrev) {
            onChangeCurrentIndex(currentIndex - 1);
          }
        }

        if (refScale.current === config.scale) {
          onReset();
        }
      });
      at.on('pinchmove', function (e) {
        console.log('pinch', e.deltaScale);

        if (e.scale > 1) {
          // 放大
          refScale.current = Math.min(
            Math.round(refScale.current * e.deltaScale * 100) / 100,
            config.maxScale,
          );
        } else {
          refScale.current = Math.max(
            Math.round(refScale.current * e.deltaScale * 100) / 100,
            config.minScale,
          );
        }

        setScaleRate(refScale.current);
      });
      return function () {
        at.destroy();
      };
    },
    [currentIndex],
  );

  var onChangeInner = function onChangeInner() {
    setInnerInfo({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  (0, _react.useEffect)(function () {
    onChangeInner();
    setIsPc(window.innerWidth > config.mobileWidth);
    window.addEventListener('resize', function () {
      onChangeInner();
      setIsPc(window.innerWidth > config.mobileWidth);
    });
    return function () {
      window.removeEventListener('resize', function () {});
    };
  }, []);

  var zoomIn = function zoomIn() {
    if (refScale.current < config.maxScale) {
      refScale.current = Math.min(refScale.current * 2, config.maxScale);
      setScaleRate(refScale.current);
    }
  };

  var zoomOut = function zoomOut() {
    if (refScale.current > config.minScale) {
      refScale.current = Math.max(refScale.current * 0.8, config.minScale);
      setScaleRate(refScale.current);
    }
  };

  var zoomReset = function zoomReset() {
    if (refScale.current !== config.scale) {
      onReset();
    }
  };

  var onPrev = function onPrev() {
    if (ablePrev) {
      onChangeCurrentIndex(currentIndex - 1);
    }
  };

  var onNext = function onNext() {
    if (ableNext) {
      onChangeCurrentIndex(currentIndex + 1);
    }
  };

  return /*#__PURE__*/ _react.default.createElement(
    'div',
    {
      className: ''.concat(prefixCls, '-image-root'),
      ref: refRoot,
    },
    urls.map(function (item, i) {
      return /*#__PURE__*/ _react.default.createElement(_image.default, {
        key: i,
        src: item,
        index: currentIndex,
        site: i,
        transInfo: transInfo,
        scaleRate: scaleRate,
        isChange: isChange,
        innerInfo: innerInfo,
      });
    }),
    urls.length > 1 &&
      /*#__PURE__*/ _react.default.createElement(
        'div',
        {
          className: ''.concat(prefixCls, '-point-box'),
        },
        new Array(urls.length).fill(0).map(function (item, i) {
          return /*#__PURE__*/ _react.default.createElement('span', {
            key: i,
            className: (0, _classnames4.default)(
              ''.concat(prefixCls, '-point'),
              (0, _defineProperty2.default)(
                {},
                ''.concat(prefixCls, '-point-on'),
                currentIndex === i,
              ),
            ),
            onMouseDown: function onMouseDown() {
              return onChangeCurrentIndex(i);
            },
            onTouchEnd: function onTouchEnd() {
              return onChangeCurrentIndex(i);
            },
          });
        }),
      ),
    isPc &&
      /*#__PURE__*/ _react.default.createElement(
        _react.default.Fragment,
        null,
        /*#__PURE__*/ _react.default.createElement(
          'div',
          {
            className: ''.concat(prefixCls, '-image-tools'),
          },
          /*#__PURE__*/ _react.default.createElement('span', {
            className: ''.concat(prefixCls, '-tools-btn ').concat(prefixCls, '-tools-reduce'),
            onMouseDown: zoomOut,
            onTouchEnd: zoomOut,
          }),
          /*#__PURE__*/ _react.default.createElement('span', {
            className: ''.concat(prefixCls, '-tools-btn ').concat(prefixCls, '-tools-add'),
            onMouseDown: zoomIn,
            onTouchEnd: zoomIn,
          }),
          /*#__PURE__*/ _react.default.createElement(
            'div',
            {
              className: ''.concat(prefixCls, '-tools-reset'),
              onMouseDown: zoomReset,
              onTouchEnd: zoomReset,
            },
            '\u91CD\u7F6E',
          ),
        ),
        /*#__PURE__*/ _react.default.createElement('div', {
          className: (0, _classnames4.default)(
            ''.concat(prefixCls, '-tools-arrow ').concat(prefixCls, '-tools-left'),
            (0, _defineProperty2.default)({}, ''.concat(prefixCls, '-tools-active'), ablePrev),
          ),
          onMouseDown: onPrev,
          onTouchEnd: onPrev,
        }),
        /*#__PURE__*/ _react.default.createElement('div', {
          className: (0, _classnames4.default)(
            ''.concat(prefixCls, '-tools-arrow ').concat(prefixCls, '-tools-right'),
            (0, _defineProperty2.default)({}, ''.concat(prefixCls, '-tools-active'), ableNext),
          ),
          onMouseDown: onNext,
          onTouchEnd: onNext,
        }),
      ),
  );
};

exports.default = _default;
