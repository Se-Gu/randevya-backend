import { DataSource } from 'typeorm';
import { Salon } from '../../salons/entities/salon.entity';
import { User } from '../../users/entities/user.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { UserRole } from '../../shared/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export async function createSampleData(dataSource: DataSource) {
  const salonRepo = dataSource.getRepository(Salon);
  const userRepo = dataSource.getRepository(User);
  const staffRepo = dataSource.getRepository(Staff);

  const defaultAvailability = [
    { day: 'Monday', slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'Tuesday', slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'Wednesday', slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'Thursday', slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'Friday', slots: [{ start: '09:00', end: '17:00' }] },
  ];

  const salonsData = [
    {
      name: 'Downtown Salon',
      phone: '+10000000001',
      email: 'downtown@salon.com',
      location: { address: '1 Main St', lat: 0, lng: 0 },
    },
    {
      name: 'Uptown Salon',
      phone: '+10000000002',
      email: 'uptown@salon.com',
      location: { address: '2 High St', lat: 0, lng: 0 },
    },
    {
      name: 'Suburb Salon',
      phone: '+10000000003',
      email: 'suburb@salon.com',
      location: { address: '3 Low St', lat: 0, lng: 0 },
    },
  ];

  for (let i = 0; i < salonsData.length; i++) {
    const salonData = salonsData[i];
    const salon = salonRepo.create({
      ...salonData,
      weeklyAvailability: defaultAvailability,
    });
    await salonRepo.save(salon);

    const owner = userRepo.create({
      name: `${salon.name} Owner`,
      email: `owner${i + 1}@salon.com`,
      passwordHash: await bcrypt.hash('123', 10),
      role: UserRole.OWNER,
      salonId: salon.id,
    });
    await userRepo.save(owner);

    for (let j = 0; j < 2; j++) {
      const staffMember = staffRepo.create({
        name: `${salon.name} Staff ${j + 1}`,
        workingHours: defaultAvailability,
        salonId: salon.id,
      });
      await staffRepo.save(staffMember);

      const staffUser = userRepo.create({
        name: staffMember.name,
        email: `staff${i + 1}${j + 1}@salon.com`,
        passwordHash: await bcrypt.hash('123', 10),
        role: UserRole.STAFF,
        salonId: salon.id,
      });
      await userRepo.save(staffUser);
    }
  }

  const extraAdmin = userRepo.create({
    name: 'Demo Admin',
    email: 'admin1@demo.com',
    passwordHash: await bcrypt.hash('123', 10),
    role: UserRole.SYSTEM_ADMIN,
  });
  await userRepo.save(extraAdmin);

  console.log('Sample data created');
}
