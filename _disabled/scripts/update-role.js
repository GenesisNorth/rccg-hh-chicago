#!/usr/bin/env node

/**
 * Update User Role Script
 * Usage: node scripts/update-role.js email@domain.com SUPERADMIN
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
    process.exit(1);
  }
}

async function updateUserRole(email, role) {
  try {
    console.log(`🔄 Updating role for ${email} to ${role}...`);
    
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found user: ${userRecord.uid}`);
    
    // Update role in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).update({
      role: role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Updated Firestore document');
    
    // Update custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { 
      role: role,
      isAdmin: ['SUPERADMIN', 'ADMIN', 'PASTOR'].includes(role),
      isSuperAdmin: role === 'SUPERADMIN',
    });
    console.log('✅ Updated custom claims');
    
    console.log(`\n🎉 Successfully updated ${email} to ${role}`);
    console.log(`   User ID: ${userRecord.uid}`);
    console.log(`   Role: ${role}`);
    
    if (['SUPERADMIN', 'ADMIN', 'PASTOR'].includes(role)) {
      console.log('\n👑 Admin Access Granted!');
      console.log('   The user can now access the admin panel');
    }
    
  } catch (error) {
    console.error('❌ Error updating role:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n💡 User not found. Make sure they have signed up first at:');
      console.log('   http://localhost:3000/auth/signup');
    }
  }
}

// Get command line arguments
const email = process.argv[2];
const role = process.argv[3] || 'SUPERADMIN';

if (!email) {
  console.log('Usage: node scripts/update-role.js <email> [role]');
  console.log('Example: node scripts/update-role.js admin@lscabuja.org SUPERADMIN');
  console.log('\nAvailable roles: SUPERADMIN, ADMIN, PASTOR, LEADER, MEMBER');
  process.exit(1);
}

updateUserRole(email, role).then(() => process.exit(0));