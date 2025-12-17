#!/usr/bin/env node

/**
 * RepurposeIQ - Complete Integration Test
 * Tests all core features with the Groq API integration
 */

import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_BASE = 'http://localhost:3000/api';

let testResults = { passed: 0, failed: 0, total: 0 };

function logTest(name, passed, details = '') {
    testResults.total++;
    if (passed) {
        testResults.passed++;
        console.log(`✅ PASS: ${name}`);
    } else {
        testResults.failed++;
        console.log(`❌ FAIL: ${name}`);
    }
    if (details) console.log(`   ${details}`);
}

async function testGroqAPI() {
    console.log('\n🧪 Testing Groq API...');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    try {
        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Say "API Working"' }],
            model: 'llama-3.3-70b-versatile',
            max_tokens: 10
        });
        logTest('Groq API', response.choices[0].message.content.includes('Working'));
    } catch (error) {
        logTest('Groq API', false, error.message);
    }
}

async function testServer() {
    console.log('\n🏥 Testing Server...');
    try {
        const response = await axios.get(`${API_BASE}/health`);
        logTest('Server Health', response.data.status === 'ok');
    } catch (error) {
        logTest('Server Health', false, error.message);
    }
}

async function testAuth() {
    console.log('\n🔐 Testing Auth...');
    try {
        const response = await axios.post(`${API_BASE}/auth/login`, {
            username: 'demo',
            password: 'demo'
        });
        logTest('Authentication', !!response.data.token);
        return response.data.token;
    } catch (error) {
        logTest('Authentication', false, error.message);
        return null;
    }
}

async function runTests() {
    console.log('═══════════════════════════════════════');
    console.log('   RepurposeIQ Integration Tests');
    console.log('═══════════════════════════════════════');
    
    await testGroqAPI();
    await testServer();
    await testAuth();
    
    console.log('\n═══════════════════════════════════════');
    console.log(`Total: ${testResults.total}, Passed: ${testResults.passed}, Failed: ${testResults.failed}`);
    console.log(testResults.failed === 0 ? '🎉 All tests passed!' : '⚠️  Some tests failed');
}

runTests();
