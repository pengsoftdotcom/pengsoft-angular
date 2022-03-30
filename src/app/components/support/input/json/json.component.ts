import { Component, ViewChild } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-json',
    templateUrl: './json.component.html',
    styleUrls: ['./json.component.scss']
})
export class JsonComponent extends InputComponent {

    jsonEditorOptions: JsonEditorOptions;

    @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;

    override ngOnInit(): void {
        super.ngOnInit();
        this.jsonEditorOptions = new JsonEditorOptions();
        this.jsonEditorOptions.modes = ['tree'];
        this.jsonEditorOptions.onChange = () => this.form[this.code] = this.jsonEditor.get();
    }

}
