package hexagon.rat.dto;

import lombok.Data;

@Data
public class ReviewResponse {
    private String text;
    private Integer rating;
    private long userId;

    public ReviewResponse(String text, Integer rating, long userId) {
        this.text = text;
        this.rating = rating;
        this.userId = userId;
    }
}
