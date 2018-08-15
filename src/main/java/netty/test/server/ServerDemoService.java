package netty.test.server;

import netty.model.RpcMessage;

public interface ServerDemoService {
    void startServer(int port);

    String sendRequest(String parkingId, RpcMessage rpcMessage);
}
