import { Component, OnChanges } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { forkJoin, Observable } from 'rxjs';
import { AssetService } from 'src/app/services/basedata/asset.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { environment } from 'src/environments/environment';
import { InputComponent } from '../input.component';
import { Upload } from './upload';

@Component({
    selector: 'app-input-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent extends InputComponent implements OnChanges {

    action = environment.gateway.path + '/api/system/asset/upload';

    headers: any = this.security.getBearerAuthorizationHeaders();

    files: NzUploadFile[] = [];

    thumbnail: any = { visible: false, data: null };

    upload: Upload;

    isImage = false;

    constructor(private security: SecurityService, private asset: AssetService) { super(); }

    ngOnChanges(): void {
        this.upload = Object.assign({ accept: '*/*', multiple: false }, this.edit.input) as Upload;
        if (this.upload.accept) {
            this.isImage = this.upload.accept?.startsWith('image/');
        }
        if (this.edit.code && this.form[this.edit.code]) {
            if (Array.isArray(this.form[this.edit.code])) {
                forkJoin(this.form[this.edit.code].map((entity: any) => this.convertToFile(entity))).subscribe((files: any) => this.files = files);
            } else {
                forkJoin([this.convertToFile(this.form[this.edit.code])]).subscribe((files: NzUploadFile[]) => this.files = files);
            }
        }
    }

    convertToFile(entity: any): Promise<NzUploadFile> {
        const convert = this.upload.convertToFile;
        if (convert) {
            return convert(entity);
        } else {
            if (entity.locked) {
                return new Promise(resolve => this.asset.download(entity.id, null, null, {
                    responseType: 'text',
                    before: () => this.loading = true,
                    success: (data: any) => resolve({
                        uid: entity.id,
                        name: entity.originalName,
                        status: 'done',
                        response: [entity],
                        thumbUrl: this.isImage ? data : ''
                    }),
                    after: () => this.loading = false
                }));
            } else {
                return Promise.resolve({
                    uid: entity.id,
                    name: entity.originalName,
                    status: 'done',
                    response: [entity],
                    thumbUrl: this.isImage ? entity.accessPath : ''
                });
            }
        }
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.upload = Object.assign({ accept: '*/*', multiple: false }, this.edit.input) as Upload;
        if (this.upload.accept) {
            this.isImage = this.upload.accept?.startsWith('image/');
        }
        if (this.upload.locked) {
            this.action += '?locked=true';
        }
    }

    preview = (file: NzUploadFile): void => {
        if (file.status === 'done') {
            this.thumbnail.visible = true;
            this.thumbnail.data = file.thumbUrl;
        }
    }

    download = (file: NzUploadFile): void => {
        if (this.isImage) {
            var image = new Image();
            if (file.thumbUrl) {
                image.src = file.thumbUrl;
            }
            const doc = window.open()?.document;
            if (doc) {
                doc.write(image.outerHTML);
                doc.close();
            }
        }
    }

    remove = (file: NzUploadFile): boolean | Observable<boolean> => {
        if (this.upload.remove) {
            return this.upload.remove(file);
        } else {
            return new Observable(observer => this.asset.delete([file.response[0].id], {
                success: () => {
                    if (this.edit.code) {
                        this.form[this.edit.code] = this.files.map(f => f.response[0]);
                    }
                    observer.next(true);
                },
                failure: () => observer.next(false)
            }));
        }
    }

    override modelChange(event: NzUploadChangeParam): void {
        switch (event.file.status) {
            case 'done':
                if (this.edit.code) {
                    if (this.upload.multiple) {
                        this.form[this.edit.code] = this.files.filter(file => Array.isArray(file.response)).map(file => file.response[0]);
                    } else {
                        this.form[this.edit.code] = this.files.filter(file => Array.isArray(file.response)).map(file => file.response[0])[0];
                    }
                }
                break;
            case 'error':
                event.file['message'] = event.file.error.error.error_description;
                break;
        }
    }

    showRemove(): boolean {
        if (this.edit.input) {
            const upload = this.edit.input as Upload;
            if (upload.showRemove) {
                return upload.showRemove(this.form);
            }
        }
        return true;
    }

}
