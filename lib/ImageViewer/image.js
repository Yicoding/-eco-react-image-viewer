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

var _classnames2 = _interopRequireDefault(require('classnames'));

require('./styles.less');

var prefixCls = 'eco-image-viewer';

var _default = function _default(props) {
  var ref = (0, _react.useRef)();
  var src = props.src,
    site = props.site,
    index = props.index,
    transInfo = props.transInfo,
    scaleRate = props.scaleRate,
    isChange = props.isChange,
    innerInfo = props.innerInfo;

  var _useState = (0, _react.useState)({
      width: 1,
      height: 1,
    }),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    imageInfo = _useState2[0],
    setImageInfo = _useState2[1];

  var rateInner = innerInfo.width / innerInfo.height;
  var rateImage = imageInfo.width / imageInfo.height;
  var imageSize = (0, _react.useMemo)(
    function () {
      if (rateImage > rateInner) {
        // 图片比浏览器更宽，上下留白
        return {
          width: Math.min(imageInfo.width, innerInfo.width),
        };
      } else {
        // 图片比浏览器更高，左右留白
        return {
          height: Math.min(imageInfo.height, innerInfo.height),
        };
      }
    },
    [rateImage, rateInner, innerInfo, imageInfo],
  );
  (0, _react.useEffect)(function () {
    var image = new Image(); // 监听目标图片加载的情况，完成时再将DOM上的img节点的src属性设置为目标图片的url

    image.onload = function () {
      setImageInfo({
        width: image.width,
        height: image.height,
      });
    }; // 设置src属性，Image实例开始加载图片

    image.src = src;
  }, []);
  return /*#__PURE__*/ _react.default.createElement(
    'div',
    {
      className: (0, _classnames2.default)(
        ''.concat(prefixCls, '-image-slide'),
        (0, _defineProperty2.default)({}, ''.concat(prefixCls, '-slide-trans'), isChange),
      ),
      style: {
        transform: 'translate(calc('
          .concat(-100 * (index - site), '% + ')
          .concat(scaleRate === 1 ? transInfo.x : index === site ? transInfo.x : 0, 'px), ')
          .concat(index === site ? transInfo.y : 0, 'px)'),
      },
    },
    /*#__PURE__*/ _react.default.createElement('img', {
      src: src,
      className: ''.concat(prefixCls, '-image-item'),
      style: Object.assign({}, imageSize, {
        transform: 'translate(-50%, -50%) scale('.concat(index === site ? scaleRate : 1),
      }),
      ref: ref,
    }),
  );
};

exports.default = _default;
