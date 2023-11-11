package hexagon.rat.dto;

import lombok.Data;

@Data
public class CreateProfileImageRequest {
    private Long userId;
    private String link;
    private String key;
}
