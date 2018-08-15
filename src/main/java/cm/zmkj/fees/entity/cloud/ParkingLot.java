package cm.zmkj.fees.entity.cloud;

public class ParkingLot {
    /**
     * 停车场id
     */
    private int parkingId;

    /**
     * 停车场名
     */
    private String parkingName;

    public int getParkingId() {
        return parkingId;
    }

    public void setParkingId(int parkingId) {
        this.parkingId = parkingId;
    }

    public String getParkingName() {
        return parkingName;
    }

    public void setParkingName(String parkingName) {
        this.parkingName = parkingName;
    }
}
