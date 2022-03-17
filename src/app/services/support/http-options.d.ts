import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpOptions {
    body?: any;
    errors?: any;
    headers?: HttpHeaders | { [header: string]: string | string[] };
    observe?: 'body';
    params?: HttpParams | { [param: string]: any | any[] };
    reportProgress?: boolean;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
    withCredentials?: boolean;
    before?: () => void;
    success?: (res: any) => void;
    failure?: (err: any) => void;
    after?: () => void;
}