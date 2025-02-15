import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOtpColumn1739504283840 implements MigrationInterface {
    name = 'UpdateOtpColumn1739504283840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`otp\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`otp\` varchar(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`otpExpiry\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`otpExpiry\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`otpExpiry\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`otpExpiry\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`otp\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`otp\` varchar(255) NULL`);
    }

}
