import { NgModule } from '@angular/core';
import {
    BookOutline,
    DashboardOutline,
    FormOutline,
    HomeOutline,
    LockOutline,
    MenuFoldOutline,
    MenuUnfoldOutline,
    PlusOutline,
    ReloadOutline,
    SafetyOutline,
    SettingOutline,
    UserOutline,
    PictureTwoTone,
    InboxOutline,
    FileOutline,
    SendOutline,
    DeleteOutline,
    AppstoreOutline,
    DatabaseOutline,
    AlertOutline,
    FileExcelOutline,
    TabletOutline,
    DownloadOutline,
    FileTwoTone,
    KeyOutline,
    BellOutline,
    UnorderedListOutline
} from '@ant-design/icons-angular/icons';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';


const icons = [
    BookOutline,
    DashboardOutline,
    FormOutline,
    HomeOutline,
    LockOutline,
    MenuFoldOutline,
    MenuUnfoldOutline,
    PlusOutline,
    ReloadOutline,
    SafetyOutline,
    SettingOutline,
    UserOutline,
    PictureTwoTone,
    InboxOutline,
    FileOutline,
    SendOutline,
    DeleteOutline,
    AppstoreOutline,
    DatabaseOutline,
    AlertOutline,
    FileExcelOutline,
    TabletOutline,
    DownloadOutline,
    FileTwoTone,
    KeyOutline,
    BellOutline,
    UnorderedListOutline
];

@NgModule({
    imports: [NzIconModule],
    exports: [NzIconModule],
    providers: [
        { provide: NZ_ICONS, useValue: icons }
    ]
})
export class IconsProviderModule {
}
