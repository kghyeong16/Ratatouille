package hexagon.rat.dto;

import lombok.Data;

@Data
public class CreateReviewRequest {

    private String text;

    private Integer rating;
}
