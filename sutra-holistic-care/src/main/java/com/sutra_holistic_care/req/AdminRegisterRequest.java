package com.sutra_holistic_care.req;

import lombok.Data;

@Data
public class AdminRegisterRequest {
    private String name;

    private String email;

    private String password;

    private String mobile;
}