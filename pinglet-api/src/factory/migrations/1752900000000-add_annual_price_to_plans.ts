import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnnualPriceToPlans1752900000000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Add missing enum values to plans_name_enum (synchronize hasn't run yet)
		await queryRunner.query(`
			DO \$\$ BEGIN
				IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'starter' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'plans_name_enum')) THEN
					ALTER TYPE plans_name_enum ADD VALUE 'starter';
				END IF;
				IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'professional' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'plans_name_enum')) THEN
					ALTER TYPE plans_name_enum ADD VALUE 'professional';
				END IF;
				IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'enterprise' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'plans_name_enum')) THEN
					ALTER TYPE plans_name_enum ADD VALUE 'enterprise';
				END IF;
			END \$\$;
		`);
		await queryRunner.query(`ALTER TABLE plans ADD COLUMN IF NOT EXISTS annual_price int DEFAULT 0;`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE plans DROP COLUMN IF EXISTS annual_price;`);
	}
}
