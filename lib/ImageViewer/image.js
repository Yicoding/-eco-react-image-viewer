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

var _classnames4 = _interopRequireDefault(require('classnames'));

require('./styles.less');

var _icon_loading = _interopRequireDefault(require('../assets/icon_loading.png'));

var prefixCls = 'eco-image-viewer';

var _default = function _default(props) {
  var src = props.src,
    site = props.site,
    index = props.index,
    transInfo = props.transInfo,
    scaleRate = props.scaleRate,
    innerInfo = props.innerInfo,
    isTrans = props.isTrans,
    visible = props.visible,
    rotateVal = props.rotateVal;

  var _useState = (0, _react.useState)(),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    url = _useState2[0],
    setUrl = _useState2[1];

  var _useState3 = (0, _react.useState)({
      width: 50,
      height: 50,
    }),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    imageInfo = _useState4[0],
    setImageInfo = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
    isShow = _useState6[0],
    setIsShow = _useState6[1];

  (0, _react.useEffect)(
    function () {
      setTimeout(function () {
        setIsShow(visible);
      }, 0);
    },
    [visible],
  );
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
  (0, _react.useEffect)(
    function () {
      setUrl('');
      var image = new Image(); // 监听目标图片加载的情况，完成时再将DOM上的img节点的src属性设置为目标图片的url

      image.onload = function () {
        setImageInfo({
          width: image.width,
          height: image.height,
        });
        setUrl(src);
      }; // 设置src属性，Image实例开始加载图片

      image.src = src;
    },
    [src],
  );
  return /*#__PURE__*/ _react.default.createElement(
    'div',
    {
      className: (0, _classnames4.default)(
        ''.concat(prefixCls, '-image-slide'),
        (0, _defineProperty2.default)({}, ''.concat(prefixCls, '-image-slide-trans'), isShow),
      ),
      style: {
        transform: 'translate(calc('
          .concat(-100 * (index - site), '%), 0) rotate(')
          .concat(index === site ? rotateVal : 0, 'deg)'),
      },
    },
    /*#__PURE__*/ _react.default.createElement('img', {
      src: url || _icon_loading.default,
      className: (0, _classnames4.default)(
        ''.concat(prefixCls, '-image-item'),
        (0, _defineProperty2.default)({}, ''.concat(prefixCls, '-loading'), !url),
        (0, _defineProperty2.default)({}, ''.concat(prefixCls, '-trans'), isTrans),
      ),
      style: Object.assign(
        {},
        imageSize,
        url && {
          transform: 'translate(calc(-50% + '
            .concat(
              scaleRate === 1 ? transInfo.x : index === site ? transInfo.x : 0,
              'px), calc(-50% + ',
            )
            .concat(index === site ? transInfo.y : 0, 'px)) scale(')
            .concat(visible ? (index === site ? scaleRate : 1) : 0.5),
        },
      ),
    }),
  );
};

exports.default = _default;
