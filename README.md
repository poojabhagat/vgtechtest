# vgtechtest
MEAN Stack assignment

Important Steps:

1. This application assumes that you have "MongoDB" installed on your machine.
2. node version : v12.13.0 (application created/tested in this runtime).
3. npm version : 6.12.0 (application created/tested in this runtime).
4. Once you get this repo code, run "npm install" command.
5. Run local mongo server and create a database with the name "virtualGainStudents_db". 
   If you want to use your already created database, then update the database name in root file
   server.js(line no. 35).
6. To send an mail from application, need to mention your gmailID and password in root file, server.js
   in "global.transporter" varible. Update the auth values.

Command To Run The Application
1. Using grunt, you will get live updates of code change
grunt --force

2. Using node server.js - if you change any file you need to restart node server manually each time.