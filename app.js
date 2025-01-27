import express from 'express';
import bodyParser from 'body-parser';

// Swagger for api docs
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Controllers
import cheesesController from './controllers/cheese.js';

// Create express server object
const app = express();

app.use(bodyParser.json());

// Swagger config
const docOptions = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'Cheese API',
            version: '1.0.0'
        }
    },
    apis: ['./controllers/*.js'] // Where to find api methods (controllers)
};

const openapiSpecification = swaggerJSDoc(docOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// URL dispatching
app.use('/cheeses', cheesesController);

// Start web server
app.listen(3000, () => {
    console.log('Express API running on port 3000');
});

