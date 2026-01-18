# Salesforce Validation Rules Manager

A React application for managing Salesforce Account validation rules through OAuth 2.0 authentication and Salesforce APIs.

## Features

- OAuth 2.0 login to Salesforce Developer Org
- Fetch Account validation rules using Tooling API
- Display validation rules with active/inactive status
- Toggle individual validation rules
- Activate/Deactivate all validation rules
- Deploy changes (placeholder for Metadata API integration)

## Prerequisites

1. **Salesforce Developer Org**: Sign up at [developer.salesforce.com/signup](https://developer.salesforce.com/signup)

2. **Create Validation Rules**: In your Salesforce org, create 4-5 validation rules on the Account object.

3. **Connected App**: Create a Connected App in Salesforce for OAuth integration.

## Salesforce Setup Instructions

### 1. Create Validation Rules

Navigate to Setup > Object Manager > Account > Validation Rules and create validation rules like:

- Rule 1: Prevent negative account balance
- Rule 2: Require phone for high-value accounts
- Rule 3: Validate email format
- Rule 4: Check account type requirements
- Rule 5: Industry-specific validations

### 2. Create Connected App

1. Go to Setup > App Manager > New Connected App
2. Fill in:
   - Connected App Name: Validation Rules Manager
   - API Name: Validation_Rules_Manager
   - Contact Email: your-email@example.com
3. Enable OAuth Settings:
   - Callback URL: `http://localhost:3000` (for development) and your deployed URL
   - Selected OAuth Scopes: Access and manage your data (api), Perform requests on your behalf at any time (refresh_token), Access your basic information (id), Access custom permissions (web)
4. Save and note the Consumer Key and Consumer Secret

### 3. Update App Configuration

Create a `.env` file in the root directory with your Connected App credentials:

```env
REACT_APP_SF_CLIENT_ID=your_consumer_key_here
REACT_APP_SF_CLIENT_SECRET=your_consumer_secret_here
REACT_APP_SF_REDIRECT_URI=http://localhost:3000
REACT_APP_SF_LOGIN_URL=https://login.salesforce.com
```

Or update the constants directly in `src/App.js`.

## Installation

1. Clone the repository
2. Run `npm install`
3. Update the OAuth configuration in `src/App.js`
4. Run `npm start` for development

## Deployment

1. Build the app: `npm run build`
2. Deploy to a static hosting service like:
   - **Vercel**: `npm install -g vercel && vercel`
   - **Netlify**: Drag the `build` folder to netlify.com
   - **GitHub Pages**: `npm install -g gh-pages && gh-pages -d build`

For production, update the callback URL in your Connected App to match your deployed domain.

### Example Vercel Deployment

1. Install Vercel CLI: `npm install -g vercel`
2. Deploy: `vercel`
3. Update your Connected App callback URL to the Vercel domain

### Example Netlify Deployment

1. Go to netlify.com and sign up/login
2. Drag the `build` folder to the deployment area
3. Update your Connected App callback URL to the Netlify domain

## Usage

1. Click "Login to Salesforce" to authenticate
2. Click "Get Validation Rules" to fetch Account validation rules
3. Use buttons to activate/deactivate rules
4. Click "Deploy Changes" (currently shows alert - implement Metadata API for full deployment)

## APIs Used

- Salesforce OAuth 2.0 Web Server Flow
- Salesforce Tooling API for Validation Rules (queries and updates)
- Metadata API (for deployment - not fully implemented)

## CORS Considerations

Salesforce APIs support CORS for web applications. Make sure your Connected App is configured correctly for cross-origin requests.

## Technologies

- React
- Axios (HTTP client)
- Salesforce REST APIs

## Submission

- Git Repository: [Link to your repo]
- Deployed Application: [Link to deployed app]
- Resume: Updated with this project

Send all links to careers@cloudvandana.com

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
