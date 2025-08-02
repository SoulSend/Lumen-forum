package life.lumen.common.utils.mapstruct;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import life.lumen.common.model.entity.category.CategoryPO;
import life.lumen.common.model.vo.category.CategoryVO;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-24T13:50:48+0800",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.15 (Oracle Corporation)"
)
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryVO toCategoryVO(CategoryPO category) {
        if ( category == null ) {
            return null;
        }

        CategoryVO categoryVO = new CategoryVO();

        categoryVO.setId( category.getId() );
        categoryVO.setName( category.getName() );
        categoryVO.setDescription( category.getDescription() );
        categoryVO.setIcon( category.getIcon() );

        return categoryVO;
    }

    @Override
    public List<CategoryVO> toCategoryVOList(List<CategoryPO> categories) {
        if ( categories == null ) {
            return null;
        }

        List<CategoryVO> list = new ArrayList<CategoryVO>( categories.size() );
        for ( CategoryPO categoryPO : categories ) {
            list.add( toCategoryVO( categoryPO ) );
        }

        return list;
    }
}
