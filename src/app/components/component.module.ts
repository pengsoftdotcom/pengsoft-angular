import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { DirectiveModule } from '../directives/directive.module';
import { HasAnyAuthorityDirective } from '../directives/has-any-authority.directive';
import { IconsProviderModule } from '../icons-provider.module';
import { ChangePasswordComponent } from './modal/change-password/change-password.component';
import { ForgetPasswordComponent } from './modal/forget-password/forget-password.component';
import { ResetPasswordComponent } from './modal/reset-password/reset-password.component';
import { SetPrimaryRoleComponent } from './modal/set-primary-role/set-primary-role.component';
import { SignInComponent } from './modal/sign-in/sign-in.component';
import { SignUpComponent } from './modal/sign-up/sign-up.component';
import { SwitchOrganizationComponent } from './modal/switch-organization/switch-organization.component';
import { ButtonComponent } from './support/button/button.component';
import { EditManyToManyComponent } from './support/edit-many-to-many/edit-many-to-many.component';
import { EditOneToManyComponent } from './support/edit-one-to-many/edit-one-to-many.component';
import { EditComponent } from './support/edit/edit.component';
import { FilterComponent } from './support/filter/filter.component';
import { FormItemComponent } from './support/form-item/form-item.component';
import { ImageComponent } from './support/input/image/image.component';
import { BooleanComponent } from './support/input/boolean/boolean.component';
import { CaptchaComponent } from './support/input/captcha/captcha.component';
import { CascaderComponent } from './support/input/cascader/cascader.component';
import { CompositeComponent } from './support/input/composite/composite.component';
import { DateRangeComponent } from './support/input/date-range/date-range.component';
import { DateComponent } from './support/input/date/date.component';
import { DatetimeComponent } from './support/input/datetime/datetime.component';
import { NumberComponent } from './support/input/number/number.component';
import { PasswordComponent } from './support/input/password/password.component';
import { SelectComponent } from './support/input/select/select.component';
import { TextComponent } from './support/input/text/text.component';
import { TextareaComponent } from './support/input/textarea/textarea.component';
import { TreeSelectComponent } from './support/input/tree-select/tree-select.component';
import { UploadComponent } from './support/input/upload/upload.component';
import { ListComponent } from './support/list/list.component';
import { HiddenComponent } from './support/input/hidden/hidden.component';
import { PopupComponent } from './support/input/popup/popup.component';
import { ImageDataComponent } from './support/input/image-data/image-data.component';
import { EditTabComponent } from './support/edit-tab/edit-tab.component';


@NgModule({
    declarations: [
        ChangePasswordComponent,
        ForgetPasswordComponent,
        ResetPasswordComponent,
        SetPrimaryRoleComponent,
        SwitchOrganizationComponent,
        ButtonComponent,
        EditManyToManyComponent,
        EditOneToManyComponent,
        EditComponent,
        EditTabComponent,
        FilterComponent,
        FormItemComponent,
        ImageComponent,
        BooleanComponent,
        CaptchaComponent,
        CascaderComponent,
        DateComponent,
        DatetimeComponent,
        NumberComponent,
        PasswordComponent,
        SelectComponent,
        TextComponent,
        TextareaComponent,
        TreeSelectComponent,
        UploadComponent,
        ListComponent,
        SignInComponent,
        SignUpComponent,
        DateRangeComponent,
        CompositeComponent,
        HiddenComponent,
        PopupComponent,
        ImageDataComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NzButtonModule,
        NzCascaderModule,
        NzDatePickerModule,
        NzDividerModule,
        NzDrawerModule,
        NzDropDownModule,
        NzFormModule,
        NzInputModule,
        NzInputNumberModule,
        NzMessageModule,
        NzModalModule,
        NzPageHeaderModule,
        NzRadioModule,
        NzSelectModule,
        NzSpinModule,
        NzSpaceModule,
        NzSwitchModule,
        NzTableModule,
        NzTabsModule,
        NzToolTipModule,
        NzTransferModule,
        NzTreeModule,
        NzTreeSelectModule,
        NzUploadModule,
        DirectiveModule,
        IconsProviderModule
    ],
    exports: [
        ButtonComponent,
        ChangePasswordComponent,
        EditComponent,
        EditTabComponent,
        EditManyToManyComponent,
        EditOneToManyComponent,
        FormItemComponent,
        ListComponent,
        UploadComponent,
        HasAnyAuthorityDirective
    ]
})
export class ComponentModule { }
