# Randevya Backend

A NestJS-based backend service for managing salon appointments and bookings.

## Features

- User authentication and authorization
- Salon management
- Service management
- Staff management
- Appointment scheduling
- Admin dashboard
- RESTful API with Swagger documentation

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/randevya-backend.git
cd randevya-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=randevya
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d
```

4. Run database migrations:

```bash
npm run migration:run
```

5. Seed the system admin:

```bash
npm run seed:system-admin
```

## Running the Application

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

## Testing

Run unit tests:

```bash
npm run test
```

Run e2e tests:

```bash
npm run test:e2e
```

## Project Structure

```
src/
├── admin/           # Admin-specific controllers and services
├── appointments/    # Appointment management
├── auth/           # Authentication and authorization
├── config/         # Application configuration
├── database/       # Database migrations and seeds
├── salons/         # Salon management
├── services/       # Service management
├── shared/         # Shared types, enums, and utilities
├── staff/          # Staff management
└── users/          # User management
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
