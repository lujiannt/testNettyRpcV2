package netty.test.client;

public interface ClientDemoService {
    void  connect(String ip, int port);

    String demo(String demo);
}
