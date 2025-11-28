# notification-service (MVP)

Microservicio mínimo para encolar/enviar notificaciones del MVP.

Endpoints:
- `POST /notify` — body: `{ "recipient": "user@example.com", "message": "Hola", "channel": "email" }`

Run locally:
- Build: `mvn -f telematica/notification-service package -DskipTests`
- Run: `java -jar telematica/notification-service/target/notification-service-0.0.1-SNAPSHOT.jar`

Docker:
- `docker build -t notification-service telematica/notification-service`
- Add to docker-compose if needed; by default this module is independent.
