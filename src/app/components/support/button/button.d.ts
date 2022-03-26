import { NzButtonSize, NzButtonType } from "ng-zorro-antd/button";

export interface Button {

    name?: ((form?: any) => string) | string;

    authority?: string;

    exclusive?: string;

    type?: NzButtonType;

    alignRight?: boolean;

    danger?: boolean;

    width?: number;

    size?: NzButtonSize;

    icon?: string;

    loading?: boolean;

    children?: Button[];

    action?: (params?: any) => void;

    isDisabled?: (row?: any) => boolean;

    isVisible?: (row?: any) => boolean;

}