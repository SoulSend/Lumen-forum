package life.lumen.auth.feign;

import life.lumen.auth.config.FeignConfig;
import life.lumen.common.model.dto.user.CreateUserDTO;
import life.lumen.common.model.entity.user.UserPO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

//如果目标服务启动了多个，使用这个value可以自动拿到这个服务，负载均衡
@FeignClient(value = "user-service",configuration = FeignConfig.class)
public interface UserFeignClients {
    @PostMapping("/internal/user")
    UserPO createUser(@RequestBody CreateUserDTO createUserDTO);

    @GetMapping("/internal/user/phone/{phone}")
    UserPO getUserByPhone(@PathVariable("phone") String phone);

    @GetMapping("/internal/user/email/{email}")
    UserPO getUserByEmail(@PathVariable("email") String email);

    @GetMapping("/internal/user/id/{id}")
    UserPO getUserById(@PathVariable("id") Long id);

    @GetMapping("/internal/user/username/{username}")
    UserPO getUserByUsername(@PathVariable("username") String username);
}
