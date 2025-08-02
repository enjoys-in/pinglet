import { OnEvent } from "@/utils/decorators";
import { MailService } from "@/utils/services/mail/mailService";

const mailer = MailService.getInstance()
export class EventListeners {
    constructor() { }

    @OnEvent("resetPassword", { async: false })
    private sendResetPassEmail(payload: any) {
        const data = JSON.parse(payload) as { name: string, email: string, adminEmail: string,password: string }
        mailer.SendTemplate({
            to: [data.adminEmail],
            subject: "Password Reset",
            template: "reset-password",
            context: { name: data.name, email: data.email,password: data.password }
        })

    }
}