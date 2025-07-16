package life.lumen.content.controller;

import life.lumen.common.model.Result;
import life.lumen.common.model.entity.category.CategoryPO;
import life.lumen.content.service.CategoriesService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类控制器
 * 与分类的所有相关操作
 */
@RestController
@RequestMapping("/categories")
public class CategoriesController {
    private final CategoriesService categoriesService;
    public CategoriesController(CategoriesService categoriesService) {
        this.categoriesService = categoriesService;
    }

    /**
     * 获取所有分类
     * @return 返回分类列表
     */
    @GetMapping()
    public Result<List<CategoryPO>> getCategories(){
        return Result.success(categoriesService.getCategories());
    }

    /**
     * 根据id 获取指定id的分类
     * @param id 分类的id
     * @return 返回对应的分类
     */
    @GetMapping("/{id}")
    public Result<CategoryPO> getCategory(@PathVariable Long id){
        return  Result.success(categoriesService.getCategory(id));
    }

}
