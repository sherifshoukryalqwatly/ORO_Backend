export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Express API",
    version: "1.0.0",
    description: "API Documentation for the Express.js Backend"
  },

  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local Server"
    }
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },

    schemas: {
      User: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          avatar: { type: "string" }
        }
      },

      Login: {
        type: "object",
        properties: {
          email: { type: "string" },
          password: { type: "string" }
        }
      }
    }
  },

  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" }
            }
          }
        },
        responses: {
          201: { description: "User created successfully" }
        }
      }
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "User login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Login" }
            }
          }
        },
        responses: {
          200: { description: "Logged in successfully" }
        }
      }
    },

    "/users/profile": {
      get: {
        tags: ["User"],
        security: [{ BearerAuth: [] }],
        summary: "Get user profile",
        responses: {
          200: { description: "User profile returned" }
        }
      }
    }
  }
};