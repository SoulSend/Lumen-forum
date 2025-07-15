package life.lumen.common.utils.redis;


import life.lumen.common.model.bo.UserContext;

import java.util.HashMap;
import java.util.Map;

public class RedisHashToMapUtil {
    /**
     * 为了将对象缓存到redis hash结构里面 先转为Map
     * 由于使用的是StringRedisTemplate 所以泛型是两个String
     * @return 实体类映射后的map
     */
    public static Map<String,String> hashToMap(UserContext userContext){
        Map<String,String> map = new HashMap<>();
        map.put("userId",String.valueOf(userContext.getUserId()));
        map.put("username", userContext.getUsername());
        map.put("avatar", userContext.getAvatar());
        map.put("isAdmin",String.valueOf(userContext.getIsAdmin()));
        map.put("isModerator",String.valueOf(userContext.getIsModerator()));
        if (userContext.getModeratedCategory()!=null){
            map.put("moderatedCategory",String.valueOf(userContext.getModeratedCategory()));
        }
        return map;
    }
    public static UserContext mapToHash(Map<Object,Object> hash){
        if(hash==null || hash.isEmpty()) return null;
        UserContext userContext = new UserContext();
        userContext.setUserId(Long.parseLong((String) hash.get("userId")));
        userContext.setUsername((String) hash.get("username"));
        userContext.setAvatar((String)hash.get("avatar"));
        userContext.setIsAdmin(Boolean.parseBoolean((String) hash.get("isAdmin")));
        userContext.setIsModerator(Boolean.parseBoolean((String)hash.get("isModerator")));
        if (hash.get("moderatedCategory")!=null) {
            userContext.setModeratedCategory(Long.parseLong((String) hash.get("moderatedCategory")));
        }
        return userContext;
    }
}
