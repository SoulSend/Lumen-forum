package life.lumen.gateway.filter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import life.lumen.common.model.Result;
import life.lumen.common.model.bo.UserContext;
import life.lumen.common.utils.context.UserHeaderUtils;
import life.lumen.gateway.utils.RedisRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class AuthFilter implements GlobalFilter, Ordered {
    // 白名单
    private static final List<String> WHITE_LIST = Arrays.asList(
            "/api/auth/login",
            "/api/auth/login/code"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();
        log.info("path:{}", path);
        // 检查是否在白名单中
        if (WHITE_LIST.stream().anyMatch(path::startsWith)) {
            return chain.filter(exchange);
        }
        HttpHeaders headers = exchange.getRequest().getHeaders();
        List<String> authorization = headers.get("Authorization");

        if (authorization == null || authorization.isEmpty()) {
            return handleError(exchange, "没有Authorization请求头");
        }

        String token = authorization.get(0);
        if (token == null || token.isEmpty()) {
            return handleError(exchange, "Authorization为空无token");
        }

        //只要token有效就刷新ttl
        UserContext userByToken = RedisRepository.getUserByToken(token);
        if (userByToken == null) {
            return handleError(exchange, "token无效");
        }

        // 将用户信息添加到请求头中
        Map<String, List<String>> userHeaders = UserHeaderUtils.convertUserToHeaders(userByToken);
        // 添加请求头
        exchange = exchange.mutate().request(builder -> {
            builder.headers(httpHeaders -> {
                httpHeaders.putAll(headers); // 保留原有头信息
                httpHeaders.putAll(userHeaders); // 添加用户信息头
            });
        }).build();

        // 放行请求
        return chain.filter(exchange);
    }
    private Mono<Void> handleError(ServerWebExchange exchange, String message){
        log.error("网关:授权验证失败:"+message);
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        Result<String> result = Result.fail(401, message);
        ObjectMapper objectMapper = new ObjectMapper();
        return response.writeWith(Mono.fromSupplier(() -> {
            try {
                return response.bufferFactory().wrap(objectMapper.writeValueAsString(result).getBytes());
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }));
    }
    @Override
    public int getOrder() {
        return 0;
    }
}
