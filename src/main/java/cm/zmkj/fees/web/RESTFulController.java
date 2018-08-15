package cm.zmkj.fees.web;

import org.springframework.web.bind.annotation.*;

@RequestMapping("/RESTFulController")
@RestController
public class RESTFulController {

    @GetMapping
    public String get(String param){
        return param;
    }

    @PostMapping
    public String post(String param){
        return param;
    }

    @PutMapping
    public String put(String param){
        return param;
    }

    @DeleteMapping
    public String delete(String param){
        return param;
    }
}
