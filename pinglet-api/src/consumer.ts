import "dotenv/config";
import "reflect-metadata";
import { register } from "tsconfig-paths";
import tsConfig from "../tsconfig.json";
register({ baseUrl: __dirname, paths: tsConfig.compilerOptions.paths });
import { KafkaAnalyticsConsumer } from "./handlers/services/kafka/notificationConsumer";

const analyticsConsumer = new KafkaAnalyticsConsumer();
analyticsConsumer.start();
