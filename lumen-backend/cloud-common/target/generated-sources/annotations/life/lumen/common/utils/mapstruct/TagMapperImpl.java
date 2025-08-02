package life.lumen.common.utils.mapstruct;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import life.lumen.common.model.entity.tag.TagPO;
import life.lumen.common.model.vo.tag.TagVO;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-25T11:49:39+0800",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.15 (Oracle Corporation)"
)
public class TagMapperImpl implements TagMapper {

    @Override
    public TagVO toVO(TagPO tag) {
        if ( tag == null ) {
            return null;
        }

        TagVO tagVO = new TagVO();

        tagVO.setId( tag.getId() );
        tagVO.setName( tag.getName() );
        tagVO.setSlug( tag.getSlug() );

        return tagVO;
    }

    @Override
    public List<TagVO> toVOList(List<TagPO> tagPO) {
        if ( tagPO == null ) {
            return null;
        }

        List<TagVO> list = new ArrayList<TagVO>( tagPO.size() );
        for ( TagPO tagPO1 : tagPO ) {
            list.add( toVO( tagPO1 ) );
        }

        return list;
    }
}
