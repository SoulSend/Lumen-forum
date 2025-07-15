package life.lumen.common.model.vo.user;


import lombok.Data;

@Data
public class UserVO {
    private Long id;

    private String username;

    private String email;

    private String phone;

    private String passwordHash;

    private String avatar ;

    private String bio;

    private String website;

    private String location;

    private String title;

    private Boolean showEmail ;

    private Integer reputation;

    private Integer postCount ;

    private Integer commentCount;

    private Boolean isAdmin ;

    private Boolean isModerator ;
}
