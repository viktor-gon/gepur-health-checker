#To run:
npm i && nodemon -r esm src/bot.js

#restart:
supervisorctl restart health-checker

#supervisor:
[program:health-checker]
directory=/var/www/dev-site-features/gepur-health-checker
command=node -r esm src/bot.js
autostart=true
autorestart=true
numprocs=1
stdout_logfile=/var/log/health-checker.log

