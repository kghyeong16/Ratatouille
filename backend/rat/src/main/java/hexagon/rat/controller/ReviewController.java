package hexagon.rat.controller;

import hexagon.rat.domain.Lesson;
import hexagon.rat.domain.UserLesson;
import hexagon.rat.dto.CreateReviewRequest;
import hexagon.rat.dto.LessonResponse;
import hexagon.rat.dto.ReviewResponse;
import hexagon.rat.repository.UserLessonRepository;
import hexagon.rat.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserLessonRepository userLessonRepository;

    // 리뷰 생성 및 업데이트
    @PutMapping("/{lessonId}")
    public ResponseEntity<ReviewResponse> createReview(@PathVariable(value = "lessonId") Long id, @RequestBody CreateReviewRequest request) {
        Optional<UserLesson> userLesson = reviewService.updateReview(request, id);
        return ResponseEntity
                .ok()
                .body(new ReviewResponse(userLesson.get().getReviewText(), userLesson.get().getReviewRating(), userLesson.get().getUser().getId()));
    }

    // 리뷰 삭제
    @PutMapping("/{lessonId}/delete")
    public ResponseEntity<ReviewResponse> deleteReview(@PathVariable(value = "lessonId") Long id) {
        CreateReviewRequest createReviewRequest = new CreateReviewRequest();
        createReviewRequest.setText("");
        createReviewRequest.setRating(0);
        Optional<UserLesson> userLesson = reviewService.updateReview(createReviewRequest, id);
        return ResponseEntity
                .ok()
                .body(new ReviewResponse(userLesson.get().getReviewText(), userLesson.get().getReviewRating(),userLesson.get().getUser().getId()));
    }

    @GetMapping("/all/{lessonId}")
    public ResponseEntity<List<ReviewResponse>> findReviews(@PathVariable(value = "lessonId") Long id) {

        List<UserLesson> userLessons = userLessonRepository.findByLessonId(id);
        List<ReviewResponse> reviews = new ArrayList<>();

        for (UserLesson ul : userLessons) {
            ReviewResponse reviewResponse = new ReviewResponse(ul.getReviewText(), ul.getReviewRating(), ul.getUser().getId());
            reviews.add(reviewResponse);
        }

        return ResponseEntity
                .ok()
                .body(reviews);
    }

    @GetMapping("/{tutorId}")
    public ResponseEntity<List<ReviewResponse>> findReview(@PathVariable(value = "tutorId") Long id) {

        List<UserLesson> userLessons = userLessonRepository.findByTutorId(id);
        List<ReviewResponse> reviews = new ArrayList<>();

        for (UserLesson ul : userLessons) {
            ReviewResponse reviewResponse = new ReviewResponse(ul.getReviewText(), ul.getReviewRating(), ul.getUser().getId());
            reviews.add(reviewResponse);
        }

        return ResponseEntity
                .ok()
                .body(reviews);
    }
}
