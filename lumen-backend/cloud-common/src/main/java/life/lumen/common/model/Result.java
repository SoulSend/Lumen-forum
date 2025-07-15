package life.lumen.common.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 统一响应结果类
 */
@Getter
@Setter
@NoArgsConstructor
public class Result<T> {
    private int code;
    private String message;
    private T data;
    private Result(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
    //操作成功 有参
    public static <T> Result<T> success(T data){
        return new Result<>(200, "success", data);
    }
    //操作成功无参
    public static <T> Result<T> success(){
        return new Result<>(200, "success", null);
    }

    //操作失败 有参
    public static <T> Result<T> fail(int code,T data){
        return new Result<>(code, "fail", data);
    }
    //操作失败 无参
    public static <T> Result<T> fail(){
        return new Result<>(500, "fail", null);
    }

    @Override
    public String toString() {
        return "{\"code\": " + code + ", \"message\": \"" + message + "\", \"data\": " + (data != null ? data.toString() : "null") + "}";
    }
}