import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const JENKINS_URL = process.env.JENKINS_URL || 'http://localhost:8080';
const JENKINS_USERNAME = process.env.JENKINS_USERNAME;
const JENKINS_TOKEN = process.env.JENKINS_TOKEN;

console.log('🔍 Testing Jenkins with CSRF Crumb Support\n');

const getAuthHeader = () => {
    const auth = Buffer.from(`${JENKINS_USERNAME}:${JENKINS_TOKEN}`).toString('base64');
    return { Authorization: `Basic ${auth}` };
};

async function testWithCrumb() {
    try {
        console.log('Step 1: Getting CSRF crumb...');
        const crumbResponse = await axios.get(
            `${JENKINS_URL}/crumbIssuer/api/json`,
            {
                headers: getAuthHeader(),
                timeout: 5000
            }
        );

        console.log('✅ Crumb obtained:', crumbResponse.data.crumb.substring(0, 20) + '...');
        const crumb = crumbResponse.data.crumb;
        const crumbField = crumbResponse.data.crumbRequestField;

        console.log('\nStep 2: Testing API with crumb...');
        const response = await axios.get(
            `${JENKINS_URL}/api/json?tree=jobs[name,url]`,
            {
                headers: {
                    ...getAuthHeader(),
                    [crumbField]: crumb
                },
                timeout: 5000
            }
        );

        console.log('✅ SUCCESS! Jenkins connection working with CSRF crumb!');
        console.log(`\nFound ${response.data.jobs.length} jobs:`);
        response.data.jobs.forEach((job, i) => {
            console.log(`  ${i + 1}. ${job.name}`);
        });

        console.log('\n✨ Your Jenkins requires CSRF protection!');
        console.log('The controller has been updated to handle this.\n');

    } catch (error) {
        console.error('❌ Error:', error.response?.status || error.message);
        console.error('Status:', error.response?.status);

        if (error.response?.status === 404) {
            console.log('\n💡 CSRF protection is not enabled. Testing without crumb...');
            await testWithoutCrumb();
        } else if (error.response?.status === 401) {
            console.log('\n🔐 Still getting 401. Let\'s verify your credentials:');
            console.log('\n📝 Please check:');
            console.log('1. Open Jenkins in browser: http://localhost:8080');
            console.log('2. Click your username in top-right corner');
            console.log('3. Look at the URL - it should be: /user/YOUR_USERNAME/');
            console.log('4. Tell me what YOUR_USERNAME is exactly (case-sensitive)');
            console.log('\n💡 OR try logging in with your Jenkins PASSWORD instead of token:');
            console.log('   JENKINS_TOKEN=<your_jenkins_password>');
        }
    }
}

async function testWithoutCrumb() {
    try {
        const response = await axios.get(
            `${JENKINS_URL}/api/json?tree=jobs[name,url]`,
            {
                headers: getAuthHeader(),
                timeout: 5000
            }
        );

        console.log('✅ SUCCESS without crumb!');
        console.log(`\nFound ${response.data.jobs.length} jobs:`);
        response.data.jobs.forEach((job, i) => {
            console.log(`  ${i + 1}. ${job.name}`);
        });

    } catch (error) {
        console.error('❌ Still failing:', error.response?.status || error.message);
    }
}

testWithCrumb();
