import { NzUploadFile } from "ng-zorro-antd/upload";
import { Observable } from "rxjs";
import { Input } from "../input";

export interface Upload extends Input {

    locked?: boolean;

    accept?: string;

    limit?: number;

    convertToFile?(entity: any): Promise<NzUploadFile>;

    showPreview?(form: any): boolean;

    preview?(file: NzUploadFile): void;

    showDownload?(form: any): boolean;

    download?(file: NzUploadFile): void;

    showRemove?(form: any): boolean;

    remove?(file: NzUploadFile): boolean | Observable<boolean>;

}