package hexagon.rat.dto;

import lombok.Data;

@Data
public class NicknameResponse {
    boolean check;

    public NicknameResponse(boolean check) {
        this.check = check;
    }
}
