const { pool } = require('../config/db');

const allowedFilters = ['status', 'source', 'priority'];

const buildFilters = (query) => {
  const clauses = [];
  const values = [];

  if (query.search) {
    const searchTerm = `%${query.search.trim()}%`;
    clauses.push(
      '(customer_name LIKE ? OR email LIKE ? OR phone LIKE ? OR property_interest LIKE ? OR notes LIKE ?)'
    );
    values.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  allowedFilters.forEach((key) => {
    if (query[key]) {
      clauses.push(`${key} = ?`);
      values.push(query[key]);
    }
  });

  return { whereClause: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', values };
};

const Lead = {
  findAll: async (query) => {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
    const offset = (page - 1) * limit;
    const { whereClause, values } = buildFilters(query);

    const countSql = `SELECT COUNT(*) AS total FROM leads ${whereClause}`;
    const [countRows] = await pool.query(countSql, values);
    const total = countRows[0]?.total || 0;

    const querySql = `SELECT * FROM leads ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const [rows] = await pool.query(querySql, [...values, limit, offset]);

    return {
      leads: rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);
    return rows[0] || null;
  },

  create: async (leadData) => {
    const {
      customer_name,
      email,
      phone,
      property_interest,
      budget,
      source = 'Website',
      status = 'New',
      priority = 'Medium',
      notes = null,
      follow_up_date = null,
      follow_up_time = null,
    } = leadData;

    const [result] = await pool.query(
      `INSERT INTO leads (
        customer_name,
        email,
        phone,
        property_interest,
        budget,
        source,
        status,
        priority,
        notes,
        follow_up_date,
        follow_up_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_name,
        email,
        phone,
        property_interest,
        budget,
        source,
        status,
        priority,
        notes,
        follow_up_date,
        follow_up_time,
      ]
    );

    return Lead.findById(result.insertId);
  },

  update: async (id, leadData) => {
    const fields = [];
    const values = [];
    const updatableFields = [
      'customer_name',
      'email',
      'phone',
      'property_interest',
      'budget',
      'source',
      'status',
      'priority',
      'notes',
      'follow_up_date',
      'follow_up_time',
    ];

    updatableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(leadData, field)) {
        fields.push(`${field} = ?`);
        values.push(leadData[field]);
      }
    });

    if (!fields.length) {
      return Lead.findById(id);
    }

    const updateSql = `UPDATE leads SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await pool.query(updateSql, values);
    if (result.affectedRows === 0) {
      return null;
    }

    return Lead.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM leads WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = Lead;
