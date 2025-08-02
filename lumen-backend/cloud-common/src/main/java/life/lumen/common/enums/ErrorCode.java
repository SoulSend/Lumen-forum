package life.lumen.common.enums;

import lombok.Getter;

@Getter
public enum ErrorCode {

    UNKNOWN_ERROR(-1,"未知异常"),
    //系统相关
    SERVICE_CALL_ERROR(1000,"服务调用错误"),
    NOT_RESPONSE_BODY_ERROR(1001,"无响应体"),
    NOT_USER_CONTEXT_ERROR(1002,"用户未登录"),
    INVALID_PARAMETERS(1003,"参数不合法"),
    DATA_IS_NULL(1004,"值为null或empty"),
    //登录相关
    VERIFY_CODE_ERROR(2000, "验证码错误或已过期"),
    CACHE_CODE_ERROR(2001,"验证码缓存异常"),
    //用户相关
    USER_QUERY_ERROR(3000,"找不到用户"),
    //文章相关
    POST_NOT_FOUND_ERROR(4000,"找不到文章")
    ;

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
