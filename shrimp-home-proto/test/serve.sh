#!/bin/sh
# serve dist on 8765 (idempotent)
if ! curl -s -o /dev/null http://127.0.0.1:8765/index.html; then
  cd "$(dirname "$0")/../dist" && nohup python3 -m http.server 8765 >/dev/null 2>&1 &
  sleep 1
fi
