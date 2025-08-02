package life.lumen.common.utils.mapstruct;

import life.lumen.common.model.entity.tag.TagPO;
import life.lumen.common.model.vo.tag.TagVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper
public interface TagMapper {
    TagMapper INSTANCE= Mappers.getMapper(TagMapper.class);
    TagVO toVO(TagPO tag);
    List<TagVO> toVOList(List<TagPO> tagPO);
    default Page<TagVO> pageTagPOToTagVO(Page<TagPO> tagPOS){
        return tagPOS.map(this::toVO);
    }
}
