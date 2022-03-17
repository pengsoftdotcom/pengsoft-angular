import { NzUploadFile } from "ng-zorro-antd/upload";
import { Observable } from "rxjs";
import { Input } from "../input";

export interface Upload extends Input {

    locked?: boolean;

    accept?: string;

    limit?: number;

    convertToFile?(entity: any): NzUploadFile;

    remove?(file: NzUploadFile): boolean | Observable<boolean>;

}