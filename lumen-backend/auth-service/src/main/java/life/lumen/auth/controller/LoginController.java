package life.lumen.auth.controller;

import jakarta.validation.Valid;
import life.lumen.auth.service.LoginService;
import life.lumen.common.model.Result;
import life.lumen.common.model.dto.auth.CodeDTO;
import life.lumen.common.model.dto.auth.LoginDTO;
import life.lumen.common.model.vo.auth.LoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 登录控制类
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/login")
public class LoginController {
    private final LoginService loginService;
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }
    /**
     * 验证码登录
     */
    @PostMapping()
    public Result<LoginVO> login(@RequestBody @Valid LoginDTO loginDTO) {
        LoginVO response=loginService.login(loginDTO);
        log.info("login response:{}",response);
        return  Result.success(response);
    }
    /**
     * 发送验证码
     */
    @PostMapping("/code")
    public Result<String> sendCode(@RequestBody @Valid  CodeDTO phone){
        loginService.sendCode(phone);
        return  Result.success();
    }
}
