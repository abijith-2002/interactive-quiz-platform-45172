const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quiz Platform API',
      version: '1.0.0',
      description: 'API documentation for the Interactive Quiz Platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'User\'s username'
            },
            email: {
              type: 'string',
              description: 'User\'s email'
            },
            password: {
              type: 'string',
              description: 'User\'s password'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User\'s role'
            }
          }
        },
        Quiz: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Quiz title'
            },
            description: {
              type: 'string',
              description: 'Quiz description'
            },
            timeLimit: {
              type: 'number',
              description: 'Time limit in minutes'
            },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: {
                    type: 'string',
                    description: 'Question text'
                  },
                  options: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        text: {
                          type: 'string',
                          description: 'Option text'
                        },
                        isCorrect: {
                          type: 'boolean',
                          description: 'Whether this option is correct'
                        }
                      }
                    }
                  },
                  points: {
                    type: 'number',
                    description: 'Points for this question'
                  }
                }
              }
            },
            isPublished: {
              type: 'boolean',
              description: 'Whether the quiz is published'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
