package hexagon.rat.dto;

import lombok.Data;

@Data
public class DetailReviewCardResponse {
    String intro;
    String nickname;
    String profileImg;

    public DetailReviewCardResponse(String intro, String nickname, String profileImg) {
        this.intro = intro;
        this.nickname = nickname;
        this.profileImg = profileImg;
    }
}
