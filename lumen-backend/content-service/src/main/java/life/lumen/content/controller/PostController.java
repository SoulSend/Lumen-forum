package life.lumen.content.controller;

import jakarta.validation.Valid;
import life.lumen.common.model.Result;
import life.lumen.common.model.dto.post.PageQueryDTO;
import life.lumen.common.model.entity.post.PostPO;
import life.lumen.common.model.vo.post.PostVO;
import life.lumen.common.utils.mapstruct.PostMapper;
import life.lumen.content.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {
    public final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * 获取最新创建的帖子 也就是一般展示的帖子 根据创建时间排序
     * @param pageQueryDTO
     * @return
     */
    @GetMapping
    public Result<Page<PostVO>> getPosts(@RequestBody @Valid PageQueryDTO pageQueryDTO){
        Page<PostPO> postPO=postService.getPosts(pageQueryDTO);
        Page<PostVO> res= PostMapper.INSTANCE.pagePostPOToPagePostVO(postPO);
        return  Result.success(res);
    }

    /**
     * 获取指定id文章的详情
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<PostVO> getPost(@PathVariable Long id){
        PostPO postPO=postService.getPost(id);
        PostVO res=PostMapper.INSTANCE.postPOToPostVO(postPO);
        return Result.success(res);
    }
    /**
     * 获取对应用户id的文章列表
     * @param pageQueryDTO
     * @return
     */
    @GetMapping("/user")
    public Result<Page<PostVO>> getUsersPosts(@RequestBody @Valid PageQueryDTO pageQueryDTO){
        Page<PostPO> postPO= postService.getUsersPosts(pageQueryDTO);
        Page<PostVO> res= PostMapper.INSTANCE.pagePostPOToPagePostVO(postPO);
        return  Result.success(res);
    }

    /**
     * 获取首页热门文章
     * @param pageQueryDTO
     * @return
     */
    @GetMapping("/hot")
    public Result<Page<PostVO>> getHotPosts(@RequestBody @Valid PageQueryDTO pageQueryDTO){
        Page<PostPO> postPO= postService.getHotPosts(pageQueryDTO);
        Page<PostVO> res= PostMapper.INSTANCE.pagePostPOToPagePostVO(postPO);
        return  Result.success(res);
    }

    /**
     * 获取侧边栏的热门文章
     * @param pageQueryDTO
     * @return
     */
    @GetMapping("/hot/side")
    public Result<List<PostVO>> getHotSidePosts(@RequestBody @Valid PageQueryDTO pageQueryDTO){
        List<PostPO> postPO= postService.getHotSidePosts(pageQueryDTO);
        List<PostVO> res= PostMapper.INSTANCE.postListToPostVOList(postPO);
        return  Result.success(res);
    }

    /**
     * 获取首页推荐的文章
     * @param pageQueryDTO
     * @return
     */
    @GetMapping("/recommended")
    public Result<Page<PostVO>> getRecommendedPosts(@RequestBody @Valid PageQueryDTO pageQueryDTO){
        Page<PostPO> postPO= postService.getRecommendedPosts(pageQueryDTO);
        Page<PostVO> res= PostMapper.INSTANCE.pagePostPOToPagePostVO(postPO);
        return  Result.success(res);
    }

    /**
     * 获取首页轮播的推荐文章
     * @param pageQueryDTO
     * @return
     */
    @GetMapping("/recommended/side")
    public Result<List<PostVO>> getRecommendedSidePosts(@RequestBody @Valid PageQueryDTO pageQueryDTO){
        List<PostPO> postPO= postService.getRecommendedSidePosts(pageQueryDTO);
        List<PostVO> res= PostMapper.INSTANCE.postListToPostVOList(postPO);
        return  Result.success(res);
    }

}
