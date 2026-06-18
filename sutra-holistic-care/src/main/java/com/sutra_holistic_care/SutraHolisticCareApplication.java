package com.sutra_holistic_care;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SutraHolisticCareApplication {

	public static void main(String[] args) {
		SpringApplication.run(SutraHolisticCareApplication.class, args);
	}

}
