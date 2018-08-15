package cm.zmkj.fees.entity.clients;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * @program: spc
 * @description: 云端查询车牌返回的消息体
 * @author: zcj
 * @create: 2018-08-14 15:32
 **/
public class CloudMsg implements Serializable {

    /**
     * 停车场ID
     */
    private String parkingLotId;

    /**
     * 停车场名字
     */
    private String parkingLot;

    /**
     * 车牌号
     */
    private String plate;

    /**
     * 停车时长
     */
    private Timestamp parkTotalTime;

    /**
     * 需缴费金额
     */
    private Double money;

    /**
     * 车辆在场记录ID （plc-parking表）
     */
    private String parkOnlineId;

    /**
     * 车俩入场时间
     */
    private Timestamp inDate;

    public String getParkingLotId() {
        return parkingLotId;
    }

    public void setParkingLotId(String parkingLotId) {
        this.parkingLotId = parkingLotId;
    }

    public String getParkingLot() {
        return parkingLot;
    }

    public void setParkingLot(String parkingLot) {
        this.parkingLot = parkingLot;
    }

    public String getPlate() {
        return plate;
    }

    public CloudMsg plate(String plate) {
        this.plate = plate;
        return this;
    }

    public Timestamp getParkTotalTime() {
        return parkTotalTime;
    }

    public CloudMsg parkTotalTime(Timestamp parkTotalTime) {
        this.parkTotalTime = parkTotalTime;
        return this;
    }

    public Double getMoney() {
        return money;
    }

    public CloudMsg money(Double money) {
        this.money = money;
        return this;
    }

    public String getParkOnlineId() {
        return parkOnlineId;
    }

    public CloudMsg parkOnlineId(String parkOnlineId) {
        this.parkOnlineId = parkOnlineId;
        return this;
    }

    public Timestamp getInDate() {
        return inDate;
    }

    public CloudMsg inDate(Timestamp inDate) {
        this.inDate = inDate;
        return this;
    }

    /**
     * 创建对象完成标志
     * @return  返回自身
     */
    public CloudMsg build(){
        return this;
    }
}
