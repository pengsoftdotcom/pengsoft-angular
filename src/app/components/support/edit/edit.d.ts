import { Input } from "../input/input";
import { Label } from "../form-item/label";


export interface Edit {

    code?: string;

    required?: boolean;

    readonly?: boolean | ((form: any, edit: Edit) => boolean);

    visible?: boolean | ((form: any, edit: Edit) => boolean);

    childrenVisible?: boolean | ((form: any, edit: Edit) => boolean);

    label?: Label;

    input?: Input;

    column?: number;

}