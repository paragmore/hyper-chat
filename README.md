# Getting Started with Hyper swarm chat app

## Running the code:
Do npm run build to create react build
Use npm run electron to start the electron app;
To start in dev mode change the isDev flag in index.js file in root folder to true;

## Using the chat app: 

* The chat app initially connects the peer to common swarm wherein the user can discover multiple peers connected to the swarm by their public key.
* User can select a specific peer by clicking on the connection in connections tab
* The connection would be highlighted in green and user can chat with the specific peer through the swarm.
* To use the app both the peers should be connected.


<img width="1440" alt="image" src="https://user-images.githubusercontent.com/34959548/228757751-ad37f3e8-27d9-4590-95bc-40e352c3198a.png">

* [Link for executable:](https://drive.google.com/file/d/1Ut8-y5zbSyP0S1Z6WuXz8ypw8HHMxp0U/view?usp=sharing)


### Pending tasks:

* Bug fixes 
  * Sometimes previous messages array gets replaced by current received message
* Error states
* Redux state management can be added
* Error handling
* Message states
* Optimization
* Code clean up / Refactoring
* Styling

