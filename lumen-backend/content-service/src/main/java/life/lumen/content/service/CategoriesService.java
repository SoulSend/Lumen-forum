package life.lumen.content.service;

import life.lumen.common.model.entity.category.Category;
import life.lumen.content.repository.CategoriesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriesService {
    private final CategoriesRepository  categoriesRepository;
    public CategoriesService(CategoriesRepository categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }
    public List<Category> getCategories() {
        return categoriesRepository.findAll();
    }

    public Category getCategory(Long id) {
        return categoriesRepository.findCategoriesById(id);
    }
}
