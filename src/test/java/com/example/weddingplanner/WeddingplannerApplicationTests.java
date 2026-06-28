package com.example.weddingplanner;

import com.example.weddingplanner.entity.Guest;
import com.example.weddingplanner.entity.Task;
import com.example.weddingplanner.entity.WeddingPlan;
import com.example.weddingplanner.repository.GuestRepository;
import com.example.weddingplanner.repository.TaskRepository;
import com.example.weddingplanner.repository.WeddingPlanRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class WeddingplannerApplicationTests {
	@Autowired MockMvc mockMvc;
	@Autowired ObjectMapper objectMapper;
	@Autowired WeddingPlanRepository weddingPlanRepository;
	@Autowired GuestRepository guestRepository;
	@Autowired TaskRepository taskRepository;

	@BeforeEach
	void setUp() {
		guestRepository.deleteAll();
		taskRepository.deleteAll();
		weddingPlanRepository.deleteAll();
	}

	@Test
	void createWeddingPlan_returnsCreatedPlan() throws Exception {
		WeddingPlan plan = new WeddingPlan(
				"Sophie", "Lena", "Sophie & Lena", "München", LocalDate.of(2025, 9, 14));

		mockMvc.perform(post("/api/wedding-plans")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(plan)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.partnerOneFirstName").value("Sophie"))
				.andExpect(jsonPath("$.location").value("München"));
	}

	@Test
	void getAllWeddingPlans_returnsListWithEntry() throws Exception {
		weddingPlanRepository.save(new WeddingPlan(
				"Max", "Julia", "Max & Julia", "Hamburg", LocalDate.of(2025, 11, 22)));

		mockMvc.perform(get("/api/wedding-plans"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].partnerOneFirstName").value("Max"));
	}

	@Test
	void getWeddingPlanById_notFound_returns404() throws Exception {
		mockMvc.perform(get("/api/wedding-plans/999"))
				.andExpect(status().isNotFound());
	}

	@Test
	void createWeddingPlan_missingPartnerName_returns400() throws Exception {
		WeddingPlan invalid = new WeddingPlan(
				"", "Lena", "Test", "München", LocalDate.of(2025, 9, 14));

		mockMvc.perform(post("/api/wedding-plans")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalid)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.partnerOneFirstName").exists());
	}

	@Test
	void createGuestForWeddingPlan_returnsGuest() throws Exception {
		WeddingPlan plan = weddingPlanRepository.save(new WeddingPlan(
				"Sophie", "Lena", "Sophie & Lena", "München", LocalDate.of(2025, 9, 14)));

		Guest guest = new Guest("Anna", "Müller", "Freundin der Braut",
				"Vegetarisch", false, true, null);

		mockMvc.perform(post("/api/guests/wedding-plan/" + plan.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(guest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.firstName").value("Anna"))
				.andExpect(jsonPath("$.lastName").value("Müller"));
	}

	@Test
	void updateTask_marksAsCompleted() throws Exception {
		WeddingPlan plan = weddingPlanRepository.save(new WeddingPlan(
				"Sophie", "Lena", "Sophie & Lena", "München", LocalDate.of(2025, 9, 14)));

		Task task = taskRepository.save(new Task("Blumen bestellen", "", false, plan));
		task.setCompleted(true);
		task.setWeddingPlan(plan);

		mockMvc.perform(put("/api/tasks/" + task.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(task)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completed").value(true));
	}

	@Test
	void deleteWeddingPlan_thenNotFound() throws Exception {
		WeddingPlan plan = weddingPlanRepository.save(new WeddingPlan(
				"Sophie", "Lena", "Test", "München", LocalDate.of(2025, 9, 14)));

		mockMvc.perform(delete("/api/wedding-plans/" + plan.getId()))
				.andExpect(status().isNoContent());

		mockMvc.perform(get("/api/wedding-plans/" + plan.getId()))
				.andExpect(status().isNotFound());
	}
}
