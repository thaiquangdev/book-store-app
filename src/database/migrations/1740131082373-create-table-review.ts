import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableReview1740131082373 implements MigrationInterface {
    name = 'CreateTableReview1740131082373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`like_reviews\` (\`id\` varchar(36) NOT NULL, \`review_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report_reviews\` (\`id\` varchar(36) NOT NULL, \`reason\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`review_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reviews\` (\`id\` varchar(36) NOT NULL, \`star\` int NOT NULL, \`comment\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`product_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`like_reviews\` ADD CONSTRAINT \`FK_d5a5b234afc57b398d84d755058\` FOREIGN KEY (\`review_id\`) REFERENCES \`reviews\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_reviews\` ADD CONSTRAINT \`FK_8cea64a7244124400ea86375bd8\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report_reviews\` ADD CONSTRAINT \`FK_474ea87b69718dfe98385305812\` FOREIGN KEY (\`review_id\`) REFERENCES \`reviews\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report_reviews\` ADD CONSTRAINT \`FK_bf8961af2f7b7bee4b7226a6ae7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_9482e9567d8dcc2bc615981ef44\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_728447781a30bc3fcfe5c2f1cdf\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_728447781a30bc3fcfe5c2f1cdf\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_9482e9567d8dcc2bc615981ef44\``);
        await queryRunner.query(`ALTER TABLE \`report_reviews\` DROP FOREIGN KEY \`FK_bf8961af2f7b7bee4b7226a6ae7\``);
        await queryRunner.query(`ALTER TABLE \`report_reviews\` DROP FOREIGN KEY \`FK_474ea87b69718dfe98385305812\``);
        await queryRunner.query(`ALTER TABLE \`like_reviews\` DROP FOREIGN KEY \`FK_8cea64a7244124400ea86375bd8\``);
        await queryRunner.query(`ALTER TABLE \`like_reviews\` DROP FOREIGN KEY \`FK_d5a5b234afc57b398d84d755058\``);
        await queryRunner.query(`DROP TABLE \`reviews\``);
        await queryRunner.query(`DROP TABLE \`report_reviews\``);
        await queryRunner.query(`DROP TABLE \`like_reviews\``);
    }

}
