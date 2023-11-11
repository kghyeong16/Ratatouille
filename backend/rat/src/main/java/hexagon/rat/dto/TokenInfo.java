package hexagon.rat.dto;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
public class TokenInfo {
    private String grantType;
    private String accessToken;
    private String refreshToken;
}
