# WebRTC Chat App

Final Project for CS50's Introduction to Computer Science

## Overview

This application allows users to send text messages and files of arbitrary size to each other in a peer to peer manner, without exposing the data to an external server. This is achieved by using the WebRTC technology behind the scenes.

## How it Works

To establish a WebRTC connection between two devices, they need to exchange an SDP (Session Description Protocol) object that contains the configuration of the connection and most importantly, the ports at which the other peer is accessible. To create an SDP object, first the host peer asks a STUN server its own accessible ports an adds this information to the desired configuration, creating an "offer". This offer is then given to the guest peer. The second peer then asks its own port information from the STUN server, adds it to the received offer, creating an answer. The answer is then sends back to the host peer, at which point, a direct connection can be established.

### How the SDP Object is Exchanged

Since it would be unfeasible to manually exchange this object in practice, we use a signaling server using WebSockets through which the peers can exchange the SDP object.

When the host initially creates a chat room, a random 8-digit number is assigned to that room and given to the user, which is used to tell the signaling server which user wants to connect to whom, essentially creating chat rooms for each set of peers. Other users, wanting to connect to that specific host, connect to the signaling server presenting the room ID, the server then informs the existing users of the arrival of a new user, asks for their offers, gives the offers to the guest, asks for an answer, and gives the answers to the existing users. At this point, the signaling server's job is done; The actual exchanging of data, happens directly between peers.

### How are Multiple Users Handled?

WebRTC connections are essentially one-to-one, each peer is individually connected to another, creating a mesh network. Meaning that, for each nth users, n-1 new one-to-one connections must be created. To avoid excessive bandwidth use, and not wanting to add am intermediary server which would go against the point of this application, the maximum number of possible users in one room is limited to 4.

### How are Large File Transfers Handled

To avoid corrupt data and inconsistency between maximum file sizes allows in different browsers, files are sent in 64kb chunks that are stitched together on the receiving end. The user receiving the file can see how big the file is before accepting the transfer ang has a chance of rejecting it before the transfer starts. Once accepted, the user will see how much of the file is downloaded in percentage term.

### What if the User is Behind a Firewall?

Roughly 20% of all users are behind firewalls that block WebRTC connections. In a production-grade application, a TURN server is used for such scenarios through which the data is routed, bypassing the firewall. But since TURN servers are expensive to run and this application is only a demo, no TURN server is used. _This means some users maybe unable to connect and will receive a "connection error" toast message upon joining a room._

## Technology Stack

- HTML and CSS (using the SCSS pre-processor) for markup and styling
- JavaScript with the React.js library for the front-end
- Node.js with the Socket.IO library for the backend (separate repository)

## Folder and File Structure

- Both the WebSockets and WebRTC connections are handled in the files in the "connections" folder. Each connection is a closure that receives and exposes various methods to and from the client.

- A React hook, placed in the "hooks" folder manages the interaction between the above connections.

- The above hook is used in a React context, placed in the "contexts" folder, which prepares the data to be displayed on the DOM. There are two other contexts in that folder, one handling the theme and the other handling toast messages and loading overlays.

- All react components and their associates .scss files are in the "components" folder. Files in that folder are categorized based on "where" they are used.

## Video Demo

[YouTube video](https://youtu.be/U9dfyAcD7t4)

## Live Demo

[Github Pages](https://sahand-masoleh.github.io/chat-app-frontend/)

## Known Issues

- React fails to clear the text input if the peer disconnects mid-session.

## Future Development

- Notifying users of disconnect events
- Sending compress voice and image messages
- Group video chat

## Related Links

- [The backend server](https://github.com/sahand-masoleh/chat-app-backend)

## Author

Sahand Masoleh

- [Email](sahand.masoleh@gmail.com)
- [Twitter](https://twitter.com/SahandMasoleh)
- [Frontend Mentor](https://www.frontendmentor.io/profile/sahand-masoleh)
