package hexagon.rat.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UploadImageRequest {
    private Integer seq;
    private MultipartFile img;
}
