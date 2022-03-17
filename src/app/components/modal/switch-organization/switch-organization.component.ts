import { Component } from '@angular/core';
import { OrganizationService } from 'src/app/services/basedata/organization.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { BaseComponent } from '../../support/base.component';
import { InputComponent } from '../../support/input/input.component';

@Component({
    selector: 'app-switch-organization',
    templateUrl: './switch-organization.component.html',
    styleUrls: ['./switch-organization.component.scss']
})
export class SwitchOrganizationComponent extends BaseComponent {

    field = FieldUtils.buildSelect({
        code: 'organization',
        edit: {
            label: { visible: false },
            input: {
                load: (component: InputComponent, event?: string) => {
                    const params: any = {};
                    if (event) {
                        params.name = event;
                    }
                    this.organization.findAll(params, [], {
                        before: () => this.loading = true,
                        success: (res: any) => {
                            if (component.edit.input) {
                                component.edit.input.options = res.map((entity: { name: string }) => Object.assign({ label: entity.name, value: entity }));
                            }
                        },
                        after: () => this.loading = false
                    });
                }
            }
        }
    });

    form: any = {};

    constructor(private organization: OrganizationService) { super(); }

}
