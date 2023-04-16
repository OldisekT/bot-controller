const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
var mainWindow = {};
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 300,
    minHeight: 100,
    titleBarStyle: "hidden",
    titleBarOverlay: false,
    icon: __dirname + "/assets/favicon.png",
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      preload: path.join(__dirname, "./assets/js/main.js"), //js
    },
  });
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  //mainWindow.webContents.openDevTools();
  //mainWindow.maximize()

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F5') {
      mainWindow.reload()
      event.preventDefault()
    }
  })
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("quit-button", () => {
  app.quit();
});

ipcMain.on("max-button", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on("min-button", () => {
  mainWindow.minimize();
});

ipcMain.on("validate-token", async (event, token) => {
  let tokenOption = token.slice(-1);
  token = token.slice(0, -1);
  let authorization = "";
  if (tokenOption == 0) {
    authorization = `Bot ${token}`;
  } else if (tokenOption == 1) {
    authorization = `${token}`;
  }
  const response = await fetch("https://discord.com/api/v9/users/@me", {
    headers: {
      authorization: authorization,
    },
  });

  let tokenValid = false;

  if (response.status === 200) {
    tokenValid = true; // Token is valid
  }
  console.log(tokenValid);
  event.reply("validate-token-response", tokenValid);
});

ipcMain.on("getMe", async (event, token) => {
  let tokenOption = token.slice(-1);
  token = token.slice(0, -1);
  let authorization = "";
  if (tokenOption == 0) {
    authorization = `Bot ${token}`;
  } else if (tokenOption == 1) {
    authorization = `${token}`;
  }
  const response = await fetch("https://discord.com/api/v9/users/@me", {
    headers: {
      authorization: authorization,
    },
  })
  .then((response) => response.json())
  .then((data) => {
    event.reply("getMe", data);
  });

});

ipcMain.on("moveOn", () => {
  mainWindow.loadFile(path.join(__dirname, "client.html"));
});

ipcMain.on("getServers", (event, token) => {
  let tokenOption = token.slice(-1);
  token = token.slice(0, -1);
  let authorization = "";
  if (tokenOption == 0) {
    authorization = `Bot ${token}`;
  } else if (tokenOption == 1) {
    authorization = `${token}`;
  }
  fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: authorization,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      event.reply("getServers", data);
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("fetchChannels", (event, guildId, token) => {
  let tokenOption = token.slice(-1);
  token = token.slice(0, -1);
  let authorization = "";
  if (tokenOption == 0) {
    authorization = `Bot ${token}`;
  } else if (tokenOption == 1) {
    authorization = `${token}`;
  }
  fetch(`https://discord.com/api/v9/guilds/${guildId}/channels`, {
    headers: {
      Authorization: authorization,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      event.reply("fetchChannels", data);
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("fetchDms", (event, token) => {
  let tokenOption = token.slice(-1);
  token = token.slice(0, -1);
  let authorization = "";
  if (tokenOption == 0) {
    authorization = `Bot ${token}`;
  } else if (tokenOption == 1) {
    authorization = `${token}`;
  }
  fetch(`https://discord.com/api/v9/users/@me/channels`, {
    headers: {
      Authorization: authorization,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      event.reply("fetchChannels", data);
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("goToChannel", (event, channelId, token) => {
  let tokenOption = token.slice(-1);
  token = token.slice(0, -1);
  let authorization = "";
  if (tokenOption == 0) {
    authorization = `Bot ${token}`;
  } else if (tokenOption == 1) {
    authorization = `${token}`;
  }
  fetch(`https://discord.com/api/v9/channels/${channelId}/messages?limit=50`, {
    headers: {
      Authorization: authorization,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      event.reply("goToChannel", data);
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("goToDm", (event, dmId, token) => {
  let tokenOption = token.slice(-1);
  token = token.slice(0, -1);
  let authorization = "";
  if (tokenOption == 0) {
    authorization = `Bot ${token}`;
  } else if (tokenOption == 1) {
    authorization = `${token}`;
  }
  let url = `https://discord.com/api/v9/channels/${dmId}/messages`;
  fetch(url, {
    headers: {
      Authorization: authorization,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      event.reply("goToChannel", data);
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("sendMessage", async (event, channelId, message, token) => {
  let tokenOption = token.slice(-1);
  token = token.slice(0, -1);
  let authorization = "";
  if (tokenOption == 0) {
    authorization = `Bot ${token}`;
  } else if (tokenOption == 1) {
    authorization = `${token}`;
  }
  try {
    const response = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
        }),
      }
    );
    const data = await response.json();
    event.reply("sendMessage", data);
  } catch (error) {
    console.error(error);
  }
});

ipcMain.on("sendRawMessage", async (event, channelId, message, token) => {
  let tokenOption = token.slice(-1);
  token = token.slice(0, -1);
  let authorization = "";
  if (tokenOption == 0) {
    authorization = `Bot ${token}`;
  } else if (tokenOption == 1) {
    authorization = `${token}`;
  }
  let headersS = {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: message,
  };
  try {
    const response = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages`,
      headersS
    );
    const data = await response.json();
    event.reply("sendMessage", data);
  } catch (error) {
    console.error(error);
  }
});

ipcMain.on("createDm", async (event, userId, token) => {
  let tokenOption = token.slice(-1);
  token = token.slice(0, -1);
  let authorization = "";
  if (tokenOption == 0) {
    authorization = `Bot ${token}`;
  } else if (tokenOption == 1) {
    authorization = `${token}`;
  }
  let BODY = {
    recipient_id: userId,
  }

  fetch(`https://discord.com/api/v9/users/@me/channels`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(BODY),
  })
    .then((response) => response.json())
    .then((channel) => {
      event.reply("ChannelID",channel.id)
      // Fetch the channel's messages
      const url = `https://discord.com/api/v9/channels/${channel.id}/messages?limit=10`;
      fetch(url, {
        headers: {
          Authorization: authorization,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          event.reply("createDm",data)
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("logOut", () => {
  mainWindow.loadFile(path.join(__dirname, "index.html"));
});
