import {MigrationInterface, QueryRunner} from "typeorm";

export class tagEntity1627385513952 implements MigrationInterface {
    name = 'tagEntity1627385513952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `tag_entity` ADD PRIMARY KEY (`name`)");
        await queryRunner.query("ALTER TABLE `tag_entity` ADD CONSTRAINT `FK_beb2a5d9f5363fe42427238b0da` FOREIGN KEY (`articleId`) REFERENCES `article_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `tag_entity` DROP FOREIGN KEY `FK_beb2a5d9f5363fe42427238b0da`");
        await queryRunner.query("ALTER TABLE `tag_entity` DROP PRIMARY KEY");
    }

}
