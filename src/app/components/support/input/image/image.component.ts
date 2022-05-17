import { Component, OnChanges } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { AssetService } from 'src/app/services/basedata/asset.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { environment } from 'src/environments/environment';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss']
})
export class ImageComponent extends InputComponent implements OnChanges {

    path = environment.gateway.path + '/api/system/asset/upload';

    headers: any = this.security.getBearerAuthorizationHeaders();

    data = '';

    imageWidth = 100;

    imageHeight = 100;

    locked = false;

    constructor(private asset: AssetService, private security: SecurityService, private message: NzMessageService) { super(); }

    ngOnChanges(): void {
        if (this.edit.code && this.edit.input && this.locked) {
            if (this.form[this.edit.code] && this.form[this.edit.code].id) {
                this.download(this.form[this.edit.code]);
            }
        }
    }

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.edit.input?.uploadType === 'locked') {
            this.locked = true;
            this.path += '?locked=true';
        }
        if (this.edit.input?.width) {
            this.imageWidth = this.edit.input.width;
        }
        if (this.edit.input?.height) {
            this.imageHeight = this.edit.input.height;
        }
    }

    get thumbnail(): string {
        let thumbnail = '';
        if (this.locked) {
            return this.data;
        } else {
            if (this.edit.code && this.form[this.edit.code]) {
                thumbnail = this.form[this.edit.code].accessPath;
                thumbnail += '?x-oss-process=image/resize';
                thumbnail += ',w_' + this.imageWidth
                thumbnail += ',h_' + this.imageHeight;
            }
        }
        return thumbnail;
    }

    override modelChange(event: NzUploadChangeParam) {
        switch (event.file.status) {
            case 'uploading':
                this.loading = true;
                break;
            case 'done':
                const res = event.file.response;
                if (res && res.length > 0) {
                    const asset = res[0];
                    if (this.locked) {
                        this.download(asset, event);
                    } else {
                        this.afterUploading(asset, event);
                    }
                }
                break;
            case 'error':
                this.message.error(event.file.error.error.error_description);
                this.loading = false;
                break;
        }
    }

    private download(asset: any, event?: NzUploadChangeParam, changed?: boolean) {
        let width = 100;
        if (this.edit && this.edit.input && this.edit.input.width) {
            width = this.edit.input.width;
        }
        let height = 100;
        if (this.edit && this.edit.input && this.edit.input.height) {
            height = this.edit.input.height;
        }
        if (changed === undefined) {
            changed = true;
        }
        this.asset.download(asset.id, false, width, height, {
            responseType: 'text',
            before: () => this.loading = true,
            success: (data: any) => this.data = data,
            after: () => this.afterUploading(asset, event, changed)
        });
    }

    afterUploading(asset: any, event: any, changed = true): void {
        if (this.edit.code) {
            this.form[this.edit.code] = asset;
            this.loading = false;
            if (changed) {
                super.modelChange(event);
            }
        }
    }

    delete() {
        const input = document.querySelector('#' + this.edit.code + ' input[type=file]');
        if (input && this.edit.code) {
            input.setAttribute('disabled', 'true');
            if (this.form.id) {
                this.enableFilePicker(input);
            } else {
                this.asset.delete([this.form[this.edit.code].id], {
                    before: () => this.loading = true,
                    success: () => this.enableFilePicker(input),
                    after: () => this.loading = false
                });
            }
        }
    }

    enableFilePicker(input: Element) {
        if (this.edit.code) {
            this.form[this.edit.code] = null;
            setTimeout(() => input.removeAttribute('disabled'), 100);
        }
    }

    view(): void {
        var image = new Image();
        const input = document.querySelector('#' + this.edit.code + ' input[type=file]');
        if (input && this.edit.code) {
            input.setAttribute('disabled', 'true');
            image.src = this.form[this.edit.code].accessPath;
            this.enableFilePicker(input);
        }
        window.open("")?.document.write(image.outerHTML);
    }

}
