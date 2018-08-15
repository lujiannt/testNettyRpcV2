package netty.test;

import netty.core.ServerNettyMapping;
import netty.model.RpcMessage;
import netty.test.server.ServerDemoService;
import netty.test.server.ServerDemoServiceImpl;

public class TestDemo {
    public static void main(String[] args) {
        ServerDemoService serverDemoService = new ServerDemoServiceImpl();
        RpcMessage request = new RpcMessage(RpcMessage.MESSAGE_TYPE_REQUEST, "ClientDemoService", "demo", new Class<?>[]{String.class}, new String[]{"demo"});

        String messageId = serverDemoService.sendRequest("1", request);
        if (messageId != null) {
            RpcMessage response = ServerNettyMapping.registerListenerAndReturn(messageId);
            System.out.println(response.getResult().toString());
        }
    }
}

