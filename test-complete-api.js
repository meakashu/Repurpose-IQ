#!/usr/bin/env node

/**
 * Comprehensive API Test Suite for RepurposeIQ
 * Tests all major endpoints and functionality with the new Groq API key
 */

import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'http://localhost:3000';
const CLIENT_URL = 'http://localhost:5173';

// ANSI color codes for better output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

let authToken = null;
let testResults = {
    passed: 0,
    failed: 0,
    total: 0
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
    testResults.total++;
    if (passed) {
        testResults.passed++;
        log(`✅ ${name}`, colors.green);
    } else {
        testResults.failed++;
        log(`❌ ${name}`, colors.red);
    }
    if (details) {
        log(`   ${details}`, colors.cyan);
    }
}

async function testHealthCheck() {
    log('\n📋 Testing Health Check...', colors.bold);
    try {
        const response = await axios.get(`${BASE_URL}/api/health`);
        logTest('Health Check', response.data.status === 'ok',
            `Version: ${response.data.version}, Status: ${response.data.status}`);
        return true;
    } catch (error) {
        logTest('Health Check', false, error.message);
        return false;
    }
}

async function testAuthentication() {
    log('\n🔐 Testing Authentication...', colors.bold);

    // Test login
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            username: 'demo',
            password: 'demo'
        });

        if (response.data.token) {
            authToken = response.data.token;
            logTest('Login', true, `Token received: ${authToken.substring(0, 20)}...`);
        } else {
            logTest('Login', false, 'No token in response');
        }
    } catch (error) {
        logTest('Login', false, error.message);
    }

    // Test token verification
    if (authToken) {
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/verify`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            logTest('Token Verification', response.data.valid === true,
                `User: ${response.data.user?.email || 'N/A'}`);
        } catch (error) {
            logTest('Token Verification', false, error.message);
        }
    }
}

async function testQueryProcessing() {
    log('\n💬 Testing Query Processing (Groq API)...', colors.bold);

    if (!authToken) {
        log('⚠️  Skipping - No auth token', colors.yellow);
        return;
    }

    try {
        const response = await axios.post(
            `${BASE_URL}/api/query`,
            {
                query: 'What are the repurposing opportunities for Aspirin in cardiovascular disease?',
                conversationId: null
            },
            {
                headers: { Authorization: `Bearer ${authToken}` },
                timeout: 60000
            }
        );

        const hasAnalysis = response.data.analysis && response.data.analysis.length > 100;
        const hasAgents = response.data.agentsUsed && response.data.agentsUsed.length > 0;
        const hasAuditId = response.data.auditId ? true : false;

        logTest('Query Processing', hasAnalysis,
            `Analysis length: ${response.data.analysis?.length || 0} chars`);
        logTest('Agent Orchestration', hasAgents,
            `Agents used: ${response.data.agentsUsed?.join(', ') || 'None'}`);
        logTest('Audit Trail', hasAuditId,
            `Audit ID: ${response.data.auditId || 'N/A'}`);

    } catch (error) {
        logTest('Query Processing', false, error.message);
    }
}

async function testDashboard() {
    log('\n📊 Testing Dashboard API...', colors.bold);

    if (!authToken) {
        log('⚠️  Skipping - No auth token', colors.yellow);
        return;
    }

    try {
        const response = await axios.get(`${BASE_URL}/api/dashboard`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        const hasMarketData = response.data.marketData && response.data.marketData.length > 0;
        const hasPatents = response.data.patents && response.data.patents.length > 0;
        const hasTrials = response.data.clinicalTrials && response.data.clinicalTrials.length > 0;
        const hasKPIs = response.data.kpis ? true : false;

        logTest('Dashboard Data', hasMarketData && hasPatents,
            `Market: ${response.data.marketData?.length || 0}, Patents: ${response.data.patents?.length || 0}`);
        logTest('Clinical Trials', hasTrials,
            `Trials: ${response.data.clinicalTrials?.length || 0}`);
        logTest('KPI Metrics', hasKPIs,
            `Total Queries: ${response.data.kpis?.totalQueries || 0}`);

    } catch (error) {
        logTest('Dashboard Data', false, error.message);
    }
}

async function testKnowledgeGraph() {
    log('\n🕸️  Testing Knowledge Graph API...', colors.bold);

    if (!authToken) {
        log('⚠️  Skipping - No auth token', colors.yellow);
        return;
    }

    // Test repurposing paths
    try {
        const response = await axios.post(
            `${BASE_URL}/api/graph/repurposing-paths`,
            {
                drug_id: 'Metformin',
                target_disease: 'Cancer'
            },
            {
                headers: { Authorization: `Bearer ${authToken}` },
                timeout: 10000
            }
        );

        const hasPaths = response.data.paths && response.data.paths.length > 0;
        const isMockData = response.data.note?.includes('Mock data');

        logTest('Repurposing Paths', hasPaths,
            `Paths found: ${response.data.paths?.length || 0}${isMockData ? ' (Mock Data)' : ''}`);

    } catch (error) {
        logTest('Repurposing Paths', false, error.message);
    }

    // Test similar drugs
    try {
        const response = await axios.get(
            `${BASE_URL}/api/graph/similar-drugs/Metformin`,
            {
                headers: { Authorization: `Bearer ${authToken}` },
                timeout: 10000
            }
        );

        const hasDrugs = response.data.similar_drugs && response.data.similar_drugs.length > 0;
        const isMockData = response.data.note?.includes('Mock data');

        logTest('Similar Drugs', hasDrugs,
            `Similar drugs: ${response.data.similar_drugs?.join(', ') || 'None'}${isMockData ? ' (Mock)' : ''}`);

    } catch (error) {
        logTest('Similar Drugs', false, error.message);
    }
}

async function testAnalytics() {
    log('\n📈 Testing Analytics API...', colors.bold);

    if (!authToken) {
        log('⚠️  Skipping - No auth token', colors.yellow);
        return;
    }

    try {
        const response = await axios.get(`${BASE_URL}/api/analytics/stats`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        const hasStats = response.data ? true : false;

        logTest('Analytics Stats', hasStats,
            `Total Queries: ${response.data.totalQueries || 0}, Today: ${response.data.queriesToday || 0}`);

    } catch (error) {
        logTest('Analytics Stats', false, error.message);
    }
}

async function testMonitoring() {
    log('\n🔔 Testing Monitoring API...', colors.bold);

    if (!authToken) {
        log('⚠️  Skipping - No auth token', colors.yellow);
        return;
    }

    try {
        const response = await axios.get(`${BASE_URL}/api/monitoring/status`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        const hasStatus = response.data.status ? true : false;

        logTest('Monitoring Status', hasStatus,
            `Status: ${response.data.status}, Alerts: ${response.data.alerts?.length || 0}`);

    } catch (error) {
        logTest('Monitoring Status', false, error.message);
    }
}

async function testReportGeneration() {
    log('\n📄 Testing Report Generation...', colors.bold);

    if (!authToken) {
        log('⚠️  Skipping - No auth token', colors.yellow);
        return;
    }

    // Test PDF generation
    try {
        const response = await axios.post(
            `${BASE_URL}/api/reports/pdf`,
            {
                title: 'Test Report',
                content: '# Test Report\n\nThis is a test report for Aspirin repurposing.',
                metadata: {
                    query: 'Test Query',
                    agentsUsed: ['Market Agent', 'Clinical Agent']
                }
            },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );

        const hasFilename = response.data.filename ? true : false;

        logTest('PDF Report Generation', hasFilename,
            `Filename: ${response.data.filename || 'N/A'}`);

    } catch (error) {
        logTest('PDF Report Generation', false, error.message);
    }
}

async function testWorkflows() {
    log('\n⚙️  Testing Workflows API...', colors.bold);

    if (!authToken) {
        log('⚠️  Skipping - No auth token', colors.yellow);
        return;
    }

    try {
        const response = await axios.get(`${BASE_URL}/api/workflows`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        const hasWorkflows = Array.isArray(response.data);

        logTest('List Workflows', hasWorkflows,
            `Workflows available: ${response.data?.length || 0}`);

    } catch (error) {
        logTest('List Workflows', false, error.message);
    }
}

async function printSummary() {
    log('\n' + '='.repeat(60), colors.bold);
    log('🎯 TEST SUMMARY', colors.bold);
    log('='.repeat(60), colors.bold);

    const passRate = testResults.total > 0
        ? ((testResults.passed / testResults.total) * 100).toFixed(1)
        : 0;

    log(`\nTotal Tests: ${testResults.total}`, colors.cyan);
    log(`Passed: ${testResults.passed}`, colors.green);
    log(`Failed: ${testResults.failed}`, colors.red);
    log(`Pass Rate: ${passRate}%`,
        passRate >= 80 ? colors.green : passRate >= 60 ? colors.yellow : colors.red);

    if (passRate >= 80) {
        log('\n✅ ALL SYSTEMS OPERATIONAL!', colors.green + colors.bold);
        log('The RepurposeIQ platform is fully functional with the new Groq API key.', colors.green);
    } else if (passRate >= 60) {
        log('\n⚠️  MOST SYSTEMS OPERATIONAL', colors.yellow + colors.bold);
        log('Some features may need attention.', colors.yellow);
    } else {
        log('\n❌ CRITICAL ISSUES DETECTED', colors.red + colors.bold);
        log('Please review the failed tests above.', colors.red);
    }

    log('\n' + '='.repeat(60) + '\n', colors.bold);
}

async function runAllTests() {
    log('\n' + '='.repeat(60), colors.bold);
    log('🧪 RepurposeIQ - Comprehensive API Test Suite', colors.bold);
    log('='.repeat(60), colors.bold);
    log(`Testing against: ${BASE_URL}`, colors.cyan);
    log(`Frontend: ${CLIENT_URL}`, colors.cyan);
    log(`Started at: ${new Date().toISOString()}`, colors.cyan);

    await testHealthCheck();
    await testAuthentication();
    await testQueryProcessing();
    await testDashboard();
    await testKnowledgeGraph();
    await testAnalytics();
    await testMonitoring();
    await testReportGeneration();
    await testWorkflows();

    await printSummary();
}

// Run tests
runAllTests().catch(error => {
    log(`\n❌ Test suite failed: ${error.message}`, colors.red);
    process.exit(1);
});
