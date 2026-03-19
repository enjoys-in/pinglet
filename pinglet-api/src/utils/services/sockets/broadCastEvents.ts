import { getSocketIo } from "./Sockets";
import { SocketEventConstants } from "./socketEventConstants";

class BroadCastEvents {
	sendServerClosed() {
		return getSocketIo().emit(SocketEventConstants.ServerClosed, {
			type: "error",
			message: "ServerDown",
		});
	}
}
export default new BroadCastEvents();
