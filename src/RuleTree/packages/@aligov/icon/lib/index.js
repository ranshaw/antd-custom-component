"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = GovIcon;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _icon = _interopRequireDefault(require("@alifd/next/lib/icon"));

var React = _interopRequireWildcard(require("react"));

// 政务图标系统项目图标 Symbol 地址
// 项目：https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=1432938
// 公开的图标系统：https://www.iconfont.cn/collections/detail?cid=18867
var DEFAULT_CUSTOM_ICONFONT_JS = '';
var CUSTOM_ICONFONT_JS = typeof window !== 'undefined' ? window.CUSTOM_ICONFONT_JS || DEFAULT_CUSTOM_ICONFONT_JS : DEFAULT_CUSTOM_ICONFONT_JS; // 自定义图标前缀

var DEFAULT_CUSTOM_ICON_FIEFIX = 'gov-icon-';
var CUSTOM_ICON_PREFIX = typeof window !== 'undefined' ? window.CUSTOM_ICON_FIEFIX || DEFAULT_CUSTOM_ICON_FIEFIX : DEFAULT_CUSTOM_ICON_FIEFIX;

var CustomIcon = _icon["default"].createFromIconfontCN({
  scriptUrl: CUSTOM_ICONFONT_JS
}); // 如果CUSTOM_ICONFONT_JS没有，则加载本地iconfont


if (!CUSTOM_ICONFONT_JS) {
  require('./iconfont');
}

function GovIcon(props) {
  var custom = props.custom,
      type = props.type,
      others = (0, _objectWithoutPropertiesLoose2["default"])(props, ["custom", "type"]);

  if (!custom) {
    return /*#__PURE__*/React.createElement(_icon["default"], (0, _extends2["default"])({
      type: type
    }, others));
  }

  return /*#__PURE__*/React.createElement(CustomIcon, (0, _extends2["default"])({
    type: "" + CUSTOM_ICON_PREFIX + type
  }, others));
}

GovIcon.defaultProps = {
  custom: false
}; // 导出方便给其他地方使用，如 demo

GovIcon.CUSTOM_ICON_PREFIX = CUSTOM_ICON_PREFIX;