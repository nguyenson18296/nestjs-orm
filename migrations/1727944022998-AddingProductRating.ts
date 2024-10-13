import { MigrationInterface, QueryRunner } from "typeorm"

export class AddingProductRating1727944022998 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "rating" integer NOT NULL DEFAULT 5`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "rating"`)
    }
}
