import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeSalonIdNullable1715000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, ensure no system admins exist yet
    const users = await queryRunner.query(
      `SELECT * FROM users WHERE role = 'system_admin'`,
    );
    if (users.length > 0) {
      throw new Error(
        'Cannot make salonId nullable: system admin users already exist',
      );
    }

    // Make salonId nullable
    await queryRunner.query(
      `ALTER TABLE users ALTER COLUMN "salonId" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // First, ensure no users have null salonId
    const users = await queryRunner.query(
      `SELECT * FROM users WHERE "salonId" IS NULL`,
    );
    if (users.length > 0) {
      throw new Error(
        'Cannot make salonId non-nullable: users with null salonId exist',
      );
    }

    // Make salonId non-nullable again
    await queryRunner.query(
      `ALTER TABLE users ALTER COLUMN "salonId" SET NOT NULL`,
    );
  }
}
