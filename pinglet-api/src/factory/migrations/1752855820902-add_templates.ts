import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddTemplates1752855820902 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      INSERT INTO template_category (name, slug, description) VALUES
        ('🛒 E-commerce', 'e-commerce', 'Templates for online stores and shopping'),
        ('💳 Payment', 'payment', 'Payment and billing notifications'),
        ('📢 Marketing', 'marketing', 'Marketing and promotional campaigns'),
        ('🚚 Delivery', 'delivery', 'Delivery and logistics notifications'),
        ('📊 Survey & Polls', 'survey-polls', 'Collect feedback and opinions'),
        ('🏢 Agency', 'agency', 'Templates for agencies and service providers'),
        ('👩‍⚕️ Healthcare', 'healthcare', 'Reminders and health-related notifications'),
        ('📅 Appointments', 'appointments', 'Booking confirmations and reminders'),
        ('🎓 Education', 'education', 'Notifications for schools, courses, and students'),
        ('🎁 Offers & Discounts', 'offers-discounts', 'Limited-time deals and discounts'),
        ('🔐 Security', 'security', '2FA codes, suspicious activity alerts'),
        ('👥 User Engagement', 'user-engagement', 'Welcome messages, tips, and re-engagement'),
        ('🔔 System Alerts', 'system-alerts', 'Downtime, maintenance, and system issues'),
        ('🛠 Support & Helpdesk', 'support-helpdesk', 'Customer support and ticket updates'),
        ('🌍 Travel', 'travel', 'Flight updates, hotel bookings, and itineraries'),
        ('📦 Order Updates', 'order-updates', 'Order confirmations, shipping, and tracking');
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DELETE FROM template_category WHERE slug IN (
        'e-commerce',
        'payment',
        'marketing',
        'delivery',
        'survey-polls',
        'agency',
        'healthcare',
        'appointments',
        'education',
        'offers-discounts',
        'security',
        'user-engagement',
        'system-alerts',
        'support-helpdesk',
        'travel',
        'order-updates'
      );
    `);
	}
}
