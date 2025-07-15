package life.lumen.common.exception;

import life.lumen.common.enums.ErrorCode;
import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {
    private final int code;
    //错误签名 爆出错误的人或者操作
    private final String sign;
    private final String message;

    public CustomException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
        this.sign="";
    }
    public CustomException(ErrorCode errorCode, String sign) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
        this.sign=sign;
    }
    public CustomException(int code,String message){
        super(message);
        this.code = code;
        this.message = message;
        this.sign="";
    }
    public CustomException(int code,String message,String sign){
        super(message);
        this.code = code;
        this.message = message;
        this.sign = sign;
    }

}