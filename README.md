# justforfun
<h2>This is project for backing up facebook messages in real time.</h2>

<h2>For setting up the project</h2>

<h3>1. Download the project</h3>
Download the project from this repo.

### 2. Open Facebook and set-up 2-Factor Authentication
In this step, i recommend you using Authen App like Google Authenticator on an Mobile Phone.

### 3. In the file `getappstate.js` 
Replace  `process.env.USER_NAME` and `process.env.USER_PASSWORD` to 
your email and password to login facebook.

### 4. Setting up your AWS DynamoDB for autosaving your message to DynamoDB in worker.js. Other DB can be updated later 
