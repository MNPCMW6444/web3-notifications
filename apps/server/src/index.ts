import expressSetup from "./app/express/expressSetup";
import { connect } from "./app/mongo";
import { notify } from "./app/w3-engine";

console.log("Connecting to MongoDB...");
connect().then(() =>
  expressSetup()
    .then(() => notify())
    .catch((e) => console.log(e)),
);
