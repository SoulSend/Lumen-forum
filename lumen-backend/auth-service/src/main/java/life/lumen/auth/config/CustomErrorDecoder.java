package life.lumen.auth.config;

import feign.Response;
import feign.Util;
import feign.codec.ErrorDecoder;
import life.lumen.common.enums.ErrorCode;
import life.lumen.common.exception.CustomException;
import life.lumen.common.model.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@AllArgsConstructor
public class CustomErrorDecoder implements ErrorDecoder {

    private final ObjectMapper objectMapper;

    @Override
    public Exception decode(String methodKey, Response response) {
        // 1. 检查响应体是否存在
        if (response.body() == null) {
            return new CustomException(ErrorCode.NOT_RESPONSE_BODY_ERROR);
        }
        try {
            // 2. 读取响应体
            byte[] bodyData = Util.toByteArray(response.body().asInputStream());
            String body = new String(bodyData, StandardCharsets.UTF_8);

            // 3. 解析为统一的Result对象
            Result<?> result = objectMapper.readValue(body, Result.class);
            // todo 有一个问题 调用的微服务返回的不是统一响应格式 此处汇报错 很奇怪的现象 报错的是404 路径找不到 第一次会报错找不到，第二次就可以了 然后删除缓存 又重复了
            // todo 奇怪现象导致的原因是两个服务用了同一个服务名 导致路由到了错误的地方，才会报错404 但是没有统一响应格式的问题依然存在 还未解决
            // 4. 创建业务异常
            if (response.status() >= 400) {
                return new CustomException(result.getCode(), result.getData().toString(),"auth.feign");
            }
        } catch (IOException e) {
            // 解析失败时使用默认处理
            log.error("解析feign响应失败：{}", e.getMessage());
        }
        return new CustomException(ErrorCode.SERVICE_CALL_ERROR);
    }
}