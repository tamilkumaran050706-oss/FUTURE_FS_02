# CRM Backend (Node.js + Express + MySQL)

Real Estate Lead Management CRM API service.

## Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd crm-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Set database host, user, password, and database name.

4. Initialize the MySQL database:
   - Run the SQL statements inside `database/schema.sql` on your MySQL server.

5. Run in development mode (with hot reloading):
   ```bash
   npm run dev
   ```

6. Run in production mode:
   ```bash
   npm start
   ```

## Environment Variables

The application reads configurations from `.env` in the root backend folder:

- `PORT`: Server port (default: `5000`)
- `NODE_ENV`: Runtime environment (`development` or `production`)
- `DB_HOST`: Database server hostname
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

## Database Configuration

See SQL schema structures and instructions inside `database/schema.sql`.
