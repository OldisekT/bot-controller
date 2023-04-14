const { ipcRenderer } = require("electron");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

  function getServers(TOKEN) {
    let tokenOption = TOKEN.slice(-1);
    TOKEN = TOKEN.slice(0, -1);
    let authorization = "";
    if (tokenOption == 0) {
      authorization = `Bot ${TOKEN}`;
    } else if (tokenOption == 1) {
      authorization = `${TOKEN}`;
    }
    fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: authorization,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  module.exports = {
    getServers,
  };