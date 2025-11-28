# Frontend - Sistema de Gestión de Condominios

## 🚀 Configuración Completada

### Estructura del Proyecto
```
src/
├── components/
│   ├── login.tsx           # Componente de inicio de sesión
│   ├── Dashboard.tsx       # Dashboard con estadísticas
│   ├── UserList.tsx        # Lista de usuarios con tabla
│   ├── UserForm.tsx        # Formulario crear/editar usuario
│   ├── ConjuntoList.tsx    # Lista de conjuntos residenciales
│   ├── ConjuntoForm.tsx    # Formulario crear/editar conjunto
│   └── Navbar.tsx          # Barra de navegación
├── services/
│   ├── authService.ts      # Servicio de autenticación
│   ├── userService.ts      # Servicio CRUD de usuarios
│   └── propertyService.ts  # Servicio CRUD de conjuntos
├── context/
│   └── AuthContext.tsx     # Context API para estado global
├── utils/
│   └── axiosConfig.ts      # Configuración de axios
└── App.tsx                 # Componente principal
```

## 📦 Dependencias Instaladas
- ✅ React 19.2.0
- ✅ TypeScript 5.9.3
- ✅ Vite 7.2.4
- ✅ Axios (instalado)

## 🎯 Funcionalidades Implementadas

### 1. **Sistema de Autenticación**
- Login con correo y contraseña
- Almacenamiento de token JWT en localStorage
- Redirección automática al login si el token expira
- Manejo de roles (ADMIN, TECNICO, RESIDENTE)

### 2. **Dashboard con Estadísticas**
- ✅ Total de usuarios registrados
- ✅ Total de conjuntos residenciales
- ✅ Conjuntos que administras
- ✅ Información de sesión del usuario
- ✅ Acciones rápidas

### 3. **Gestión de Usuarios (CRUD)**
- ✅ **Crear** usuario (solo ADMIN)
- ✅ **Leer** lista de usuarios
- ✅ **Actualizar** usuario (solo ADMIN)
- ✅ **Eliminar** usuario (solo ADMIN)
- Validación de correo único
- Encriptación automática de contraseñas

### 4. **Gestión de Conjuntos Residenciales (CRUD)**
- ✅ **Crear** conjunto (solo ADMIN)
- ✅ **Leer** lista de conjuntos
- ✅ **Actualizar** conjunto (solo ADMIN)
- ✅ **Eliminar** conjunto (solo ADMIN)
- Asignación de administrador
- Visualización resaltada de tus conjuntos

### 5. **Control de Acceso por Roles**
- ADMIN: Acceso completo (crear, editar, eliminar)
- TECNICO/RESIDENTE: Solo visualización

## 🔧 Cómo Usar

### 1. Iniciar los Servicios Backend
Primero asegúrate de que los servicios backend estén corriendo:
```bash
# En la raíz del proyecto
docker-compose up -d
```

### 2. Iniciar el Frontend
```bash
cd frontend/front-mainhub
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### 3. Primer Login
Para probar necesitas crear un usuario primero en la base de datos o usar Swagger:

**Opción 1 - Crear usuario con Swagger:**
1. Abre http://localhost:8081/swagger-ui.html
2. Usa el endpoint `POST /usuario/`
3. Crea un usuario ADMIN:
```json
```

**Opción 2 - Usar Postman/cURL:**
```bash
curl -X POST http://localhost:8081/usuario/ \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Administrador",
    "correo": "admin@ejemplo.com",
    "clave": "admin123",
    "rol": "ADMIN"
  }'
```

### 4. Iniciar Sesión en el Frontend
- Correo: `admin@ejemplo.com`
- Contraseña: `admin123`

## 🎨 Flujo de Uso

### Navegación por Pestañas:
1. **📊 Dashboard**: Vista general con estadísticas
2. **👥 Usuarios**: Gestión de usuarios del sistema
3. **🏢 Conjuntos**: Administración de conjuntos residenciales

### Como ADMIN:
1. Login → Dashboard con estadísticas
2. **Pestaña Usuarios**: Crear, editar, eliminar usuarios
3. **Pestaña Conjuntos**: Crear, editar, eliminar conjuntos
4. Ver conjuntos que administras resaltados
5. Cerrar sesión

### Como TECNICO/RESIDENTE:
1. Login → Dashboard
2. Ver estadísticas generales
3. **Pestaña Usuarios**: Solo lectura
4. **Pestaña Conjuntos**: Solo lectura
5. Cerrar sesión

## 🔐 Endpoints Utilizados

### Auth Service (puerto 8082)
- `POST /auth/login/` - Autenticación

### User Service (puerto 8081)
- `POST /usuario/` - Crear usuario
- `GET /usuario/` - Listar usuarios
- `GET /usuario/{id}` - Obtener usuario
- `PUT /usuario/` - Actualizar usuario
- `DELETE /usuario/{id}` - Eliminar usuario

### Property Service (puerto 8084)
- `POST /conjuntos/` - Crear conjunto
- `GET /conjuntos/` - Listar conjuntos
- `GET /conjuntos/{id}` - Obtener conjunto
- `PUT /conjuntos/` - Actualizar conjunto
- `DELETE /conjuntos/{id}` - Eliminar conjunto

## 📝 Notas Importantes

1. **CORS**: Ya está configurado en el backend con `@CrossOrigin("*")`
2. **Token JWT**: Expira en 1 hora
3. **Contraseñas**: Se encriptan automáticamente en el backend
4. **Rol por defecto**: RESIDENTE (si no se especifica)
5. **Validación**: El correo debe ser único

## 🐛 Solución de Problemas

### Error: "No se recibió respuesta del servidor"
- Verifica que los servicios backend estén corriendo
- Revisa que los puertos 8081 y 8082 estén disponibles

### Error: "Credenciales inválidas"
- Verifica que el usuario existe en la base de datos
- Confirma que la contraseña es correcta

### Error al crear usuario: "El correo ya está registrado"
- El correo debe ser único en el sistema
- Usa otro correo electrónico

## 🚀 Próximos Pasos (Opcional)

- Agregar React Router para navegación entre páginas
- Implementar paginación en la lista de usuarios
- Agregar búsqueda y filtros
- Mejorar el diseño con una librería de UI (MUI, Ant Design, etc.)
- Agregar validaciones del lado del cliente
- Implementar manejo de propiedades (si aplica)

## 📧 Contacto
Para más información sobre el proyecto, consulta la documentación del backend.
