import ConfigProvider from '../config-provider';
import NumberPicker from './number-picker';
import { log } from '../util';

export default ConfigProvider.config(NumberPicker, {
    transform: /* istanbul ignore next */function transform(props) {
        if ('onDisabled' in props && typeof props.onDisabled === 'function') {
            log.warning('[NumberPicker]: onDisabled is deleted!');
        }

        if ('state' in props && props.state === 'success') {
            delete props.state;
        }

        return props;
    },
    exportNames: ['getInputNode']
});