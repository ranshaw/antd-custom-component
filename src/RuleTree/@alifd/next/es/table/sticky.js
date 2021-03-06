import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import Header from './fixed/header';
import StickyHeader from './sticky/header';
import { statics } from './util';

export default function sticky(BaseComponent) {
    var _class, _temp2;

    /** Table */
    var StickyTable = (_temp2 = _class = function (_React$Component) {
        _inherits(StickyTable, _React$Component);

        function StickyTable() {
            var _temp, _this, _ret;

            _classCallCheck(this, StickyTable);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {}, _temp), _possibleConstructorReturn(_this, _ret);
        }

        StickyTable.prototype.getChildContext = function getChildContext() {
            return {
                Header: this.props.components.Header || Header,
                offsetTop: this.props.offsetTop,
                affixProps: this.props.affixProps
            };
        };

        StickyTable.prototype.render = function render() {
            /* eslint-disable no-unused-vars */
            var _props = this.props,
                stickyHeader = _props.stickyHeader,
                offsetTop = _props.offsetTop,
                affixProps = _props.affixProps,
                others = _objectWithoutProperties(_props, ['stickyHeader', 'offsetTop', 'affixProps']);

            var _props2 = this.props,
                components = _props2.components,
                maxBodyHeight = _props2.maxBodyHeight,
                fixedHeader = _props2.fixedHeader;

            if (stickyHeader) {
                components = _extends({}, components);
                components.Header = StickyHeader;
                fixedHeader = true;
                maxBodyHeight = Math.max(maxBodyHeight, 10000);
            }
            return React.createElement(BaseComponent, _extends({}, others, {
                components: components,
                fixedHeader: fixedHeader,
                maxBodyHeight: maxBodyHeight
            }));
        };

        return StickyTable;
    }(React.Component), _class.StickyHeader = StickyHeader, _class.propTypes = _extends({
        /**
         * ???????????????sticky
         */
        stickyHeader: PropTypes.bool,
        /**
         * ????????????????????????????????????????????????
         */
        offsetTop: PropTypes.number,
        /**
         * affix??????????????????
         */
        affixProps: PropTypes.object,
        components: PropTypes.object
    }, BaseComponent.propTypes), _class.defaultProps = _extends({
        components: {}
    }, BaseComponent.defaultProps), _class.childContextTypes = {
        Header: PropTypes.any,
        offsetTop: PropTypes.number,
        affixProps: PropTypes.object
    }, _temp2);
    StickyTable.displayName = 'StickyTable';

    statics(StickyTable, BaseComponent);
    return StickyTable;
}