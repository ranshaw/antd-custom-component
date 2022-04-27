/// <reference types="react" />
import { IconProps } from '@alifd/next/types/icon';
interface IGovProps extends IconProps {
    custom?: boolean;
}
declare function GovIcon(props: IGovProps): JSX.Element;
declare namespace GovIcon {
    var defaultProps: {
        custom: boolean;
    };
    var CUSTOM_ICON_PREFIX: any;
}
export default GovIcon;
