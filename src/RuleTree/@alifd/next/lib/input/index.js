'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _configProvider = require('../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _password = require('./password');

var _password2 = _interopRequireDefault(_password);

var _textarea = require('./textarea');

var _textarea2 = _interopRequireDefault(_textarea);

var _group = require('./group');

var _group2 = _interopRequireDefault(_group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_input2.default.Password = _configProvider2.default.config(_password2.default, {
    exportNames: ['getInputNode', 'focus'],
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('hasLimitHint' in props) {
            deprecated('hasLimitHint', 'showLimitHint', 'Input');
            var _props = props,
                hasLimitHint = _props.hasLimitHint,
                others = (0, _objectWithoutProperties3.default)(_props, ['hasLimitHint']);


            props = (0, _extends3.default)({ showLimitHint: hasLimitHint }, others);
        }

        return props;
    }
});

_input2.default.TextArea = _configProvider2.default.config(_textarea2.default, {
    exportNames: ['getInputNode', 'focus'],
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('hasLimitHint' in props) {
            deprecated('hasLimitHint', 'showLimitHint', 'Input');
            var _props2 = props,
                hasLimitHint = _props2.hasLimitHint,
                others = (0, _objectWithoutProperties3.default)(_props2, ['hasLimitHint']);


            props = (0, _extends3.default)({ showLimitHint: hasLimitHint }, others);
        }

        return props;
    }
});
_input2.default.Group = _group2.default;

// ???????????????????????????????????????????????? react-docgen????????????????????? HOC ??????????????????????????????????????????
// ??????????????? input.jsx???textarea.jsx ????????? HOC
exports.default = _configProvider2.default.config(_input2.default, {
    exportNames: ['getInputNode', 'focus'],
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('hasLimitHint' in props) {
            deprecated('hasLimitHint', 'showLimitHint', 'Input');
            var _props3 = props,
                hasLimitHint = _props3.hasLimitHint,
                others = (0, _objectWithoutProperties3.default)(_props3, ['hasLimitHint']);


            props = (0, _extends3.default)({ showLimitHint: hasLimitHint }, others);
        }

        return props;
    }
});
module.exports = exports['default'];