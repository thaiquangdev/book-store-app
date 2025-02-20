import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableProduct1740046449214 implements MigrationInterface {
    name = 'CreateTableProduct1740046449214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_images\` (\`id\` varchar(36) NOT NULL, \`url\` varchar(255) NOT NULL, \`type\` varchar(255) NULL, \`productId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`inventory\` (\`id\` varchar(36) NOT NULL, \`stock\` int NOT NULL DEFAULT '0', \`sold\` int NOT NULL DEFAULT '0', \`imported\` int NOT NULL DEFAULT '0', \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`product_id\` varchar(36) NULL, UNIQUE INDEX \`REL_732fdb1f76432d65d2c136340d\` (\`product_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` varchar(36) NOT NULL, \`productName\` varchar(255) NOT NULL, \`productSlug\` varchar(255) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`discount\` decimal(5,2) NOT NULL DEFAULT '0.00', \`description\` text NULL, \`supplier\` varchar(255) NULL, \`author\` varchar(255) NULL, \`publisher\` varchar(255) NULL, \`coverFormat\` varchar(255) NULL, \`yearOfPublication\` int NULL, \`language\` varchar(255) NULL, \`pageOfNumber\` int NULL, \`avgRating\` decimal(2,1) NOT NULL DEFAULT '0.0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`inventory_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_270b1a4eb00eebe56b528e909f\` (\`productName\`), UNIQUE INDEX \`IDX_27669e600697c50927a5cfa065\` (\`productSlug\`), UNIQUE INDEX \`REL_834b52ac77bc55fc5d0eb014ae\` (\`inventory_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stock_history\` (\`id\` varchar(36) NOT NULL, \`quantity\` int NOT NULL, \`type\` enum ('Import', 'Sale', 'Adjustment') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`productId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_images\` ADD CONSTRAINT \`FK_b367708bf720c8dd62fc6833161\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inventory\` ADD CONSTRAINT \`FK_732fdb1f76432d65d2c136340dc\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_834b52ac77bc55fc5d0eb014ae2\` FOREIGN KEY (\`inventory_id\`) REFERENCES \`inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_history\` ADD CONSTRAINT \`FK_245fa798752893dd5046f1de46c\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stock_history\` DROP FOREIGN KEY \`FK_245fa798752893dd5046f1de46c\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_834b52ac77bc55fc5d0eb014ae2\``);
        await queryRunner.query(`ALTER TABLE \`inventory\` DROP FOREIGN KEY \`FK_732fdb1f76432d65d2c136340dc\``);
        await queryRunner.query(`ALTER TABLE \`product_images\` DROP FOREIGN KEY \`FK_b367708bf720c8dd62fc6833161\``);
        await queryRunner.query(`DROP TABLE \`stock_history\``);
        await queryRunner.query(`DROP INDEX \`REL_834b52ac77bc55fc5d0eb014ae\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_27669e600697c50927a5cfa065\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_270b1a4eb00eebe56b528e909f\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP INDEX \`REL_732fdb1f76432d65d2c136340d\` ON \`inventory\``);
        await queryRunner.query(`DROP TABLE \`inventory\``);
        await queryRunner.query(`DROP TABLE \`product_images\``);
    }

}
