#!/bin/bash
# Railway-compatible start script for Next.js standalone mode

# Set defaults if not provided by Railway
export NODE_ENV=${NODE_ENV:-production}
export HOSTNAME=${HOSTNAME:-0.0.0.0}
export PORT=${PORT:-8080}

# Start server from project root (server.js will change to its own directory)
exec node .next/standalone/server.js
