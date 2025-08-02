package life.lumen.user.controller;


import jakarta.validation.Valid;
import life.lumen.common.enums.ErrorCode;
import life.lumen.common.exception.CustomException;
import life.lumen.common.model.Result;
import life.lumen.common.model.dto.PageQueryDTO;
import life.lumen.common.model.dto.user.UpdateUserDTO;
import life.lumen.common.model.entity.user.UserPO;
import life.lumen.common.model.vo.user.UserVO;
import life.lumen.common.utils.mapstruct.UserMapper;
import life.lumen.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@Slf4j
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
        log.info("/me:"+userVO.toString());
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
        log.info("/profile:"+userVO.toString());
        return Result.success(userVO);
    }

    /**
     * 获取活跃用户
     * @param
     * @return
     */
    @GetMapping("/active")
    public Result<Page<UserVO>> getActiveUsers(@RequestParam int page, @RequestParam int size){
        PageQueryDTO pageQueryDTO=new PageQueryDTO();
        pageQueryDTO.setPage(page);
        pageQueryDTO.setSize(size);
        Page<UserPO> res=userService.getActiveUsers(pageQueryDTO);
        if(res==null||res.isEmpty()){
            throw new CustomException(ErrorCode.DATA_IS_NULL);
        }
        Page<UserVO> userVOS = UserMapper.INSTANCE.userPOToUserVO(res);
        log.info("/activeUsers:"+ res);
        return Result.success(userVOS);
    }
}
