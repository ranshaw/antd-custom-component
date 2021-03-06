'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _util = require('../util');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _index = require('./runtime/index');

var _index2 = _interopRequireDefault(_index);

var _html5Uploader = require('./runtime/html5-uploader');

var _html5Uploader2 = _interopRequireDefault(_html5Uploader);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _util2 = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = _util.func.noop;

/**
 * Upload
 */
var Upload = (_temp = _class = function (_Base) {
    (0, _inherits3.default)(Upload, _Base);

    function Upload(props) {
        (0, _classCallCheck3.default)(this, Upload);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Base.call(this, props));

        _initialiseProps.call(_this);

        var value = void 0;
        if ('value' in props) {
            value = props.value;
        } else {
            value = props.defaultValue;
        }

        _this.state = {
            value: !Array.isArray(value) ? [] : value,
            uploading: false
        };
        return _this;
    }

    Upload.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        // ?????????????????????????????????
        if ('value' in nextProps && nextProps.value !== prevState.value && !prevState.uploading) {
            return {
                value: !Array.isArray(nextProps.value) ? [] : nextProps.value
            };
        }

        return null;
    };

    /**
     * ????????????API, ????????????
     * @param files
     */
    Upload.prototype.selectFiles = function selectFiles(files) {
        var filesArr = files.length ? Array.prototype.slice.call(files) : [files];

        this.onSelect(filesArr);
    };

    Upload.prototype.uploadFiles = function uploadFiles(files) {
        // NOTE: drag?????????????????????????????????????????? onDrop????????????onChange?????????????????? value=[], ???????????????????????????
        this.state.uploading = true;
        var fileList = files.filter(function (file) {
            if (file.state === 'selected') {
                file.state = 'uploading';
                return true;
            }
            return false;
        }).map(function (file) {
            return file.originFileObj;
        });

        fileList.length && this.uploaderRef.startUpload(fileList);
    };

    /**
     * ????????????api?????????????????????
     */


    Upload.prototype.startUpload = function startUpload() {
        this.uploadFiles(this.state.value);
    };

    Upload.prototype.replaceFiles = function replaceFiles(old, current) {
        var targetItem = (0, _util2.getFileItem)(old, this.state.value);
        if (!targetItem) {
            return;
        }

        current.uid = old.uid;
        targetItem.originFileObj = current;
    };

    // ??????????????????????????????


    Upload.prototype.isUploading = function isUploading() {
        return this.state.uploading;
    };

    /**
     * ????????????
     * @param {File} file
     * @return {void}
     */


    /**
     * ????????????
     * @param {File} file
     * @return {void}
     */


    Upload.prototype.render = function render() {
        var _classNames, _classNames2;

        var _props = this.props,
            listType = _props.listType,
            prefix = _props.prefix,
            dragable = _props.dragable,
            shape = _props.shape,
            className = _props.className,
            style = _props.style,
            useDataURL = _props.useDataURL,
            disabled = _props.disabled,
            limit = _props.limit,
            closable = _props.closable,
            beforeUpload = _props.beforeUpload,
            readonly = _props.readonly,
            onRemove = _props.onRemove,
            onCancel = _props.onCancel,
            onPreview = _props.onPreview,
            list = _props.list,
            extraRender = _props.extraRender,
            progressProps = _props.progressProps,
            rtl = _props.rtl,
            isPreview = _props.isPreview,
            renderPreview = _props.renderPreview,
            name = _props.name,
            _props$fileKeyName = _props.fileKeyName,
            fileKeyName = _props$fileKeyName === undefined ? name : _props$fileKeyName,
            fileNameRender = _props.fileNameRender,
            actionRender = _props.actionRender,
            previewOnFileName = _props.previewOnFileName,
            others = (0, _objectWithoutProperties3.default)(_props, ['listType', 'prefix', 'dragable', 'shape', 'className', 'style', 'useDataURL', 'disabled', 'limit', 'closable', 'beforeUpload', 'readonly', 'onRemove', 'onCancel', 'onPreview', 'list', 'extraRender', 'progressProps', 'rtl', 'isPreview', 'renderPreview', 'name', 'fileKeyName', 'fileNameRender', 'actionRender', 'previewOnFileName']);


        var cls = (0, _classnames2.default)((_classNames = {}, _classNames[prefix + 'upload'] = true, _classNames[prefix + 'upload-dragable'] = dragable, _classNames[prefix + 'disabled'] = disabled, _classNames[prefix + 'readonly'] = readonly, _classNames[className] = className, _classNames));

        var isExceedLimit = this.state.value.length >= limit;
        var innerCls = (0, _classnames2.default)((_classNames2 = {}, _classNames2[prefix + 'upload-inner'] = true, _classNames2[prefix + 'hidden'] = isExceedLimit, _classNames2));

        var children = this.props.children;
        if (shape === 'card') {
            var _classNames3;

            var cardCls = (0, _classnames2.default)((_classNames3 = {}, _classNames3[prefix + 'upload-card'] = true, _classNames3[prefix + 'disabled'] = disabled, _classNames3));
            children = _react2.default.createElement(
                'div',
                { className: cardCls },
                _react2.default.createElement(_icon2.default, { size: 'large', type: 'add', className: prefix + 'upload-add-icon' }),
                _react2.default.createElement(
                    'div',
                    { tabIndex: '0', role: 'button', className: prefix + 'upload-text' },
                    children
                )
            );
        }

        if (isPreview) {
            if (typeof renderPreview === 'function') {
                var _classNames4;

                var previewCls = (0, _classnames2.default)((_classNames4 = {}, _classNames4[prefix + 'form-preview'] = true, _classNames4[className] = !!className, _classNames4));
                return _react2.default.createElement(
                    'div',
                    { style: style, className: previewCls },
                    renderPreview(this.state.value, this.props)
                );
            }

            if (listType) {
                return _react2.default.createElement(_list2.default, { isPreview: true, listType: listType, style: style, className: className, value: this.state.value });
            }

            return null;
        }

        // disabled ???????????? remove????????????????????? remove?????????
        var onRemoveFunc = disabled ? _util.func.prevent : onRemove;
        var otherAttributes = _util.obj.pickAttrsWith(this.props, 'data-');
        return _react2.default.createElement(
            'div',
            (0, _extends3.default)({ className: cls, style: style }, otherAttributes),
            _react2.default.createElement(
                _index2.default,
                (0, _extends3.default)({}, others, {
                    name: fileKeyName,
                    beforeUpload: beforeUpload,
                    dragable: dragable,
                    disabled: disabled || isExceedLimit,
                    className: innerCls,
                    onSelect: this.onSelect,
                    onDrop: this.onDrop,
                    onProgress: this.onProgress,
                    onSuccess: this.onSuccess,
                    onError: this.onError,
                    ref: this.saveUploaderRef
                }),
                children
            ),
            listType || list ? _react2.default.createElement(_list2.default, {
                useDataURL: useDataURL,
                fileNameRender: fileNameRender,
                actionRender: actionRender,
                uploader: this,
                listType: listType,
                value: this.state.value,
                closable: closable,
                onRemove: onRemoveFunc,
                progressProps: progressProps,
                onCancel: onCancel,
                onPreview: onPreview,
                extraRender: extraRender,
                rtl: rtl,
                previewOnFileName: previewOnFileName
            }) : null
        );
    };

    return Upload;
}(_base2.default), _class.displayName = 'Upload', _class.propTypes = (0, _extends3.default)({}, _html5Uploader2.default.propTypes, _list2.default.propTypes, {
    /**
     * ????????????
     */
    prefix: _propTypes2.default.string.isRequired,
    /**
     * ???????????????
     */
    action: _propTypes2.default.string,
    /**
     * ????????????
     */
    value: _propTypes2.default.array,
    /**
     * ??????????????????
     */
    defaultValue: _propTypes2.default.array,
    /**
     * ??????????????????
     */
    shape: _propTypes2.default.oneOf(['card']),
    /**
     * ?????????????????????
     * @enumdesc ??????, ??????, ??????
     */
    listType: _propTypes2.default.oneOf(['text', 'image', 'card']),
    list: _propTypes2.default.any,
    /**
     * ???????????????
     */
    name: _propTypes2.default.string,
    /**
     * ??????????????????
     */
    data: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func]),
    /**
     * ??????????????????????????????????????? action ??????????????????????????????????????????????????? [formatter](#formater)
     * @param {Object} response ??????
     * @param {File} file ????????????
     */
    formatter: _propTypes2.default.func,
    /**
     * ????????????????????????
     */
    limit: _propTypes2.default.number,
    /**
     * ??????????????????,??????ms
     */
    timeout: _propTypes2.default.number,
    /**
     * ??????????????????????????????????????????`ie10+` ?????????
     */
    dragable: _propTypes2.default.bool,
    closable: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     */
    useDataURL: _propTypes2.default.bool,
    /**
     * ???????????????????????????????????????
     */
    disabled: _propTypes2.default.bool,
    /**
     * ??????????????????
     */
    onSelect: _propTypes2.default.func,
    /**
     * ?????????
     */
    onProgress: _propTypes2.default.func,
    /**
     * ??????????????????????????????
     * @param {Object} info ??????????????????
     */
    onChange: _propTypes2.default.func,
    /**
     * ????????????????????????????????????????????????????????????????????????????????????
     * @param {Object} file ??????
     * @param {Array<Object>} value ???
     */
    onSuccess: _propTypes2.default.func,
    /**
     * ????????????, ??????????????????,afterSelect?????? autoUpload=false ???????????????,autoUpload=true???,????????????beforeUpload???????????????????????????.
     * @param {Object} file
     * @returns {Boolean} ??????false???????????????,?????????????????????
     */
    afterSelect: _propTypes2.default.func,
    /**
     * ????????????????????????
     * @param {Object} file ??????
     * @returns {Boolean|Promise} ?????? false???Promise.resolve(false)??? Promise.reject() ?????????????????????
     */
    onRemove: _propTypes2.default.func,
    /**
     * ???????????????????????????????????????????????????????????????????????????????????????????????????
     * @param {Object} file ???????????????
     * @param {Array} value ?????????
     */
    onError: _propTypes2.default.func,
    /**
     * ????????????, ?????? [beforeUpload](#beforeUpload)
     * @param {Object} file ????????????
     * @param {Object} options ??????
     * @returns {Boolean|Object|Promise} ??????????????????demo
     */
    beforeUpload: _propTypes2.default.func,
    /**
     * ?????????
     */
    onDrop: _propTypes2.default.func,
    /**
     * ?????????class
     */
    className: _propTypes2.default.string,
    /**
     * ?????????????????????
     */
    style: _propTypes2.default.object,
    /**
     * ?????????
     */
    children: _propTypes2.default.node,
    /**
     * ????????????
     */
    autoUpload: _propTypes2.default.bool,
    /**
     * ?????????????????????
     * @param {Object} option
     * @return {Object} object with abort method
     */
    request: _propTypes2.default.func,
    /**
     * ?????????Progress props
     */
    progressProps: _propTypes2.default.object,
    rtl: _propTypes2.default.bool,
    /**
     * ??????????????????
     */
    isPreview: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     * @param {number} value ?????????
     */
    renderPreview: _propTypes2.default.func,
    /**
     * ??????????????? key name
     * @version 1.21
     */
    fileKeyName: _propTypes2.default.string,
    /**
     * list ???????????????????????????
     * @param {Object} file ??????
     * @return {Node} react node
     */
    fileNameRender: _propTypes2.default.func,
    /**
     * ????????????????????????
     * @param {Object} file ??????
     * @return {Node} react node
     */
    actionRender: _propTypes2.default.func,
    /**
     * ???????????????????????? onPreview
     * @version 1.24
     */
    previewOnFileName: _propTypes2.default.bool
}), _class.defaultProps = (0, _extends3.default)({}, _html5Uploader2.default.defaultProps, {
    prefix: 'next-',
    limit: Infinity,
    autoUpload: true,
    closable: true,
    onSelect: noop,
    onProgress: noop,
    onChange: noop,
    onSuccess: noop,
    onRemove: noop,
    onError: noop,
    onDrop: noop,
    beforeUpload: noop,
    afterSelect: noop,
    previewOnFileName: false
}), _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.onSelect = function (files) {
        var _props2 = _this2.props,
            autoUpload = _props2.autoUpload,
            afterSelect = _props2.afterSelect,
            onSelect = _props2.onSelect,
            limit = _props2.limit;
        // ??????

        var total = _this2.state.value.length + files.length;
        // ??????
        var less = limit - _this2.state.value.length;
        if (less <= 0) {
            // ???????????? ????????????
            return;
        }

        var fileList = files.map(function (file) {
            var objFile = (0, _util2.fileToObject)(file);
            objFile.state = 'selected';
            return objFile;
        });

        // ??????????????????
        var uploadFiles = fileList;
        var discardFiles = [];
        if (total > limit) {
            // ???????????????????????????limit ?????? ????????????
            uploadFiles = fileList.slice(0, less);
            discardFiles = fileList.slice(less);
        }

        var value = _this2.state.value.concat(fileList);

        /* eslint-disable-next */
        _this2.state.value = value;

        if (autoUpload) {
            _this2.uploadFiles(uploadFiles);
        }

        onSelect(uploadFiles, value);
        discardFiles.forEach(function (file) {
            // ???????????????
            var err = new Error(_util2.errorCode.EXCEED_LIMIT);
            err.code = _util2.errorCode.EXCEED_LIMIT;
            _this2.onError(err, null, file);
        });

        if (!autoUpload) {
            uploadFiles.forEach(function (file) {
                var isPassed = afterSelect(file);
                _util.func.promiseCall(isPassed, _util.func.noop, function (error) {
                    _this2.onError(error, null, file); // TODO: handle error message
                });
            });
            _this2.onChange(value, uploadFiles);
        }
    };

    this.onDrop = function (files) {
        _this2.onSelect(files);
        _this2.props.onDrop(files);
    };

    this.replaceWithNewFile = function (old, current) {
        var newFile = (0, _util2.fileToObject)(current);
        newFile.state = 'selected';

        var matchKey = old.uid !== undefined ? 'uid' : 'name';

        var fileList = _this2.state.value;
        for (var i = 0; i < fileList.length; i++) {
            var item = fileList[i];
            if (item[matchKey] === old[matchKey]) {
                fileList.splice(i, 1, newFile);
                break;
            }
        }

        _this2.uploadFiles([newFile]);
        return newFile;
    };

    this.onProgress = function (e, file) {
        _this2.state.uploading = true;

        var value = _this2.state.value;
        var targetItem = (0, _util2.getFileItem)(file, value);

        if (!targetItem) {
            return;
        }

        (0, _extends3.default)(targetItem, {
            state: 'uploading',
            percent: e.percent
        });

        _this2.setState({
            value: value
        });

        _this2.props.onProgress(value, targetItem);
    };

    this.onSuccess = function (response, file) {
        var formatter = _this2.props.formatter;


        if (formatter) {
            response = formatter(response, file);
        }

        try {
            if (typeof response === 'string') {
                response = JSON.parse(response);
            }
        } catch (e) {
            e.code = _util2.errorCode.RESPONSE_FAIL;
            return _this2.onError(e, response, file);
        }

        if (response.success === false) {
            var err = new Error(response.message || _util2.errorCode.RESPONSE_FAIL);
            err.code = _util2.errorCode.RESPONSE_FAIL;
            return _this2.onError(err, response, file);
        }

        var value = _this2.state.value;
        var targetItem = (0, _util2.getFileItem)(file, value);

        if (!targetItem) {
            return;
        }

        (0, _extends3.default)(targetItem, {
            state: 'done',
            response: response,
            url: response.url,
            downloadURL: response.downloadURL || response.url // ????????????(??????)
        });

        if (!_this2.props.useDataURL) {
            targetItem.imgURL = response.imgURL || response.url; // ???????????????(??????)
        }

        _this2.updateUploadingState();

        _this2.onChange(value, targetItem);
        _this2.props.onSuccess(targetItem, value);
    };

    this.onError = function (err, response, file) {
        var value = _this2.state.value;
        var targetItem = (0, _util2.getFileItem)(file, value);

        if (!targetItem) {
            return;
        }

        (0, _extends3.default)(targetItem, {
            state: 'error',
            error: err,
            response: response
        });

        _this2.updateUploadingState();

        _this2.onChange(value, targetItem);
        _this2.props.onError(targetItem, value);
    };

    this.removeFile = function (file) {
        file.state = 'removed';
        _this2.uploaderRef.abort(file); // ?????????????????????????????? `abort` ??????????????????

        var fileList = _this2.state.value;
        var targetItem = (0, _util2.getFileItem)(file, fileList);
        var index = fileList.indexOf(targetItem);
        if (index !== -1) {
            fileList.splice(index, 1);
            _this2.onChange(fileList, targetItem);
        }
    };

    this.updateUploadingState = function () {
        var inProgress = _this2.state.value.some(function (i) {
            return i.state === 'uploading';
        });
        if (!inProgress) {
            _this2.state.uploading = false;
        }
    };

    this.abort = function (file) {
        var fileList = _this2.state.value;
        var targetItem = (0, _util2.getFileItem)(file, fileList);
        var index = fileList.indexOf(targetItem);
        if (index !== -1) {
            fileList.splice(index, 1);
            _this2.onChange(fileList, targetItem);
        }
        _this2.uploaderRef.abort(file); // ?????????????????????????????? `abort` ??????????????????
    };

    this.onChange = function (value, file) {
        _this2.setState({
            value: value
        });
        _this2.props.onChange(value, file);
    };
}, _temp);
exports.default = (0, _reactLifecyclesCompat.polyfill)(Upload);
module.exports = exports['default'];