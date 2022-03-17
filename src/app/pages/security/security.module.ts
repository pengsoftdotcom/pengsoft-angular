import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentModule } from 'src/app/components/component.module';
import { AuthorityComponent } from './authority/authority.component';
import { RolePopupComponent } from './role/role-popup.component';
import { RoleComponent } from './role/role.component';
import { SecurityRoutingModule } from './security-routing.module';
import { UserComponent } from './user/user.component';
import { UserPopupComponent } from './user/user-popup.component';



@NgModule({
    declarations: [UserComponent, RoleComponent, AuthorityComponent, RolePopupComponent, UserPopupComponent],
    imports: [
        CommonModule,
        SecurityRoutingModule,
        ComponentModule
    ]
})
export class SecurityModule { }
