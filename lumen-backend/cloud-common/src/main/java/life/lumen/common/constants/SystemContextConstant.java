package life.lumen.common.constants;


public class SystemContextConstant {
    //系统调用 外部白名单访问 和 内部服务间调用
    public static final String SYSTEM_CALL_HEAD="X-SYSTEM-Call";

    //系统用户名 构建系统用户的时候使用
    public static final String SYSTEM_USER_NAME = "SYSTEM_USER";

    //后续拓展的时候提高安全性使用
    //系统内部服务调用的头 SYSTEM_INTERNAL_CALL
    public static final String SYSTEM_INTERNAL_CALL = "X-Internal-Call";
    //系统内部调用的密码 SYSTEM_INTERNAL_CALL_PASS
    public static final String SYSTEM_INTERNAL_CALL_PASS = "PASSWORD";
}
