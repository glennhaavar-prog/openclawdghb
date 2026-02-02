#!/bin/bash
# Start the Kanban Webhook Server

cd "$(dirname "$0")"

echo "Starting Kanban Webhook Server..."
node webhook-server.js
