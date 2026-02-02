#!/usr/bin/env node

/**
 * Validation script for GitHub-backed Kanban Dashboard
 * Tests critical functionality without needing a browser
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Kanban Dashboard Validation Test\n');

// Read the HTML file
const htmlFile = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Test 1: Check for required functions
console.log('✓ Test 1: Required Functions');
const requiredFunctions = [
    'loadTasks',
    'saveTasks',
    'loadFromGitHub',
    'saveToGitHub',
    'syncTasks',
    'syncNow',
    'openSettings',
    'closeSettings',
    'saveSettings',
    'setSyncStatus',
    'getGithubToken',
    'setGithubToken'
];

let functionsOk = true;
requiredFunctions.forEach(fn => {
    if (htmlFile.includes(`function ${fn}`) || htmlFile.includes(`async function ${fn}`)) {
        console.log(`  ✓ ${fn}()`);
    } else {
        console.log(`  ✗ MISSING: ${fn}()`);
        functionsOk = false;
    }
});

// Test 2: Check for GitHub API integration
console.log('\n✓ Test 2: GitHub API Integration');
const githubChecks = [
    ['GitHub raw content URL', 'https://raw.githubusercontent.com/'],
    ['GitHub API URL', 'https://api.github.com/repos/'],
    ['Base64 encoding', 'btoa\\('],
    ['PUT request for commit', 'method: \'PUT\''],
    ['GitHub token header', 'Authorization.*token']
];

let githubOk = true;
githubChecks.forEach(([desc, pattern]) => {
    if (new RegExp(pattern).test(htmlFile)) {
        console.log(`  ✓ ${desc}`);
    } else {
        console.log(`  ✗ MISSING: ${desc}`);
        githubOk = false;
    }
});

// Test 3: Check for localStorage fallback
console.log('\n✓ Test 3: LocalStorage Fallback');
const storageChecks = [
    ['localStorage.setItem', 'localStorage.setItem'],
    ['localStorage.getItem', 'localStorage.getItem'],
    ['Default tasks fallback', 'defaultTasks'],
    ['STORAGE_KEY defined', 'const STORAGE_KEY']
];

let storageOk = true;
storageChecks.forEach(([desc, pattern]) => {
    if (htmlFile.includes(pattern)) {
        console.log(`  ✓ ${desc}`);
    } else {
        console.log(`  ✗ MISSING: ${desc}`);
        storageOk = false;
    }
});

// Test 4: Check for Settings Modal
console.log('\n✓ Test 4: Settings Modal');
const settingsChecks = [
    ['Settings overlay', 'id="settingsOverlay"'],
    ['GitHub token input', 'id="githubToken"'],
    ['GitHub repo input', 'id="githubRepo"'],
    ['GitHub file input', 'id="githubFile"'],
    ['Sync button', 'onclick="syncNow()"'],
    ['Webhook URL input', 'id="webhookUrl"']
];

let settingsOk = true;
settingsChecks.forEach(([desc, pattern]) => {
    if (htmlFile.includes(pattern)) {
        console.log(`  ✓ ${desc}`);
    } else {
        console.log(`  ✗ MISSING: ${desc}`);
        settingsOk = false;
    }
});

// Test 5: Check for Sync Status Display
console.log('\n✓ Test 5: Sync Status Display');
const syncStatusChecks = [
    ['Sync status element', 'id="syncStatus"'],
    ['Sync status class handling', 'syncStatus.className'],
    ['Syncing animation', 'animation: pulse'],
    ['Sync states', 'syncing.*synced.*error']
];

let syncStatusOk = true;
syncStatusChecks.forEach(([desc, pattern]) => {
    if (new RegExp(pattern, 's').test(htmlFile)) {
        console.log(`  ✓ ${desc}`);
    } else {
        console.log(`  ✗ MISSING: ${desc}`);
        syncStatusOk = false;
    }
});

// Test 6: Check for Error Handling
console.log('\n✓ Test 6: Error Handling');
const errorHandlingChecks = [
    ['Toast notifications', 'showToast'],
    ['Try-catch blocks', 'try {', 'catch'],
    ['Error messages', 'GitHub.*error.*message'],
    ['Fallback on error', 'catch.*return null']
];

let errorHandlingOk = true;
if (htmlFile.includes('showToast')) {
    console.log('  ✓ Toast notifications');
} else {
    console.log('  ✗ MISSING: Toast notifications');
    errorHandlingOk = false;
}

if (htmlFile.includes('try {') && htmlFile.includes('catch')) {
    console.log('  ✓ Try-catch blocks');
} else {
    console.log('  ✗ MISSING: Try-catch blocks');
    errorHandlingOk = false;
}

if (/GitHub.*failed.*message|error.*message/i.test(htmlFile)) {
    console.log('  ✓ Error messages');
} else {
    console.log('  ✗ MISSING: Error messages');
    errorHandlingOk = false;
}

// Test 7: Check for existing features preservation
console.log('\n✓ Test 7: Existing Features Preserved');
const existingFeatures = [
    ['Drag and drop', 'dragstart.*dragend.*drop'],
    ['Assignee support', 'assignee.*nikoline.*glenn'],
    ['Dark theme', '--bg-primary.*--text-primary'],
    ['Priority badges', 'priority-low.*priority-medium.*priority-high'],
    ['Task creation', 'openModal.*saveTask'],
    ['Task deletion', 'deleteTask.*confirmDelete']
];

let featuresOk = true;
existingFeatures.forEach(([desc, pattern]) => {
    if (new RegExp(pattern, 's').test(htmlFile)) {
        console.log(`  ✓ ${desc}`);
    } else {
        console.log(`  ✗ MISSING: ${desc}`);
        featuresOk = false;
    }
});

// Test 8: Validate JavaScript syntax (basic)
console.log('\n✓ Test 8: JavaScript Syntax');
const syntaxChecks = [
    ['No unclosed braces', htmlFile.match(/{/g).length === htmlFile.match(/}/g).length],
    ['No unclosed parentheses', htmlFile.match(/\(/g).length === htmlFile.match(/\)/g).length],
    ['Properly closed script tags', (htmlFile.match(/<script>/g) || []).length === (htmlFile.match(/<\/script>/g) || []).length]
];

let syntaxOk = true;
syntaxChecks.forEach(([desc, result]) => {
    if (result) {
        console.log(`  ✓ ${desc}`);
    } else {
        console.log(`  ✗ FAILED: ${desc}`);
        syntaxOk = false;
    }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Test Summary:');
console.log('='.repeat(50));

const allOk = [functionsOk, githubOk, storageOk, settingsOk, syncStatusOk, errorHandlingOk, featuresOk, syntaxOk].every(x => x);

if (allOk) {
    console.log('✅ All validation tests PASSED!');
    process.exit(0);
} else {
    console.log('❌ Some validation tests FAILED!');
    process.exit(1);
}
