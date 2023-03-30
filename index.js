const Hyperswarm = require("hyperswarm");
const Hypercore = require("hypercore");
const goodbye = require("graceful-goodbye");
const crypto = require("hypercore-crypto");
const b4a = require("b4a");
const { BrowserWindow, app, ipcMain } = require("electron");
const os = require("os");
const readline = require("readline");

let mainWindow;
const isDev = false;
app.on("ready", () => {
  const isWindows = os.platform() === "win32";
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  console.log("loade");
  const loadUrl = isWindows
    ? `file://${app.getAppPath()}\\build\\index.html`
    : `file://${app.getAppPath()}/build/index.html`;
  console.log("loadUrl", loadUrl);

  mainWindow.loadURL(isDev ? "http://localhost:3001" : loadUrl);
  const swarm = new Hyperswarm();
  goodbye(() => swarm.destroy());

  const core = new Hypercore("./storage");
  core.ready();
  const conns = [];
  swarm.on("connection", (conn) => {
    const name = b4a.toString(conn.remotePublicKey, "hex");
    console.log("* got a connection from:", name, "*");
    conns.push(conn);
    // ipcMain.on('CONNECTIONS', (event, connections) => {
    //     console.log('connedc', connections)
    //   event.sender.send('CONNECTIONS', conns);
    // });
    mainWindow.webContents.send(
      "CONNECTIONS",
      conns.map((co) => b4a.toString(co.remotePublicKey, "hex"))
    );

    conn.once("close", () => conns.splice(conns.indexOf(conn), 1));
    conn.on("data", (data) => {
      console.log(`${name}: ${data}`);
      mainWindow.webContents.send("RECIEVED_MESSAGE", {
        user: name,
        text: `${data}`,
      });
    });
  });

  // Join a common topic
  try {
    const topic = true
      ? b4a.from(
          "c04d79d47fbe6d9dfef3f41a59d12206690cf4b5d4089993a68b672cfea5eb3f",
          "hex"
        )
      : crypto.randomBytes(32);
    mainWindow.webContents.send("CONNECTION_STATUS", "CONNECTING");

    const discovery = swarm.join(topic, { client: true, server: true });
    // The flushed promise will resolve when the topic has been fully announced to the DHT
    discovery.flushed().then(() => {
      console.log("joined topic:", b4a.toString(topic, "hex"));
      mainWindow.webContents.send("CONNECTION_STATUS", "CONNECTED");
    });
  } catch (error) {
    mainWindow.webContents.send("CONNECTION_STATUS", "FAILED");
  }

  let currentConnection = "";
  //   // Generate a unique peer id for the user
  //   const myPeerId = new hypercore()?.crypto?.randomBytes(32);
  //   console.log("myPeerId", myPeerId.toString("hex"));
  //   // Create a new Hyperswarm swarm instance
  //   const swarm = new hyperswarm();

  //   const connect = Buffer.from('cacad8213b31c9fd6562776194f5dff6d7fdc25df4b85215f7712de831c4f426', "hex")
  //   // Join the swarm and announce the user's peer id
  //   swarm.join(connect, {
  //     lookup: true, // find and connect to other peers in the network
  //     announce: true, // announce user's peer id to other peers
  //   });

  //   // Listen for connections to other peers in the swarm
  //   swarm.on("connection", (socket, details) => {
  //     console.log("New peer connected:", details.publicKey.toString("hex"));

  //     // Create a new Hypercore instance for the chat messages
  //     const chat = new hypercore(`./chat-${myPeerId.toString("hex")}`, {
  //       valueEncoding: "json",
  //     });

  //     console.log(chat)
  //     // Add the new peer's stream to the Hypercore instance
  //     chat
  //       .replicate({
  //         stream: socket,
  //         live: true,
  //       })
  //       .on("error", (err) => {
  //         console.error("Chat replication error:", err);
  //       });

  //     // Listen for new chat messages from other peers
  //     chat.createReadStream().on("data", (data) => {
  //       console.log(`New message from ${details.peer.toString("hex")}: ${data}`);
  //     });
  //   });

  // Prompt the user to enter chat messages
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (line) => {
    // Create a new Hypercore instance for the chat messages
    console.log("line", line);
    for (const conn of conns) {
      conn.write(line);
    }
  });

  ipcMain.on("CURRENT_CONNECTION", (event, connection) => {
    currentConnection = connection;
  });

  ipcMain.on("SEND_MESSAGE", (event, message) => {
    console.log("line", message);
    try {
      mainWindow.webContents.send("SEND_MESSAGE_STATUS", "SENDING");
      const peerPresentInConns = conns.find(
        (con) =>
          b4a.toString(con.remotePublicKey, "hex") ===
          message?.currentConnection
      );
      // console.log('peerPresentInConns',peerPresentInConns)
      if (!peerPresentInConns) {
        swarm.joinPeer(message?.currentConnection);
        swarm.on("connection", (conn) => conn.write(message.message));
      } else {
        console.log("peer present writing");
        peerPresentInConns.write(message.message);
      }
      mainWindow.webContents.send("SEND_MESSAGE_STATUS", "SENT");
    } catch (error) {
      mainWindow.webContents.send("SEND_MESSAGE_STATUS", "FAILED");
    }
  });
});
