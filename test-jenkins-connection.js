import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const JENKINS_URL = process.env.JENKINS_URL || 'http://localhost:8080';
const JENKINS_USERNAME = process.env.JENKINS_USERNAME;
const JENKINS_TOKEN = process.env.JENKINS_TOKEN;

console.log('Testing Jenkins Connection...');
console.log('================================');
console.log('Jenkins URL:', JENKINS_URL);
console.log('Username:', JENKINS_USERNAME);
console.log('Token:', JENKINS_TOKEN ? `${JENKINS_TOKEN.substring(0, 10)}...` : 'NOT SET');
console.log('================================\n');

const getAuthHeader = () => {
    if (!JENKINS_USERNAME || !JENKINS_TOKEN) {
        console.error('❌ Jenkins credentials not found in .env file');
        return {};
    }
    const auth = Buffer.from(`${JENKINS_USERNAME}:${JENKINS_TOKEN}`).toString('base64');
    return { Authorization: `Basic ${auth}` };
};

async function testConnection() {
    try {
        console.log('🔍 Testing basic connection...');
        const response = await axios.get(`${JENKINS_URL}/api/json?tree=jobs[name,url,color,lastBuild[number,result,timestamp,duration]]`, {
            headers: getAuthHeader(),
            timeout: 5000
        });

        console.log('✅ Connection successful!');
        console.log(`\n📊 Found ${response.data.jobs.length} jobs:\n`);

        response.data.jobs.forEach((job, index) => {
            console.log(`${index + 1}. ${job.name}`);
            console.log(`   URL: ${job.url}`);
            console.log(`   Status: ${job.color}`);
            if (job.lastBuild) {
                console.log(`   Last Build: #${job.lastBuild.number} - ${job.lastBuild.result || 'In Progress'}`);
            }
            console.log('');
        });

    } catch (error) {
        console.error('❌ Connection failed!');
        console.error('Error:', error.message);

        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Status Text:', error.response.statusText);

            if (error.response.status === 401) {
                console.error('\n🔐 Authentication Failed!');
                console.error('\nPossible solutions:');
                console.error('1. Go to Jenkins → User Icon (top right) → Configure');
                console.error('2. Scroll to "API Token" section');
                console.error('3. Click "Add new Token" → Give it a name → Generate');
                console.error('4. Copy the token and update JENKINS_TOKEN in .env file');
                console.error('5. Make sure JENKINS_USERNAME matches your Jenkins username');
            } else if (error.response.status === 403) {
                console.error('\n🚫 Forbidden! User doesn\'t have permission to access Jenkins API');
            }
        } else if (error.code === 'ECONNREFUSED') {
            console.error('\n🔌 Connection refused! Is Jenkins running at', JENKINS_URL, '?');
        }
    }
}

testConnection();
