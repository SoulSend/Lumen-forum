package life.lumen.common.enums;


public enum LoginType {
    EMAIL("email:"),  // 邮箱前缀
    SMS("phone:");    // 手机前缀

    private final String prefix;

    LoginType(String prefix) {
        this.prefix = prefix;
    }
    /**
     * 获取登录类型对应的Redis键前缀
     * @return 前缀字符串（带冒号）
     */
    public String getPrefix() {
        return this.prefix;
    }
    /**
     * 可选：获取不带冒号的纯前缀（根据业务需求选择）
     */
    public String getRawPrefix() {
        return this.prefix.replace(":", "");
    }

}
