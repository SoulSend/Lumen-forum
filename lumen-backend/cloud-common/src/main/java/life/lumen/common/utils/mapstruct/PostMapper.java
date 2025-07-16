package life.lumen.common.utils.mapstruct;

import life.lumen.common.model.entity.post.PostPO;
import life.lumen.common.model.vo.post.PostVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper
public interface PostMapper {
    PostMapper INSTANCE= Mappers.getMapper(PostMapper.class);
    PostVO postPOToPostVO(PostPO postPO);
    List<PostVO> postListToPostVOList(List<PostPO> posts);
    default Page<PostVO> pagePostPOToPagePostVO(Page<PostPO> postPO){
        return postPO.map(this::postPOToPostVO);
    }

}
