# Multi-stage Dockerfile for the `property` Spring Boot module
# Builds the application with Maven and produces a small runtime image

FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy only Maven wrapper and pom to leverage layer caching
COPY pom.xml mvnw .mvn ./
COPY .mvn .mvn

# Copy sources
COPY src ./src

# Build the project (skip tests for faster image builds)
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the jar built in the previous stage
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
