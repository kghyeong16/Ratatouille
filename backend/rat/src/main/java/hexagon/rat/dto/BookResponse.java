package hexagon.rat.dto;

import hexagon.rat.domain.UserLesson;
import lombok.Data;

@Data
public class BookResponse {
    private Long bookId;

    public BookResponse(UserLesson book){
        this.bookId = book.getId();
    }
}
