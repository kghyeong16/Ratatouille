package hexagon.rat.service;

import hexagon.rat.domain.UserLesson;
import hexagon.rat.dto.CreateReviewRequest;
import hexagon.rat.repository.UserLessonRepository;
import hexagon.rat.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final UserLessonRepository userLessonRepository;
    private final UserRepository userRepository;

    @Transactional
    public Optional<UserLesson> updateReview(CreateReviewRequest request, Long id){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userRepository.findByEmail(email).get().getId();
        Optional<UserLesson> review = userLessonRepository.findByUserIdAndLessonId(userId, id);
        review.get().UpdateReview(request.getText(), request.getRating());
        return review;
    }
}
