Hola Jorge, La verdad que no se entendieron casi nada las 2 clases relacionadas a este entregable, hice lo que pude de la primera parte que creo que esta correcto pero nginx la verdad que no pude comprenderlo, espero que se pueda realizar un after en algun momento relacionado a estos temas.


NODEMON:

nodemon server.js
.\tasklist /fi "imagename eq node.exe"
.\taskkill /pid 00000 /f // 0000 como pid a cambiar.

FOREVER:

forever start -w src/server.js -p 8085
forever list
.\tasklist /fi "imagename eq node.exe"
forever stop 0000
.\taskkill /pid 00000 /f
forever stopall

PM2:

 pm2 start src/server.js --name="ServerX" --watch //MODO FORK 
 pm2 start src/server.js --name="ServerX" --watch -i 0 //MODO CLUSTER
pm2 list 
.\tasklist /fi "imagename eq node.exe"
pm2 stop ServerX || all
.\taskkill /pid 00000 /f

NGINX ??
Primera Consigna

 pm2 start src/server.js --name="ServerX" --watch //MODO FORK port 8080

 pm2 start src/server.js --name="ServerCluster" --watch -i 0 //MODO CLUSTER port 8081

Segunda Consigna 

pm2 start src/server.js --name="ServerX" --watch //MODO FORK port 8080

 pm2 start src/server.js --name="ServerCluster" --watch -i 0 //MODO CLUSTER port 8082
 pm2 start src/server.js --name="ServerCluster" --watch -i 0 //MODO CLUSTER port 8083
 pm2 start src/server.js --name="ServerCluster" --watch -i 0 //MODO CLUSTER port 8084
 pm2 start src/server.js --name="ServerCluster" --watch -i 0 //MODO CLUSTER port 8085
