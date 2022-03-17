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

    isReadonly?: (form?: any) => boolean;

    isVisible?: (form?: any) => boolean;

}