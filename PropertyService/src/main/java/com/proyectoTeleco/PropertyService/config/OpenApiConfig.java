package com.proyectoTeleco.PropertyService.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI propertyServiceOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Property Service API")
                .description("API para gestión de solicitudes de mantenimiento (HU-09, HU-10, HU-11)")
                .version("v1"));
    }
}
