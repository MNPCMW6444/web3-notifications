import expressSetup from "./app/express/expressSetup";
import { connect } from "./app/mongo";

console.log("Connecting to MongoDB...");
connect().then(() => expressSetup().catch((e) => console.log(e)));
