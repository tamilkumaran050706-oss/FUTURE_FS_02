# CRM Backend (Node.js + Express + MySQL)

Backend API for the Real Estate Lead Management CRM.

## Project Overview

This backend provides a REST API for managing real estate leads, including support for:

- Create, read, update, and delete leads
- Pagination, searching, and filtering
- Input validation with `express-validator`
- Centralized error handling
- MySQL connection pooling with `mysql2/promise`

## Installation

1. Navigate to the backend directory:

   ```bash
   cd crm-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file from the example:

   ```bash
   copy .env.example .env
   ```

4. Update `.env` with your MySQL connection settings.

## Database Setup

Run the SQL in `database/schema.sql` to create the database and `leads` table:

```sql
CREATE DATABASE IF NOT EXISTS real_estate_crm;
USE real_estate_crm;
-- then create the leads table
```

## Environment Variables

The backend reads configuration from `.env`:

- `PORT` - server port (default `5000`)
- `NODE_ENV` - environment (`development` or `production`)
- `DB_HOST` - MySQL hostname
- `DB_PORT` - MySQL port (`3306`)
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name

## API Endpoints

### Get All Leads

`GET /api/leads`

Query parameters:

- `page` - page number
- `limit` - page size
- `search` - search term for customer name, email, phone, property interest, and notes
- `status` - filter by lead status
- `source` - filter by lead source
- `priority` - filter by lead priority

### Get Lead by ID

`GET /api/leads/:id`

### Create Lead

`POST /api/leads`

Body fields:

- `customer_name` (required)
- `email` (required)
- `phone` (required, 10 digits)
- `property_interest` (required)
- `budget` (required, numeric > 0)
- `source`
- `status`
- `priority`
- `notes`
- `follow_up_date`
- `follow_up_time`

### Update Lead

`PUT /api/leads/:id`

Allowed fields:

- `customer_name`
- `email`
- `phone`
- `property_interest`
- `budget`
- `source`
- `status`
- `priority`
- `notes`
- `follow_up_date`
- `follow_up_time`

### Delete Lead

`DELETE /api/leads/:id`

## Running Locally

Run the backend with hot reload:

```bash
npm run dev
```

Run in production:

```bash
npm start
```
