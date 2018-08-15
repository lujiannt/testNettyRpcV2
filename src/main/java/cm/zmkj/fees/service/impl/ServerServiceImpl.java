package cm.zmkj.fees.service.impl;

import cm.zmkj.fees.service.ServerService;
import netty.core.RpcService;
import netty.core.ServerNettyMapping;
import netty.model.RpcMessage;
import netty.server.RpcServer;
import org.springframework.stereotype.Service;

@RpcService(ServerService.class)
@Service("serverService")
public class ServerServiceImpl implements ServerService {
    @Override
    public void startServer(int port) {
        new RpcServer(port).start();
    }

    @Override
    public Object request(String parkingId, RpcMessage rpcMessage) {
        Object result = null;
        String messageId =  ServerNettyMapping.sendRequestMessage(parkingId, rpcMessage);
        if (messageId != null) {
            RpcMessage response = ServerNettyMapping.registerListenerAndReturn(messageId);
            result = response.getResult();
        }
        return result;
    }
}
