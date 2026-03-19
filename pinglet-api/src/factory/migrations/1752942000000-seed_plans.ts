import type { MigrationInterface, QueryRunner } from "typeorm";

export class SeedPlans1752942000000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			INSERT INTO plans (name, price, annual_price, details) VALUES
			('free', 0, 0, '${JSON.stringify({
				max_notifications_per_month: 10000,
				max_widgets: 5,
				max_webhooks: 0,
				max_projects: 1,
				max_templates: 5,
				features: {
					analytics_basic: true,
					analytics_advanced: false,
					ab_testing: false,
					basic_targeting: true,
					browser_notifications: false,
					custom_html_editor: false,
					white_label: false,
					advanced_api_access: false,
					integrations: false,
					integrations_limited: false,
					priority_support: false,
				},
			})}'),
			('starter', 700, 560, '${JSON.stringify({
				max_notifications_per_month: 100000,
				max_widgets: 100,
				max_webhooks: 0,
				max_projects: 5,
				max_templates: 20,
				features: {
					analytics_basic: true,
					analytics_advanced: false,
					ab_testing: false,
					basic_targeting: true,
					browser_notifications: false,
					custom_html_editor: false,
					white_label: false,
					advanced_api_access: false,
					integrations: true,
					integrations_limited: true,
					priority_support: false,
				},
			})}'),
			('professional', 2900, 2320, '${JSON.stringify({
				max_notifications_per_month: 500000,
				max_widgets: 250,
				max_webhooks: 10,
				max_projects: 20,
				max_templates: 100,
				features: {
					analytics_basic: true,
					analytics_advanced: true,
					ab_testing: true,
					basic_targeting: true,
					browser_notifications: true,
					custom_html_editor: true,
					white_label: false,
					advanced_api_access: false,
					integrations: true,
					integrations_limited: true,
					priority_support: true,
				},
			})}'),
			('enterprise', 9900, 7920, '${JSON.stringify({
				max_notifications_per_month: -1,
				max_widgets: -1,
				max_webhooks: -1,
				max_projects: -1,
				max_templates: -1,
				features: {
					analytics_basic: true,
					analytics_advanced: true,
					ab_testing: true,
					basic_targeting: true,
					browser_notifications: true,
					custom_html_editor: true,
					white_label: true,
					advanced_api_access: true,
					integrations: true,
					integrations_limited: false,
					priority_support: true,
				},
			})}')
			ON CONFLICT (name) DO UPDATE SET
				price = EXCLUDED.price,
				annual_price = EXCLUDED.annual_price,
				details = EXCLUDED.details;
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			DELETE FROM plans WHERE name IN ('free', 'starter', 'professional', 'enterprise');
		`);
	}
}
