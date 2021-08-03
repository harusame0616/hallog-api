import {MigrationInterface, QueryRunner} from "typeorm";

export class publishedAtAddition1627195119592 implements MigrationInterface {
    name = 'publishedAtAddition1627195119592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `article_entity` ADD `publishedAt` timestamp NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `article_entity` DROP COLUMN `publishedAt`");
    }

}
