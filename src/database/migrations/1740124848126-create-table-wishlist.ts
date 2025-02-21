import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableWishlist1740124848126 implements MigrationInterface {
    name = 'CreateTableWishlist1740124848126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`wishlists\` (\`id\` varchar(36) NOT NULL, \`product_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_9c64a981c56ba677ac17f5fba6\` (\`user_id\`, \`product_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`wishlists\` ADD CONSTRAINT \`FK_2662acbb3868b1f0077fda61dd2\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wishlists\` ADD CONSTRAINT \`FK_b5e6331a1a7d61c25d7a25cab8f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wishlists\` DROP FOREIGN KEY \`FK_b5e6331a1a7d61c25d7a25cab8f\``);
        await queryRunner.query(`ALTER TABLE \`wishlists\` DROP FOREIGN KEY \`FK_2662acbb3868b1f0077fda61dd2\``);
        await queryRunner.query(`DROP INDEX \`IDX_9c64a981c56ba677ac17f5fba6\` ON \`wishlists\``);
        await queryRunner.query(`DROP TABLE \`wishlists\``);
    }

}
