import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import classnames from 'classnames';
import moment from 'moment';
import ConfigProvider from '../config-provider';
import nextLocale from '../locale/zh-cn';
import { obj, func } from '../util';
import RangePanelHeader from './head/range-panel-header';
import MonthPanelHeader from './head/month-panel-header';
import YearPanelHeader from './head/year-panel-header';
import DateTable from './table/date-table';
import MonthTable from './table/month-table';
import YearTable from './table/year-table';
import { checkMomentObj, formatDateValue, getVisibleMonth, isSameYearMonth, CALENDAR_MODES, CALENDAR_MODE_DATE, CALENDAR_MODE_MONTH, CALENDAR_MODE_YEAR, getLocaleData } from './utils';

var RangeCalendar = (_temp = _class = function (_React$Component) {
    _inherits(RangeCalendar, _React$Component);

    function RangeCalendar(props, context) {
        _classCallCheck(this, RangeCalendar);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

        _this.onSelectCell = function (date, nextMode) {
            if (_this.state.mode === CALENDAR_MODE_DATE) {
                _this.props.onSelect(date);
            } else {
                _this.changeVisibleMonth(date, 'cellClick');
            }

            _this.changeMode(nextMode);
        };

        _this.changeMode = function (mode, activePanel) {
            var _this$state = _this.state,
                lastMode = _this$state.lastMode,
                lastPanelType = _this$state.lastPanelType;


            var state = {
                lastMode: mode,
                // rangePicker???panel????????? year -> month ?????????????????????activePanel?????????????????????????????? start end panel??????????????????????????? lastMode ?????????
                lastPanelType: lastMode === 'year' ? lastPanelType : activePanel
            };
            if (typeof mode === 'string' && mode !== _this.state.mode) {
                state.mode = mode;
            }
            if (activePanel && activePanel !== _this.state.activePanel) {
                state.activePanel = activePanel;
            }

            _this.setState(state);
        };

        _this.changeVisibleMonth = function (date, reason) {
            var lastPanelType = _this.state.lastPanelType;

            if (!isSameYearMonth(date, _this.state.startVisibleMonth)) {
                var startVisibleMonth = lastPanelType === 'end' ? date.clone().add(-1, 'month') : date;
                _this.setState({ startVisibleMonth: startVisibleMonth });
                _this.props.onVisibleMonthChange(startVisibleMonth, reason);
            }
        };

        _this.changeVisibleMonthByOffset = function (offset, type) {
            var offsetDate = _this.state.startVisibleMonth.clone().add(offset, type);
            _this.changeVisibleMonth(offsetDate, 'buttonClick');
        };

        _this.goPrevDecade = function () {
            _this.changeVisibleMonthByOffset(-10, 'years');
        };

        _this.goNextDecade = function () {
            _this.changeVisibleMonthByOffset(10, 'years');
        };

        _this.goPrevYear = function () {
            _this.changeVisibleMonthByOffset(-1, 'years');
        };

        _this.goNextYear = function () {
            _this.changeVisibleMonthByOffset(1, 'years');
        };

        _this.goPrevMonth = function () {
            _this.changeVisibleMonthByOffset(-1, 'months');
        };

        _this.goNextMonth = function () {
            _this.changeVisibleMonthByOffset(1, 'months');
        };

        var startValue = formatDateValue(props.startValue || props.defaultStartValue);
        var endValue = formatDateValue(props.endValue || props.defaultEndValue);
        var visibleMonth = getVisibleMonth(props.defaultVisibleMonth, startValue);

        _this.state = {
            startValue: startValue,
            endValue: endValue,
            mode: props.mode,
            prevMode: props.mode,
            startVisibleMonth: visibleMonth,
            activePanel: undefined,
            lastMode: undefined,
            lastPanelType: 'start' // enum, ?????? start end
        };
        _this.today = moment();
        return _this;
    }

    RangeCalendar.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
        var st = {};
        if ('startValue' in props) {
            var startValue = formatDateValue(props.startValue);
            st.startValue = startValue;
            if (startValue && !startValue.isSame(state.startValue, 'day')) {
                st.startVisibleMonth = startValue;
            }
        }

        if ('endValue' in props) {
            st.endValue = formatDateValue(props.endValue);
        }

        if ('mode' in props && state.prevMode !== props.mode) {
            st.prevMode = props.mode;
            st.mode = props.mode;
        }

        return st;
    };

    /**
     * ????????????????????????????????????????????????
     * @param {Number} offset ???????????????
     * @param {String} type ?????????????????? days, months, years
     */


    RangeCalendar.prototype.render = function render() {
        var _classnames;

        var _props = this.props,
            prefix = _props.prefix,
            rtl = _props.rtl,
            dateCellRender = _props.dateCellRender,
            monthCellRender = _props.monthCellRender,
            yearCellRender = _props.yearCellRender,
            className = _props.className,
            format = _props.format,
            locale = _props.locale,
            showOtherMonth = _props.showOtherMonth,
            disabledDate = _props.disabledDate,
            disableChangeMode = _props.disableChangeMode,
            yearRange = _props.yearRange,
            others = _objectWithoutProperties(_props, ['prefix', 'rtl', 'dateCellRender', 'monthCellRender', 'yearCellRender', 'className', 'format', 'locale', 'showOtherMonth', 'disabledDate', 'disableChangeMode', 'yearRange']);

        var _state = this.state,
            startValue = _state.startValue,
            endValue = _state.endValue,
            mode = _state.mode,
            startVisibleMonth = _state.startVisibleMonth,
            activePanel = _state.activePanel;

        // reset moment locale

        if (locale.momentLocale) {
            startValue && startValue.locale(locale.momentLocale);
            endValue && endValue.locale(locale.momentLocale);
            startVisibleMonth.locale(locale.momentLocale);
        }

        if (rtl) {
            others.dir = 'rtl';
        }
        var localeData = getLocaleData(locale.format || {}, startVisibleMonth.localeData());

        var endVisibleMonth = startVisibleMonth.clone().add(1, 'months');

        var headerProps = {
            prefix: prefix,
            rtl: rtl,
            mode: mode,
            locale: locale,
            momentLocale: localeData,
            startVisibleMonth: startVisibleMonth,
            endVisibleMonth: endVisibleMonth,
            changeVisibleMonth: this.changeVisibleMonth,
            changeMode: this.changeMode,
            yearRange: yearRange,
            disableChangeMode: disableChangeMode
        };

        var tableProps = {
            prefix: prefix,
            value: startValue,
            startValue: startValue,
            endValue: endValue,
            mode: mode,
            locale: locale,
            momentLocale: localeData,
            showOtherMonth: showOtherMonth,
            today: this.today,
            disabledDate: disabledDate,
            dateCellRender: dateCellRender,
            monthCellRender: monthCellRender,
            yearCellRender: yearCellRender,
            changeMode: this.changeMode,
            changeVisibleMonth: this.changeVisibleMonth
        };

        var visibleMonths = {
            start: startVisibleMonth,
            end: endVisibleMonth
        };

        var visibleMonth = visibleMonths[activePanel];

        var header = void 0;
        var table = void 0;

        switch (mode) {
            case CALENDAR_MODE_DATE:
                {
                    table = [React.createElement(
                        'div',
                        { className: prefix + 'calendar-body-left', key: 'left-panel' },
                        React.createElement(DateTable, _extends({
                            format: format
                        }, tableProps, {
                            visibleMonth: startVisibleMonth,
                            onSelectDate: this.onSelectCell
                        }))
                    ), React.createElement(
                        'div',
                        { className: prefix + 'calendar-body-right', key: 'right-panel' },
                        React.createElement(DateTable, _extends({
                            format: format
                        }, tableProps, {
                            visibleMonth: endVisibleMonth,
                            onSelectDate: this.onSelectCell
                        }))
                    )];
                    header = React.createElement(RangePanelHeader, _extends({}, headerProps, {
                        goPrevYear: this.goPrevYear,
                        goPrevMonth: this.goPrevMonth,
                        goNextYear: this.goNextYear,
                        goNextMonth: this.goNextMonth
                    }));
                    break;
                }
            case CALENDAR_MODE_MONTH:
                {
                    table = React.createElement(MonthTable, _extends({}, tableProps, { visibleMonth: visibleMonth, onSelectMonth: this.onSelectCell }));
                    header = React.createElement(MonthPanelHeader, _extends({}, headerProps, {
                        visibleMonth: visibleMonth,
                        goPrevYear: this.goPrevYear,
                        goNextYear: this.goNextYear
                    }));
                    break;
                }
            case CALENDAR_MODE_YEAR:
                {
                    table = React.createElement(YearTable, _extends({}, tableProps, {
                        rtl: rtl,
                        visibleMonth: visibleMonth,
                        onSelectYear: this.onSelectCell,
                        goPrevDecade: this.goPrevDecade,
                        goNextDecade: this.goNextDecade
                    }));
                    header = React.createElement(YearPanelHeader, _extends({}, headerProps, {
                        visibleMonth: visibleMonth,
                        goPrevDecade: this.goPrevDecade,
                        goNextDecade: this.goNextDecade
                    }));
                    break;
                }
        }

        var classNames = classnames((_classnames = {}, _classnames[prefix + 'calendar'] = true, _classnames[prefix + 'calendar-range'] = true, _classnames), className);

        return React.createElement(
            'div',
            _extends({}, obj.pickOthers(RangeCalendar.propTypes, others), { className: classNames }),
            header,
            React.createElement(
                'div',
                { className: prefix + 'calendar-body' },
                table
            )
        );
    };

    return RangeCalendar;
}(React.Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    /**
     * ????????????
     */
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * ?????????????????????
     */
    defaultStartValue: checkMomentObj,
    /**
     * ?????????????????????
     */
    defaultEndValue: checkMomentObj,
    /**
     * ???????????????moment ?????????
     */
    startValue: checkMomentObj,
    /**
     * ???????????????moment ?????????
     */
    endValue: checkMomentObj,
    // ????????????
    mode: PropTypes.oneOf(CALENDAR_MODES),
    // ????????????????????????????????? dropdown ??????????????????????????? (????????????????????????)
    disableChangeMode: PropTypes.bool,
    // ?????????????????????????????????title??????????????????
    format: PropTypes.string,
    yearRange: PropTypes.arrayOf(PropTypes.number),
    /**
     * ??????????????????????????????
     */
    showOtherMonth: PropTypes.bool,
    /**
     * ???????????????????????????????????????
     */
    defaultVisibleMonth: PropTypes.func,
    /**
     * ?????????????????????????????????
     * @param {Object} value ??????????????? (moment ??????)
     * @param {String} reason ????????????????????????
     */
    onVisibleMonthChange: PropTypes.func,
    /**
     * ?????????????????????
     * @param {Object} calendarDate ?????? Calendar ??????????????????????????????
     * @param {String} view ?????????????????????year: ?????? month: ???, date: ???
     * @returns {Boolean}
     */
    disabledDate: PropTypes.func,
    /**
     * ?????????????????????????????????
     * @param {Object} value ?????????????????? (moment ??????)
     */
    onSelect: PropTypes.func,
    /**
     * ??????????????????????????????
     */
    dateCellRender: PropTypes.func,
    /**
     * ???????????????????????????
     * @param {Object} calendarDate ?????? Calendar ??????????????????????????????
     * @returns {ReactNode}
     */
    monthCellRender: PropTypes.func,
    yearCellRender: PropTypes.func, // ?????? 0.x yearCellRender
    locale: PropTypes.object,
    className: PropTypes.string
}), _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    mode: CALENDAR_MODE_DATE,
    disableChangeMode: false,
    format: 'YYYY-MM-DD',
    dateCellRender: function dateCellRender(value) {
        return value.date();
    },
    onSelect: func.noop,
    onVisibleMonthChange: func.noop,
    locale: nextLocale.Calendar,
    showOtherMonth: false
}, _temp);
RangeCalendar.displayName = 'RangeCalendar';


export default ConfigProvider.config(polyfill(RangeCalendar), {
    componentName: 'Calendar'
});