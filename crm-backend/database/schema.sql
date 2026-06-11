CREATE DATABASE IF NOT EXISTS real_estate_crm;
USE real_estate_crm;

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  property_interest VARCHAR(255) NOT NULL,
  budget DECIMAL(15,2) NOT NULL,
  source ENUM(
    'Website',
    'Referral',
    'Facebook',
    'Instagram',
    'Walk-in',
    'Property Portal',
    'Other'
  ) DEFAULT 'Website',
  status ENUM(
    'New',
    'Contacted',
    'Site Visit Scheduled',
    'Negotiating',
    'Closed Deal',
    'Not Interested'
  ) DEFAULT 'New',
  priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
  notes TEXT,
  follow_up_date DATE,
  follow_up_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
