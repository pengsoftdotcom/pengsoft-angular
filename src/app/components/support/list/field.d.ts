import { Edit } from "../edit/edit";
import { List } from "./list";

export interface Field {

    code?: string;

    parentCode?: string;

    name?: string;

    list?: List;

    edit?: Edit;

    filter?: Edit;

    children?: Field[];

}