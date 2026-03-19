import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnnualPriceToPlans1752900000000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Recreate enum with all values (ALTER TYPE ADD VALUE can't run in a transaction)
		const hasEnum = await queryRunner.query(
			`SELECT 1 FROM pg_type WHERE typname = 'plans_name_enum'`
		);
		if (hasEnum.length > 0) {
			await queryRunner.query(`ALTER TYPE plans_name_enum RENAME TO plans_name_enum_old;`);
			await queryRunner.query(`CREATE TYPE plans_name_enum AS ENUM ('free', 'starter', 'professional', 'enterprise');`);
			await queryRunner.query(`ALTER TABLE plans ALTER COLUMN name TYPE plans_name_enum USING name::text::plans_name_enum;`);
			await queryRunner.query(`DROP TYPE plans_name_enum_old;`);
		} else {
			await queryRunner.query(`CREATE TYPE plans_name_enum AS ENUM ('free', 'starter', 'professional', 'enterprise');`);
		}

		await queryRunner.query(`ALTER TABLE plans ADD COLUMN IF NOT EXISTS annual_price int DEFAULT 0;`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE plans DROP COLUMN IF EXISTS annual_price;`);
	}
}
