import { NzUploadFile } from "ng-zorro-antd/upload";
import { Observable } from "rxjs";
import { InputType } from "src/app/enums/input-type.enum";
import { Edit } from "../edit/edit";
import { InputComponent } from "./input.component";
import { Option } from './tree-select/option';

export interface Input {

    visible?: boolean | ((form: any, edit: Edit) => boolean);

    placeholder?: string,

    type?: InputType,

    prefixIcon?: string,

    suffixIcon?: string,

    modelChange?: (event: any) => void;

    changeOnSelect?: boolean,

    options?: Option[];

    optionLabelRender?: (edit: Edit, form: any) => string;

    loaded?: boolean;

    load?: (component: any, event?: any | number) => any;

    rows?: number;

    lazy?: boolean;

    multiple?: boolean;

    width?: number;

    height?: number;

    min?: number;

    max?: number;

    mode?: string;

    deletable?: boolean;

    popupComponent?: any;

    popupComponentParams?: any;

    popupComponentSelect?: (component: InputComponent, row: any) => any;

    popupComponentSelectRowCode?: string;

    uploadAccept?: string;

    uploadType?: 'public' | 'locked';

    uploadLimit?: number;

    uploadSize?: number;

    uploadRemove?(file: NzUploadFile): boolean | Observable<boolean>;

}