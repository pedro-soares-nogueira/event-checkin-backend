import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-events";
import { registerforEvent } from "./routes/register-for-event";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerforEvent);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server is running!");
});