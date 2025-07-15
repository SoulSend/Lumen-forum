package life.lumen.auth.controller;

import life.lumen.auth.service.LoginService;
import life.lumen.common.model.Result;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 登出控制类
 */
@RestController
@RequestMapping("/logout")
public class LogoutController {
    private final LoginService loginService;
    public LogoutController(LoginService loginService) {
        this.loginService = loginService;
    }

    /**
     * 处理登出请求 删除对应用户信息
     * @param token 用户持有的token
     * @return 无
     */
    @PostMapping()
    public Result<Void> logout(@RequestHeader("Authorization")  String token){
        //直接删除缓存中的token即可
        loginService.logout(token);
        return Result.success();
    }

}
