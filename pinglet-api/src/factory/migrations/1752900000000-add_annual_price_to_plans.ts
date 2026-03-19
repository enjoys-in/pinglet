import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnnualPriceToPlans1752900000000 implements MigrationInterface {
	// Must run outside a transaction — ALTER TYPE ADD VALUE is not safe inside one
	transaction = false as const;

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Add missing enum values (IF NOT EXISTS requires PostgreSQL 12+)
		await queryRunner.query(`ALTER TYPE plans_name_enum ADD VALUE IF NOT EXISTS 'starter';`);
		await queryRunner.query(`ALTER TYPE plans_name_enum ADD VALUE IF NOT EXISTS 'professional';`);
		await queryRunner.query(`ALTER TYPE plans_name_enum ADD VALUE IF NOT EXISTS 'enterprise';`);
		await queryRunner.query(`ALTER TABLE plans ADD COLUMN IF NOT EXISTS annual_price int DEFAULT 0;`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE plans DROP COLUMN IF EXISTS annual_price;`);
	}
}
