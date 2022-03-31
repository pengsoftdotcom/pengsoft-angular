import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentModule } from 'src/app/components/component.module';
import { AssetComponent } from './asset/asset.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { DictionaryItemComponent } from './dictionary-item/dictionary-item.component';
import { DictionaryTypeComponent } from './dictionary-type/dictionary-type.component';
import { RegionComponent } from './region/region.component';
import { SystemRoutingModule } from './system-routing.module';
import { InternalMessageComponent } from './internal-message/internal-message.component';
import { CompositeMessageTemplateComponent } from './composite-message-template/composite-message-template.component';
import { PushMessageComponent } from './push-message/push-message.component';
import { SmsMessageComponent } from './sms-message/sms-message.component';
import { EmailMessageComponent } from './email-message/email-message.component';
import { SubscribeMessageComponent } from './subscribe-message/subscribe-message.component';
import { SystemParamComponent } from './system-param/system-param.component';



@NgModule({
    declarations: [
        AssetComponent,
        CaptchaComponent,
        DictionaryTypeComponent,
        DictionaryItemComponent,
        RegionComponent,
        InternalMessageComponent,
        CompositeMessageTemplateComponent,
        PushMessageComponent,
        SmsMessageComponent,
        EmailMessageComponent,
        SubscribeMessageComponent,
        SystemParamComponent
    ],
    imports: [
        CommonModule,
        SystemRoutingModule,
        ComponentModule
    ]
})
export class SystemModule { }
