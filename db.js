const { Pool } = require('pg');

const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'Node_CRUD',
  password: 'password',
  port: 5432,
});

// CREATE - Insert a new user with images
const createUser = async (userData, imageUrls = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert user
    const userResult = await client.query(
      `INSERT INTO users (first_name, last_name, email, gender, age) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [userData.first_name, userData.last_name, userData.email, userData.gender, userData.age]
    );


    const user = userResult.rows[0];

    // Insert images if any
    if (imageUrls.length > 0) {
      const imageValues = imageUrls.map((url, index) =>
        `($1, $${index + 2})`
      ).join(', ');

      const imageParams = [user.id, ...imageUrls];
      await client.query(
        `INSERT INTO user_images (user_id, image_url) 
         VALUES ${imageValues}`,
        imageParams
      );
    }

    await client.query('COMMIT');

    return user.id; // Return user with images
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// READ - Get all users with their images
const getAllUsers = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        u.*,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', ui.id,
                'user_id', ui.user_id,
                'image_url', ui.image_url,
                'created_at', ui.created_at
              )
            )
            FROM user_images ui
            WHERE ui.user_id = u.id
          ),
          '[]'
        ) as images
      FROM users u
      GROUP BY u.id
      ORDER BY u.id`
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// READ - Get a single user by ID with their images
const getUserById = async (id) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.*,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', ui.id,
                'user_id', ui.user_id,
                'image_url', ui.image_url,
                'created_at', ui.created_at
              )
            )
            FROM user_images ui
            WHERE ui.user_id = u.id
          ),
          '[]'
        ) as images
      FROM users u
      WHERE u.id = $1
      GROUP BY u.id`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// UPDATE - Update user and their images
const updateUser = async (id, userData, imageUrls = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN')
    console.log(userData)
    // Update user
    const userResult = await client.query(
      `UPDATE users 
       SET ${Object.keys(userData).map((key, i) => `${key} = $${i + 1}`).join(', ')}
       WHERE id = $${Object.keys(userData).length + 1} 
       RETURNING *`,
      [...Object.values(userData), id]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    // If new images are provided, append new ones
    if (imageUrls.length > 0) {
      const imageValues = imageUrls.map((url, index) =>
        `($1, $${index + 2})`
      ).join(', ');

      const imageParams = [id, ...imageUrls];
      await client.query(
        `INSERT INTO user_images (user_id, image_url) 
         VALUES ${imageValues}`,
        imageParams
      );
    }

    await client.query('COMMIT');
    return await getUserById(id); // Return updated user with images
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// DELETE - Delete a user (will cascade delete their images)
const deleteUser = async (id) => {
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = ${id}`
    );
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};



