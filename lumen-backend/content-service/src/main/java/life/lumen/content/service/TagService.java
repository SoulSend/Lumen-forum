package life.lumen.content.service;

import life.lumen.common.model.dto.PageQueryDTO;
import life.lumen.common.model.entity.tag.TagPO;
import life.lumen.common.model.vo.tag.TagVO;
import life.lumen.content.repository.TagRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class TagService {
    private final TagRepository  tagRepository;
    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public Page<TagPO> getTags(PageQueryDTO pageQueryDTO) {
        Pageable pageable=PageRequest.of(pageQueryDTO.getPage(),pageQueryDTO.getSize());
        return tagRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public List<TagPO> getTagsPopular(int limit) {
        return tagRepository.findTopNOrderByCreateTime(limit);
    }
}
