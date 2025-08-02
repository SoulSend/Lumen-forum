package life.lumen.content.controller;

import life.lumen.common.model.Result;
import life.lumen.common.model.dto.PageQueryDTO;
import life.lumen.common.model.entity.tag.TagPO;
import life.lumen.common.model.vo.tag.TagVO;
import life.lumen.common.utils.mapstruct.TagMapper;
import life.lumen.content.service.TagService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tags")
public class TagController {
    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    /**
     * 获取所有标签
     * @param page
     * @param size
     * @return
     */
    @GetMapping
    public Result<Page<TagVO>> getTags(@RequestParam int page, @RequestParam int size) {
        PageQueryDTO pageQueryDTO=new PageQueryDTO();
        pageQueryDTO.setPage(page);
        pageQueryDTO.setSize(size);
        Page<TagPO>  tagPO= tagService.getTags(pageQueryDTO);
        return Result.success(TagMapper.INSTANCE.pageTagPOToTagVO(tagPO));
    }

    @GetMapping("/popular")
    public Result<List<TagVO>> getTagsPopular(@RequestParam int limit) {
        List<TagPO>  tagPO= tagService.getTagsPopular(limit);
        return Result.success(TagMapper.INSTANCE.toVOList(tagPO));
    }


}
