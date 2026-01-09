#!/bin/bash
# Railway-compatible start script for Next.js standalone mode

# CRITICAL: Force HOSTNAME to 0.0.0.0 (Railway sets it to container hostname)
# Unset any existing HOSTNAME first, then set to 0.0.0.0
unset HOSTNAME
export HOSTNAME=0.0.0.0
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-8080}

# Debug: Print what we're using (helps troubleshoot)
echo "Starting Next.js server with HOSTNAME=$HOSTNAME PORT=$PORT"

# Start server from project root (server.js will change to its own directory)
exec node .next/standalone/server.js
