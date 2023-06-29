import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

export function getSwaggerOptions(): FastifyDynamicSwaggerOptions {
  return {
    openapi: {
      info: {
        title: `Fastify Swagger Typebox Example`,
        version: "1.0.0",
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
      servers: [
        {
          url: "http://0.0.0.0:8000/",
          description: "DEV",
        },
      ],
      components: {
        securitySchemes: {
          bearer: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearer: [] }],
    },
  };
}
export function getSwaggerUiOptions(): FastifySwaggerUiOptions {
  return {
    routePrefix: "/docs",
  };
}
