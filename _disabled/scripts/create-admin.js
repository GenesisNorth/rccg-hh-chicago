#!/usr/bin/env node

/**
 * Quick Admin Creation Script for RCCG LSC Abuja
 * 
 * This script creates a super admin account quickly using environment variables
 */

require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Initialize Firebase Admin using environment variables
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
      console.error('❌ Missing Firebase environment variables in .env.local');
      console.log('Required variables:');
      console.log('- FIREBASE_PROJECT_ID');
      console.log('- FIREBASE_PRIVATE_KEY');
      console.log('- FIREBASE_CLIENT_EMAIL');
      process.exit(1);
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message);
    process.exit(1);
  }
}

async function createSuperAdmin() {
  try {
    console.log('\n🛡️  Creating Super Admin Account for RCCG LSC Abuja\n');

    // Admin account details
    const adminData = {
      email: 'admin@lscabuja.org',
      password: 'admin123456',
      name: 'Super Administrator',
      phone: '+234-800-000-0000',
      role: 'SUPERADMIN'
    };

    console.log('🔄 Creating super admin account...');
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`👤 Name: ${adminData.name}`);
    console.log(`👑 Role: ${adminData.role}`);

    // Create user in Firebase Auth
    let userRecord;
    try {
      userRecord = await admin.auth().createUser({
        email: adminData.email,
        password: adminData.password,
        displayName: adminData.name,
        emailVerified: true,
      });
      console.log('✅ Firebase Auth user created');
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log('🔄 User already exists, getting existing user...');
        userRecord = await admin.auth().getUserByEmail(adminData.email);
        console.log('✅ Found existing user');
      } else {
        throw error;
      }
    }

    // Create/Update user document in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone,
      role: adminData.role,
      emailVerified: true,
      image: null,
      imagePublicId: null,
      bio: 'Super Administrator of RCCG LSC Abuja Church Management System',
      address: 'Abuja, Nigeria',
      gender: null,
      dateOfBirth: null,
      occupation: 'Church Administrator',
      maritalStatus: null,
      anniversary: null,
      joinedChurchDate: admin.firestore.FieldValue.serverTimestamp(),
      emergencyContact: null,
      notificationPrefs: {
        email: true,
        push: true,
        sms: true,
      },
      theme: 'system',
      privacySettings: {
        showEmail: true,
        showPhone: false,
        showAddress: false,
      },
      departmentIds: [],
      ledDepartmentIds: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log('✅ Firestore user document created/updated');

    // Set custom claims for role-based access
    await admin.auth().setCustomUserClaims(userRecord.uid, { 
      role: adminData.role,
      isAdmin: true,
      isSuperAdmin: true,
    });

    console.log('✅ User role claims set');

    console.log('\n🎉 Super Admin Account Ready!');
    console.log('\n📊 Account Details:');
    console.log(`   📧 Email: ${adminData.email}`);
    console.log(`   👤 Name: ${adminData.name}`);
    console.log(`   👑 Role: ${adminData.role}`);
    console.log(`   🆔 User ID: ${userRecord.uid}`);
    console.log(`   📱 Phone: ${adminData.phone}`);

    console.log('\n🔐 Login Information:');
    console.log(`   🌐 Website: http://localhost:3000`);
    console.log(`   📧 Email: ${adminData.email}`);
    console.log(`   🔑 Password: ${adminData.password}`);

    console.log('\n👑 Admin Access:');
    console.log(`   🔗 Login: http://localhost:3000/auth/signin`);
    console.log(`   ⚡ Dashboard: http://localhost:3000/dashboard`);
    console.log(`   👨‍💼 Admin Panel: http://localhost:3000/admin`);

    console.log('\n🚀 Next Steps:');
    console.log('1. ✅ Development server is running at http://localhost:3000');
    console.log('2. 🔗 Go to: http://localhost:3000/auth/signin');
    console.log('3. 🔑 Use the credentials above to log in');
    console.log('4. 👑 Access the admin panel from your user menu');

    console.log('\n💡 Additional Admin Accounts:');
    console.log('   To create more admin accounts, use: npm run setup:admin');
    console.log('   Or visit the admin panel → User Management');

  } catch (error) {
    console.error('\n❌ Error creating super admin account:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      console.log('\n🔄 The admin email already exists.');
      console.log('You can still log in with:');
      console.log(`   📧 Email: admin@lscabuja.org`);
      console.log(`   🔑 Password: admin123456`);
    }
  }
}

// Create another admin with different credentials
async function createSecondAdmin() {
  try {
    const adminData = {
      email: 'isaac@lscabuja.org',
      password: 'isaac123456',
      name: 'Isaac Makinde',
      phone: '+234-803-000-0000',
      role: 'SUPERADMIN'
    };

    console.log('\n🔄 Creating second admin account...');
    console.log(`📧 Email: ${adminData.email}`);

    let userRecord;
    try {
      userRecord = await admin.auth().createUser({
        email: adminData.email,
        password: adminData.password,
        displayName: adminData.name,
        emailVerified: true,
      });
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        userRecord = await admin.auth().getUserByEmail(adminData.email);
      } else {
        throw error;
      }
    }

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone,
      role: adminData.role,
      emailVerified: true,
      image: null,
      imagePublicId: null,
      bio: 'Project Administrator - RCCG LSC Abuja',
      address: 'Abuja, Nigeria',
      gender: null,
      dateOfBirth: null,
      occupation: 'System Administrator',
      maritalStatus: null,
      anniversary: null,
      joinedChurchDate: admin.firestore.FieldValue.serverTimestamp(),
      emergencyContact: null,
      notificationPrefs: {
        email: true,
        push: true,
        sms: true,
      },
      theme: 'system',
      privacySettings: {
        showEmail: true,
        showPhone: false,
        showAddress: false,
      },
      departmentIds: [],
      ledDepartmentIds: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    await admin.auth().setCustomUserClaims(userRecord.uid, { 
      role: adminData.role,
      isAdmin: true,
      isSuperAdmin: true,
    });

    console.log('✅ Second admin account created');
    console.log(`   📧 Email: ${adminData.email}`);
    console.log(`   🔑 Password: ${adminData.password}`);

  } catch (error) {
    console.log(`ℹ️  Second admin account setup: ${error.message}`);
  }
}

async function main() {
  try {
    await createSuperAdmin();
    await createSecondAdmin();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    process.exit(0);
  }
}

// Run the script
main();