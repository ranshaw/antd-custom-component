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

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _configProvider = require('../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _zhCn = require('../locale/zh-cn');

var _zhCn2 = _interopRequireDefault(_zhCn);

var _util = require('../util');

var _cardHeader = require('./head/card-header');

var _cardHeader2 = _interopRequireDefault(_cardHeader);

var _datePanelHeader = require('./head/date-panel-header');

var _datePanelHeader2 = _interopRequireDefault(_datePanelHeader);

var _monthPanelHeader = require('./head/month-panel-header');

var _monthPanelHeader2 = _interopRequireDefault(_monthPanelHeader);

var _yearPanelHeader = require('./head/year-panel-header');

var _yearPanelHeader2 = _interopRequireDefault(_yearPanelHeader);

var _dateTable = require('./table/date-table');

var _dateTable2 = _interopRequireDefault(_dateTable);

var _monthTable = require('./table/month-table');

var _monthTable2 = _interopRequireDefault(_monthTable);

var _yearTable = require('./table/year-table');

var _yearTable2 = _interopRequireDefault(_yearTable);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isValueChanged = function isValueChanged(value, oldVlaue) {
    if (value && oldVlaue) {
        if (!_moment2.default.isMoment(value)) {
            value = (0, _moment2.default)(value);
        }
        if (!_moment2.default.isMoment(oldVlaue)) {
            oldVlaue = (0, _moment2.default)(oldVlaue);
        }
        return value.valueOf() !== oldVlaue.valueOf();
    } else {
        return value !== oldVlaue;
    }
};

/** Calendar */
var Calendar = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(Calendar, _Component);

    function Calendar(props, context) {
        (0, _classCallCheck3.default)(this, Calendar);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props, context));

        _initialiseProps.call(_this);

        var value = (0, _utils.formatDateValue)(props.value || props.defaultValue);
        var visibleMonth = (0, _utils.getVisibleMonth)(props.defaultVisibleMonth, value);

        _this.MODES = props.modes;
        _this.today = (0, _moment2.default)();
        _this.state = {
            value: value,
            mode: props.mode || _this.MODES[0],
            MODES: _this.MODES,
            visibleMonth: visibleMonth
        };
        return _this;
    }

    Calendar.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
        var st = {};
        if ('value' in props) {
            var value = (0, _utils.formatDateValue)(props.value);
            if (value && isValueChanged(props.value, state.value)) {
                st.visibleMonth = value;
            }
            st.value = value;
        }

        if (props.mode && state.MODES.indexOf(props.mode) > -1) {
            st.mode = props.mode;
        }

        return st;
    };

    /**
     * ????????????????????????????????????????????????
     * @param {Number} offset ?????????????????????
     * @param {String} type ????????????????????? days, months, years
     */
    Calendar.prototype.changeVisibleMonthByOffset = function changeVisibleMonthByOffset(offset, type) {
        var cloneValue = this.state.visibleMonth.clone();
        cloneValue.add(offset, type);
        this.changeVisibleMonth(cloneValue, 'buttonClick');
    };

    Calendar.prototype.render = function render() {
        var _classnames, _tables, _panelHeaders;

        var _props = this.props,
            prefix = _props.prefix,
            rtl = _props.rtl,
            className = _props.className,
            shape = _props.shape,
            showOtherMonth = _props.showOtherMonth,
            format = _props.format,
            locale = _props.locale,
            dateCellRender = _props.dateCellRender,
            monthCellRender = _props.monthCellRender,
            yearCellRender = _props.yearCellRender,
            disabledDate = _props.disabledDate,
            yearRange = _props.yearRange,
            disableChangeMode = _props.disableChangeMode,
            others = (0, _objectWithoutProperties3.default)(_props, ['prefix', 'rtl', 'className', 'shape', 'showOtherMonth', 'format', 'locale', 'dateCellRender', 'monthCellRender', 'yearCellRender', 'disabledDate', 'yearRange', 'disableChangeMode']);

        var state = this.state;

        var classNames = (0, _classnames3.default)((_classnames = {}, _classnames[prefix + 'calendar'] = true, _classnames[prefix + 'calendar-' + shape] = shape, _classnames), className);

        if (rtl) {
            others.dir = 'rtl';
        }

        var visibleMonth = state.visibleMonth;

        // reset moment locale
        if (locale.momentLocale) {
            state.value && state.value.locale(locale.momentLocale);
            visibleMonth.locale(locale.momentLocale);
        }

        var localeData = (0, _utils.getLocaleData)(locale.format || {}, visibleMonth.localeData());

        var headerProps = {
            prefix: prefix,
            value: state.value,
            mode: state.mode,
            disableChangeMode: disableChangeMode,
            yearRange: yearRange,
            locale: locale,
            rtl: rtl,
            visibleMonth: visibleMonth,
            momentLocale: localeData,
            changeMode: this.changeMode,
            changeVisibleMonth: this.changeVisibleMonth,
            goNextDecade: this.goNextDecade,
            goNextYear: this.goNextYear,
            goNextMonth: this.goNextMonth,
            goPrevDecade: this.goPrevDecade,
            goPrevYear: this.goPrevYear,
            goPrevMonth: this.goPrevMonth
        };

        var tableProps = {
            prefix: prefix,
            visibleMonth: visibleMonth,
            showOtherMonth: showOtherMonth,
            value: state.value,
            mode: state.mode,
            locale: locale,
            dateCellRender: dateCellRender,
            monthCellRender: monthCellRender,
            yearCellRender: yearCellRender,
            disabledDate: disabledDate,
            momentLocale: localeData,
            today: this.today,
            goPrevDecade: this.goPrevDecade,
            goNextDecade: this.goNextDecade
        };

        var tables = (_tables = {}, _tables[_utils.CALENDAR_MODE_DATE] = _react2.default.createElement(_dateTable2.default, (0, _extends3.default)({ format: format }, tableProps, { onSelectDate: this.onSelectCell })), _tables[_utils.CALENDAR_MODE_MONTH] = _react2.default.createElement(_monthTable2.default, (0, _extends3.default)({}, tableProps, { onSelectMonth: this.onSelectCell })), _tables[_utils.CALENDAR_MODE_YEAR] = _react2.default.createElement(_yearTable2.default, (0, _extends3.default)({}, tableProps, { rtl: rtl, onSelectYear: this.onSelectCell })), _tables);

        var panelHeaders = (_panelHeaders = {}, _panelHeaders[_utils.CALENDAR_MODE_DATE] = _react2.default.createElement(_datePanelHeader2.default, headerProps), _panelHeaders[_utils.CALENDAR_MODE_MONTH] = _react2.default.createElement(_monthPanelHeader2.default, headerProps), _panelHeaders[_utils.CALENDAR_MODE_YEAR] = _react2.default.createElement(_yearPanelHeader2.default, headerProps), _panelHeaders);

        return _react2.default.createElement(
            'div',
            (0, _extends3.default)({}, _util.obj.pickOthers(Calendar.propTypes, others), { className: classNames }),
            shape === 'panel' ? panelHeaders[state.mode] : _react2.default.createElement(_cardHeader2.default, headerProps),
            tables[state.mode]
        );
    };

    return Calendar;
}(_react.Component), _class.propTypes = (0, _extends3.default)({}, _configProvider2.default.propTypes, {
    prefix: _propTypes2.default.string,
    rtl: _propTypes2.default.bool,
    /**
     * ????????????????????????moment ?????????
     */
    defaultValue: _utils.checkMomentObj,
    /**
     * ?????????????????? (moment ??????)
     */
    value: _utils.checkMomentObj,
    /**
     * ????????????
     */
    mode: _propTypes2.default.oneOf(_utils.CALENDAR_MODES), // ?????? API ???????????????????????? ['date', 'month', 'year']
    // ????????????????????????????????????????????????????????????
    modes: _propTypes2.default.array,
    // ????????????????????????????????? dropdown ??????????????????????????? (????????????????????????)
    disableChangeMode: _propTypes2.default.bool,
    // ?????????????????????????????????title??????????????????
    format: _propTypes2.default.string,
    /**
     * ??????????????????????????????
     */
    showOtherMonth: _propTypes2.default.bool,
    /**
     * ?????????????????????
     */
    defaultVisibleMonth: _propTypes2.default.func,
    /**
     * ????????????
     */
    shape: _propTypes2.default.oneOf(['card', 'fullscreen', 'panel']),
    /**
     * ?????????????????????????????????
     * @param {Object} value ?????????????????? (moment ??????)
     */
    onSelect: _propTypes2.default.func,
    /**
     * ??????????????????????????????
     * @param {String} mode ?????????????????? date month year
     */
    onModeChange: _propTypes2.default.func,
    /**
     * ?????????????????????????????????
     * @param {Object} value ??????????????? (moment ??????)
     * @param {String} reason ????????????????????????
     */
    onVisibleMonthChange: _propTypes2.default.func,
    /**
     * ??????????????????
     */
    className: _propTypes2.default.string,
    /**
     * ???????????????????????????
     * @param {Object} value ????????????moment?????????
     * @returns {ReactNode}
     */
    dateCellRender: _propTypes2.default.func,
    /**
     * ???????????????????????????
     * @param {Object} calendarDate ?????? Calendar ??????????????????????????????
     * @returns {ReactNode}
     */
    monthCellRender: _propTypes2.default.func,
    yearCellRender: _propTypes2.default.func, // ?????? 0.x yearCellRender
    /**
     * ???????????????[START_YEAR, END_YEAR] (??????shape ??? ???card???, 'fullscreen' ?????????)
     */
    yearRange: _propTypes2.default.arrayOf(_propTypes2.default.number),
    /**
     * ?????????????????????
     * @param {Object} calendarDate ?????? Calendar ??????????????????????????????
     * @param {String} view ?????????????????????year: ?????? month: ???, date: ???
     * @returns {Boolean}
     */
    disabledDate: _propTypes2.default.func,
    /**
     * ???????????????
     */
    locale: _propTypes2.default.object
}), _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    shape: 'fullscreen',
    modes: _utils.CALENDAR_MODES,
    disableChangeMode: false,
    format: 'YYYY-MM-DD',
    onSelect: _util.func.noop,
    onVisibleMonthChange: _util.func.noop,
    onModeChange: _util.func.noop,
    dateCellRender: function dateCellRender(value) {
        return value.date();
    },
    locale: _zhCn2.default.Calendar,
    showOtherMonth: true
}, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.onSelectCell = function (date, nextMode) {
        var visibleMonth = _this2.state.visibleMonth;
        var _props2 = _this2.props,
            shape = _props2.shape,
            showOtherMonth = _props2.showOtherMonth;

        // ?????????????????????????????????

        if (!showOtherMonth && !(0, _utils.isSameYearMonth)(visibleMonth, date)) {
            return;
        }

        _this2.changeVisibleMonth(date, 'cellClick');

        // ???????????????????????????????????????????????????????????????????????? onSelect ??????
        if (_this2.state.mode === _this2.MODES[0]) {
            _this2.props.onSelect(date);
        }

        if (shape === 'panel') {
            _this2.changeMode(nextMode);
        }
    };

    this.changeMode = function (nextMode) {
        if (nextMode && _this2.MODES.indexOf(nextMode) > -1 && nextMode !== _this2.state.mode) {
            _this2.setState({ mode: nextMode });
            _this2.props.onModeChange(nextMode);
        }
    };

    this.changeVisibleMonth = function (date, reason) {
        if (!(0, _utils.isSameYearMonth)(date, _this2.state.visibleMonth)) {
            _this2.setState({ visibleMonth: date });
            _this2.props.onVisibleMonthChange(date, reason);
        }
    };

    this.goPrevDecade = function () {
        _this2.changeVisibleMonthByOffset(-10, 'years');
    };

    this.goNextDecade = function () {
        _this2.changeVisibleMonthByOffset(10, 'years');
    };

    this.goPrevYear = function () {
        _this2.changeVisibleMonthByOffset(-1, 'years');
    };

    this.goNextYear = function () {
        _this2.changeVisibleMonthByOffset(1, 'years');
    };

    this.goPrevMonth = function () {
        _this2.changeVisibleMonthByOffset(-1, 'months');
    };

    this.goNextMonth = function () {
        _this2.changeVisibleMonthByOffset(1, 'months');
    };
}, _temp);
Calendar.displayName = 'Calendar';
exports.default = (0, _reactLifecyclesCompat.polyfill)(Calendar);
module.exports = exports['default'];