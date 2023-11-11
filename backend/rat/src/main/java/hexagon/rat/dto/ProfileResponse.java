package hexagon.rat.dto;

import hexagon.rat.domain.User;
import lombok.Data;

@Data
public class ProfileResponse {
    private String email;
    private String name;
    private String nickname;
    private String phoneNumber;
    private String intro;
    private String profileImg;
    private int role;

    public ProfileResponse(User user){
        this.email = user.getEmail();
        this.name = user.getName();
        this.nickname = user.getNickname();
        this.phoneNumber = user.getPhoneNumber();
        this.intro = user.getIntro();
        this.profileImg = user.getProfileImg();
        this.role = user.getRole();
    }

}
