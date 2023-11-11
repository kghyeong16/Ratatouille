package hexagon.rat.dto;

import hexagon.rat.domain.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    private String email;
    private String password;
    private String name;
    private String nickname;
    private String phoneNumber;
    private String intro;
    private String accessToken;
    private String refreshToken;
    private int role;
}
