package life.lumen.auth.service;


import life.lumen.auth.feign.UserFeignClients;
import life.lumen.auth.repository.RedisRepository;
import life.lumen.common.enums.ErrorCode;
import life.lumen.common.enums.LoginType;
import life.lumen.common.exception.CustomException;
import life.lumen.common.model.bo.UserContext;
import life.lumen.common.model.dto.auth.CodeDTO;
import life.lumen.common.model.dto.auth.LoginDTO;
import life.lumen.common.model.dto.user.CreateUserDTO;
import life.lumen.common.model.entity.user.UserPO;
import life.lumen.common.model.vo.auth.LoginVO;
import life.lumen.common.utils.context.UserContextHolder;
import life.lumen.common.utils.mapstruct.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;



@Service
@Slf4j
public class LoginService {
    private final RedisRepository redisRepository;
    private final UserFeignClients  userFeignClients;

    public LoginService(RedisRepository redisRepository,UserFeignClients  userFeignClients) {
        this.redisRepository = redisRepository;
        this.userFeignClients = userFeignClients;
    }

    public LoginVO login(LoginDTO loginDTO){
        String cachedCode = redisRepository.fetchAndDeleteCode(loginDTO.getIdentifier(), loginDTO.getLoginType());

        //1、比较验证码是否一致 一致则继续，否则抛出异常
        if(cachedCode==null||!cachedCode.equals(loginDTO.getCode())){
            throw new CustomException(ErrorCode.VERIFY_CODE_ERROR.getCode(),ErrorCode.VERIFY_CODE_ERROR.getMessage(),loginDTO.getIdentifier());
        }

        //2、发起远程调用,根据手机号或者邮箱号，获取用户信息，判断用户是否存在，不存在则创建
        UserPO user=null;
        //设置系统用户 发起服务调用
        UserContextHolder.setSystemContext();
        if(loginDTO.getLoginType()== LoginType.SMS){
            user=userFeignClients.getUserByPhone(loginDTO.getIdentifier());
        }else if(loginDTO.getLoginType()== LoginType.EMAIL){
            user=userFeignClients.getUserByEmail(loginDTO.getIdentifier());
        }
        if(user==null){
            user = userFeignClients.createUser(new CreateUserDTO(loginDTO.getLoginType(), loginDTO.getIdentifier()));
        }

        //3、已拿到当前用户数据，缓存该用户返回token和用户信息
        //缓存用户会话信息
        String token = redisRepository.cacheUserContext(user);
        //构建VO对象
        LoginVO loginVO=new LoginVO();
        loginVO.setToken(token);
        UserContext userContext = UserMapper.INSTANCE.userPOToUserSession(user);
        loginVO.setUserContext(userContext);
        return loginVO;
    }

    /**
     * 发送验证码
     * @param codeDTO
     */
    public void sendCode(CodeDTO codeDTO) {
        String code = redisRepository.cacheCode(codeDTO.getIdentifier(), codeDTO.getLoginType());
        if (code != null) {
            log.info("用户 {} 发送验证码:{}",codeDTO.getIdentifier(),code);
        }
    }
    /**
     * 用户登出
     */
    public void logout(String token) {
        UserContext userContext = UserContextHolder.getUserContext();
        redisRepository.removeUserContext(userContext.getUserId(),token);
        log.info("用户登出：{}",userContext.getUsername());
    }
}
