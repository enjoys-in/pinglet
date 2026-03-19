import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnnualPriceToPlans1752900000000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE plans ADD COLUMN IF NOT EXISTS annual_price int DEFAULT 0;`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE plans DROP COLUMN IF EXISTS annual_price;`);
	}
}
