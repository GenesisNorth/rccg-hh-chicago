import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, deleteDoc, connectFirestoreEmulator } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
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

async function testBasicConnection() {
  console.log('🔥 Testing Basic Firebase Connection...\n');

  try {
    // Test 1: Firebase App Initialization
    console.log('1. Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');

    // Test 2: Firestore Connection
    console.log('\n2. Testing Firestore...');
    const db = getFirestore(app);
    console.log('✅ Firestore instance created');

    // Test 3: Simple document write (using test collection with open rules)
    console.log('\n3. Testing document write...');
    const testDocRef = doc(db, 'test', 'connection-test');
    await setDoc(testDocRef, {
      message: 'Firebase connection successful!',
      timestamp: new Date().toISOString(),
      testId: 'basic-connection-test'
    });
    console.log('✅ Document written successfully');

    // Test 4: Document read
    console.log('\n4. Testing document read...');
    const docSnap = await getDoc(testDocRef);
    if (docSnap.exists()) {
      console.log('✅ Document read successfully');
      console.log('   Data:', docSnap.data());
    } else {
      console.log('❌ Document not found');
    }

    // Test 5: Document deletion
    console.log('\n5. Cleaning up test document...');
    await deleteDoc(testDocRef);
    console.log('✅ Test document deleted');

    console.log('\n🎉 All basic Firebase tests passed!');
    console.log('Your Firebase connection is working perfectly.');

    return true;

  } catch (error: any) {
    console.error('\n❌ Firebase test failed:', error);
    
    if (error.code === 'permission-denied') {
      console.log('\n💡 Permission Error Solutions:');
      console.log('   - Make sure Firestore rules are deployed');
      console.log('   - Check if the test collection rules allow writes');
      console.log('   - Run: firebase deploy --only firestore:rules');
    }
    
    if (error.code === 'unavailable') {
      console.log('\n💡 Network Error Solutions:');
      console.log('   - Check your internet connection');
      console.log('   - Verify Firebase project exists');
      console.log('   - Try again in a few moments');
    }

    return false;
  }
}

async function testAuthAndFirestore() {
  console.log('\n🔐 Testing Authentication + Firestore...\n');

  try {
    const app = initializeApp(firebaseConfig, 'auth-test');
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('1. Testing anonymous authentication...');
    
    // Enable anonymous auth if needed
    const userCredential = await signInAnonymously(auth);
    console.log('✅ Anonymous authentication successful');
    console.log('   User ID:', userCredential.user.uid);

    console.log('\n2. Testing authenticated Firestore access...');
    const userTestDoc = doc(db, 'test', 'auth-test');
    await setDoc(userTestDoc, {
      message: 'Authenticated user test',
      userId: userCredential.user.uid,
      timestamp: new Date().toISOString()
    });
    console.log('✅ Authenticated write successful');

    // Clean up
    await deleteDoc(userTestDoc);
    await auth.signOut();
    console.log('✅ Cleanup completed');

    return true;

  } catch (error: any) {
    console.error('❌ Auth + Firestore test failed:', error);
    
    if (error.code === 'auth/operation-not-allowed') {
      console.log('\n💡 Anonymous Auth Error:');
      console.log('   - Enable Anonymous Authentication in Firebase Console');
      console.log('   - Go to Authentication > Sign-in method > Anonymous');
    }

    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Firebase Connection Tests');
  console.log('=' .repeat(50));

  const basicTest = await testBasicConnection();
  const authTest = await testAuthAndFirestore();

  console.log('\n' + '=' .repeat(50));
  console.log('📊 Test Results:');
  console.log(`   Basic Connection: ${basicTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Auth + Firestore: ${authTest ? '✅ PASS' : '❌ FAIL'}`);

  if (basicTest) {
    console.log('\n🎉 Your Firebase setup is working correctly!');
    console.log('✅ Ready for development and deployment');
  } else {
    console.log('\n⚠️  Connection issues detected. Check error messages above.');
  }

  process.exit(basicTest ? 0 : 1);
}

runTests().catch(console.error);