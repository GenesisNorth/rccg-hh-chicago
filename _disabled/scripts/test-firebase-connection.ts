#!/usr/bin/env npx ts-node

/**
 * Firebase Connection Test Script
 * 
 * This script tests the connection to Firebase services
 * Run with: npx ts-node scripts/test-firebase-connection.ts
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase Connection...\n');

  // Check environment variables
  console.log('📋 Environment Variables Check:');
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  let missingVars = [];
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      console.log(`  ✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`  ❌ ${varName}: MISSING`);
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.log('\n❌ Missing environment variables. Please check your .env.local file.');
    console.log('Missing variables:', missingVars.join(', '));
    process.exit(1);
  }

  try {
    // Initialize Firebase
    console.log('\n🚀 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('  ✅ Firebase app initialized');

    // Test Auth
    console.log('\n🔐 Testing Authentication...');
    const auth = getAuth(app);
    console.log('  ✅ Auth instance created');
    console.log(`  📊 Current user: ${auth.currentUser ? auth.currentUser.email : 'None'}`);

    // Test Firestore
    console.log('\n🗄️  Testing Firestore...');
    const db = getFirestore(app);
    console.log('  ✅ Firestore instance created');

    // Try to write and read a test document
    const testDocRef = doc(db, 'test', 'connection-test');
    const testData = {
      message: 'Firebase connection test',
      timestamp: new Date(),
      projectId: firebaseConfig.projectId
    };

    await setDoc(testDocRef, testData);
    console.log('  ✅ Test document written to Firestore');

    const docSnap = await getDoc(testDocRef);
    if (docSnap.exists()) {
      console.log('  ✅ Test document read from Firestore');
      console.log(`  📄 Document data:`, docSnap.data());
    } else {
      console.log('  ❌ Test document not found');
    }

    // Test Storage
    console.log('\n📁 Testing Storage...');
    const storage = getStorage(app);
    console.log('  ✅ Storage instance created');
    console.log(`  🪣 Storage bucket: ${storage.app.options.storageBucket}`);

    console.log('\n🎉 All Firebase services connected successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Start your development server: npm run dev');
    console.log('  2. Open http://localhost:3000');
    console.log('  3. Try signing up/signing in');
    console.log('  4. Check Firebase Console for users and data');

  } catch (error) {
    console.error('\n❌ Firebase connection failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Check your .env.local file has correct Firebase config');
    console.log('  2. Ensure Firebase project exists and services are enabled');
    console.log('  3. Check Firebase Console for any issues');
    console.log('  4. Verify your internet connection');
    process.exit(1);
  }
}

// Run the test
testFirebaseConnection().catch(console.error);