import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp, _initialiseProps;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import moment from 'moment';
import classnames from 'classnames';
import ConfigProvider from '../config-provider';
import nextLocale from '../locale/zh-cn';
import { func, obj } from '../util';
import CardHeader from './head/card-header';
import DatePanelHeader from './head/date-panel-header';
import MonthPanelHeader from './head/month-panel-header';
import YearPanelHeader from './head/year-panel-header';
import DateTable from './table/date-table';
import MonthTable from './table/month-table';
import YearTable from './table/year-table';
import { checkMomentObj, formatDateValue, getVisibleMonth, isSameYearMonth, CALENDAR_MODES, CALENDAR_MODE_DATE, CALENDAR_MODE_MONTH, CALENDAR_MODE_YEAR, getLocaleData } from './utils';

var isValueChanged = function isValueChanged(value, oldVlaue) {
    if (value && oldVlaue) {
        if (!moment.isMoment(value)) {
            value = moment(value);
        }
        if (!moment.isMoment(oldVlaue)) {
            oldVlaue = moment(oldVlaue);
        }
        return value.valueOf() !== oldVlaue.valueOf();
    } else {
        return value !== oldVlaue;
    }
};

/** Calendar */
var Calendar = (_temp = _class = function (_Component) {
    _inherits(Calendar, _Component);

    function Calendar(props, context) {
        _classCallCheck(this, Calendar);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _initialiseProps.call(_this);

        var value = formatDateValue(props.value || props.defaultValue);
        var visibleMonth = getVisibleMonth(props.defaultVisibleMonth, value);

        _this.MODES = props.modes;
        _this.today = moment();
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
            var value = formatDateValue(props.value);
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
            others = _objectWithoutProperties(_props, ['prefix', 'rtl', 'className', 'shape', 'showOtherMonth', 'format', 'locale', 'dateCellRender', 'monthCellRender', 'yearCellRender', 'disabledDate', 'yearRange', 'disableChangeMode']);

        var state = this.state;

        var classNames = classnames((_classnames = {}, _classnames[prefix + 'calendar'] = true, _classnames[prefix + 'calendar-' + shape] = shape, _classnames), className);

        if (rtl) {
            others.dir = 'rtl';
        }

        var visibleMonth = state.visibleMonth;

        // reset moment locale
        if (locale.momentLocale) {
            state.value && state.value.locale(locale.momentLocale);
            visibleMonth.locale(locale.momentLocale);
        }

        var localeData = getLocaleData(locale.format || {}, visibleMonth.localeData());

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

        var tables = (_tables = {}, _tables[CALENDAR_MODE_DATE] = React.createElement(DateTable, _extends({ format: format }, tableProps, { onSelectDate: this.onSelectCell })), _tables[CALENDAR_MODE_MONTH] = React.createElement(MonthTable, _extends({}, tableProps, { onSelectMonth: this.onSelectCell })), _tables[CALENDAR_MODE_YEAR] = React.createElement(YearTable, _extends({}, tableProps, { rtl: rtl, onSelectYear: this.onSelectCell })), _tables);

        var panelHeaders = (_panelHeaders = {}, _panelHeaders[CALENDAR_MODE_DATE] = React.createElement(DatePanelHeader, headerProps), _panelHeaders[CALENDAR_MODE_MONTH] = React.createElement(MonthPanelHeader, headerProps), _panelHeaders[CALENDAR_MODE_YEAR] = React.createElement(YearPanelHeader, headerProps), _panelHeaders);

        return React.createElement(
            'div',
            _extends({}, obj.pickOthers(Calendar.propTypes, others), { className: classNames }),
            shape === 'panel' ? panelHeaders[state.mode] : React.createElement(CardHeader, headerProps),
            tables[state.mode]
        );
    };

    return Calendar;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * ????????????????????????moment ?????????
     */
    defaultValue: checkMomentObj,
    /**
     * ?????????????????? (moment ??????)
     */
    value: checkMomentObj,
    /**
     * ????????????
     */
    mode: PropTypes.oneOf(CALENDAR_MODES), // ?????? API ???????????????????????? ['date', 'month', 'year']
    // ????????????????????????????????????????????????????????????
    modes: PropTypes.array,
    // ????????????????????????????????? dropdown ??????????????????????????? (????????????????????????)
    disableChangeMode: PropTypes.bool,
    // ?????????????????????????????????title??????????????????
    format: PropTypes.string,
    /**
     * ??????????????????????????????
     */
    showOtherMonth: PropTypes.bool,
    /**
     * ?????????????????????
     */
    defaultVisibleMonth: PropTypes.func,
    /**
     * ????????????
     */
    shape: PropTypes.oneOf(['card', 'fullscreen', 'panel']),
    /**
     * ?????????????????????????????????
     * @param {Object} value ?????????????????? (moment ??????)
     */
    onSelect: PropTypes.func,
    /**
     * ??????????????????????????????
     * @param {String} mode ?????????????????? date month year
     */
    onModeChange: PropTypes.func,
    /**
     * ?????????????????????????????????
     * @param {Object} value ??????????????? (moment ??????)
     * @param {String} reason ????????????????????????
     */
    onVisibleMonthChange: PropTypes.func,
    /**
     * ??????????????????
     */
    className: PropTypes.string,
    /**
     * ???????????????????????????
     * @param {Object} value ????????????moment?????????
     * @returns {ReactNode}
     */
    dateCellRender: PropTypes.func,
    /**
     * ???????????????????????????
     * @param {Object} calendarDate ?????? Calendar ??????????????????????????????
     * @returns {ReactNode}
     */
    monthCellRender: PropTypes.func,
    yearCellRender: PropTypes.func, // ?????? 0.x yearCellRender
    /**
     * ???????????????[START_YEAR, END_YEAR] (??????shape ??? ???card???, 'fullscreen' ?????????)
     */
    yearRange: PropTypes.arrayOf(PropTypes.number),
    /**
     * ?????????????????????
     * @param {Object} calendarDate ?????? Calendar ??????????????????????????????
     * @param {String} view ?????????????????????year: ?????? month: ???, date: ???
     * @returns {Boolean}
     */
    disabledDate: PropTypes.func,
    /**
     * ???????????????
     */
    locale: PropTypes.object
}), _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    shape: 'fullscreen',
    modes: CALENDAR_MODES,
    disableChangeMode: false,
    format: 'YYYY-MM-DD',
    onSelect: func.noop,
    onVisibleMonthChange: func.noop,
    onModeChange: func.noop,
    dateCellRender: function dateCellRender(value) {
        return value.date();
    },
    locale: nextLocale.Calendar,
    showOtherMonth: true
}, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.onSelectCell = function (date, nextMode) {
        var visibleMonth = _this2.state.visibleMonth;
        var _props2 = _this2.props,
            shape = _props2.shape,
            showOtherMonth = _props2.showOtherMonth;

        // ?????????????????????????????????

        if (!showOtherMonth && !isSameYearMonth(visibleMonth, date)) {
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
        if (!isSameYearMonth(date, _this2.state.visibleMonth)) {
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


export default polyfill(Calendar);