package life.lumen.user.feign;

import life.lumen.common.model.dto.user.CreateUserDTO;
import life.lumen.common.model.entity.user.UserPO;
import life.lumen.user.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("internal")
public class UserFeignServer {
    private final UserService userService;
    UserFeignServer(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/user")
    public UserPO createUser(@RequestBody CreateUserDTO createUserDTO) {
        return userService.createUser(createUserDTO);
    }
    @GetMapping("/user/phone/{phone}")
    public UserPO getUserByPhone(@PathVariable String phone) {
        return userService.getUserByPhone(phone);
    }
    @GetMapping("/user/email/{email}")
    public UserPO getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }
    @GetMapping("/user/id/{id}")
    public UserPO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
    @GetMapping("/user/username/{username}")
    public UserPO getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }
}
