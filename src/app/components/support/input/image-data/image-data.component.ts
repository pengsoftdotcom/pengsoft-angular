import { Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-image-data',
    templateUrl: './image-data.component.html',
    styleUrls: ['./image-data.component.scss']
})
export class ImageDataComponent extends InputComponent implements OnChanges {

    choosable = true;

    @ViewChild('file') file!: ElementRef;

    @ViewChild('image') image!: ElementRef;

    imageCtWidth = '102px';

    imageCtHeight = '102px';

    imageWidth = 100;

    imageHeight = 100;

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.edit.input && this.edit.input.width) {
            this.imageWidth = this.edit.input.width;
        }
        this.imageCtWidth = (this.imageWidth + 2) + 'px';
        this.width = (this.imageWidth + 4) + 'px';
        if (this.edit.input && this.edit.input.height) {
            this.imageHeight = this.edit.input.height;
        }
        this.imageCtHeight = (this.imageHeight + 2) + 'px';
        this.height = (this.imageHeight + 4) + 'px';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.edit.code && this.form[this.edit.code]) {
            this.resize(this.form[this.edit.code]);
        }
    }

    override modelChange(event: any): void {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (this.edit.code) {
                this.form[this.edit.code] = reader.result;
            }
            this.resize(reader.result as string);
        }
    }

    resize(data: string): void {
        const temp = new Image();
        temp.src = data;
        temp.onload = () => {
            const rate = temp.width / temp.height;
            if (rate > 1) {
                this.image.nativeElement.width = this.imageWidth;
            } else if (rate < 1) {
                this.image.nativeElement.height = this.imageHeight;
            } else {
                this.image.nativeElement.width = this.imageWidth;
                this.image.nativeElement.height = this.imageHeight;
            }
        }
    }

    choose(): void {
        if (this.choosable && this.file) {
            this.file.nativeElement.click();
        }
        this.choosable = true;
    }

    view(): void {
        this.choosable = false;
        var image = new Image();
        if (this.edit.code) {
            image.src = this.form[this.edit.code];
        }
        const doc = window.open()?.document;
        if (doc) {
            doc.write(image.outerHTML);
            doc.close();
        }
    }

    delete(): void {
        this.choosable = false;
        if (this.edit.code) {
            this.form[this.edit.code] = null;
        }
    }

}
