import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1739462051551 implements MigrationInterface {
    name = 'CreateUserTable1739462051551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`user_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'user', \`refresh_token\` varchar(255) NULL, \`password_reset_token\` varchar(255) NULL, \`password_reset_expiry\` timestamp NULL, \`email_verify\` tinyint NOT NULL DEFAULT 0, \`otp\` varchar(255) NULL, \`otpExpiry\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_17d1817f241f10a3dbafb169fd\` (\`phone_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_17d1817f241f10a3dbafb169fd\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
