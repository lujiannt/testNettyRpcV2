package cm.zmkj.fees.service;

import netty.core.RpcService;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ServiceCenter implements ApplicationContextAware {
    private ApplicationContext context;

    private static Map<String, Object> serviceMap = new HashMap<>();

    public static Object getService(String serviceName) {
        String newServiceName = serviceName.substring(0,1).toUpperCase() + serviceName.substring(1);
        return serviceMap.get(newServiceName);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        context = applicationContext;
        Map<String, Object> serviceBeans = context.getBeansWithAnnotation(RpcService.class);
        for (Map.Entry entry : serviceBeans.entrySet()) {
            String interfaceName = entry.getValue().getClass().getAnnotation(RpcService.class).value().getName();
            int index = interfaceName.lastIndexOf(".") + 1;
            interfaceName = interfaceName.substring(index);
            System.out.println("interfaceName = " + interfaceName);
            System.out.println("entry.getValue() = " + entry.getValue());
            serviceMap.put(interfaceName, entry.getValue());
        }
    }
}
