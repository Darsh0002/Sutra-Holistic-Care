package com.sutra_holistic_care.req;

import lombok.Data;

@Data
public class AdminLoginRequest {
    private String email;
    private String password;
}