import "dotenv/config";
import "reflect-metadata";
import { register } from "tsconfig-paths";
import tsConfig from "../tsconfig.json";
register({ baseUrl: __dirname, paths: tsConfig.compilerOptions.paths });
import { CreateConnection } from "@factory/typeorm";
import { ListenWorkers } from "./utils/services/queue/worker";
import "./utils/services/queue/event-listener";

// Initialize TypeORM so entity repositories (FlowEntity etc.) are available in workers
CreateConnection().then(() => {
	ListenWorkers.listen();
});
