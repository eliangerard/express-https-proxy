const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const httpProxy = require('http-proxy');
const { server } = require('./src/util/server');

// Cargamos los certificados SSL
const privateKey = fs.readFileSync('./key.pem', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
};

const app = express();

// Creamos un proxy para reenviar las solicitudes
const proxy = httpProxy.createProxyServer({});

app.use((req, res) => {
    // Aquí reenviamos todas las solicitudes a la otra API
    proxy.web(req, res, { target: server });
});

// Creamos el servidor HTTP y HTTPS
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => console.log('HTTP Server running on port 80'));
httpsServer.listen(443, () => console.log('HTTPS Server running on port 443'));