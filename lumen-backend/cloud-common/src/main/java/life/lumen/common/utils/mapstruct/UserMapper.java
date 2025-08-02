package life.lumen.common.utils.mapstruct;

import life.lumen.common.model.bo.UserContext;
import life.lumen.common.model.entity.user.UserPO;
import life.lumen.common.model.vo.user.UserVO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;

@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserVO userPOToUserVO(UserPO user);

    @Mapping(source = "id",target = "userId")
    UserContext userPOToUserSession(UserPO userPO);

    default Page<UserVO> userPOToUserVO(Page<UserPO> userPOs){
        return userPOs.map(this::userPOToUserVO);
    }
}
