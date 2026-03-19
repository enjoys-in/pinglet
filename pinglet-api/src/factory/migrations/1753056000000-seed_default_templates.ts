import { readFileSync } from "fs";
import { join } from "path";
import type { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDefaultTemplates1753056000000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const sqlPath = join(__dirname, "..", "seed", "templates.sql");
		const sql = readFileSync(sqlPath, "utf8");
		await queryRunner.query(sql);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM templates WHERE id IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,43,44) AND type = 'd';`,
		);
	}
}
