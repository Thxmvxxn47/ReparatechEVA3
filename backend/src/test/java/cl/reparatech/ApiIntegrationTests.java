package cl.reparatech;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTests {

    @Autowired
    MockMvc mvc;

    @Test
    void catalogoPublico() throws Exception {
        mvc.perform(get("/api/public/servicios"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").exists());
    }

    @Test
    void privadoRequiereSesion() throws Exception {
        mvc.perform(get("/api/ordenes")).andExpect(status().isForbidden());
    }

    @Test
    void loginRechazaContrasenaIncorrecta() throws Exception {
        mvc.perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"correo\":\"admin@reparatech.cl\",\"password\":\"mal\"}")
        ).andExpect(status().isUnauthorized());
    }

    @Test
    void swaggerDisponible() throws Exception {
        mvc.perform(get("/v3/api-docs")).andExpect(status().isOk());
    }

    private String login(String correo, String password, String rol, String nombre) throws Exception {
        var json = new com.fasterxml.jackson.databind.ObjectMapper();
        var response = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(java.util.Map.of("correo", correo, "password", password))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.usuario.rol").value(rol))
            .andExpect(jsonPath("$.usuario.nombre").value(nombre))
            .andReturn().getResponse();
        return "Bearer " + json.readTree(response.getContentAsString()).path("token").asText();
    }

    @Test
    void equipoIniciaSesionConSuRol() throws Exception {
        login("encargado@reparatech.cl", "1234", "encargado", "Thomas");
        login("admin@reparatech.cl", "1234", "administrador", "Maximiliano");
        login("recepcion@reparatech.cl", "1234", "recepcionista", "Dafne");
        login("tecnico@reparatech.cl", "1234", "tecnico", "Darliette");
        login("victor.gutierrez@reparatech.cl", "1234", "tecnico", "Victor");
        login("carlos.ramirez@reparatech.cl", "1234", "tecnico", "Carlos");
        login("mizahel.huaman@reparatech.cl", "1234", "tecnico", "Mizahel");
        login("sebastian.covarrubias@reparatech.cl", "1234", "tecnico", "Sebastian");
        login("matias.estobar@reparatech.cl", "1234", "tecnico", "Matias");
    }

    @Test
    void tecnicoVeSuFichaYNoPuedeConsultarOtra() throws Exception {
        String token = login("victor.gutierrez@reparatech.cl", "1234", "tecnico", "Victor");
        mvc.perform(get("/api/tecnicos").header("Authorization", token))
            .andExpect(status().isOk()).andExpect(jsonPath("$[0].id").value(2))
            .andExpect(jsonPath("$[1]").doesNotExist());
        mvc.perform(get("/api/tecnicos/1").header("Authorization", token))
            .andExpect(status().isForbidden());
    }

    @Test
    void clienteSolicitaReparacionConPrecioCalculadoPorLaApi() throws Exception {
        String token = login("rodrigo.chacon@reparatech.cl", "1234", "cliente", "Rodrigo");
        mvc.perform(post("/api/mis-ordenes").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"dispositivo":"iPhone 15","falla":"Pantalla dañada","servicioIds":["SE001"],
                 "costoTotal":1,"clienteId":2,"estado":"Cancelado"}
                """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.clienteId").value(1))
            .andExpect(jsonPath("$.estado").value("Recibido"))
            .andExpect(jsonPath("$.costoTotal", org.hamcrest.Matchers.greaterThan(1)));
    }
}
