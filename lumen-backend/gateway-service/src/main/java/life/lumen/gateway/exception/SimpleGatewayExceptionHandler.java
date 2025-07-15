package life.lumen.gateway.exception;

import life.lumen.common.exception.CustomException;
import life.lumen.common.model.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebExceptionHandler;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Slf4j
@Order(-1) // 确保最高优先级
@Component
public class SimpleGatewayExceptionHandler implements WebExceptionHandler {

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        // 1. 记录异常日志（保持您原有的日志格式）
        log.error("网关异常: {}", ex.getMessage(), ex);
        
        // 2. 创建统一响应对象
        Result<String> result;
        if (ex instanceof CustomException) {
            CustomException ce = (CustomException) ex;
            result = Result.fail(ce.getCode(), ce.getMessage());
        } else {
            result = Result.fail(500, "网关服务异常: " + ex.getMessage());
        }
        
        // 3. 将响应对象转为JSON字符串
        String jsonResponse = result.toString(); // 假设Result有合适的toString实现
        
        // 4. 直接写入响应
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.OK); // 统一用200状态码，错误信息在body中
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        
        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        
        return response.writeWith(Mono.just(buffer));
    }
}