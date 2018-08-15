package netty.client;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.serialization.ClassResolvers;
import io.netty.handler.codec.serialization.ObjectDecoder;
import io.netty.handler.codec.serialization.ObjectEncoder;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import io.netty.handler.timeout.IdleStateHandler;
import io.netty.util.HashedWheelTimer;
import netty.heart.ConnectionWatchdog;
import netty.heart.ConnectorIdleStateTrigger;
import netty.model.RpcMessage;
import netty.serialize.*;

import java.util.concurrent.TimeUnit;

public class RpcClient {
    protected final HashedWheelTimer timer = new HashedWheelTimer();
    private Bootstrap boot;
    //todo -- 测试用
    private SocketChannel socketChannel;

    private final ConnectorIdleStateTrigger idleStateTrigger = new ConnectorIdleStateTrigger();

    public void connect(int port, String host) throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
        boot = new Bootstrap();
        boot.group(group).channel(NioSocketChannel.class).handler(new LoggingHandler(LogLevel.INFO));

        final ConnectionWatchdog watchdog = new ConnectionWatchdog(boot, timer, port,host, true) {
            public ChannelHandler[] handlers() {
                return new ChannelHandler[] {
                        this,
                        new IdleStateHandler(0, 4, 0, TimeUnit.SECONDS),
//                        new ObjectDecoder(Integer.MAX_VALUE ,ClassResolvers.cacheDisabled(this
//                                .getClass().getClassLoader())),
//                        new ObjectEncoder(),
//                        new ObjectEncoder(),

                        new MessageDecoder(new KryoCodecUtil(KryoPoolFactory.getKryoPoolInstance())),
                        new MessageEncoder(new KryoCodecUtil(KryoPoolFactory.getKryoPoolInstance())),
                        idleStateTrigger,
//                        new StringDecoder(),
//                        new StringEncoder(),
                        new PpcClientHandler()
                };
            }
        };

        ChannelFuture future;
        //进行连接
        try {
            synchronized (boot) {
                boot.handler(new ChannelInitializer<Channel>() {

                    //初始化channel
                    @Override
                    protected void initChannel(Channel ch) throws Exception {
                        ch.pipeline().addLast(watchdog.handlers());
                    }
                });

                future = boot.connect(host,port);
            }

            // 以下代码在synchronized同步块外面是安全的
            future.sync();

            //todo -- 测试用
            socketChannel = (SocketChannel)future.channel();
        } catch (Throwable t) {
            throw new Exception("connects to  fails", t);
        }
    }

    /**
     * @param args
     * @throws Exception
     */
    public static void main(String[] args) throws Exception {
        int port = 8080;
        if (args != null && args.length > 0) {
            try {
                port = Integer.valueOf(args[0]);
            } catch (NumberFormatException e) {
                // 采用默认值
            }
        }
        new RpcClient().connect(port, "127.0.0.1");
    }

    /**
     * 发送消息 todo -- 测试用
     *
     * @param msg
     */
    public void sendMessage(RpcMessage msg) {
        if (socketChannel != null) {
            socketChannel.writeAndFlush(msg);
        }
    }
}
