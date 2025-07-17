package life.lumen.user.controller;


import jakarta.validation.Valid;
import life.lumen.common.model.Result;
import life.lumen.common.model.dto.PageQueryDTO;
import life.lumen.common.model.dto.user.UpdateUserDTO;
import life.lumen.common.model.entity.user.UserPO;
import life.lumen.common.model.vo.user.UserVO;
import life.lumen.common.utils.mapstruct.UserMapper;
import life.lumen.user.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping()
public class UserController {
    private final UserService userService;
    UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 获取当前用户的信息
     * @return
     */
    @GetMapping("/me")
    public Result<UserVO> getMe(){
        UserPO user=userService.getMe();
        UserVO userVO = UserMapper.INSTANCE.userPOToUserVO(user);
        return Result.success(userVO);
    }

    /**
     * 获取指定id的用户信息
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<UserVO> getSomeone(@PathVariable Long id){
        UserPO user=userService.getSomeone(id);
        UserVO userVO = UserMapper.INSTANCE.userPOToUserVO(user);
        return Result.success(userVO);
    }

    /**
     * 更新用户个人资料
     * @param userDTO
     * @return
     */
    @PutMapping("/profile")
    public Result<UserVO> updateProfile(@RequestBody @Valid UpdateUserDTO userDTO){
        UserPO user=userService.updateProfile(userDTO);
        UserVO userVO = UserMapper.INSTANCE.userPOToUserVO(user);
        return Result.success(userVO);
    }

    /**
     * 获取活跃用户
     * @param pageQueryDTO
     * @return
     */
    @GetMapping("/active")
    public Result<List<UserVO>> getActiveUsers(@RequestBody @Valid PageQueryDTO  pageQueryDTO){
        List<UserVO> res=userService.getActiveUsers(pageQueryDTO);
        return Result.success(res);
    }
}
