import app from "./app.js";
import { db } from "./Config/db.js";

const PORT = process.env.PORT || 8080;

db();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT} ✔`);
});
