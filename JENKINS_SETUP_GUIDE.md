# 🏗️ Jenkins API Token Setup Guide

To connect your DevOps Dashboard to Jenkins, you need your **Username** and an **API Token**.

## 1. Find Your Username
*   Log in to your Jenkins dashboard (usually `http://localhost:8585`).
*   Look at the **top right corner** of the page.
*   The name displayed there is your **Username** (e.g., `admin` or `arunp`).

## 2. Generate an API Token
1.  Click on your **Username** in the top right corner.
2.  Click on **Configure** in the left-hand sidebar menu.
3.  Scroll down to the section labeled **API Token**.
4.  Click the **Add new Token** button.
5.  Enter a name (e.g., `DevOps-Dashboard`).
6.  Click **Generate**.
7.  **COPY THE TOKEN IMMEDIATELY!** You will not be able to see it again after you leave the page.

## 3. Update Your Environment Variables
Open the `server/.env` file in your project and add the following lines:

```env
JENKINS_URL=http://localhost:8585
JENKINS_USERNAME=your_username_here
JENKINS_TOKEN=your_generated_token_here
```

*(Replace `http://localhost:8585` if your Jenkins runs on a different URL)*
