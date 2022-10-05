https://backendprojectcoder.herokuapp.com


NODEMON:

nodemon server.js -p 8082 -m FORK    /" INICIAR MODO modo FORK"
nodemon server.js -p 8083 -m CLUSTER   /" INICIAR MODO modo CLUSTER"

.\tasklist /fi "imagename eq node.exe"
.\taskkill /pid 00000 /f // 0000 como pid a cambiar.

FOREVER:

forever start -w src/server.js -p 8082 -m FORK  /"INICIAR modo FORK"
forever start -w src/server.js -p 8083 -m CLUSTER /"INICIAR modo CLUSTER"
forever list O .\tasklist /fi "imagename eq node.exe"
forever stop 0000 O .\taskkill /pid 00000 /f
forever stopall "DETENER TODOS LOS PROCESOS"

PM2:

 pm2 start src/server.js --name="ServerFork" --watch -- -- --PORT=8082 //MODO FORK "Funciona bien"

 pm2 start src/server.js --name="ServerCluster" --watch -i 0 -- -- --PORT=8082 //MODO CLUSTER "Levanta en modo cluster pero el problema es el mismo que se da en el after relacionado a las rutas Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only file and data URLs are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'c:'"

pm2 list O .\tasklist /fi "imagename eq node.exe"
pm2 stop <pid> O .\taskkill /pid 00000 /f



NGINX 
Primera Consigna

forever start -w src/server.js -p 8080 -m FORK //MODO FORK port 8080

forever start -w src/server.js -p 8081 -m CLUSTER //MODO CLUSTER port 8081 para api/randoms

Segunda Consigna 

forever start -w src/server.js -p 8080 -m FORK //MODO FORK port 8080

forever start -w src/server.js -p 8082 -m CLUSTER //MODO CLUSTER port 8082 para api/randoms
forever start -w src/server.js -p 8083 -m CLUSTER //MODO CLUSTER port 8083 para api/randoms
forever start -w src/server.js -p 8084 -m CLUSTER //MODO CLUSTER port 8084 para api/randoms
forever start -w src/server.js -p 8085 -m CLUSTER //MODO CLUSTER port 8085 para api/randoms
