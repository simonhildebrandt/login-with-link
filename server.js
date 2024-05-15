var liveServer = require("live-server");

var params = {
    host: "127.0.0.1",
    port: 9000,
    // open: false,
    file: "index.html",       // this is in ./nested/folder/
    root: "./dev/", // this folder contains index.html
};

liveServer.start(params);
