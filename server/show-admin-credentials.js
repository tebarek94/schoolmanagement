const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  port: process.env.DB_PORT || 3306
};

async function showAdminCredentials() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully!');
    
    // Get all admin users
    const [adminUsers] = await connection.execute(`
      SELECT u.id, u.email, u.is_active, u.created_at, r.name as role 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE r.name = 'Admin'
      ORDER BY u.created_at DESC
    `);
    
    if (adminUsers.length > 0) {
      console.log('\n👑 ADMIN USERS FOUND:');
      console.log('='.repeat(50));
      
      adminUsers.forEach((admin, index) => {
        console.log(`\n${index + 1}. Admin User:`);
        console.log(`   📧 Email: ${admin.email}`);
        console.log(`   🎭 Role: ${admin.role}`);
        console.log(`   ✅ Active: ${admin.is_active ? 'Yes' : 'No'}`);
        console.log(`   📅 Created: ${admin.created_at}`);
      });
      
      console.log('\n' + '='.repeat(50));
      console.log('💡 DEFAULT ADMIN CREDENTIALS:');
      console.log('📧 Email: admin@school.edu.et');
      console.log('🔑 Password: admin123 (if using default seed data)');
      console.log('\n💡 If the default password doesn\'t work, run:');
      console.log('   node create-admin.js');
      console.log('   to reset the admin password');
      
    } else {
      console.log('❌ No admin users found!');
      console.log('💡 Run: node create-admin.js');
      console.log('   to create a new admin user');
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
showAdminCredentials();
