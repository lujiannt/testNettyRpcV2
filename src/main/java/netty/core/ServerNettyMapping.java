package netty.core;

import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelId;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.concurrent.GlobalEventExecutor;
import netty.model.RpcMessage;

import java.util.*;

public class ServerNettyMapping {
    /**
     * 存储每一个客户端接入进来时的channel对象
     */
    public static ChannelGroup group = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

    /**
     * server端停车场标识与channel键值对
     */
    public static Map<String, ChannelId> serverChannelMap = new HashMap<>();

    /**
     * 本地端返回的消息映射
     */
    public static Map<String, RpcMessage> rpcMessageMap = new HashMap<>();

    /**
     * 注册监听返回响应消息
     *
     * @param messageId
     */
    public static RpcMessage registerListenerAndReturn(String messageId) {
        RpcMessage rpcMessage = null;
        try {
            Thread.sleep(500);
            while (rpcMessage == null) {
                rpcMessage = rpcMessageMap.get(messageId);
            }
            rpcMessageMap.remove(messageId);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            return rpcMessage;
        }
    }

    /**
     * server端：根据停车场id获取channel
     *
     * @param parkingId
     * @return
     */
    public static Channel getServerChannel(String parkingId) {
        Channel channel = null;
        ChannelId channelId = serverChannelMap.get(parkingId);
        Iterator<Channel> iterator = ServerNettyMapping.group.iterator();

        while (iterator.hasNext()) {
            Channel ch = iterator.next();
            if (ch.id().asShortText().equals(channelId.asShortText()) && ch.id().asLongText().equals(channelId.asLongText())) {
                channel = ch;
                break;
            }
        }

        return channel;
    }

    /**
     * 删除停车场id与channel的映射
     *
     * @param channel
     */
    public static void removeServerChannel(Channel channel) {
        ChannelId channelId = channel.id();
        Set<String> keys = ServerNettyMapping.serverChannelMap.keySet();
        Iterator<String> iterator = keys.iterator();

        while (iterator.hasNext()) {
            ChannelId chId = ServerNettyMapping.serverChannelMap.get(iterator.next());
            if (chId.asShortText().equals(channelId.asShortText()) && chId.asLongText().equals(channelId.asLongText())) {
                iterator.remove();
            }
        }

        ServerNettyMapping.group.remove(channel);
    }

    /**
     * 发送信息给相应的channel
     *
     * @param parkingId
     * @param rpcMessage
     * @return
     */
    public static String sendRequestMessage(String parkingId, RpcMessage rpcMessage) {
        ChannelId channelId = ServerNettyMapping.serverChannelMap.get(parkingId);
        String messageId = null;
        assert channelId != null;

        //发消息
        Iterator<Channel> iterator = ServerNettyMapping.group.iterator();
        while (iterator.hasNext()) {
            Channel ch = iterator.next();

            if (ch.id().asLongText().equals(channelId.asLongText()) && ch.id().asShortText().equals(channelId.asShortText())) {
                String uuid = UUID.randomUUID().toString();
                messageId = uuid;
                rpcMessage.setMessageId(messageId);
                ch.writeAndFlush(rpcMessage);
                ServerNettyMapping.rpcMessageMap.put(messageId, null);
                break;
            }
        }

        return messageId;
    }
}
