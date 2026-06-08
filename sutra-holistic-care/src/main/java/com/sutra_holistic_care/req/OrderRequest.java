package com.sutra_holistic_care.req;

import lombok.Data;

@Data
public class OrderRequest {
    private String name;

    private String address;

    private String mobile;

    private String email;

    private String productId;

    private int packIndex;

    private Long quantity;
}