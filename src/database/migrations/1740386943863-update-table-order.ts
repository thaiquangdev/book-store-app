import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableOrder1740386943863 implements MigrationInterface {
    name = 'UpdateTableOrder1740386943863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`orderCode\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`orderCode\``);
    }

}
