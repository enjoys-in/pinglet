import "dotenv/config";
import "reflect-metadata";
import { register } from "tsconfig-paths";
import tsConfig from "../tsconfig.json";
register({ baseUrl: __dirname, paths: tsConfig.compilerOptions.paths });
import { CreateConnection, CloseConnection } from "@factory/typeorm";
import { ListenWorkers } from "./utils/services/queue/worker";
import "./utils/services/queue/event-listener";
import { Logging } from "@/logs";

// Initialize TypeORM so entity repositories (FlowEntity etc.) are available in workers
CreateConnection().then(() => {
	ListenWorkers.listen();
});

const shutdown = async (signal: string) => {
	Logging.dev(`[Worker] ${signal} — shutting down`);
	await ListenWorkers.closeAll().catch(() => {});
	await CloseConnection().catch(() => {});
	process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
