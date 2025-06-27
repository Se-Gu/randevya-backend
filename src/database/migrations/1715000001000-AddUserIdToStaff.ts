import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToStaff1715000001000 implements MigrationInterface {
  name = 'AddUserIdToStaff1715000001000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "staff" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "staff" ADD CONSTRAINT "FK_staff_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "staff" DROP CONSTRAINT "FK_staff_user"`,
    );
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "userId"`);
  }
}
