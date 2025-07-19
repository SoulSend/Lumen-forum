package life.lumen.common.utils.mapstruct;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import life.lumen.common.model.entity.post.PostPO;
import life.lumen.common.model.vo.post.PostVO;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-19T10:56:02+0800",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.15 (Oracle Corporation)"
)
public class PostMapperImpl implements PostMapper {

    @Override
    public PostVO postPOToPostVO(PostPO postPO) {
        if ( postPO == null ) {
            return null;
        }

        PostVO postVO = new PostVO();

        postVO.setId( postPO.getId() );
        postVO.setTitle( postPO.getTitle() );
        postVO.setContent( postPO.getContent() );
        postVO.setUserId( postPO.getUserId() );
        postVO.setCategoryId( postPO.getCategoryId() );
        postVO.setViewCount( postPO.getViewCount() );
        postVO.setLikeCount( postPO.getLikeCount() );
        postVO.setCommentCount( postPO.getCommentCount() );
        postVO.setIsPinned( postPO.getIsPinned() );
        postVO.setIsFeatured( postPO.getIsFeatured() );
        postVO.setIsSolved( postPO.getIsSolved() );
        postVO.setIsRecommended( postPO.getIsRecommended() );
        postVO.setSolutionCommentId( postPO.getSolutionCommentId() );

        return postVO;
    }

    @Override
    public List<PostVO> postListToPostVOList(List<PostPO> posts) {
        if ( posts == null ) {
            return null;
        }

        List<PostVO> list = new ArrayList<PostVO>( posts.size() );
        for ( PostPO postPO : posts ) {
            list.add( postPOToPostVO( postPO ) );
        }

        return list;
    }
}
