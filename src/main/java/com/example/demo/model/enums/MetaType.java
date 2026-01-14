package com.example.demo.model.enums;

public enum MetaType {


        MERCHANT_ELECTRONICS("merchant=Electronics"),
        MERCHANT_GROCERY("merchant=Grocery"),
        MERCHANT_GIFTCARDS("merchant=GiftCards"),
        MERCHANT_CRYPTO_EXCHANGE("merchant=CryptoExchange"),

        DEVICE_NEW("device=new"),
        DEVICE_KNOWN("device=known"),

        IP_RISK_LOW("ip_risk=low"),
        IP_RISK_MEDIUM("ip_risk=medium"),
        IP_RISK_HIGH("ip_risk=high"),

        NIGHT_USAGE_TRUE("night_usage=true"),
        PLAN_PREMIUM("plan=premium"),
        REASON_FRAUD_SUSPECTED("reason=fraud_suspected");

        private final String value;

        MetaType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }


}


