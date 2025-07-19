package life.lumen.content.service;


import jakarta.validation.Valid;
import life.lumen.common.enums.ErrorCode;
import life.lumen.common.exception.CustomException;
import life.lumen.common.model.dto.PageQueryDTO;
import life.lumen.common.model.entity.post.PostPO;
import life.lumen.content.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }


    public Page<PostPO> getUsersPosts(PageQueryDTO pageQueryDTO) {
        Pageable pageable=PageRequest.of(pageQueryDTO.getPage(),pageQueryDTO.getSize());
        return postRepository.findByUserIdOrderByCreatedAtDesc(pageQueryDTO.getId(), pageable);
    }

    public Page<PostPO> getPosts(PageQueryDTO pageQueryDTO) {
        Pageable pageable=PageRequest.of(pageQueryDTO.getPage(),pageQueryDTO.getSize());
        return postRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public PostPO getPost(Long id) {
        PostPO postPoById = postRepository.findPostPoById(id);
        if (postPoById == null) {
            throw new CustomException(ErrorCode.POST_NOT_FOUND_ERROR);
        }
        return postPoById;
    }

    public Page<PostPO> getHotPosts(PageQueryDTO pageQueryDTO) {
        Pageable pageable=PageRequest.of(pageQueryDTO.getPage(),pageQueryDTO.getSize());
        return  postRepository.findHotPosts(pageable);
    }

    public List<PostPO> getHotSidePosts( PageQueryDTO pageQueryDTO) {
        Pageable pageable=PageRequest.of(pageQueryDTO.getPage(),pageQueryDTO.getSize());
        return  postRepository.findTopHotPosts(pageable);
    }

    public Page<PostPO> getRecommendedPosts( PageQueryDTO pageQueryDTO) {
        Pageable pageable=PageRequest.of(pageQueryDTO.getPage(),pageQueryDTO.getSize());
        return postRepository.findByIsRecommendedTrueOrderByCreatedAtDesc(pageable);
    }

    public List<PostPO> getRecommendedSidePosts( PageQueryDTO pageQueryDTO) {
        Pageable pageable=PageRequest.of(pageQueryDTO.getPage(),pageQueryDTO.getSize());
        return postRepository.findTopByIsRecommendedTrueOrderByCreatedAtDesc(pageable);
    }

    public Page<PostPO> getCategoriesPosts( PageQueryDTO pageQueryDTO) {
        Pageable pageable=PageRequest.of(pageQueryDTO.getPage(),pageQueryDTO.getSize());
        return postRepository.findByCategoryIdOrderByCreatedAtDesc(pageQueryDTO.getId(),pageable);
    }
}
