# Guía de Integración Frontend - Secret Santa API

Esta guía proporciona toda la información necesaria para integrar el frontend con la API de Secret Santa. Incluye autenticación, endpoints, modelos de datos, validaciones, permisos y ejemplos de uso.

## Configuración Base

### URL Base de la API
```
Base URL: http://localhost:4000 (desarrollo)
```

### Headers Comunes
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // Para endpoints protegidos
}
```

## Autenticación

### Roles de Usuario
- **participant**: Puede ver sus propios eventos y asignaciones
- **organizer**: Puede crear y gestionar eventos propios
- **admin**: Acceso completo a todos los eventos y usuarios

### Flujo de Registro
1. **POST /auth/register** - Registrar usuario
2. **POST /auth/verify-otp** - Verificar email con OTP
3. **POST /auth/login** - Iniciar sesión

### Flujo de Invitación
1. **POST /auth/invite** - Enviar invitación (por organizador)
2. **POST /auth/verify** - Completar verificación con contraseña

### Validación de Token al Cargar la App
Para validar la sesión al refrescar la página, usa **GET /auth/verify-token** en lugar de **GET /events** para una validación más rápida y ligera que no requiere consultas a la base de datos.

### Rate Limiting
- **OTP Verification**: Máximo 5 intentos por IP cada 15 minutos
- **Otras operaciones**: No tienen límites específicos, pero se recomienda implementar throttling en el frontend

### Token JWT
- Expira en 24 horas
- Incluir en header `Authorization: Bearer <token>`
- Contiene: `{ userId, role }`

### Importancia del Rol en el Frontend
El rol del usuario determina qué funcionalidades mostrar en la UI:
- **participant**: Mostrar solo eventos donde participa, sin opciones de gestión
- **organizer**: Mostrar botones de "Crear evento", "Gestionar participantes", etc.
- **admin**: Mostrar panel administrativo y acceso global

Siempre verifica el rol almacenado localmente o obtenido de `/auth/verify-token` para renderizar la UI apropiada.

## Endpoints de la API

### Autenticación

#### POST /auth/register
Registra un nuevo usuario y envía OTP de verificación.

**Request:**
```json
{
  "name": "string (1-255 chars)",
  "email": "string (email válido)",
  "password": "string (8-255 chars)"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "organizer",
    "email_verified": false
  },
  "requires_verification": true,
  "message": "User registered. Please check your email for OTP verification."
}
```

#### POST /auth/verify-otp
Verifica el código OTP enviado por email.

**Request:**
```json
{
  "email": "string",
  "otp": "string (6 dígitos)"
}
```

**Response (200):**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "email_verified": true
  },
  "message": "Email verified successfully"
}
```

#### POST /auth/login
Inicia sesión de usuario.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "email_verified": true
  }
}
```

#### POST /auth/invite
Invita a un usuario a unirse a un evento (requiere autenticación).

**Request:**
```json
{
  "name": "string",
  "email": "string",
  "eventId": "string (UUID)"
}
```

**Response (201):**
```json
{
  "invitationLink": "string"
}
```

#### POST /auth/verify
Completa la verificación de cuenta con contraseña.

**Request:**
```json
{
  "token": "string (UUID)",
  "password": "string (8-255 chars)"
}
```

**Response (200):**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "email_verified": true
  },
  "message": "Account verified and password set successfully"
}
```

#### GET /auth/verify-token
Verifica la validez del token JWT sin realizar consultas adicionales a la base de datos. Útil para validación rápida del token al cargar la aplicación.

**Auth:** Bearer token requerido

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "string",
    "role": "string"
  }
}
```

**Response (401):**
```json
{
  "error": "Token expired" // o "Invalid token"
}
```

### Eventos

#### GET /events
Obtiene todos los eventos accesibles para el usuario.

**Auth:** Bearer token requerido

**Response (200) - Varía por rol del usuario:**
- **Admin**: Todos los eventos del sistema con información completa
- **Organizer**: Eventos propios con información completa
- **Participant**: Eventos donde participa con información limitada

```json
// Respuesta para Admin/Organizer
[
  {
    "id": "string",
    "owner_id": "string",
    "name": "string",
    "participants": [...],
    "rules": {
      "avoidSameGroup": false,
      "maxShuffleAttempts": 1000,
      "avoidPreviousAssignments": false
    },
    "assignments": [
      {"giverId": "user1", "receiverId": "user2"}
    ],
    "createdAt": "string",
    "assignedAt": "string"
  }
]

// Respuesta para Participant (filtrada)
[
  {
    "id": "string",
    "owner_id": "string",
    "name": "string",
    "participants": [...],
    "createdAt": "string",
    "assignedAt": "string"
    // Sin rules ni assignments por privacidad
  }
]
```

#### POST /events
Crea un nuevo evento.

**Auth:** Bearer token requerido (organizer+)

**Request:**
```json
{
  "name": "string (1-255 chars)"
}
```

**Response (201):**
```json
{
  "id": "string",
  "owner_id": "string",
  "name": "string",
  "participants": [],
  "rules": {},
  "createdAt": "string"
}
```

#### GET /events/{id}
Obtiene detalles de un evento específico.

**Auth:** Bearer token requerido

**Parameters:**
- `id`: UUID del evento

**Response (200) - Varía por rol del usuario:**
- **Admin/Organizer**: Información completa del evento
- **Participant**: Información limitada (sin reglas ni asignaciones)

```json
// Respuesta para Admin/Organizer
{
  "id": "string",
  "owner_id": "string",
  "name": "string",
  "participants": [...],
  "rules": {
    "avoidSameGroup": false,
    "maxShuffleAttempts": 1000,
    "avoidPreviousAssignments": false
  },
  "assignments": [
    {"giverId": "user1", "receiverId": "user2"}
  ],
  "createdAt": "string",
  "assignedAt": "string"
}

// Respuesta para Participant (filtrada)
{
  "id": "string",
  "owner_id": "string",
  "name": "string",
  "participants": [...],
  "createdAt": "string",
  "assignedAt": "string"
  // Sin rules ni assignments por privacidad
}
```

#### PUT /events/{id}
Actualiza un evento.

**Auth:** Bearer token requerido (propietario o admin)

**Parameters:**
- `id`: UUID del evento (en la URL, NO en el body)

**Request:**
```json
{
  "name": "string (1-255 chars)"
}
```

**Response (200):**
```json
{
  "id": "string",
  "owner_id": "string",
  "name": "string (nuevo nombre)",
  "participants": [...],
  "rules": {...},
  "assignments": [...],
  "createdAt": "string",
  "assignedAt": "string"
}
```

**Response (404):**
```json
{
  "error": "Event not found"
}
```

**Importante:** El ID del evento debe ir en la URL (`/events/{uuid}`), no en el body del request. Solo envía el campo `name` en el JSON del body.

#### DELETE /events/{id}
Elimina un evento.

**Auth:** Bearer token requerido (propietario o admin)

**Parameters:**
- `id`: UUID del evento

**Response (200):**
```json
{
  "message": "Event deleted"
}
```

**Response (404):**
```json
{
  "error": "Event not found"
}
```

### Participantes

#### GET /events/{eventId}/participants
Obtiene participantes de un evento.

**Auth:** Bearer token requerido

**Parameters:**
- `eventId`: UUID del evento

**Response (200):**
```json
[
  {
    "id": "string",
    "event_id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "group_id": "string"
  }
]
```

#### POST /events/{eventId}/participants
Agrega un participante a un evento.

**Auth:** Bearer token requerido (propietario o admin)

**Parameters:**
- `eventId`: UUID del evento

**Request:**
```json
{
  "name": "string (1-255 chars)",
  "email": "string (email válido)",
  "phone": "string (opcional, max 50 chars)",
  "groupId": "string (1-255 chars, opcional - cualquier string, se convierte a UUID internamente)"
}
```

**Response (201):**
```json
{
  "id": "string",
  "event_id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "group_id": "string"
}
```

**Response (409 - Conflict):**
```json
{
  "error": "A participant with this email already exists in this event"
}
```

#### PUT /events/{eventId}/participants/{id}
Actualiza un participante.

**Auth:** Bearer token requerido (propietario o admin)

**Parameters:**
- `eventId`: UUID del evento
- `id`: UUID del participante

**Request:**
```json
{
  "name": "string (1-255 chars)",
  "email": "string (email válido)",
  "phone": "string (opcional)",
  "groupId": "string (1-255 chars, opcional - cualquier string, se convierte a UUID internamente)"
}
```

#### DELETE /events/{eventId}/participants/{id}
Elimina un participante.

**Auth:** Bearer token requerido (propietario o admin)

**Parameters:**
- `eventId`: UUID del evento
- `id`: UUID del participante

### Reglas

#### GET /events/{eventId}/rules
Obtiene reglas de un evento.

**Auth:** Bearer token requerido

**Parameters:**
- `eventId`: UUID del evento

**Response (200):**
```json
{
  "avoidSameGroup": false,
  "maxShuffleAttempts": 1000,
  "avoidPreviousAssignments": false
}
```

#### PUT /events/{eventId}/rules
Actualiza reglas de un evento.

**Auth:** Bearer token requerido (propietario o admin)

**Parameters:**
- `eventId`: UUID del evento

**Request:**
```json
{
  "avoidSameGroup": "boolean (opcional)",
  "maxShuffleAttempts": "number (1-10000, opcional)",
  "avoidPreviousAssignments": "boolean (opcional)"
}
```

### Asignaciones

#### GET /events/{eventId}/assignments
Obtiene asignaciones de un evento.

**Auth:** Bearer token requerido (propietario o admin)

**Parameters:**
- `eventId`: UUID del evento

**Response (200):**
```json
[
  {
    "giverId": "string",
    "receiverId": "string"
  }
]
```

#### POST /events/{eventId}/assignments
Genera asignaciones para un evento y envía emails.

**Auth:** Bearer token requerido (propietario o admin)

**Parameters:**
- `eventId`: UUID del evento

**Response (201):**
```json
{
  "assignments": [
    {
      "giverId": "string",
      "receiverId": "string"
    }
  ],
  "emailsSent": 5,
  "message": "Assignments generated and 5 notification emails sent"
}
```

#### GET /me/assignment
Obtiene la asignación del usuario actual.

**Auth:** Bearer token requerido

**Response (200):**
```json
{
  "eventId": "string",
  "eventName": "string",
  "receiverName": "string",
  "receiverEmail": "string"
}
```

#### GET /events/{eventId}/my-info
Obtiene información específica del participante en un evento.

**Auth:** Bearer token requerido

**Parameters:**
- `eventId`: UUID del evento

**Response (200):**
```json
{
  "event": {
    "id": "string",
    "name": "string",
    "createdAt": "string",
    "assignedAt": "string"
  },
  "myRole": "participant|organizer|admin",
  "myInfo": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### Administración

#### GET /admin/dashboard
Obtiene estadísticas del dashboard de admin.

**Auth:** Bearer token requerido (admin)

**Response (200):**
```json
{
  "message": "Admin dashboard data",
  "stats": {
    "totalUsers": 100,
    "totalEvents": 50,
    "totalParticipants": 500,
    "recentEvents": 10,
    "activeEvents": 25
  },
  "timestamp": "2025-11-22T17:42:13.771Z"
}
```

#### GET /admin/events
Obtiene todos los eventos (vista admin).

**Auth:** Bearer token requerido (admin)

**Response (200):**
```json
{
  "message": "All events (admin view)",
  "events": [...],
  "total": 50
}
```

#### GET /admin/users
Obtiene todos los usuarios (vista admin).

**Auth:** Bearer token requerido (admin)

**Response (200):**
```json
{
  "message": "All users (admin view)",
  "users": [...],
  "total": 100
}
```

### Health Checks

#### GET /health
Verifica que el servidor esté ejecutándose (Liveness Probe).

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T18:10:00.000Z"
}
```

#### GET /ready
Verifica que el servidor esté listo para recibir tráfico (Readiness Probe).

**Response (200):**
```json
{
  "status": "ready",
  "timestamp": "2025-11-22T18:10:00.000Z"
}
```

**Response (503):**
```json
{
  "status": "not ready",
  "error": "Database connection failed"
}
```

## Modelos de Datos

### Event
```typescript
interface Event {
  id: string;
  owner_id: string;
  name: string;
  participants: Participant[];
  rules: Rules;
  assignments?: Assignment[];
  createdAt: Date;
  assignedAt?: Date;
}
```

### Participant
```typescript
interface Participant {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone?: string;
  group_id?: string;
}
```

### Rules
```typescript
interface Rules {
  avoidSameGroup?: boolean;
  maxShuffleAttempts?: number;
  avoidPreviousAssignments?: boolean;
}
```

### Assignment
```typescript
interface Assignment {
  giverId: string;
  receiverId: string;
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'participant' | 'organizer' | 'admin';
  email_verified?: boolean;
}
```

## Validaciones

### Esquemas de Validación
- **registerSchema**: name (1-255), email (válido), password (8-255)
- **loginSchema**: email (válido), password (requerido)
- **verifyOtpSchema**: email (válido), otp (6 dígitos numéricos)
- **inviteUserSchema**: name (1-255), email (válido), eventId (UUID)
- **completeVerificationSchema**: token (UUID), password (8-255)
- **createEventSchema**: name (1-255)
- **updateEventSchema**: name (1-255)
- **createParticipantSchema**: name (1-255), email (válido), phone (opcional, max 50), groupId (opcional, 1-255 chars - cualquier string)
- **updateParticipantSchema**: igual que createParticipantSchema
- **rulesSchema**: avoidSameGroup (boolean opcional), maxShuffleAttempts (1-10000 opcional), avoidPreviousAssignments (boolean opcional)
- **uuidParamSchema**: string UUID válido

### Manejo de Errores de Validación
Los errores de validación retornan:
```json
{
  "error": "field1: error message, field2: error message"
}
```

## Permisos y Autorización

### Jerarquía de Roles
1. **participant** (nivel 1): Acceso limitado
2. **organizer** (nivel 2): Gestión de eventos propios
3. **admin** (nivel 3): Acceso completo

### Permisos por Rol

#### Participant
- READ_OWN_PROFILE
- READ_OWN_ASSIGNMENT
- READ_EVENT (solo eventos donde participa)

#### Organizer
- Todos los permisos de Participant
- UPDATE_OWN_PROFILE
- CREATE_EVENT
- READ_EVENT, UPDATE_EVENT, DELETE_EVENT (solo eventos propios)
- MANAGE_PARTICIPANTS (solo eventos propios)
- MANAGE_RULES (solo eventos propios)
- GENERATE_ASSIGNMENTS (solo eventos propios)
- READ_ASSIGNMENTS (solo eventos propios)

#### Admin
- Todos los permisos de Organizer
- MANAGE_ALL_EVENTS
- MANAGE_USERS
- SYSTEM_ADMIN
- VIEW_ADMIN_DASHBOARD
- VIEW_ALL_EVENTS
- VIEW_ALL_USERS
- AUDIT_SYSTEM

### Middleware de Autenticación
- **authMiddleware**: Verifica token JWT
- **requireOrganizer**: Requiere rol organizer o superior
- **requireAdmin**: Requiere rol admin
- **requireEventAccess**: Verifica propiedad del evento o rol admin
- **otpRateLimit**: Limita intentos de verificación OTP (5 por 15 min)

## Respuestas Filtradas por Rol

La API implementa **filtrado inteligente de respuestas** basado en el rol del usuario para garantizar privacidad y seguridad. Los participantes no ven información sensible como reglas de matching o asignaciones completas.

### Participantes
- **Eventos**: Solo ven eventos donde fueron invitados
- **Detalles de evento**: Sin reglas ni asignaciones
- **Asignaciones**: Solo pueden ver su propia asignación personal (`/me/assignment`)
- **Gestión**: No pueden crear eventos ni modificar participantes

### Organizadores
- **Eventos**: Pueden ver y gestionar sus eventos propios
- **Información completa**: Acceso a reglas, asignaciones y configuración
- **Gestión**: Pueden invitar participantes y generar asignaciones

### Administradores
- **Acceso global**: Ven todos los eventos y usuarios del sistema
- **Dashboard**: Estadísticas administrativas completas
- **Auditoría**: Control total del sistema

### Ejemplos de Filtrado

```javascript
// Participante ve evento limitado
{
  "id": "event-123",
  "name": "Navidad 2024",
  "participants": [...],
  "createdAt": "2024-12-01T...",
  "assignedAt": "2024-12-15T..."
  // Sin rules, sin assignments
}

// Organizador/Admin ve evento completo
{
  "id": "event-123",
  "name": "Navidad 2024",
  "participants": [...],
  "rules": {
    "avoidSameGroup": true,
    "maxShuffleAttempts": 1000
  },
  "assignments": [
    {"giverId": "user1", "receiverId": "user2"}
  ],
  "createdAt": "2024-12-01T...",
  "assignedAt": "2024-12-15T..."
}
```

## Emails y Notificaciones

### Tipos de Email
1. **OTP Verification**: Código de 6 dígitos para verificación de email
2. **Secret Santa Assignment**: Notificación de asignación con nombre del receptor
3. **Event Invitation**: Invitación para unirse a un evento con enlace de verificación

### Plantillas
- Ubicadas en `src/templates/emails/`
- Variables reemplazadas: `{{variable}}`
- En desarrollo: emails se envían a `DEV_EMAIL` si está configurado

### Configuración de Email
- Usa Resend API
- API Key: `RESEND_API_KEY`
- Remitente: `Secret Santa <onboarding@resend.dev>` (desarrollo)

## Webhooks

### Eventos de Webhook
- **event.created**: Cuando se crea un evento
- **assignments.generated**: Cuando se generan asignaciones

### Payload del Webhook
```json
{
  "eventType": "string",
  "data": {
    // Datos específicos del evento
  },
  "timestamp": "string"
}
```

### Configuración
- Webhooks registrados programáticamente
- Soporte para secret de verificación
- Headers: `Content-Type: application/json`, `X-Webhook-Secret` (opcional)

## Manejo de Errores

### Códigos de Estado HTTP
- **200**: OK
- **201**: Created
- **400**: Bad Request (validación fallida)
- **401**: Unauthorized (token inválido)
- **403**: Forbidden (permisos insuficientes)
- **404**: Not Found
- **429**: Too Many Requests (rate limit)
- **500**: Internal Server Error

### Formato de Error
```json
{
  "error": "Mensaje de error descriptivo"
}
```

En desarrollo, incluye stack trace adicional.

## Configuración del Entorno

### Variables de Entorno Requeridas
```env
DATABASE_URL=mysql://user:password@localhost:3306/secret_santa
JWT_SECRET=your_jwt_secret_key
RESEND_API_KEY=your_resend_api_key
```

### Variables Opcionales
```env
PORT=4000
NODE_ENV=development
LOG_LEVEL=info
DEV_EMAIL=user@example.com
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

## Observabilidad y Monitoreo

### Health Checks
La API incluye endpoints de health checks para monitoreo en producción:

#### GET /health (Liveness Probe)
Verifica que el servidor esté ejecutándose.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T18:10:00.000Z"
}
```

#### GET /ready (Readiness Probe)
Verifica que el servidor esté listo para recibir tráfico (base de datos conectada).

**Response (200):**
```json
{
  "status": "ready",
  "timestamp": "2025-11-22T18:10:00.000Z"
}
```

**Response (503 - Service Unavailable):**
```json
{
  "status": "not ready",
  "error": "Database connection failed"
}
```

### Server Timing
La API incluye el middleware `timing` de Hono que agrega headers `Server-Timing` a todas las respuestas HTTP. Estos headers permiten medir el tiempo de respuesta de diferentes partes del procesamiento.

**Headers de ejemplo:**
```
Server-Timing: db;dur=45, algo;dur=120, total;dur=165
```

### Logging
El sistema de logging está configurado para producción:

- **Desarrollo**: Logs coloreados en consola + archivos locales
- **Producción**: Logs JSON estructurados solo en stdout (sin archivos)

**Configuración por entorno:**
```javascript
// En desarrollo: colores + archivos
// En producción: JSON a stdout
```

**Ejemplo de log JSON:**
```json
{
  "level": "info",
  "message": "User registered",
  "service": "secret-santa-api",
  "timestamp": "2025-11-22T18:10:00.000Z",
  "userId": "uuid",
  "email": "user@example.com"
}
```

### Métricas Recomendadas
Para un setup completo de monitoreo en producción, considera:

1. **APM (Application Performance Monitoring)**: DataDog, New Relic
2. **Log Aggregation**: ELK Stack, CloudWatch Logs
3. **Health Checks**: Kubernetes liveness/readiness probes
4. **Metrics**: Response times, error rates, database connections

## Ejemplos de Integración

### Registro y Login
```javascript
// Registro
const register = async (name, email, password) => {
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await response.json();
  if (response.ok) {
    // Esperar OTP
    return data;
  }
  throw new Error(data.error);
};

// Verificar OTP
const verifyOTP = async (email, otp) => {
  const response = await fetch('/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data;
  }
  throw new Error(data.error);
};

// Login
const login = async (email, password) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data;
  }
  throw new Error(data.error);
};

// Verificar token al cargar la app (recomendado)
const verifyToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await fetch('/auth/verify-token', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (response.ok) {
      return data.user; // Token válido
    }
    // Token inválido - limpiar y redirigir
    localStorage.removeItem('token');
    return null;
  } catch (error) {
    // Error de red - mantener token por ahora
    return null;
  }
};
```

### Gestión de Eventos
```javascript
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

// Obtener eventos
const getEvents = async () => {
  const response = await fetch('/events', {
    headers: getAuthHeaders()
  });
  return response.json();
};

// Crear evento
const createEvent = async (name) => {
  const response = await fetch('/events', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name })
  });
  return response.json();
};

// Agregar participante
const addParticipant = async (eventId, participant) => {
  const response = await fetch(`/events/${eventId}/participants`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(participant)
  });
  return response.json();
};

// Generar asignaciones
const generateAssignments = async (eventId) => {
  const response = await fetch(`/events/${eventId}/assignments`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return response.json();
};

// Obtener asignación propia
const getMyAssignment = async () => {
  const response = await fetch('/me/assignment', {
    headers: getAuthHeaders()
  });
  return response.json();
};

// Actualizar evento (CORRECTO)
const updateEvent = async (eventId, newName) => {
  const response = await fetch(`/events/${eventId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name: newName })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};

// ❌ INCORRECTO - No enviar ID en el body
const updateEventWrong = async (eventId, newName) => {
  const response = await fetch('/events', {  // URL incorrecta
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      id: eventId,      // ❌ No enviar ID aquí
      name: newName
    })
  });
  return response.json();
};
```

### Manejo de Errores Global
```javascript
const handleApiError = (error) => {
  // Errores de autenticación - redirigir a login
  if (error.message.includes('Token expired') ||
      error.message.includes('Invalid token') ||
      error.message.includes('Invalid or expired token')) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  // Errores de permisos
  if (error.message.includes('Access denied') ||
      error.message.includes('Forbidden')) {
    alert('No tienes permisos para esta acción');
    return;
  }

  // Errores de recursos no encontrados
  if (error.message.includes('Event not found') ||
      error.message.includes('Participant not found')) {
    alert('El recurso solicitado no existe o no tienes acceso');
    return;
  }

  // Errores de validación
  if (error.message.includes('field1:') ||
      error.message.includes('field2:')) {
    alert('Datos inválidos: ' + error.message);
    return;
  }

  // Errores de rate limiting
  if (error.message.includes('Too many')) {
    alert('Demasiadas solicitudes. Inténtalo de nuevo más tarde.');
    return;
  }

  // Error genérico
  alert('Error inesperado: ' + error.message);
};
```

## Consideraciones de Seguridad

1. **Almacenamiento de Token**: Usar localStorage o secure cookies
2. **Validación**: Siempre validar datos en frontend antes de enviar
3. **Rate Limiting**: Respetar límites de API (ej: OTP cada 15 min)
4. **HTTPS**: Usar HTTPS en producción
5. **CORS**: Configurar CORS apropiadamente
6. **Input Sanitization**: Sanitizar todos los inputs del usuario

## Testing

### Tests Unitarios
- **Framework**: Jest con ts-jest para ES modules
- **Cobertura**: Algoritmo de Secret Santa completamente probado
- **Configuración**: 100% tipado con TypeScript
- **Ejecución**: `npm test` - 5/5 tests pasan

### Ejemplos de Tests
```typescript
import { SecretSantaService } from '../../src/services/SecretSanta.js'
import type { Participant } from '../../src/domain/Participant.js'

describe('SecretSantaService', () => {
  it('should generate valid assignments for 3 participants', () => {
    const service = new SecretSantaService({
      participants: mockParticipants
    })
    const assignments = service.run()
    expect(assignments).toHaveLength(3)
  })
})
```

## Logging y Monitoreo

### Configuración por Entorno
- **Desarrollo**: Logs coloreados en consola + archivos locales (`logs/error.log`, `logs/combined.log`)
- **Producción**: Logs JSON estructurados solo en stdout (compatible con Docker/Kubernetes)

### Niveles de Log
- `error`: Errores críticos
- `warn`: Advertencias
- `info`: Información general (default)
- `debug`: Información detallada para debugging

### Formato JSON (Producción)
```json
{
  "level": "info",
  "message": "Assignments generated",
  "service": "secret-santa-api",
  "timestamp": "2025-11-22T18:10:00.000Z",
  "eventId": "uuid",
  "assignmentsCount": 5
}
```

## Solución de Problemas Comunes

### Error "Event ID required" al editar eventos

**Síntoma:** Al intentar actualizar un evento, recibes el error "Event ID required" aunque estás enviando el ID.

**Causa:** El ID del evento debe ir en la URL, no en el body del request.

**Solución correcta:**
```javascript
// ✅ CORRECTO
const updateEvent = async (eventId, newName) => {
  const response = await fetch(`/events/${eventId}`, {  // ID en la URL
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name: newName })  // Solo name en el body
  });
  return response.json();
};

// ❌ INCORRECTO
const updateEventWrong = async (eventId, newName) => {
  const response = await fetch('/events', {  // URL sin ID
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      id: eventId,      // No enviar ID aquí
      name: newName
    })
  });
  return response.json();
};
```

**Verificación:** Asegúrate de que:
1. La URL sea `/events/{uuid}` (con el ID en la URL)
2. El body solo contenga `{"name": "nuevo nombre"}`
3. Tengas un token JWT válido en el header Authorization

### Error "Access denied" en eventos

**Causa:** Solo el owner del evento o un admin pueden editarlo.

**Solución:** Verifica que el usuario autenticado sea el owner del evento o tenga rol 'admin'.

### Error "Event not found"

**Causa:** El ID del evento no existe o el usuario no tiene acceso.

**Solución:** Verifica que el ID sea un UUID válido y que el usuario tenga permisos para ver ese evento.

Esta guía cubre toda la funcionalidad necesaria para integrar completamente el frontend con la API de Secret Santa.