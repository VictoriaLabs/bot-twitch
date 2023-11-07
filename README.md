---- Installation ----

Clone this repository (https://github.com/VictoriaLabs/bot-twitch.git)  
Install Docker (https://docs.docker.com/get-docker/)  
Install Docker-compose (if you don't already get it) (https://docs.docker.com/compose/install/)  
Install Make (https://tilburgsciencehub.com/building-blocks/configure-your-computer/automation-and-workflows/make/)  
Enjoy (optional)  

---- Get started ----

To start the Container :
```
make run
```

To stop the container : 
```
make stop
```

---- Important Information ----

Add/modify the files inside the /src folder automatically add/modify the  same files in the container

The Node server restart at any modification

To add a new package, execute "npm install [new package]" inside the /src folder

The server runs at http://localhost:8000