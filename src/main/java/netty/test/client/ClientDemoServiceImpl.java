package netty.test.client;

import netty.client.RpcClient;
import netty.core.RpcService;
import org.springframework.stereotype.Service;

@RpcService(ClientDemoService.class)
@Service
public class ClientDemoServiceImpl implements ClientDemoService {

    @Override
    public void connect(String ip, int port) {
        RpcClient rpcClient = new RpcClient();
        try {
            rpcClient.connect(port, ip);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public String demo(String demo) {
        return demo;
    }
}
