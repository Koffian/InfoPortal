const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');

// Без таких трюков не распарсится swagger.yaml
const fs = require('fs');
const jsyaml = require('js-yaml');
const spec = fs.readFileSync('swagger.yaml', 'utf-8');
const swaggerDocument = jsyaml.load(spec);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const port = 3200;

// Start the server
app.listen(port, () => {
 try {
	console.log(`Server with swagger-ui running on http://localhost:${port}`);
 }
 catch (error) {
	console.log("Ошибка запуска сервера с swagger-ui: " + error);
 }
});
