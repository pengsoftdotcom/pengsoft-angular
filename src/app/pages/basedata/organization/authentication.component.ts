import { Component } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { Field } from 'src/app/components/support/list/field';
import { IdentityCardService } from 'src/app/services/basedata/identity-card.service';
import { OrganizationService } from 'src/app/services/basedata/organization.service';
import { PersonService } from 'src/app/services/basedata/person.service';
import { RegionService } from 'src/app/services/basedata/region.service';
import { HttpOptions } from 'src/app/services/support/http-options';
import { DictionaryItemService } from 'src/app/services/system/dictionary-item.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { BusinessLicenseComponent } from '../business-license/business-license.component';
import { OrganizationComponent } from './organization.component';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent extends EditComponent {

    organization: any;

    legalRepresentative: any;

    organizationAdmin: any;

    businessLicense: any;

    current = -1;

    fieldsArray: Array<Field[]> = [[], [], [], []];

    statusArray: Array<'wait' | 'process' | 'finish' | 'error'> = ['wait', 'wait', 'wait', 'wait'];

    titleArray: string[] = ['基础资料', '法人代表', '管理员', '营业执照'];

    readonly = false;

    constructor(
        private region: RegionService,
        private dictionaryItem: DictionaryItemService,
        private identityCard: IdentityCardService,
        private person: PersonService,
        public entity: OrganizationService,
        public modal: NzModalService,
        public message: NzMessageService,
        public override drawer: NzDrawerService
    ) {
        super(drawer);
        this.width = '60%';
        this.column = 2;
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initToolbar();
    }

    initToolbar(): void {
        this.toolbar = [
            { name: '上一步', type: 'default', size: 'default', isVisible: () => this.isPrevVisible(), action: () => this.prev() },
            { name: '下一步', type: 'primary', size: 'default', isVisible: () => this.isNextVisible(), action: () => this.next() },
            { name: '提交', type: 'primary', size: 'default', isVisible: () => this.isSubmitVisible(), action: () => this.submit() },
            { name: '通过', type: 'primary', size: 'default', isVisible: () => this.isAuthenticateVisible(), action: () => this.authenticate() },
            { name: '拒绝', type: 'primary', danger: true, size: 'default', isVisible: () => this.isAuthenticateVisible(), action: () => this.unauthenticate() },
        ];
    }

    isPrevVisible(): boolean {
        return this.current > 0;
    }

    prev(): void {
        this.goTo(--this.current);
    }

    isNextVisible(): boolean {
        return this.current < 3;
    }

    next(): void {
        switch (this.current) {
            case 0:
                this.saveOrganization();
                break;
            case 1:
                this.saveLegalRepresentative();
                break;
            case 2:
                this.saveOrganizationAdmin();
                break;
            default:
                break;
        }
    }

    saveOrganization(): void {
        if (this.readonly || JSON.stringify(this.organization) === JSON.stringify(this.form)) {
            this.goToNext();
        } else {
            this.entity.save(this.organization, {
                errors: this.errors,
                before: () => this.before(),
                success: res => {
                    this.organization = res;
                    this.form = res;
                    this.goToNext();
                },
                after: () => this.after()
            });
        }
    }

    saveLegalRepresentative(): void {
        if (this.readonly || JSON.stringify(this.legalRepresentative) === JSON.stringify(this.form)) {
            this.goToNext();
        } else {
            this.entity.setLegalRepresentative(this.organization, this.form, {
                errors: this.errors,
                before: () => this.before(),
                success: () => this.goToNext(),
                after: () => this.after()
            });
        }
    }

    saveOrganizationAdmin(): void {
        if (this.readonly || JSON.stringify(this.organizationAdmin) === JSON.stringify(this.form)) {
            this.goToNext();
        } else {
            this.entity.setAdmin(this.organization, this.form, {
                errors: this.errors,
                before: () => this.before(),
                success: () => this.goToNext(),
                after: () => this.after()
            });
        }
    }

    saveBusinessLicense(): void {
        if (this.readonly || JSON.stringify(this.businessLicense) === JSON.stringify(this.form)) {
            this.goToNext();
        }
        this.entity.setBusinessLicense(this.organization, this.form, {
            errors: this.errors,
            before: () => this.before(),
            success: () => this.goToNext(),
            after: () => this.after()
        });
    }

    goToNext(): void {
        this.statusArray[this.current] = 'finish';
        this.goTo(++this.current);
    }

    isSubmitVisible(): boolean {
        const authentication = this.organization.authentication;
        return this.current === 3 && (!authentication || authentication.status.code === 'unauthenticated');
    }

    isAuthenticateVisible(): boolean {
        const authentication = this.organization.authentication;
        return this.current === 3 && authentication && authentication.status.code === 'submitted';
    }

    goTo(event: number) {
        if (event < 4) {
            this.current = event;
            this.statusArray[this.current] = 'process';
            switch (event) {
                case 0:
                    this.getOrganization();
                    break;
                case 1:
                    this.getLegalRepresentative();
                    break;
                case 2:
                    this.getOrganizationAdmin();
                    break;
                case 3:
                    this.getBusinessLicense();
                    break;
                default:
                    break;
            }
        }
    }

    getOrganization() {
        if (!this.fieldsArray[this.current]) {
            OrganizationComponent.prototype.dictionaryItem = this.dictionaryItem;
            this.fieldsArray[this.current] = OrganizationComponent.prototype.initFields();
        }
        this.fields = this.fieldsArray[this.current];
        this.entity.findOne(this.organization ? this.organization.id : null, {
            before: () => this.before(() => this.form = {}),
            success: res => {
                this.form = res;
                this.organization = JSON.parse(JSON.stringify(this.form));
                const authentication = this.organization.authentication;
                if (authentication && (authentication.status.code === 'submitted' || authentication.status.code === 'authenticated')) {
                    this.readonly = true;
                    this.setFieldsToReadonly();
                }
            },
            after: () => this.after()
        });
    }

    private setFieldsToReadonly() {
        if (this.readonly) {
            this.fields.forEach(field => {
                if (field.edit) {
                    field.edit.readonly = true;
                }
                if (field.children) {
                    field.children.forEach(subField => {
                        if (subField.edit) {
                            subField.edit.readonly = true;
                        }
                    });
                }
            });
        }
    }

    getLegalRepresentative() {
        this.setFieldsToPersonFields();
        this.setFieldsToReadonly();
        this.entity.getLegalRepresentative(this.organization, {
            before: () => this.beforeGetPerson(),
            success: res => {
                if (!res.identityCard) {
                    res.identityCard = { address: {} };
                }
                this.form = res;
                this.legalRepresentative = JSON.parse(JSON.stringify(this.form));
            },
            after: () => this.after()
        });
    }

    private setFieldsToPersonFields() {
        if (!this.fieldsArray[this.current]) {
            this.fieldsArray[this.current] = FieldUtils.buildPersonFields(this.dictionaryItem, this.identityCard, this.region, this.person, this);
        }
        this.fields = this.fieldsArray[this.current];
    }

    getOrganizationAdmin() {
        this.setFieldsToPersonFields();
        this.setFieldsToReadonly();
        this.entity.getAdmin(this.organization, {
            before: () => this.beforeGetPerson(),
            success: res => {
                if (!res.identityCard) {
                    res.identityCard = { address: {} };
                }
                this.form = res;
                this.organizationAdmin = JSON.parse(JSON.stringify(this.form));
            },
            after: () => this.after()
        });
    }

    private beforeGetPerson(): void {
        this.before(() => {
            this.form = {};
            this.errors = { identityCard: { address: {} } };
        })
    }

    getBusinessLicense() {
        this.setFieldsToBusinessLicenseFields();
        this.setFieldsToReadonly();
        this.entity.getBusinessLicense(this.organization, {
            before: () => this.before(() => {
                this.form = {};
                this.errors = { businessLicense: {} };
            }),
            success: res => {
                this.form = res;
                if (!res.address) {
                    this.form.address = {};
                }
            },
            after: () => this.after()
        });
    }

    private setFieldsToBusinessLicenseFields() {
        if (!this.fieldsArray[this.current]) {
            this.fieldsArray[this.current] = BusinessLicenseComponent.prototype.initFields();
            BusinessLicenseComponent.prototype.initFieldsPropertyDefaultValue(this.fieldsArray[this.current]);
        }
        this.fields = this.fieldsArray[this.current];
    }

    setLegalRepresentative(): void {
        this.entity.setLegalRepresentative(this.organization, JSON.parse(JSON.stringify(this.form)), this.getHttpOptions('保存成功！'));
    }

    setOrganizationAdmin(): void {
        this.entity.setAdmin(this.organization, JSON.parse(JSON.stringify(this.form)), this.getHttpOptions('保存成功！'));
    }

    setBusinessLicense(): void {
        this.entity.setBusinessLicense(this.organization, JSON.parse(JSON.stringify(this.form)), this.getHttpOptions('保存成功！'));
    }

    submit(): void {
        this.modal.confirm({
            nzTitle: '确定要提交认证吗？',
            nzOnOk: () => new Promise(resolve => this.entity.submit(this.organization.id, this.getHttpOptions('提交成功！', resolve)))
        });
    }

    authenticate(): void {
        this.modal.confirm({
            nzTitle: '确定要通过认证吗？',
            nzOnOk: () => new Promise(resolve => this.entity.authenticate(this.organization.id, true, this.getHttpOptions('通过成功！', resolve)))
        });
    }

    unauthenticate(): void {
        this.modal.confirm({
            nzTitle: '确定要拒绝认证吗？',
            nzOnOk: () => new Promise(resolve => this.entity.authenticate(this.organization.id, false, this.getHttpOptions('拒绝成功！', resolve)))
        });
    }

    private getHttpOptions(content: string, resolve?: any): HttpOptions {
        return {
            errors: this.errors,
            before: () => this.before(),
            success: () => this.message.info(content),
            after: () => this.after(() => {
                if (resolve) {
                    this.hide();
                    resolve();
                }
            })
        };
    }

    private before(callback?: () => void): void {
        this.loading = true;
        if (callback) {
            callback();
        }
    }

    private after(callback?: () => void): void {
        this.loading = false;
        if (callback) {
            callback();
        }
    }

}
