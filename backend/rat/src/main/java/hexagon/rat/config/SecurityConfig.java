package hexagon.rat.config;

import hexagon.rat.jwt.JwtAuthenticationFilter;
import hexagon.rat.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic(httpBasic -> httpBasic.disable())                                                                    // basic auth 미사용
                .csrf(csrf -> csrf.disable())                                                                                   // csrf 보안 미사용
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))                   // 세션 미사용
                .authorizeHttpRequests((authorizeHttpRequests) -> authorizeHttpRequests                                         // 특정 URL 접근 허가 나머지는 모두 인증 필요
                        .requestMatchers("/user").permitAll().requestMatchers("/user/login").permitAll()
                        .requestMatchers("/user/logout").permitAll().requestMatchers("/user/refresh").permitAll()
                        .requestMatchers(HttpMethod.GET, "/user/detail/{}").permitAll().requestMatchers(HttpMethod.GET, "/user/nickname/{}").permitAll()
                        .requestMatchers(HttpMethod.GET,"/lesson").permitAll().requestMatchers(HttpMethod.GET,"/lesson/card").permitAll()
                        .requestMatchers(HttpMethod.GET, "/lesson/{}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/review/{}").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);    // 직접 구현한 필터 sernamePasswordAuthenticationFilter 전에 사용함을 명시

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}