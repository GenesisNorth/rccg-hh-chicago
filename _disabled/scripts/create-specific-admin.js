#!/usr/bin/env node

/**
 * Create Specific Admin Account for RCCG LSC Abuja
 */

require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    // Try to continue anyway, sometimes it works in client mode
  }
}

async function createSpecificAdmin() {
  try {
    console.log('\n🛡️  Creating Super Admin Account\n');

    const adminData = {
      email: 'habilagenesis@gmail.com',
      password: 'Genesis1234',
      name: 'Genesis Super Admin',
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
        console.error('❌ Auth error:', error.message);
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

    console.log('\n🔐 Login Information:');
    console.log(`   🌐 Website: http://localhost:3000`);
    console.log(`   📧 Email: ${adminData.email}`);
    console.log(`   🔑 Password: ${adminData.password}`);

    console.log('\n👑 Admin Access:');
    console.log(`   🔗 Login: http://localhost:3000/auth/signin`);
    console.log(`   ⚡ Dashboard: http://localhost:3000/dashboard`);
    console.log(`   👨‍💼 Admin Panel: http://localhost:3000/admin`);

    console.log('\n✅ SUCCESS! You can now log in as Super Admin');

  } catch (error) {
    console.error('\n❌ Error creating super admin account:', error.message);
    console.log('\n💡 If this fails, you can:');
    console.log(`1. Sign up normally at: http://localhost:3000/auth/signup`);
    console.log(`2. Use email: habilagenesis@gmail.com`);
    console.log(`3. Use password: Genesis1234`);
    console.log(`4. Then run: node scripts/update-role.js habilagenesis@gmail.com SUPERADMIN`);
  }
}

createSpecificAdmin().then(() => process.exit(0));