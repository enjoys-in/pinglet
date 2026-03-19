import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebhookTracking1753100000000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE webhooks
			 ADD COLUMN IF NOT EXISTS success_count int DEFAULT 0,
			 ADD COLUMN IF NOT EXISTS failure_count int DEFAULT 0,
			 ADD COLUMN IF NOT EXISTS last_triggered_at timestamp NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE webhooks
			 DROP COLUMN IF EXISTS success_count,
			 DROP COLUMN IF EXISTS failure_count,
			 DROP COLUMN IF EXISTS last_triggered_at`,
		);
	}
}
