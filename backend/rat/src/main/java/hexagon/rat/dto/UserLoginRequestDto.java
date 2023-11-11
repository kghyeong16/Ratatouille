package hexagon.rat.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class UserLoginRequestDto {
    private String userId;          // 변수명 email로 바꾸면 비정상작동
    private String password;
}
