package netty.serialize;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * 序列化、反序列化接口
 */
public interface RpcSerialize {

    void serialize(OutputStream output, Object object) throws IOException;

    Object deserialize(InputStream input) throws IOException;

}
