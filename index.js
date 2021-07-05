const path = require("path");
const fs = require("fs");
const express = require('express');
const app = express();
const port = 3000;

require('esbuild').build({
    entryPoints: [path.resolve(__dirname, "client", "index.js")],
    outfile: path.resolve(__dirname, "dist", "client.dist.js"),
    bundle: true,
    loader: {
        ".png": "dataurl"
    },
    watch: {
        onRebuild(error, result) {
            if (error) console.error('watch build failed:', error)
            else console.log('watch build succeeded:', result)
        },
    },
});

app.get('/', (req, res) => {
    fs.readFile(path.resolve(__dirname, "index.html"), "utf8", function (err, data) {
        res.send(`${data}`);
    });
});



app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/dist'));

app.listen(port, () => console.log("listening on " + port));
