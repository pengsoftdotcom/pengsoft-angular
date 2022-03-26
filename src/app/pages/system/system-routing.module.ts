import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetComponent } from './asset/asset.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { CompositeMessageTemplateComponent } from './composite-message-template/composite-message-template.component';
import { DictionaryTypeComponent } from './dictionary-type/dictionary-type.component';
import { EmailMessageComponent } from './email-message/email-message.component';
import { InternalMessageComponent } from './internal-message/internal-message.component';
import { PushMessageComponent } from './push-message/push-message.component';
import { RegionComponent } from './region/region.component';
import { SmsMessageComponent } from './sms-message/sms-message.component';
import { SubscribeMessageComponent } from './subscribe-message/subscribe-message.component';

const routes: Routes = [
    {
        path: 'system',
        data: { name: '系统设置', icon: 'setting' },
        children: [
            {
                path: '', data: { name: '消息管理', path: 'message' },
                children: [
                    { path: 'composite-message-template', component: CompositeMessageTemplateComponent, data: { code: 'system::composite_message_template::find_page', name: '消息模版' } },
                    { path: 'internal-message', component: InternalMessageComponent, data: { code: 'system::internal_message::find_page', name: '站内消息' } },
                    { path: 'push-message', component: PushMessageComponent, data: { code: 'system::push_message::find_page', name: '推送消息' } },
                    { path: 'sms-message', component: SmsMessageComponent, data: { code: 'system::sms_message::find_page', name: '短信消息' } },
                    { path: 'email-message', component: EmailMessageComponent, data: { code: 'system::email_message::find_page', name: '邮件消息' } },
                    { path: 'subscribe-message', component: SubscribeMessageComponent, data: { code: 'system::subscribe_message::find_page', name: '订阅消息' } }

                ]
            },
            { path: 'captcha', component: CaptchaComponent, data: { code: 'system::captcha::find_page', name: '验证码' } },
            { path: 'asset', component: AssetComponent, data: { code: 'system::asset::find_page', name: '附件' } },
            { path: 'dictionary-type', component: DictionaryTypeComponent, data: { code: 'system::dictionary_type::find_page', name: '数据字典' } },
            { path: 'region', component: RegionComponent, data: { code: 'system::region::find_all_by_parent', name: '行政区划' } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemRoutingModule { }
