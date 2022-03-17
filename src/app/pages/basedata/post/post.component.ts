import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Button } from 'src/app/components/support/button/button';
import { EditComponent } from 'src/app/components/support/edit/edit.component';
import { EntityComponent } from 'src/app/components/support/entity.component';
import { Field } from 'src/app/components/support/list/field';
import { ListComponent } from 'src/app/components/support/list/list.component';
import { PostService } from 'src/app/services/basedata/post.service';
import { RankService } from 'src/app/services/basedata/rank.service';
import { SecurityService } from 'src/app/services/support/security.service';
import { FieldUtils } from 'src/app/utils/field-utils';
import { OrganizationPopupComponent } from '../organization/organization-popup.component';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent extends EntityComponent<PostService> implements OnInit {

    @ViewChild('listComponent', { static: true }) listComponent!: ListComponent;

    getListComponent(): ListComponent { return this.listComponent }

    @ViewChild('editComponent', { static: true }) editComponent!: EditComponent;

    getEditComponent(): EditComponent { return this.editComponent }

    organization: any;

    constructor(
        private rank: RankService,
        public override entity: PostService,
        public override security: SecurityService,
        public override modal: NzModalService,
        public override message: NzMessageService
    ) {
        super(entity, security, modal, message);
        this.organization = this.security.userDetails.primaryOrganization;
    }

    initFields(): Field[] {
        return [
            FieldUtils.buildTreeSelect({ code: 'organization', name: '机构', list: { visible: false }, edit: { visible: false } }),
            /*  FieldUtils.buildSelect({
                 code: 'rank', name: '职级', edit: {
                     required: true,
                     input: {
                         load: component => this.rank.findAll({ 'organization.id': this.organization.id }, null, {
                             before: () => this.loading = true,
                             success: res => component.edit.input.options = res.map(entity => Object.assign({ label: entity.name, value: entity })),
                             after: () => this.loading = false
                         })
                     }
                 }
             }), */
            FieldUtils.buildTextForName({ list: { sortable: false } })
        ];
    }

    override initListToolbar(): Button[] {
        const buttons = super.initListToolbar();
        if (!this.child) {
            buttons.splice(0, 0, {
                name: '切换机构',
                type: 'link',
                action: () => this.switchOrganization()
            });
        }
        return buttons;
    }

    override afterInit(): void {
        if (this.organization) {
            this.filterForm = { 'organization.id': this.organization.id };
            super.afterInit();
        } else {
            this.switchOrganization();
        }
    }

    switchOrganization(): void {
        const modalRef = this.modal.create({
            nzWidth: '80%',
            nzContent: OrganizationPopupComponent,
            nzComponentParams: {
                title: '切换机构',
                action: '切换',
                select: row => {
                    this.organization = row;
                    this.title = this.organization.name;
                    modalRef.close();
                    this.afterInit();
                }
            },
            nzFooter: null
        });
    }

    override afterEdit(): void {
        if (!this.editForm.id) {
            this.editForm.organization = this.organization;
        }
    }

    override afterFilterFormReset(): void {
        this.filterForm = { 'organization.id': this.organization.id };
        super.afterFilterFormReset();
    }

}
