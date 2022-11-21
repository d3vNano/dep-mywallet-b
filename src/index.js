import chalk from "chalk";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transactions.routes.js";
import listRoutes from "./routes/list.routes.js";
import sessionRoutes from "./routes/session.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(transactionRoutes);
app.use(listRoutes);
app.use(sessionRoutes);

app.listen(process.env.PORT_API, () => {
    console.log(
        chalk.bold.cyan(`[Listening ON] Port: ${process.env.PORT_API}.`)
    );
});
