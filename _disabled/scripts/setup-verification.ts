#!/usr/bin/env npx ts-node

/**
 * Setup Verification Script
 * Checks if all required files and configurations are in place
 */

import * as fs from 'fs';
import * as path from 'path';

const checks = [
  {
    name: 'Environment Variables',
    check: () => {
      const envPath = path.join(process.cwd(), '.env.local');
      if (!fs.existsSync(envPath)) {
        return { success: false, message: '.env.local file not found' };
      }
      
      const envContent = fs.readFileSync(envPath, 'utf8');
      const requiredVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_PRIVATE_KEY'
      ];
      
      const missingVars = requiredVars.filter(v => !envContent.includes(v));
      if (missingVars.length > 0) {
        return { success: false, message: `Missing variables: ${missingVars.join(', ')}` };
      }
      
      return { success: true, message: 'All required environment variables found' };
    }
  },
  {
    name: 'Firebase Configuration Files',
    check: () => {
      const files = ['firebase.json', 'firestore.rules', 'storage.rules'];
      const missing = files.filter(f => !fs.existsSync(path.join(process.cwd(), f)));
      
      if (missing.length > 0) {
        return { success: false, message: `Missing files: ${missing.join(', ')}` };
      }
      
      return { success: true, message: 'All Firebase config files present' };
    }
  },
  {
    name: 'Functions Directory',
    check: () => {
      const functionsPath = path.join(process.cwd(), 'functions');
      if (!fs.existsSync(functionsPath)) {
        return { success: false, message: 'Functions directory not found' };
      }
      
      const packagePath = path.join(functionsPath, 'package.json');
      if (!fs.existsSync(packagePath)) {
        return { success: false, message: 'Functions package.json not found' };
      }
      
      return { success: true, message: 'Functions directory properly configured' };
    }
  },
  {
    name: 'TypeScript Configuration',
    check: () => {
      const files = ['tsconfig.json'];
      const missing = files.filter(f => !fs.existsSync(path.join(process.cwd(), f)));
      
      if (missing.length > 0) {
        return { success: false, message: `Missing files: ${missing.join(', ')}` };
      }
      
      return { success: true, message: 'TypeScript configuration found' };
    }
  },
  {
    name: 'Required Dependencies',
    check: () => {
      const packagePath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(packagePath)) {
        return { success: false, message: 'package.json not found' };
      }
      
      const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const deps = { ...packageContent.dependencies, ...packageContent.devDependencies };
      
      const required = ['firebase', 'firebase-admin', 'next', 'react', 'typescript'];
      const missing = required.filter(dep => !deps[dep]);
      
      if (missing.length > 0) {
        return { success: false, message: `Missing dependencies: ${missing.join(', ')}` };
      }
      
      return { success: true, message: 'All required dependencies installed' };
    }
  },
  {
    name: 'Firebase Utils & Types',
    check: () => {
      const files = [
        'lib/firebase.ts',
        'lib/firebase-admin.ts',
        'lib/firestore-types.ts',
        'lib/firestore-utils.ts',
        'contexts/AuthContext.tsx',
        'hooks/useFirestore.ts'
      ];
      
      const missing = files.filter(f => !fs.existsSync(path.join(process.cwd(), f)));
      
      if (missing.length > 0) {
        return { success: false, message: `Missing files: ${missing.join(', ')}` };
      }
      
      return { success: true, message: 'All Firebase utility files present' };
    }
  }
];

async function runVerification() {
  console.log('🔍 Running Setup Verification...\n');
  
  let allPassed = true;
  
  for (const check of checks) {
    const result = check.check();
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${check.name}: ${result.message}`);
    
    if (!result.success) {
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 All checks passed! Your setup is ready.');
    console.log('\n📋 Next steps:');
    console.log('1. Create Firebase project: https://console.firebase.google.com');
    console.log('2. Add your Firebase config to .env.local');
    console.log('3. Run: npm run test:firebase');
    console.log('4. Run: npm run dev');
    console.log('5. Test the application at http://localhost:3000');
  } else {
    console.log('❌ Some checks failed. Please fix the issues above.');
    console.log('\n📖 Refer to SETUP_GUIDE.md for detailed instructions.');
  }
}

runVerification().catch(console.error);