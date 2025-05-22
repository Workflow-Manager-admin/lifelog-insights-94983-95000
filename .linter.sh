#!/bin/bash
cd /home/kavia/workspace/code-generation/lifelog-insights-94983-95000/life_log_insights
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

