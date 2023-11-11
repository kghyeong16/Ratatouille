package hexagon.rat.dto;

import hexagon.rat.domain.User;
import lombok.Builder;
import lombok.Data;
import org.antlr.v4.runtime.Token;

@Data
public class LoginResponse {
    private Long id;
    private String grantType;
    private String accessToken;
    private String refreshToken;
    private String nickname;
    private int role;
    private String profileImg;
    @Builder
    public LoginResponse(TokenInfo tokenInfo, User user) {
        this.id = user.getId();
        this.grantType = tokenInfo.getGrantType();
        this.accessToken = tokenInfo.getAccessToken();
        this.refreshToken = tokenInfo.getRefreshToken();
        this.nickname = user.getNickname();
        this.role = user.getRole();
        this.profileImg = user.getProfileImg();
    }
}
