import build from "./src/server";
import fs from "fs";
import axios from "axios";

async function gen() {
  const server = await build();

  await server.listen({ port: 9999 });

  const swaggerYaml = await axios
    .get<string>("http://localhost:9999/docs/yaml")
    .then((res) => res.data);

  await server.close();
  fs.writeFileSync(`./swagger.yaml`, swaggerYaml);
}

gen();
