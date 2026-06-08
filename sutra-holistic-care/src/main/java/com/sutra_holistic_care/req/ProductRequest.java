package com.sutra_holistic_care.req;

import com.sutra_holistic_care.entities.Pack;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProductRequest {
    private String name;

    private String description;

    private String emoji;

    // "At least one pack is required"
    private List<Pack> packs = new ArrayList<>();

    private List<String> ingredients = new ArrayList<>();

    private List<String> benefits = new ArrayList<>();
}