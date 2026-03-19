import { exec } from "node:child_process";
import { platform } from "node:os";
import { __CONFIG__ } from "@/app/config";
import { Logging } from "@/logs";
const osPlatform = platform();

const url = __CONFIG__.APP.APP_URL;
const WINDOWS_PLATFORM = "win32";
const MAC_PLATFORM = "darwin";

let command;
export class Platform {
	static LaunchWindow(): void {
		Logging.dev(`Main Instance ${process.pid} is running`);
		if (osPlatform === WINDOWS_PLATFORM) {
			command = `start microsoft-edge:${url}`;
		} else if (osPlatform === MAC_PLATFORM) {
			command = `open -a "Google Chrome" ${url}`;
		} else {
			command = `google-chrome --no-sandbox ${url}`;
		}
		// exec(command);
	}
}
