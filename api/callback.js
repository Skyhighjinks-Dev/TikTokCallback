const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// OAuth callback endpoint
app.get('/api/callback', (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const error = req.query.error;
    const error_description = req.query.error_description;

    console.log('=== TikTok OAuth Callback ===');
    console.log('Authorization code:', code);
    console.log('State:', state);
    if (error) {
        console.log('Error:', error);
        console.log('Error description:', error_description);
    }
    console.log('============================');

    if (error) {
        res.status(400).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>OAuth Error</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                    .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="error">
                    <h1>OAuth Error</h1>
                    <p><strong>Error:</strong> ${error}</p>
                    <p><strong>Description:</strong> ${error_description || 'No description provided'}</p>
                    <p>Please check your TikTok app configuration and try again.</p>
                </div>
            </body>
            </html>
        `);
        return;
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>TikTok OAuth Success</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                .success { background: #efe; border: 1px solid #cfc; padding: 20px; border-radius: 5px; }
                .code { background: #f5f5f5; padding: 10px; border-radius: 3px; font-family: monospace; word-break: break-all; }
                .copy-btn { background: #007cba; color: white; border: none; padding: 10px 20px; border-radius: 3px; cursor: pointer; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="success">
                <h1>🎉 OAuth Success!</h1>
                <p>Your TikTok authorization code has been captured:</p>
                <div class="code" id="authCode">${code}</div>
                <button class="copy-btn" onclick="copyCode()">Copy Code</button>
                <p><strong>State:</strong> ${state || 'None'}</p>
                <p>Check your terminal/logs for the authorization code. You can now close this window.</p>
            </div>
            <script>
                function copyCode() {
                    const code = document.getElementById('authCode').textContent;
                    navigator.clipboard.writeText(code).then(() => {
                        alert('Code copied to clipboard!');
                    });
                }
            </script>
        </body>
        </html>
    `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export for Vercel
module.exports = app;