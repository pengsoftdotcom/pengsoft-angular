import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { Button } from 'src/app/components/support/button/button';
import { EditOneToManyComponent } from 'src/app/components/support/edit-one-to-many/edit-one-to-many.component';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { InputComponent } from 'src/app/components/support/input/input.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { ConstructionProjectService } from 'src/app/services/ss/construction-project.service';
import { SafetyTrainingService } from 'src/app/services/ss/safety-training.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { StaffPopupComponent } from '../../basedata/staff/staff-popup.component';
import { SafetyTrainingParticipantComponent } from '../safety-training-participant/safety-training-participant.component';

@Component({
    selector: 'app-safety-training',
    templateUrl: './safety-training.component.html',
    styleUrls: ['./safety-training.component.scss']
})
export class SafetyTrainingComponent extends EntityComponent<SafetyTrainingService> {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    @ViewChild('participants', { static: true }) participantsComponent: EditOneToManyComponent;

    organization: any;

    department: any;

    constructor(
        private constructionProject: ConstructionProjectService,
        public override entity: SafetyTrainingService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
        this.organization = this.security.userDetails.primaryOrganization;
        this.department = this.security.userDetails.primaryDepartment;
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.editComponent.width = '40%';
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildSelect({
                code: 'project', name: '????????????',
                edit: {
                    required: true,
                    readonly: !this.editForm.id,
                    input: {
                        load: (component: InputComponent) => {
                            this.constructionProject.findAll(null, [], {
                                success: (res: any) => {
                                    if (component.edit.input) {
                                        component.edit.input.options = res.map((data: any) => Object.assign({ label: data.shortName, value: data }));
                                    }
                                }
                            });
                        }
                    }
                },
                list: { render: (_field: Field, row: any) => row.project.shortName },
                filter: {
                    readonly: false
                }
            }),
            FieldUtils.buildTextForCode(),
            FieldUtils.buildText({ code: 'subject', name: '????????????', edit: { required: true } }),
            FieldUtils.buildPopup({
                code: 'trainer', name: '?????????',
                edit: {
                    required: true,
                    input: {
                        popupComponent: StaffPopupComponent,
                        popupComponentSelectRowCode: 'person.name',
                        popupComponentParams: {
                            organization: this.organization,
                            department: this.department,
                            params: {
                                'job.name': '?????????'
                            }
                        }
                    }
                },
                list: { render: (f: Field, row: any) => f.code && row[f.code] ? row[f.code].person.name : '-' },
                filter: {}
            }),
            // FieldUtils.buildBoolean({
            //     code: 'allWorkers', name: '??????????????????',
            //     edit: {
            //         input: {
            //             modelChange: () => {
            //                 if (!this.editForm.allWorkers) {
            //                     this.message.warning("??????????????????????????????????????????????????????");
            //                 }
            //             }
            //         }
            //     },
            //     list: { visible: false }
            // }),
            FieldUtils.buildDatetime({ code: 'estimatedStartTime', name: '??????????????????', edit: { readonly: () => this.editForm.submittedAt }, list: { visible: false } }),
            FieldUtils.buildDatetime({ code: 'estimatedEndTime', name: '??????????????????', edit: { readonly: () => this.editForm.submittedAt }, list: { visible: false } }),
            FieldUtils.buildTextarea({ code: 'address', name: '????????????' }),
            FieldUtils.buildDatetime({ code: 'submittedAt', name: '????????????', edit: { readonly: true } }),
            FieldUtils.buildDatetime({ code: 'startedAt', name: '????????????', edit: { readonly: true } }),
            FieldUtils.buildUpload({ code: 'files', name: '????????????', edit: { visible: (form: any) => form.startedAt } }, {
                multiple: true, accept: FieldUtils.IMAGE,
                showRemove: (form: any) => !form.endedAt,
                remove: (file: NzUploadFile) => new Observable(observer => this.entity.deleteFileByAsset(this.editForm, file.response[0], {
                    success: () => observer.next(true),
                    failure: () => observer.next(false)
                }))
            }),
            FieldUtils.buildUpload({ code: 'confirmFiles', name: '????????????', edit: { visible: (form: any) => form.startedAt } }, {
                multiple: true, accept: FieldUtils.IMAGE,
                showRemove: (form: any) => !form.endedAt,
                remove: (file: NzUploadFile) => new Observable(observer => this.entity.deleteConfirmFileByAsset(this.editForm, file.response[0], {
                    success: () => observer.next(true),
                    failure: () => observer.next(false)
                }))
            }),
            FieldUtils.buildDatetime({ code: 'endedAt', name: '????????????', edit: { readonly: true } })
        ];
    }

    override initListAction(): Button[] {
        const buttons = super.initListAction();
        delete buttons[0].exclusive;
        buttons.splice(1, 1);
        buttons.splice(0, 0,
            { name: '?????????', width: 44, type: 'link', action: (row: any) => this.editParticipants(row), authority: 'ss::safety_training_participant::find_page' }
        );
        return buttons;
    }

    editParticipants(training: any): void {
        this.participantsComponent.component = SafetyTrainingParticipantComponent;
        this.participantsComponent.width = '40%';
        this.participantsComponent.params = { title: training.name, training };
        this.participantsComponent.show();
    }

    submit(): void {
        this.modal.confirm({
            nzTitle: '???????????????????',
            nzOnOk: () => this.entity.submit(this.editForm.id, {
                before: () => this.getEditComponent().loading = true,
                success: () => {
                    this.message.info('????????????');
                    this.getEditComponent().hide();
                    this.list();
                },
                after: () => this.getEditComponent().loading = false
            })
        });
    }

    start(): void {
        this.modal.confirm({
            nzTitle: '???????????????????',
            nzOnOk: () => this.entity.start(this.editForm.id, {
                before: () => this.getEditComponent().loading = true,
                success: () => {
                    this.message.info('????????????');
                    this.getEditComponent().hide();
                    this.list();
                },
                after: () => this.getEditComponent().loading = false
            })
        });
    }

    end(): void {
        const form = this.buildEditForm();
        this.modal.confirm({
            nzTitle: '???????????????????',
            nzOnOk: () => this.entity.end(form, {
                errors: this.errors,
                before: () => this.getEditComponent().loading = true,
                success: () => {
                    this.message.info('????????????');
                    this.getEditComponent().hide();
                    this.list();
                },
                after: () => this.getEditComponent().loading = false
            })
        });
    }

    override initEditToolbar(): Button[] {
        return [
            { name: '??????', type: 'primary', action: () => this.submit(), authority: this.getAuthority('submit'), isDisabled: (form: any) => !form.id || form.submittedAt },
            { name: '??????', type: 'primary', action: () => this.start(), authority: this.getAuthority('start'), isDisabled: (form: any) => !form.submittedAt || form.startedAt },
            { name: '??????', type: 'primary', action: () => this.end(), authority: this.getAuthority('end'), isDisabled: (form: any) => !form.startedAt || form.endedAt }
        ];
    }

}
