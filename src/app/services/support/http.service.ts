import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpOptions } from './http-options';
import { SecurityService } from './security.service';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(
        private http: HttpClient, private security: SecurityService, private message: NzMessageService, private router: Router
    ) { }

    request(method: 'DELETE' | 'GET' | 'HEAD' | 'JSONP' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH', url: string, options: HttpOptions): void {
        options.responseType = options.responseType ? options.responseType : 'json';
        if (!this.security.urlsPermitted.some(i => url.indexOf(i) > -1) && this.security.isAuthenticated()) {
            options.headers = this.security.getBearerAuthorizationHeaders();
        }
        if (options.errors) {
            for (const key in options.errors) {
                delete options.errors[key];
            }
        }
        if (options.before) {
            options.before();
        }
        this.http.request(method, url, options).subscribe({
            next: res => this.success(res, options),
            error: err => this.failure(err, options)
        });
    }

    private success(res: any, options: HttpOptions): void {
        try {
            if (options.success) {
                options.success(res);
            }
            if (options.after) {
                options.after();
            }
        } catch (error) {
            this.failure(error, options);
        }
    }

    private failure(err: any, options: HttpOptions): void {
        if (err instanceof HttpErrorResponse) {
            switch (err.status) {
                case 0:
                    this.message.error('请检查您的网络，若网络正常，则稍后再试');
                    break;
                case 400:
                    if (err.error) {
                        const error = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
                        switch (error.error_description) {
                            case 'Bad credentials':
                                this.message.error('账号或密码错误');
                                break;
                            case 'User account is locked':
                                this.message.error('账号已锁定');
                                break;
                            default:
                                this.message.error(error.error_description);
                                break;
                        }
                    } else {
                        this.message.error('错误的请求');
                    }
                    break;
                case 401:
                    this.message.error('登录已失效，请重新登录').onClose.subscribe(() => {
                        this.security.clear();
                        this.router.navigateByUrl('/sign-in');
                    });
                    break;
                case 403:
                    this.message.error('禁止访问');
                    break;
                case 404:
                    this.message.error('请求的资源不存在或已删除');
                    break;
                case 422:
                    if (!options.errors) {
                        for (const key in err.error) {
                            if (Object.prototype.hasOwnProperty.call(err.error, key)) {
                                const value = err.error[key];
                                this.message.error(value);
                            }
                        }
                    } else {
                        Object.assign(options.errors, err.error);
                    }
                    break;
                case 500:
                    this.message.error(err.error && err.error.error_description ? err.error.error_description : '服务器发生了一个意外的错误，如再次遇到，请联系管理员');
                    break;
                default:
                    break;
            }
        } else {
            throw new Error(err);
        }
        if (options.failure) {
            options.failure(err);
        }
        if (options.after) {
            options.after();
        }
    }

    after(options: HttpOptions): void {
        if (options.after) {
            options.after();
        }
    }

}
