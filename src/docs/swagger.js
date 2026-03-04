export const swaggerDocument = {
  openapi: "3.0.0",

  info: {
    title: "ORO E-Commerce API",
    version: "1.0.0",
    description:
      "Official API Documentation for ORO E-Commerce Backend built with Express.js and MongoDB"
  },

  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local Development Server"
    }
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter JWT token in format: Bearer <token>"
      }
    },

    schemas: {
      /* ================= USER ================= */
      User: {
        type: "object",
        properties: {
          name: { type: "string", example: "Sherif Shoukry" },
          email: { type: "string", example: "sherif@gmail.com" },
          password: { type: "string", example: "Password@123" },
          avatar: { type: "string", example: "https://image-url.com/avatar.jpg" }
        }
      },

      Login: {
        type: "object",
        properties: {
          email: { type: "string", example: "sherif@gmail.com" },
          password: { type: "string", example: "Password@123" }
        }
      },

      UserResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "65f1a2b34cde123456789000" },
          firstName: { type: "string", example: "Sherif" },
          lastName: { type: "string", example: "Shoukry" },
          email: { type: "string", example: "sherif@gmail.com" },
          phoneType: { type: "string", example: "mobile" },
          phoneNumber: { type: "string", example: "01012345678" },
          role: { type: "string", example: "user" },
          isVerified: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" }
        }
      },

      UpdateUser: {
        type: "object",
        properties: {
          firstName: { type: "string", example: "Ahmed" },
          lastName: { type: "string", example: "Ali" },
          phoneNumber: { type: "string", example: "01099998888" }
        }
      },

      /* ================= RESPONSE MODELS ================= */
      SuccessResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          message: { type: "string", example: "Operation completed successfully" }
        }
      },

      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string", example: "Something went wrong" }
        }
      }
    }
  },

  tags: [
    { name: "Auth", description: "Authentication operations" },
    { name: "User", description: "User profile operations" }
  ],

  paths: {
    /* ================= AUTH ================= */

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
            201: { description: "User registered successfully" },
            400: { description: "Validation error" }
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
            200: { description: "Login successful (Access & Refresh tokens returned)" },
            401: { description: "Invalid credentials" }
          }
        }
      },

      "/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Refresh access token",
          responses: {
            200: { description: "New access token generated" },
            401: { description: "Invalid refresh token" }
          }
        }
      },

      "/auth/logout": {
        post: {
          tags: ["Auth"],
          security: [{ BearerAuth: [] }],
          summary: "Logout user",
          responses: {
            200: { description: "Logged out successfully" }
          }
        }
      },

      "/auth/me": {
        get: {
          tags: ["Auth"],
          security: [{ BearerAuth: [] }],
          summary: "Get authenticated user profile",
          responses: {
            200: { description: "User profile returned" },
            401: { description: "Unauthorized" }
          }
        }
      },

      "/auth/verify-otp": {
        post: {
          tags: ["Auth"],
          summary: "Verify OTP code",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "user@gmail.com" },
                    otp: { type: "string", example: "123456" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "OTP verified successfully" },
            400: { description: "Invalid or expired OTP" }
          }
        }
      },

      "/auth/resend-otp": {
        post: {
          tags: ["Auth"],
          summary: "Resend OTP",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "user@gmail.com" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "OTP resent successfully" }
          }
        }
      },

      "/auth/request-reset-password": {
        post: {
          tags: ["Auth"],
          summary: "Request password reset",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "user@gmail.com" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Password reset email sent" }
          }
        }
      },

      "/auth/reset-password": {
        post: {
          tags: ["Auth"],
          summary: "Reset password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", example: "reset-token" },
                    newPassword: { type: "string", example: "NewPassword@123" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Password reset successful" }
          }
        }
      },

      /* ================= GOOGLE AUTH ================= */

      "/auth/google/login": {
        get: {
          tags: ["Auth"],
          summary: "Redirect to Google OAuth login",
          responses: {
            302: { description: "Redirects to Google authentication page" }
          }
        }
      },

      "/auth/google/callback": {
        get: {
          tags: ["Auth"],
          summary: "Google OAuth callback",
          responses: {
            200: { description: "Google authentication successful" },
            401: { description: "Google authentication failed" }
          }
        }
      },

    /* ================= USER ================= */
      /* Get Logged In User */
      "/users/me": {
        get: {
          tags: ["User"],
          security: [{ BearerAuth: [] }],
          summary: "Get current authenticated user",
          responses: {
            200: { description: "User returned successfully" },
            401: { description: "Unauthorized" }
          }
        },

        delete: {
          tags: ["User"],
          security: [{ BearerAuth: [] }],
          summary: "Delete current authenticated user (Soft Delete)",
          responses: {
            200: { description: "User deleted successfully" }
          }
        }
      },

      /* Find User By ID (Admin Only) */
      "/users/{id}": {
        get: {
          tags: ["User"],
          security: [{ BearerAuth: [] }],
          summary: "Find user by ID (Admin only)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "User found" },
            403: { description: "Forbidden" }
          }
        },

        patch: {
          tags: ["User"],
          security: [{ BearerAuth: [] }],
          summary: "Update user by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateUser" }
              }
            }
          },
          responses: {
            200: { description: "User updated successfully" }
          }
        },

        delete: {
          tags: ["User"],
          security: [{ BearerAuth: [] }],
          summary: "Delete user by ID (Admin only)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "User deleted successfully" }
          }
        }
      },

      /* Find By Email (Admin Only) */
      "/users/by_email/{email}": {
        get: {
          tags: ["User"],
          security: [{ BearerAuth: [] }],
          summary: "Find user by email (Admin only)",
          parameters: [
            {
              name: "email",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "User found" }
          }
        }
      },

      /* Admin: Get All Users */
      "/users": {
        get: {
          tags: ["User"],
          security: [{ BearerAuth: [] }],
          summary: "Get all users (Admin only)",
          responses: {
            200: { description: "Users retrieved successfully" }
          }
        },

        post: {
          tags: ["User"],
          security: [{ BearerAuth: [] }],
          summary: "Create new user (Admin only)",
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
        },

        delete: {
          tags: ["User"],
          security: [{ BearerAuth: [] }],
          summary: "Delete all users (Admin only)",
          responses: {
            200: { description: "All users deleted" }
          }
        }
    }
  }
};