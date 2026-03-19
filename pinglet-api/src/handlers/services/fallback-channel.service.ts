import type { FallbackChannelsConfig } from "@/utils/interfaces/project.interface";
import { MailService } from "@/utils/services/mail/mailService";
import { Logging } from "@/logs";

const mailer = MailService.getInstance();

/**
 * Sends fallback notification via email when push notification fails.
 */
export async function sendEmailFallback(
	config: FallbackChannelsConfig,
	recipientEmail: string,
	notification: { title: string; body?: string; url?: string },
) {
	if (!config.email?.enabled || !recipientEmail) return;

	try {
		await mailer.SendMail({
			to: recipientEmail,
			subject: notification.title,
			html: `
				<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
					<h2 style="color: #333;">${escapeHtml(notification.title)}</h2>
					${notification.body ? `<p style="color: #666;">${escapeHtml(notification.body)}</p>` : ""}
					${notification.url ? `<p><a href="${escapeHtml(notification.url)}" style="color: #4da6ff;">View Details</a></p>` : ""}
					<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
					<p style="font-size: 12px; color: #999;">
						${config.email.from_name || "Pinglet Notification"}
					</p>
				</div>
			`,
			text: `${notification.title}\n${notification.body || ""}\n${notification.url || ""}`,
		});
	} catch (err) {
		Logging.error(`Email fallback failed: ${err}`);
	}
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}
