import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _Icon from "@alifd/next/es/icon";
import * as React from 'react';
// 政务图标系统项目图标 Symbol 地址
// 项目：https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=1432938
// 公开的图标系统：https://www.iconfont.cn/collections/detail?cid=18867
var DEFAULT_CUSTOM_ICONFONT_JS = '';
var CUSTOM_ICONFONT_JS = typeof window !== 'undefined' ? window.CUSTOM_ICONFONT_JS || DEFAULT_CUSTOM_ICONFONT_JS : DEFAULT_CUSTOM_ICONFONT_JS; // 自定义图标前缀

var DEFAULT_CUSTOM_ICON_FIEFIX = 'gov-icon-';
var CUSTOM_ICON_PREFIX = typeof window !== 'undefined' ? window.CUSTOM_ICON_FIEFIX || DEFAULT_CUSTOM_ICON_FIEFIX : DEFAULT_CUSTOM_ICON_FIEFIX;

var CustomIcon = _Icon.createFromIconfontCN({
  scriptUrl: CUSTOM_ICONFONT_JS
}); // 如果CUSTOM_ICONFONT_JS没有，则加载本地iconfont


if (!CUSTOM_ICONFONT_JS) {
  require('./iconfont');
}

export default function GovIcon(props) {
  var custom = props.custom,
      type = props.type,
      others = _objectWithoutPropertiesLoose(props, ["custom", "type"]);

  if (!custom) {
    return /*#__PURE__*/React.createElement(_Icon, _extends({
      type: type
    }, others));
  }

  return /*#__PURE__*/React.createElement(CustomIcon, _extends({
    type: "" + CUSTOM_ICON_PREFIX + type
  }, others));
}
GovIcon.defaultProps = {
  custom: false
}; // 导出方便给其他地方使用，如 demo

GovIcon.CUSTOM_ICON_PREFIX = CUSTOM_ICON_PREFIX;