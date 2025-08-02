package life.lumen.common.utils.mapstruct;

import life.lumen.common.model.entity.category.CategoryPO;
import life.lumen.common.model.vo.category.CategoryVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface CategoryMapper {
    CategoryMapper INSTANCE= Mappers.getMapper(CategoryMapper.class);
    CategoryVO toCategoryVO(CategoryPO category);
    List<CategoryVO> toCategoryVOList(List<CategoryPO> categories);
}
