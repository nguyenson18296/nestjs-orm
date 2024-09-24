import { MigrationInterface, QueryRunner } from "typeorm"

export class AddingPostType1727148205883 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "post_type" character varying NOT NULL DEFAULT 'normal'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "post_type"`);
    }
}
