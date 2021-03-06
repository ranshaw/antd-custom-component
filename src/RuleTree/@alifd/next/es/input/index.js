import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Input from './input';
import Password from './password';
import TextArea from './textarea';
import Group from './group';

Input.Password = ConfigProvider.config(Password, {
    exportNames: ['getInputNode', 'focus'],
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('hasLimitHint' in props) {
            deprecated('hasLimitHint', 'showLimitHint', 'Input');

            var _props = props,
                hasLimitHint = _props.hasLimitHint,
                others = _objectWithoutProperties(_props, ['hasLimitHint']);

            props = _extends({ showLimitHint: hasLimitHint }, others);
        }

        return props;
    }
});

Input.TextArea = ConfigProvider.config(TextArea, {
    exportNames: ['getInputNode', 'focus'],
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('hasLimitHint' in props) {
            deprecated('hasLimitHint', 'showLimitHint', 'Input');

            var _props2 = props,
                hasLimitHint = _props2.hasLimitHint,
                others = _objectWithoutProperties(_props2, ['hasLimitHint']);

            props = _extends({ showLimitHint: hasLimitHint }, others);
        }

        return props;
    }
});
Input.Group = Group;

// 用来自动生成文档的工具底层依赖的 react-docgen，无法解析生成 HOC 的方法中存在第二个参数的情况
// 所以不能在 input.jsx／textarea.jsx 中生成 HOC
export default ConfigProvider.config(Input, {
    exportNames: ['getInputNode', 'focus'],
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('hasLimitHint' in props) {
            deprecated('hasLimitHint', 'showLimitHint', 'Input');

            var _props3 = props,
                hasLimitHint = _props3.hasLimitHint,
                others = _objectWithoutProperties(_props3, ['hasLimitHint']);

            props = _extends({ showLimitHint: hasLimitHint }, others);
        }

        return props;
    }
});