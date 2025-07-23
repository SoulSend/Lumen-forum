package life.lumen.content.service;


import jakarta.validation.Valid;
import life.lumen.common.enums.ErrorCode;
import life.lumen.common.exception.CustomException;
import life.lumen.common.model.bo.UserContext;
import life.lumen.common.model.dto.PageQueryDTO;
import life.lumen.common.model.dto.post.CreatePostDTO;
import life.lumen.common.model.entity.post.PostPO;
import life.lumen.common.utils.context.UserContextHolder;
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

    public void createPost(CreatePostDTO createPostDTO) {
        PostPO postPO = new PostPO();
        postPO.setTitle(createPostDTO.getTitle());
        postPO.setContent(createPostDTO.getContent());
        postPO.setCategoryId(createPostDTO.getCategoryId());
        UserContext userContext = UserContextHolder.getUserContext();
        postPO.setUserId(userContext.getUserId());
        postRepository.save(postPO);
    }

    public void updatePost(CreatePostDTO createPostDTO, Long id) {
        if (id<0){
            throw new CustomException(ErrorCode.INVALID_PARAMETERS);
        }
        PostPO post = postRepository.findPostPoById(id);
        if (post == null) {
            throw new CustomException(ErrorCode.POST_NOT_FOUND_ERROR);
        }
        post.setTitle(createPostDTO.getTitle());
        post.setContent(createPostDTO.getContent());
        post.setCategoryId(createPostDTO.getCategoryId());
        postRepository.save(post);
    }

    public void deletePost(Long id) {
        if (id<0){
            throw new CustomException(ErrorCode.INVALID_PARAMETERS);
        }
        PostPO post = postRepository.findPostPoById(id);
        if (post == null) {
            throw new CustomException(ErrorCode.POST_NOT_FOUND_ERROR);
        }
        postRepository.deleteById(post.getId());
    }
}
