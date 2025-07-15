package life.lumen.common.utils.context;

import jakarta.servlet.http.HttpServletRequest;

import life.lumen.common.model.bo.UserContext;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserHeaderUtils {

    public static Map<String, List<String>> convertUserToHeaders(UserContext user) {
        Map<String, List<String>> headers = new HashMap<>();
        if (user.getUserId() != null) {
            headers.put("X-User-UserId", List.of(String.valueOf(user.getUserId())));
        }
        if (user.getUsername() != null) {
            headers.put("X-User-Username", List.of(user.getUsername()));
        }
        if (user.getAvatar() != null) {
            headers.put("X-User-Avatar", List.of(user.getAvatar()));
        }
        headers.put("X-User-Admin", List.of(String.valueOf(user.getIsAdmin() != null ? user.getIsAdmin() : false)));
        headers.put("X-User-Moderator", List.of(String.valueOf(user.getIsModerator() != null ? user.getIsModerator() : false)));
        if (user.getModeratedCategory() != null) {
            headers.put("X-User-ModeratedCategory", List.of(String.valueOf(user.getModeratedCategory())));
        }
        return headers;
    }

    public static UserContext convertHeadersToUser(HttpServletRequest request) {
        UserContext user = new UserContext();
        // 获取 X-User-UserId
        String userIdHeader = request.getHeader("X-User-UserId");
        if (userIdHeader == null) {
            return null;
        }
        user.setUserId(Long.parseLong(userIdHeader));
        // 获取 X-User-Username
        String usernameHeader = request.getHeader("X-User-Username");
        if (usernameHeader == null) {
            return null;
        }
        user.setUsername(usernameHeader);
        // 获取 X-User-Avatar
        String avatarHeader = request.getHeader("X-User-Avatar");
        if (avatarHeader == null) {
            return null;
        }
        user.setAvatar(avatarHeader);
        // 获取 X-User-Admin
        String adminHeader = request.getHeader("X-User-Admin");
        if (adminHeader == null) {
            return null;
        }
        user.setIsAdmin(Boolean.parseBoolean(adminHeader));
        // 获取 X-User-Moderator
        String moderatorHeader = request.getHeader("X-User-Moderator");
        if (moderatorHeader == null) {
            return null;
        }
        user.setIsModerator(Boolean.parseBoolean(moderatorHeader));
        // 获取 X-User-ModeratedCategory
        String moderatedCategoryHeader = request.getHeader("X-User-ModeratedCategory");
        if (moderatedCategoryHeader != null) {
            user.setModeratedCategory(Long.parseLong(moderatedCategoryHeader));
        }

        return user;
    }
}