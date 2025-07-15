package life.lumen.user.controller;


import jakarta.validation.Valid;
import life.lumen.common.model.Result;
import life.lumen.common.model.dto.user.UpdateUserDTO;
import life.lumen.common.model.entity.user.UserPO;
import life.lumen.common.model.vo.user.UserVO;
import life.lumen.common.utils.mapstruct.UserMapper;
import life.lumen.user.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping()
public class UserController {
    private final UserService userService;
    UserController(UserService userService) {
        this.userService = userService;
    }
    @GetMapping("/me")
    public Result<UserVO> getMe(){
        UserPO user=userService.getMe();
        UserVO userVO = UserMapper.INSTANCE.userPOToUserVO(user);
        return Result.success(userVO);
    }
    @GetMapping("/{id}")
    public Result<UserVO> getSomeone(@PathVariable Long id){
        UserPO user=userService.getSomeone(id);
        UserVO userVO = UserMapper.INSTANCE.userPOToUserVO(user);
        return Result.success(userVO);
    }
    @PutMapping("/profile")
    public Result<UserVO> updateProfile(@RequestBody @Valid UpdateUserDTO userVO){
        return null;
    }
}
