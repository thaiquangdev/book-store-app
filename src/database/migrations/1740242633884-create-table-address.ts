import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAddress1740242633884 implements MigrationInterface {
    name = 'CreateTableAddress1740242633884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`addresses\` (\`id\` varchar(36) NOT NULL, \`fullName\` varchar(255) NOT NULL, \`phoneNumber\` varchar(10) NOT NULL, \`street\` varchar(255) NOT NULL, \`city\` varchar(100) NOT NULL, \`state\` varchar(100) NOT NULL, \`zipCode\` varchar(20) NOT NULL, \`country\` varchar(100) NOT NULL, \`isDefault\` tinyint NOT NULL DEFAULT 0, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`addresses\` ADD CONSTRAINT \`FK_95c93a584de49f0b0e13f753630\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`addresses\` DROP FOREIGN KEY \`FK_95c93a584de49f0b0e13f753630\``);
        await queryRunner.query(`DROP TABLE \`addresses\``);
    }

}
