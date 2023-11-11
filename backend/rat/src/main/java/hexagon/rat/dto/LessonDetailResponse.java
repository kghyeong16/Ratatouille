package hexagon.rat.dto;

import hexagon.rat.domain.*;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Data
public class LessonDetailResponse {
    private String title;

    private String detail;

    private String ingredients;

    private Integer fee;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long categoryId;

    private String url;

    private Long tutorId;

    private List<String> imageUrls = new ArrayList<>();

    private List<String> videoTitles = new ArrayList<>();

    private List<String> videoContents = new ArrayList<>();

    private List<String> videoUrls = new ArrayList<>();

    private boolean isBooked;
    public LessonDetailResponse(Lesson lesson, boolean isBooked){
        this.title = lesson.getTitle();
        this.detail = lesson.getDetail();
        this.ingredients = lesson.getIngredients();
        this.fee = lesson.getFee();
        this.startTime = lesson.getStartTime();
        this.endTime = lesson.getEndTime();
        this.tutorId = lesson.getTutor().getId();
        this.categoryId = lesson.getCategory().getId();
        this.url = lesson.getUrl();
        this.isBooked = isBooked;
        for (Image image : lesson.getImages()){
            this.imageUrls.add(image.getLink());
        }
        for (Video video : lesson.getVideos()){
            this.videoTitles.add(video.getTitle());
            this.videoContents.add(video.getContent());
            this.videoUrls.add(video.getLink());
        }
    }
}
