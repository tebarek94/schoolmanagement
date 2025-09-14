const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  port: process.env.DB_PORT || 3306
};

async function createAdminUser() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully!');
    
    // Check if admin user already exists
    const [existingAdmin] = await connection.execute(
      'SELECT u.id, u.email, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = "Admin" LIMIT 1'
    );
    
    if (existingAdmin.length > 0) {
      console.log('👤 Existing admin user found:');
      console.log(`   Email: ${existingAdmin[0].email}`);
      console.log(`   Role: ${existingAdmin[0].role}`);
      
      // Ask if user wants to reset password
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise((resolve) => {
        rl.question('Do you want to reset the admin password? (y/n): ', resolve);
      });
      
      rl.close();
      
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        const newPassword = await new Promise((resolve) => {
          const rl2 = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          rl2.question('Enter new password for admin: ', resolve);
        });
        
        if (newPassword.trim()) {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await connection.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, existingAdmin[0].id]
          );
          console.log('✅ Admin password updated successfully!');
          console.log(`📧 Login with email: ${existingAdmin[0].email}`);
          console.log(`🔑 Password: ${newPassword}`);
        } else {
          console.log('❌ Password cannot be empty');
        }
      } else {
        console.log('ℹ️  No changes made');
      }
    } else {
      console.log('❌ No admin user found. Creating new admin user...');
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const email = await new Promise((resolve) => {
        rl.question('Enter admin email: ', resolve);
      });
      
      const password = await new Promise((resolve) => {
        rl.question('Enter admin password: ', resolve);
      });
      
      rl.close();
      
      if (email.trim() && password.trim()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new admin user
        await connection.execute(
          'INSERT INTO users (email, password, role_id, is_active) VALUES (?, ?, 1, TRUE)',
          [email.trim(), hashedPassword]
        );
        
        console.log('✅ Admin user created successfully!');
        console.log(`📧 Email: ${email.trim()}`);
        console.log(`🔑 Password: ${password}`);
      } else {
        console.log('❌ Email and password are required');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('💡 Make sure your database is running and the connection details are correct.');
    console.error('💡 Check your .env file for database configuration.');
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the function
createAdminUser();
