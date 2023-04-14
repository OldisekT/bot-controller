// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
var TOKEN = "";

window.addEventListener("DOMContentLoaded", () => {
  //                                      TITLE BAR                                         \\
  // Create the title bar element
  const titleBar = document.createElement("div");
  titleBar.classList.add("title-bar");
  titleBar.id = "title_bar";

  // Create the headline element
  const headline = document.createElement("p");
  headline.classList.add("discord-headline");
  headline.textContent = "Bot controller";
  titleBar.appendChild(headline);

  // Create the handle element
  const handle = document.createElement("div");
  handle.classList.add("title-handle");
  titleBar.appendChild(handle);

  // Create the buttons container element
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("title-buttons");
  buttonsContainer.id = "titleButtons";
  titleBar.appendChild(buttonsContainer);

  // Create the buttons
  const buttons = ["min-button", "max-button", "quit-button"];
  buttons.forEach((button) => {
    const buttonEl = document.createElement("button");
    buttonEl.classList.add("title-button", button);
    buttonsContainer.appendChild(buttonEl);
    buttonEl.addEventListener("click", () => {
      ipcRenderer.send(button, true, { forward: true });
    });
  });

  // Add the title bar to the DOM
  document.body.appendChild(titleBar);

  //                                           index.html                                              \\
  if (document.body.id === "index") {
    // AUTO LOGIN
    let maybeToken
    fs.access(path.join(__dirname, "config.json"), fs.constants.F_OK, (err) => {
      if (err) {
      } else {
        maybeToken = JSON.parse(
          fs.readFileSync(path.join(__dirname, "config.json"))
        )["TOKEN"];
        if (maybeToken) {
          ipcRenderer.send("validate-token", maybeToken);
        }
      }
    });

    const tokenEl = document.getElementById("token");
    const tokenButton = document.querySelector("#moveOn");
    tokenButton.addEventListener("mousedown", () => {
      setTimeout(() => {
        if (tokenEl.innerHTML != "") {
          console.log("Checking token");
          ipcRenderer.send("validate-token", tokenEl.innerHTML);
        }
      }, 50);
    });

    ipcRenderer.on("validate-token-response", (event, isValid) => {
      const messageContainer = document.querySelector("#isTokenValid");
      console.log("Received validation " + isValid);
      console.log(`MaybeToken = ${maybeToken}`)
      console.log(`TOKEN = ${TOKEN}`)

      if (isValid) {
        messageContainer.innerHTML = "true";
        if (typeof maybeToken === "string" && maybeToken.length > 0) {
          TOKEN = maybeToken;
        } else {
          TOKEN = tokenEl.innerHTML;
          fs.writeFileSync(
            path.join(__dirname, "config.json"),
            JSON.stringify({ TOKEN })
          );
        }
        ipcRenderer.send("moveOn", true);
      } else {
        maybeToken = "";
        messageContainer.innerHTML = "false";
      }
    });
  }
  //                                          client.html                                               \\

  if (document.body.id == "client") {
    const commandEl = document.getElementById("command");
    const responseServerEl = document.getElementById("responseServers");
    const responseChannelsEl = document.getElementById("responseChannels");
    const responseMessagesEl = document.getElementById("responseMessages");
    const responseMessageEl = document.getElementById("responseMessage");
    TOKEN = JSON.parse(
      fs.readFileSync(path.join(__dirname, "config.json"), "utf8")
    ).TOKEN;
    var command = "";
    setInterval(() => {
      if (commandEl.innerHTML !== "") {
        command = commandEl.innerHTML;
        commandEl.innerHTML = "";
        if (command == "getServers") {
          console.log("Getting servers");
          ipcRenderer.send("getServers", TOKEN);
        }
        else if (command.startsWith("fetchChannels")){
          console.log("Getting channels");
          ipcRenderer.send("fetchChannels",command.split(" ")[1],TOKEN)
        }
        else if (command == "goToDms"){
          console.log("Getting Dms");
          ipcRenderer.send("fetchDms",TOKEN)
        }
        else if (command.startsWith("goToChannel")){
          console.log("Getting first messages");
          ipcRenderer.send("goToChannel",command.split(" ")[1],TOKEN)
        }
        else if (command.startsWith("goToDm")){
          console.log("Getting Dm's first messages");
          ipcRenderer.send("goToDm",command.split(" ")[1],TOKEN)
        }
        else if (command.startsWith("sendMessage")) {
          const { id, message } = JSON.parse(command.slice(12));
          console.log("Sending message " + message);
          ipcRenderer.send("sendMessage", id, message, TOKEN);
        }
        else if (command.startsWith("sendRawMessage")) {
          const { id, message } = JSON.parse(command.slice(15));
          console.log("Sending message " + message);
          ipcRenderer.send("sendRawMessage", id, message, TOKEN);
        }
        else if (command.startsWith("logOut")) {
          fs.writeFileSync(
            path.join(__dirname, "config.json"),
            JSON.stringify({"TOKEN":""})
          );
          ipcRenderer.send("logOut");
        }
      }
    }, 10);
    ipcRenderer.on("getServers", (event, data) => {
      responseServerEl.innerHTML = JSON.stringify(data);
    });
    ipcRenderer.on("fetchChannels", (event, data) => {
      responseChannelsEl.innerHTML = JSON.stringify(data);
    });
    ipcRenderer.on("goToChannel", (event, data) => {
      responseMessagesEl.innerHTML = JSON.stringify(data);
    });
    ipcRenderer.on("sendMessage", (event, data) => {
      responseMessageEl.innerHTML = JSON.stringify(data);
    });
  }
});
