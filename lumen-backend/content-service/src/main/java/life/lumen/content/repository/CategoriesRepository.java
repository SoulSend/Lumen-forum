package life.lumen.content.repository;

import life.lumen.common.model.entity.category.CategoryPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriesRepository extends JpaRepository<CategoryPO,Long> {
    CategoryPO findCategoriesById(Long id);
}
