package life.lumen.content.repository;

import life.lumen.common.model.entity.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriesRepository extends JpaRepository<Category,Long> {
    Category findCategoriesById(Long id);
}
