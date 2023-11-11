package hexagon.rat.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UploadRecipeRequest {
    private String title;
    private String content;
    private Integer seq;
    private MultipartFile video;
}
