import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { func } from '../../util';
import Uploader from './uploader';
import Selecter from './selecter';

var Html5Uploader = (_temp2 = _class = function (_Component) {
    _inherits(Html5Uploader, _Component);

    function Html5Uploader() {
        var _temp, _this, _ret;

        _classCallCheck(this, Html5Uploader);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.getUploadOptions = function (props) {
            return {
                action: props.action,
                name: props.name,
                timeout: props.timeout,
                method: props.method,
                beforeUpload: props.beforeUpload,
                onProgress: props.onProgress,
                onSuccess: props.onSuccess,
                onError: props.onError,
                withCredentials: props.withCredentials,
                headers: props.headers,
                data: props.data,
                request: props.request
            };
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Html5Uploader.prototype.componentDidMount = function componentDidMount() {
        var props = this.props;

        var options = this.getUploadOptions(props);
        this.uploader = new Uploader(options);
    };

    Html5Uploader.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        var preOptions = this.getUploadOptions(prevProps);
        var options = this.getUploadOptions(this.props);

        var keys = Object.keys(options);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (options[key] !== preOptions[key]) {
                this.uploader.setOptions(options);
                return;
            }
        }
    };

    Html5Uploader.prototype.componentWillUnmount = function componentWillUnmount() {
        this.abort();
    };

    Html5Uploader.prototype.abort = function abort(file) {
        this.uploader.abort(file);
    };

    Html5Uploader.prototype.startUpload = function startUpload(fileList) {
        this.uploader.startUpload(fileList);
    };

    Html5Uploader.prototype.render = function render() {
        var _props = this.props,
            accept = _props.accept,
            multiple = _props.multiple,
            webkitdirectory = _props.webkitdirectory,
            children = _props.children,
            id = _props.id,
            disabled = _props.disabled,
            dragable = _props.dragable,
            style = _props.style,
            className = _props.className,
            onSelect = _props.onSelect,
            onDragOver = _props.onDragOver,
            onDragLeave = _props.onDragLeave,
            onDrop = _props.onDrop,
            name = _props.name,
            others = _objectWithoutProperties(_props, ['accept', 'multiple', 'webkitdirectory', 'children', 'id', 'disabled', 'dragable', 'style', 'className', 'onSelect', 'onDragOver', 'onDragLeave', 'onDrop', 'name']);

        return React.createElement(
            Selecter,
            _extends({}, others, {
                id: id,
                accept: accept,
                multiple: multiple,
                webkitdirectory: webkitdirectory,
                dragable: dragable,
                disabled: disabled,
                className: className,
                style: style,
                onSelect: onSelect,
                onDragOver: onDragOver,
                onDragLeave: onDragLeave,
                onDrop: onDrop,
                name: name
            }),
            children
        );
    };

    return Html5Uploader;
}(Component), _class.propTypes = _extends({}, Selecter.propTypes, {
    /**
     * ???????????????
     */
    action: PropTypes.string,
    /**
     * ??????????????????????????? (image/png, image/jpg, .doc, .ppt) ?????? [input accept attribute](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input#attr-accept)
     */
    accept: PropTypes.string,
    /**
     * ??????????????????
     */
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    /**
     * ???????????????????????????
     */
    headers: PropTypes.object,
    /**
     * ???????????????????????? cookie
     */
    withCredentials: PropTypes.bool,
    /**
     * ??????????????????
     * @param {Object} file ????????????
     * @return {Boolean} `false` ????????????
     */
    beforeUpload: PropTypes.func,
    /**
     * ??????????????????????????????????????????????????????????????????
     */
    onProgress: PropTypes.func,
    /**
     * ?????????????????????????????????????????????????????????????????????
     */
    onSuccess: PropTypes.func,
    /**
     * ????????????????????????????????????????????????????????????????????????????????????
     */
    onError: PropTypes.func,
    children: PropTypes.node,
    /**
     * ????????????,??????ms
     */
    timeout: PropTypes.number,
    /**
     * ????????????
     */
    method: PropTypes.oneOf(['post', 'put']),
    request: PropTypes.func
}), _class.defaultProps = _extends({}, Selecter.defaultProps, {
    name: 'file',
    multiple: false,
    withCredentials: true,
    beforeUpload: func.noop,
    onSelect: func.noop,
    onDragOver: func.noop,
    onDragLeave: func.noop,
    onDrop: func.noop,
    onProgress: func.noop,
    onSuccess: func.noop,
    onError: func.noop,
    onAbort: func.noop,
    method: 'post'
}), _temp2);
Html5Uploader.displayName = 'Html5Uploader';
export { Html5Uploader as default };