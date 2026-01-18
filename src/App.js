import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [instanceUrl, setInstanceUrl] = useState(null);
  const [validationRules, setValidationRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Salesforce OAuth configuration - Replace with your Connected App details
  const CLIENT_ID = process.env.REACT_APP_SF_CLIENT_ID || 'YOUR_CONNECTED_APP_CONSUMER_KEY';
  const CLIENT_SECRET = process.env.REACT_APP_SF_CLIENT_SECRET || 'YOUR_CONNECTED_APP_CONSUMER_SECRET';
  const REDIRECT_URI = process.env.REACT_APP_SF_REDIRECT_URI || 'http://localhost:3000';
  const LOGIN_URL = process.env.REACT_APP_SF_LOGIN_URL || 'https://login.salesforce.com';

  const login = () => {
    const authUrl = `${LOGIN_URL}/services/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=api%20refresh_token%20web`;
    window.location.href = authUrl;
  };

  const exchangeCodeForToken = useCallback(async (code) => {
    try {
      const response = await axios.post(`${LOGIN_URL}/services/oauth2/token`, null, {
        params: {
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
          redirect_uri: REDIRECT_URI
        }
      });
      setAccessToken(response.data.access_token);
      setInstanceUrl(response.data.instance_url);
      setLoggedIn(true);
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('OAuth error:', error);
    }
  }, [CLIENT_ID, CLIENT_SECRET, LOGIN_URL, REDIRECT_URI]);

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      exchangeCodeForToken(code);
    }
  }, [exchangeCodeForToken]);

  const getValidationRules = async () => {
    if (!accessToken || !instanceUrl) return;
    setLoading(true);
    try {
      // Query Validation Rules using Tooling API
      const response = await axios.get(`${instanceUrl}/services/data/v57.0/tooling/query/?q=SELECT+Id,ValidationName,Active,ErrorMessage+FROM+ValidationRule+WHERE+EntityDefinition.QualifiedApiName='Account'`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      setValidationRules(response.data.records);
    } catch (error) {
      console.error('Error fetching validation rules:', error);
    }
    setLoading(false);
  };

  const toggleValidationRule = async (ruleId, currentActive) => {
    if (!accessToken || !instanceUrl) return;
    try {
      await axios.patch(`${instanceUrl}/services/data/v57.0/tooling/sobjects/ValidationRule/${ruleId}`, {
        Active: !currentActive
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      // Refresh the list
      getValidationRules();
    } catch (error) {
      console.error('Error toggling validation rule:', error);
    }
  };

  const toggleAllValidationRules = async (activate) => {
    if (!accessToken || !instanceUrl) return;
    try {
      const promises = validationRules.map(rule =>
        axios.patch(`${instanceUrl}/services/data/v57.0/tooling/sobjects/ValidationRule/${rule.Id}`, {
          Active: activate
        }, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
      );
      await Promise.all(promises);
      // Refresh the list
      getValidationRules();
    } catch (error) {
      console.error('Error toggling all validation rules:', error);
    }
  };

  const deployChanges = async () => {
    // For deployment, we might need to use Metadata API
    // This is a simplified version - in real scenario, use Metadata API for deployment
    alert('Deploy functionality would use Metadata API to deploy changes to production/sandbox orgs.');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Salesforce Validation Rules Manager</h1>
        {!loggedIn ? (
          <button onClick={login}>Login to Salesforce</button>
        ) : (
          <div>
            <p>Connected to Salesforce</p>
            <button onClick={getValidationRules} disabled={loading}>
              {loading ? 'Loading...' : 'Get Validation Rules'}
            </button>
            {validationRules.length > 0 && (
              <div>
                <h2>Account Validation Rules</h2>
                <button onClick={() => toggleAllValidationRules(true)}>Activate All</button>
                <button onClick={() => toggleAllValidationRules(false)}>Deactivate All</button>
                <button onClick={deployChanges}>Deploy Changes</button>
                <ul>
                  {validationRules.map(rule => (
                    <li key={rule.Id}>
                      <span>{rule.ValidationName}: {rule.ErrorMessage} - {rule.Active ? 'Active' : 'Inactive'}</span>
                      <button onClick={() => toggleValidationRule(rule.Id, rule.Active)}>
                        {rule.Active ? 'Deactivate' : 'Activate'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
