import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const JENKINS_URL = process.env.JENKINS_URL || 'http://localhost:8585';
const JENKINS_TOKEN = process.env.JENKINS_TOKEN;

console.log('🔍 Jenkins Authentication Tester\n');
console.log('Jenkins URL:', JENKINS_URL);
console.log('Token:', JENKINS_TOKEN ? `${JENKINS_TOKEN.substring(0, 10)}...` : 'NOT SET');
console.log('=====================================\n');

// Test different username variations
const usernameVariations = [
    'Parthi',
    'parthi',
    'PARTHI',
    'admin',
    'Admin'
];

async function testUsername(username) {
    try {
        const auth = Buffer.from(`${username}:${JENKINS_TOKEN}`).toString('base64');
        const response = await axios.get(
            `${JENKINS_URL}/api/json`,
            {
                headers: { Authorization: `Basic ${auth}` },
                timeout: 5000
            }
        );

        return { success: true, username, data: response.data };
    } catch (error) {
        return { success: false, username, error: error.response?.status || error.message };
    }
}

async function runTests() {
    console.log('Testing username variations...\n');

    for (const username of usernameVariations) {
        const result = await testUsername(username);

        if (result.success) {
            console.log(`✅ SUCCESS with username: "${username}"`);
            console.log(`\nUpdate your .env file with:`);
            console.log(`JENKINS_USERNAME=${username}\n`);
            return;
        } else {
            console.log(`❌ Failed with "${username}" - Status: ${result.error}`);
        }
    }

    console.log('\n⚠️  All username variations failed!');
    console.log('\n📋 Manual Steps:');
    console.log('1. Open Jenkins: http://localhost:8585');
    console.log('2. Log in and click your name (top right)');
    console.log('3. Check the URL - it will be like: /user/[USERNAME]/');
    console.log('4. That [USERNAME] is your exact Jenkins username');
    console.log('5. Also verify you generated the API token correctly');
    console.log('\n🔐 Alternative: Try username/password instead:');
    console.log('   If you know your Jenkins password, you can use:');
    console.log('   JENKINS_USERNAME=your_username');
    console.log('   JENKINS_TOKEN=your_password');
}

runTests();
