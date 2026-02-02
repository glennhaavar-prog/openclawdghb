/**
 * Kanban Webhook Server
 * Receives tasks from the dashboard and saves them for Nikoline to process
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const TASKS_FILE = path.join(__dirname, 'received-tasks.json');

// Initialize tasks file if it doesn't exist
if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify({ tasks: [] }, null, 2));
}

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // POST /task - Receive a new task
    if (req.method === 'POST' && req.url === '/task') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const task = JSON.parse(body);
                
                // Load existing tasks
                const data = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
                
                // Add timestamp
                task.receivedAt = new Date().toISOString();
                task.processed = false;
                
                // Add to list
                data.tasks.push(task);
                
                // Save
                fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
                
                console.log(`[${new Date().toISOString()}] Task received: ${task.title}`);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Task received!' }));
            } catch (err) {
                console.error('Error processing task:', err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid task data' }));
            }
        });
        return;
    }

    // GET /tasks - List all received tasks
    if (req.method === 'GET' && req.url === '/tasks') {
        try {
            const data = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read tasks' }));
        }
        return;
    }

    // GET /health - Health check
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
        return;
    }

    // 404 for everything else
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`🚀 Kanban Webhook Server running on port ${PORT}`);
    console.log(`   POST /task    - Receive a task`);
    console.log(`   GET  /tasks   - List all tasks`);
    console.log(`   GET  /health  - Health check`);
});
