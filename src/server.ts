import swagger from "@fastify/swagger";
import Fastify, { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";
import swaggerUi from "@fastify/swagger-ui";
import { getSwaggerOptions } from "./swagger";
interface Props {
  exposeDocs?: boolean;
}

async function build(
  { exposeDocs }: Props = { exposeDocs: false }
): Promise<FastifyInstance> {
  const fastify = Fastify({ trustProxy: true });

  await fastify.register(swagger, {
    ...getSwaggerOptions(),
    refResolver: {
      buildLocalReference: (json, baseUri, fragment, i) =>
        (json.$id as string) || `def-${i}`,
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    // transformSpecification: (swaggerObject, request, reply) => {
    //   console.log(swaggerObject)
    //   return swaggerObject
    // },
  });

  fastify.get(
    "/",
    {
      schema: {
        response: {
          "2xx": Type.Object({
            hello: Type.String({ examples: ["world"] }),
          }),
        },
      },
    },
    (request, reply) => {
      reply.send("Hello!");
    }
  );

  return fastify;
}

async function start() {
  // Google Cloud Run will set this environment variable for you, so
  // you can also use it to detect if you are running in Cloud Run
  //const IS_GOOGLE_CLOUD_RUN = process.env.K_SERVICE !== undefined

  try {
    const server = await build();
    // You must listen on the port Cloud Run provides
    const port = 8000;

    // You must listen on all IPV4 addresses in Cloud Run
    const host = "0.0.0.0";
    const address = await server.listen({ port, host });
    console.log(`Listening on ${address}`);
    console.log({ message: "Server is listening for requests." });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default build;

if (require.main === module) {
  start().catch((e) => console.error("Application start failed:", e));
}
