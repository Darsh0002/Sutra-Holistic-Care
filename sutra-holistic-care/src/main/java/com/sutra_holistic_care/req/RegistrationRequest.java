package com.sutra_holistic_care.req;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String name;

    private int age;

    private String sex;

    private String mobile;

    private String email;

    private String seminarId;
}