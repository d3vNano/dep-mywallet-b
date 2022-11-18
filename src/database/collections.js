import db from "./db.js";

const usersCollection = db.collection("users");
const sessionsCollection = db.collection("sessions");
const entriesCollection = db.collection("entries");
const exitiesCollection = db.collection("exities");

export {
    usersCollection,
    sessionsCollection,
    entriesCollection,
    exitiesCollection,
};
