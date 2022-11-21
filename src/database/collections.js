import db from "./db.js";

const usersCollection = db.collection("users");
const sessionsCollection = db.collection("sessions");
const transactionsCollection = db.collection("transactions");

export { usersCollection, sessionsCollection, transactionsCollection };
