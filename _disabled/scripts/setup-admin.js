#!/usr/bin/env node

/**
 * Admin Setup Script for RCCG LSC Abuja
 * 
 * This script helps create admin and super admin accounts
 * Run with: node scripts/setup-admin.js
 */

const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    // Try to use environment variables first
    if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          clientId: process.env.FIREBASE_CLIENT_ID,
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log('✅ Firebase Admin initialized from environment variables');
    } else {
      // Fallback to service account file
      const serviceAccount = require('../firebase-admin-key.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
      console.log('✅ Firebase Admin initialized from service account file');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message);
    console.log('\n🔧 Setup Instructions:');
    console.log('1. Download your service account key from Firebase Console');
    console.log('2. Save it as firebase-admin-key.json in the project root');
    console.log('3. Or set up environment variables in .env.local');
    process.exit(1);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const roles = {
  1: 'SUPERADMIN',
  2: 'ADMIN', 
  3: 'PASTOR',
  4: 'LEADER',
  5: 'MEMBER'
};

async function createAdmin() {
  try {
    console.log('\n🛡️  RCCG LSC Abuja - Admin Account Setup\n');
    console.log('This script will help you create admin accounts for the church management system.\n');

    // Get user details
    const email = await question('📧 Enter email address: ');
    const name = await question('👤 Enter full name: ');
    const password = await question('🔐 Enter password (min 6 characters): ');
    const phone = await question('📱 Enter phone number (optional): ');

    // Show role options
    console.log('\n👑 Select user role:');
    Object.entries(roles).forEach(([key, value]) => {
      console.log(`${key}. ${value}`);
    });

    const roleChoice = await question('\nEnter role number (1-5): ');
    const selectedRole = roles[roleChoice];

    if (!selectedRole) {
      console.log('❌ Invalid role selection');
      return;
    }

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      return;
    }

    console.log('\n🔄 Creating user account...');

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      emailVerified: true, // Auto-verify admin emails
    });

    console.log('✅ Firebase Auth user created');

    // Create user document in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      name,
      email,
      phone: phone || null,
      role: selectedRole,
      emailVerified: true,
      image: null,
      imagePublicId: null,
      bio: `${selectedRole} of RCCG LSC Abuja`,
      address: null,
      gender: null,
      dateOfBirth: null,
      occupation: null,
      maritalStatus: null,
      anniversary: null,
      joinedChurchDate: admin.firestore.FieldValue.serverTimestamp(),
      emergencyContact: null,
      notificationPrefs: {
        email: true,
        push: true,
        sms: false,
      },
      theme: null,
      privacySettings: {
        showEmail: false,
        showPhone: false,
        showAddress: false,
      },
      departmentIds: [],
      ledDepartmentIds: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Firestore user document created');

    // Set custom claims for role-based access
    await admin.auth().setCustomUserClaims(userRecord.uid, { 
      role: selectedRole,
      isAdmin: ['SUPERADMIN', 'ADMIN', 'PASTOR'].includes(selectedRole),
    });

    console.log('✅ User role claims set');

    console.log('\n🎉 Admin account created successfully!');
    console.log('\n📊 Account Details:');
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${name}`);
    console.log(`   Role: ${selectedRole}`);
    console.log(`   User ID: ${userRecord.uid}`);
    console.log(`   Phone: ${phone || 'Not provided'}`);

    console.log('\n🔐 Login Information:');
    console.log(`   ➡️  Go to: http://localhost:3000/auth/signin`);
    console.log(`   📧 Email: ${email}`);
    console.log(`   🔑 Password: ${password}`);

    if (['SUPERADMIN', 'ADMIN', 'PASTOR'].includes(selectedRole)) {
      console.log('\n👑 Admin Access:');
      console.log(`   ➡️  Admin Panel: http://localhost:3000/admin`);
      console.log('   ✅ Full administrative privileges granted');
    }

    console.log('\n⚡ Next Steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Visit the login page and sign in with the credentials above');
    console.log('3. Access the admin panel if you have admin privileges');

  } catch (error) {
    console.error('\n❌ Error creating admin account:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      console.log('\n🔄 Email already exists. Would you like to update the role instead?');
      const updateRole = await question('Update existing user role? (y/n): ');
      
      if (updateRole.toLowerCase() === 'y') {
        await updateExistingUserRole(email);
      }
    }
  }
}

async function updateExistingUserRole(email) {
  try {
    console.log('\n🔄 Updating existing user role...');
    
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Show role options
    console.log('\n👑 Select new role:');
    Object.entries(roles).forEach(([key, value]) => {
      console.log(`${key}. ${value}`);
    });

    const roleChoice = await question('\nEnter role number (1-5): ');
    const selectedRole = roles[roleChoice];

    if (!selectedRole) {
      console.log('❌ Invalid role selection');
      return;
    }

    // Update Firestore document
    await admin.firestore().collection('users').doc(userRecord.uid).update({
      role: selectedRole,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { 
      role: selectedRole,
      isAdmin: ['SUPERADMIN', 'ADMIN', 'PASTOR'].includes(selectedRole),
    });

    console.log(`✅ User role updated to ${selectedRole}`);
    console.log(`   User ID: ${userRecord.uid}`);
    console.log(`   Email: ${email}`);

  } catch (error) {
    console.error('❌ Error updating user role:', error.message);
  }
}

async function main() {
  try {
    const action = await question('Choose action:\n1. Create new admin\n2. Update existing user role\n3. Exit\n\nEnter choice (1-3): ');
    
    switch (action) {
      case '1':
        await createAdmin();
        break;
      case '2':
        const email = await question('Enter email of existing user: ');
        await updateExistingUserRole(email);
        break;
      case '3':
        console.log('👋 Goodbye!');
        break;
      default:
        console.log('❌ Invalid choice');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createAdmin, updateExistingUserRole };