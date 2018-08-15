package netty.serialize;

/**
 * TODO 扩展类
 *
 * 序列化协议类型
 */
public enum RpcSerializeProtocol {

    JDKSERIALIZE("jdknative"), KRYOSERIALIZE("serialize");

    private String serializeProtocol;

    private RpcSerializeProtocol(String serializeProtocol) {
        this.serializeProtocol = serializeProtocol;
    }

    public String getProtocol() {
        return serializeProtocol;
    }
}
