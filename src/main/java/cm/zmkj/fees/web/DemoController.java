package cm.zmkj.fees.web;

import cm.zmkj.fees.service.ServerService;
import netty.core.ServerNettyMapping;
import netty.model.RpcMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
@Controller
@RequestMapping("/demoController")
public class DemoController {
    @Autowired
    private ServerService serverService;

    @GetMapping("/getView")
    public String tem(String name,String param,Model model) {
        model.addAttribute("textParam",param);
        return name;
    }

    @PostMapping("/postParam")
    @ResponseBody
    public String tem(String name, String param) {
        return name;
    }

    @DeleteMapping("/deleteDemo")
    @ResponseBody
    public String delete(String id) {
        return "ok" + id;
    }

    @PutMapping("/updateDemo")
    @ResponseBody
    public String update(String data) {
        return "ok" + data;
    }

}
