package life.lumen.auth.repository;


import life.lumen.common.constants.CacheConstant;
import life.lumen.common.enums.ErrorCode;
import life.lumen.common.enums.LoginType;
import life.lumen.common.exception.CustomException;
import life.lumen.common.model.bo.UserContext;
import life.lumen.common.model.entity.user.UserPO;
import life.lumen.common.utils.mapstruct.UserMapper;
import life.lumen.common.utils.redis.RedisHashToMapUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

@Repository
@Slf4j
public class RedisRepository {
    private final StringRedisTemplate stringRedisTemplate;

    public RedisRepository(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    /**
     * 缓存用户会话信息
     * 生成一个token 用这个token作为键 缓存用户信息
     * @param userPO 用户实体类
     * @return 返回token
     */
    public String cacheUserContext(UserPO userPO){
        //使用UUID生成一个伪token不负载任何信息 只做标识
        String token = UUID.randomUUID().toString().replaceAll("-","");
        //缓存token-》id
        String tokenKey=CacheConstant.TOKEN_PREFIX+token;
        stringRedisTemplate.opsForValue().set(tokenKey,String.valueOf(userPO.getId()));
        stringRedisTemplate.expire(
                tokenKey,
                CacheConstant.SESSION_EXPIRE_SECONDS,
                TimeUnit.SECONDS
        );
        //记录 id - token
        stringRedisTemplate.opsForList().leftPush(CacheConstant.SESSION_TO_TOKEN+userPO.getId(),token);

        //转userSession
        UserContext userContext = UserMapper.INSTANCE.userPOToUserSession(userPO);
        //将会话对象转成一个map toHash方法
        Map<String, String> hash = RedisHashToMapUtil.hashToMap(userContext);
        //存储这个map使用hash
        String sessionKey=CacheConstant.SESSION_PREFIX +userPO.getId();
        stringRedisTemplate.opsForHash().putAll(sessionKey,hash);
        //设置过期时间
        stringRedisTemplate.expire(
                sessionKey,
                CacheConstant.SESSION_EXPIRE_SECONDS,
                TimeUnit.SECONDS
        );
        return token;
    }

    /**
     * 根据 token 获取用户的会话信息
     * @param token
     * @return
     */
    public UserContext fetchUserContext(String token){
        String userId = stringRedisTemplate.opsForValue().get(CacheConstant.TOKEN_PREFIX + token);
        //根据token获取会话信息
        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries(CacheConstant.SESSION_PREFIX + userId);
        if (entries.isEmpty()) {
            stringRedisTemplate.delete(CacheConstant.TOKEN_PREFIX + token);
            throw new CustomException(ErrorCode.NOT_USER_CONTEXT_ERROR);
        }
        return RedisHashToMapUtil.mapToHash(entries);
    }

    /**
     * 删除用户会话信息的缓存 和对应的token
     * @param userId 用户id
     * @param token 用户持有的token
     */
    public void removeUserContext(Long  userId,String token){
        stringRedisTemplate.delete(CacheConstant.TOKEN_PREFIX + token);
        stringRedisTemplate.opsForList().remove(CacheConstant.SESSION_TO_TOKEN+userId,1,token);
    }

    /**
     * 生成验证码，缓存这个验证码，返回验证码 缓存的键 code:key:type
     * @param key 手机号或者邮箱号
     * @param loginType 邮箱验证还是手机验证
     * @return 返回验证码
     */
    public String cacheCode(String key, LoginType loginType){
        try {
            //验证码
            int random = ThreadLocalRandom.current().nextInt(100000, 999999 + 1);
            String code = String.valueOf(random);
            //构建缓存key
            String redisKey=CacheConstant.CODE_PREFIX+loginType.getPrefix()+key;
            //缓存操作
            stringRedisTemplate.opsForValue().set(
                    redisKey,
                    code,
                    CacheConstant.CODE_EXPIRE_SECONDS,
                    TimeUnit.SECONDS);
            return code;
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new CustomException(ErrorCode.CACHE_CODE_ERROR);
        }
    }

    /**
     *  获取验证码 根据 code:key:type 键获取值
     * @param key 邮箱号或者手机号
     * @param loginType 邮箱验证还是手机验证
     * @return 验证码
     */
    public String fetchAndDeleteCode(String key, LoginType loginType) {
        String redisKey = CacheConstant.CODE_PREFIX + loginType.getPrefix() + key;
        // 获取值，拿到以后删掉这个值
        String luaScript =
                "local code = redis.call('GET', KEYS[1]) if code then redis.call('DEL', KEYS[1]) end return code";
        //执行脚本 返回结果
        return stringRedisTemplate.execute(
                new DefaultRedisScript<>(luaScript, String.class),
                Collections.singletonList(redisKey)
        );
    }
}
