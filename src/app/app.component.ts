import { Location } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Route, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { environment } from 'src/environments/environment';
import { ChangePasswordComponent } from './components/modal/change-password/change-password.component';
import { Field } from './components/support/list/field';
import { UserDetailsService } from './services/security/user-details.service';
import { SecurityService } from './services/support/security.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    isCollapsed = false;

    menus: any[] = [];

    userDetails: any = { user: {} };

    @ViewChild('jobsTemplate', { static: true }) jobsTemplate!: TemplateRef<any>;

    switchJobModal!: NzModalRef;

    switchJobVisible = false;

    switchJobReadonly = false;

    @ViewChild('rolesTemplate', { static: true }) rolesTemplate!: TemplateRef<any>;

    switchRoleModal!: NzModalRef;

    switchRoleVisible = false;

    switchRoleReadonly = false;

    @ViewChild('editPersonTemplate', { static: true }) editPersonTemplate!: TemplateRef<any>;

    editPersonModal!: NzModalRef;

    personFields: Field[] = [];

    errors: any = {};

    unreadCount = 0;

    constructor(
        private title: Title,
        private router: Router,
        private location: Location,
        private security: SecurityService,
        private message: NzMessageService,
        private modal: NzModalService,
        private userDetailsService: UserDetailsService
    ) {
        if (security.isNotAuthenticated()) {
            this.signIn();
        }
        this.title.setTitle(environment.title);

        this.initMenus();
        this.initPerson();
        this.initSwitchRole();
        this.initSwitchJob();
    }

    private initMenus() {
        this.menus = this.filterSubMenus(this.router.config.filter((route: Route) => route.data || route.children));
    }

    filterSubMenus(menus: Route[]): Route[] {
        return menus.filter(menu => {
            let visible = false;
            if (menu.data) {
                visible = this.security.hasAnyAuthority(menu.data['code'], menu.data['exclusive']);
            }
            if (menu.children) {
                menu.children = this.filterSubMenus(menu.children);
                visible = menu.children && menu.children.length > 0;
            }
            return visible;
        });
    }


    private initPerson() {
        this.userDetails = this.security.userDetails;
    }

    private initSwitchRole() {
        if (!this.userDetails.jobs && this.userDetails.primaryRole && this.userDetails.primaryRole.code !== 'org_admin') {
            this.switchRoleVisible = true;
            if (this.userDetails.roles.length === 1) {
                this.switchRoleReadonly = true;
            }
        }
    }

    private initSwitchJob() {
        if (this.userDetails.jobs && this.userDetails.jobs.length > 0) {
            this.switchJobVisible = true;
            if (this.userDetails.jobs.length === 1) {
                this.switchJobReadonly = true;
            }
        }
    }

    getMenuAuthority(route: Route): string {
        let authority = '';
        if (route.children) {
            authority = route.children
                .map(child => child.data?.['code'])
                .join(',');
        } else if (route.data) {
            authority = route.data['code'];
        }
        return authority;
    }

    isMenuOpen(menu: any): boolean {
        const paths = this.location.path().split('/');
        if (menu.data.path) {
            const path = paths.pop();
            return !!path && path.indexOf(menu.data.path) > -1;
        } else {
            paths.shift();
            return menu.path === paths.shift();
        }
    }

    editPerson(): void {
        this.message.warning('暂未开放，敬请期待');
        /* PersonComponent.prototype.dictionaryItem = this.dictionaryItem;
        this.personFields = PersonComponent.prototype.initFields();
        this.editPersonModal = this.modal.create({
            nzTitle: '编辑基本信息',
            nzContent: this.editPersonTemplate,
            nzOnOk: () =>
                new Promise((resolve) => {
                    this.userDetailsService.savePerson(this.userDetails.person, {
                        errors: this.errors,
                        success: (res: any) => {
                            this.userDetails = res;
                            this.message.info('保存成功', { nzDuration: 1000 })
                                .onClose.subscribe(() => resolve(true));
                        },
                        failure: () => resolve(false)
                    });
                })
        }); */
    }

    switchRole(): void {
        this.switchRoleModal = this.modal.create({
            nzStyle: { top: '30%' },
            nzWidth: 450,
            nzTitle: '切换角色',
            nzContent: this.rolesTemplate,
            nzFooter: null,
        });
    }

    switchJob(): void {
        this.switchJobModal = this.modal.create({
            nzStyle: { top: '30%' },
            nzWidth: 630,
            nzTitle: '切换职位',
            nzContent: this.jobsTemplate,
            nzFooter: null,
        });
    }

    roleSwitched(): void {
        this.userDetailsService.setPrimaryRole(this.userDetails.primaryRole, {
            success: (res: any) => this.afterSwiched(res),
            failure: () => this.message.error('切换失败'),
        });
    }

    jobSwitched(): void {
        this.userDetailsService.setPrimaryJob(this.userDetails.primaryJob, {
            success: (res: any) => this.afterSwiched(res),
            failure: () => this.message.error('切换失败'),
        });
    }

    afterSwiched(res: any): void {
        this.userDetails = res;
        this.security.userDetails = res;
        this.switchJobModal?.close();
        this.switchRoleModal?.close();
        this.message.info('切换成功，即将刷新', { nzDuration: 1000 }).onClose.subscribe(() => window.location.href = '/dashboard');
    }

    changePassword(): void {
        this.modal.create({
            nzContent: ChangePasswordComponent,
            nzStyle: { top: '30%' },
            nzWidth: 450,
            nzTitle: '修改密码',
            nzOnOk: (component) =>
                new Promise((resolve) => {
                    component.submit({
                        before: () => (component.loading = true),
                        success: () => resolve(true),
                        failure: () => resolve(false),
                        after: () => (component.loading = false),
                    });
                })
        });
    }

    signIn(): void {
        this.router.navigateByUrl('/sign-in');
    }

    signOut(): void {
        this.modal.confirm({
            nzTitle: '确定要退出登录吗？',
            nzOnOk: () => {
                this.userDetailsService.signOut();
                this.security.clear();
                this.signIn();
            },
        });
    }

    get avatar(): string {
        return (
            this.userDetails.person.avatar.accessPath + '?x-oss-process=image/resize,w_28,h_28'
        );
    }

    get name(): string {
        let name = this.userDetails.user.username;
        if (this.userDetails.person) {
            name = this.userDetails.person.name;
        }
        return name;
    }


}