package life.lumen.gateway.utils;

import life.lumen.common.constants.CacheConstant;
import life.lumen.common.model.bo.UserContext;
import life.lumen.common.utils.redis.RedisHashToMapUtil;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class RedisRepository {
    private static StringRedisTemplate stringRedisTemplate;

    private RedisRepository(StringRedisTemplate stringRedisTemplate) {
        RedisRepository.stringRedisTemplate = stringRedisTemplate;
    }
    public static UserContext getUserByToken(String token){

        String userId = stringRedisTemplate.opsForValue().get(CacheConstant.TOKEN_PREFIX + token);
        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries(CacheConstant.SESSION_PREFIX + userId);
        // 检查是否存在有效数据
        if (!entries.isEmpty()) {
            // 刷新token过期时间
            stringRedisTemplate.expire(CacheConstant.SESSION_PREFIX + userId, CacheConstant.SESSION_EXPIRE_SECONDS, TimeUnit.SECONDS);
            stringRedisTemplate.expire(CacheConstant.TOKEN_PREFIX + token, CacheConstant.SESSION_EXPIRE_SECONDS, TimeUnit.SECONDS);
            return RedisHashToMapUtil.mapToHash(entries);
        }
        return null;
    }

}
