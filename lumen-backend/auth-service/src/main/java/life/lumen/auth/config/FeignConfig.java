package life.lumen.auth.config;


import com.fasterxml.jackson.databind.ObjectMapper;
import feign.codec.ErrorDecoder;
import life.lumen.auth.feign.FeignContextInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    @Bean
    public ErrorDecoder errorDecoder(ObjectMapper objectMapper) {
        return new CustomErrorDecoder(objectMapper);
    }
    @Bean
    public FeignContextInterceptor feignContextInterceptor() {
        return new FeignContextInterceptor();
    }

}