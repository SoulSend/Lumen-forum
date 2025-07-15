package life.lumen.user.service;

import life.lumen.common.enums.ErrorCode;
import life.lumen.common.enums.LoginType;
import life.lumen.common.exception.CustomException;
import life.lumen.common.model.bo.UserContext;
import life.lumen.common.model.dto.user.CreateUserDTO;
import life.lumen.common.model.entity.user.UserPO;
import life.lumen.common.utils.context.UserContextHolder;
import life.lumen.user.controller.UserController;
import life.lumen.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;



@Service
@Slf4j
public class UserService {
    public final UserRepository userRepository;
    UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 创建一个用户 用到一些默认数据
     * @param createUserDTO 封装创建一个用户需要的数据
     */
    public UserPO createUser(CreateUserDTO createUserDTO) {
        try {
            UserPO newUser=new UserPO();
            if(createUserDTO.getLoginType()== LoginType.SMS){
                newUser.setPhone(createUserDTO.getIdentifier());
            }else if (createUserDTO.getLoginType()== LoginType.EMAIL){
                newUser.setEmail(createUserDTO.getIdentifier());
            }
            newUser.setUsername("user_"+createUserDTO.getIdentifier());
            newUser.setAvatar("/default-avatar.png");
            return userRepository.save(newUser);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.SERVICE_CALL_ERROR);
        }
    }
    // ==================根据唯一值获取用户=================
    public UserPO getUserByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }

    public UserPO getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserPO getUserById(Long id) {

        return userRepository.findUserPoById(id);
    }

    public UserPO getUserByUsername(String username) {

        return userRepository.findByUsername(username);
    }

    // =================end==============================

    public UserPO getMe() {
        return userRepository.findUserPoById(UserContextHolder.getUserContext().getUserId());
    }

    public UserPO getSomeone(Long id) {
        UserPO userPoById = userRepository.findUserPoById(id);
        if (userPoById == null) {
            throw new CustomException(ErrorCode.USER_QUERY_ERROR);
        }
        return userRepository.findUserPoById(id);
    }
}
