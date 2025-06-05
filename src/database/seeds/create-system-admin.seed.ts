import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../shared/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export async function createSystemAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Check if system admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@randevya.com' },
  });

  if (existingAdmin) {
    console.log('System admin already exists');
    return;
  }

  // Create the system admin user
  const adminUser = userRepository.create({
    name: 'System Administrator',
    email: 'admin@randevya.com',
    passwordHash: await bcrypt.hash('admin123', 10),
    role: UserRole.SYSTEM_ADMIN,
  });

  await userRepository.save(adminUser);

  console.log('System admin created successfully');
  console.log('Email: admin@randevya.com');
  console.log('Password: admin123');
  console.log('IMPORTANT: Please change the password after first login!');
}
