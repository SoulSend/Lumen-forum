package life.lumen.common.utils.mapstruct;

import javax.annotation.processing.Generated;
import life.lumen.common.model.bo.UserContext;
import life.lumen.common.model.entity.user.UserPO;
import life.lumen.common.model.vo.user.UserVO;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-19T10:56:02+0800",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.15 (Oracle Corporation)"
)
public class UserMapperImpl implements UserMapper {

    @Override
    public UserVO userPOToUserVO(UserPO user) {
        if ( user == null ) {
            return null;
        }

        UserVO userVO = new UserVO();

        userVO.setId( user.getId() );
        userVO.setUsername( user.getUsername() );
        userVO.setEmail( user.getEmail() );
        userVO.setPhone( user.getPhone() );
        userVO.setPasswordHash( user.getPasswordHash() );
        userVO.setAvatar( user.getAvatar() );
        userVO.setBio( user.getBio() );
        userVO.setWebsite( user.getWebsite() );
        userVO.setLocation( user.getLocation() );
        userVO.setTitle( user.getTitle() );
        userVO.setShowEmail( user.getShowEmail() );
        userVO.setReputation( user.getReputation() );
        userVO.setPostCount( user.getPostCount() );
        userVO.setCommentCount( user.getCommentCount() );
        userVO.setIsAdmin( user.getIsAdmin() );
        userVO.setIsModerator( user.getIsModerator() );

        return userVO;
    }

    @Override
    public UserContext userPOToUserSession(UserPO userPO) {
        if ( userPO == null ) {
            return null;
        }

        UserContext userContext = new UserContext();

        userContext.setUserId( userPO.getId() );
        userContext.setUsername( userPO.getUsername() );
        userContext.setAvatar( userPO.getAvatar() );
        userContext.setIsAdmin( userPO.getIsAdmin() );
        userContext.setIsModerator( userPO.getIsModerator() );
        userContext.setModeratedCategory( userPO.getModeratedCategory() );

        return userContext;
    }
}
