import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserCategoryRelation1743164541036 implements MigrationInterface {
    name = 'AddUserCategoryRelation1743164541036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "userId" character varying NOT NULL`);
    }

}
