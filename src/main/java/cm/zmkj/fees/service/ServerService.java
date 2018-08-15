package cm.zmkj.fees.service;

import netty.model.RpcMessage;

public interface ServerService {
    void startServer(int port);

    Object request(String parkingId, RpcMessage rpcMessage);
}
