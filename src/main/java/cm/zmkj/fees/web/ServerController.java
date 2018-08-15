package cm.zmkj.fees.web;

import cm.zmkj.fees.service.ServerService;
import netty.core.ServerNettyMapping;
import netty.model.RpcMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/server")
public class ServerController {
    @Autowired
    private ServerService serverService;

    @PutMapping("/startServer")
    @ResponseBody
    public String startServer() {
        serverService.startServer(10086);
        return "start server success";
    }

    @PutMapping("/rpcDemo")
    @ResponseBody
    public String rpcTest(String parkingId) {
        RpcMessage request = new RpcMessage(RpcMessage.MESSAGE_TYPE_REQUEST, "ClientDemoService", "demo", new Class<?>[]{String.class}, new String[]{"demo"});
        return (String)serverService.request(parkingId, request);
    }
}
