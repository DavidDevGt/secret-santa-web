# Guía de Roles y Permisos para el Frontend - Secret Santa API

Esta guía explica cómo manejar roles de usuario, permisos y autenticación en el frontend de la aplicación Secret Santa.

## Roles de Usuario

La aplicación tiene tres roles principales con diferentes niveles de permisos:

### 1. PARTICIPANT (Participante)
**Nivel jerárquico:** 1
**Descripción:** Usuario básico que participa en eventos de Secret Santa.

**Permisos:**
- Leer su propio perfil
- Leer su propia asignación de Secret Santa
- Ver eventos en los que participa

**Limitaciones:**
- Solo puede ver información limitada de eventos
- No puede crear o modificar eventos
- No puede gestionar participantes o reglas

### 2. ORGANIZER (Organizador)
**Nivel jerárquico:** 2
**Descripción:** Usuario que puede crear y gestionar sus propios eventos.

**Permisos adicionales a Participant:**
- Crear eventos
- Leer, actualizar y eliminar sus propios eventos
- Gestionar participantes en sus eventos
- Gestionar reglas en sus eventos
- Generar asignaciones en sus eventos
- Leer asignaciones en sus eventos
- Actualizar su propio perfil

**Limitaciones:**
- Solo puede gestionar sus propios eventos
- No puede acceder a eventos de otros organizadores
- No tiene acceso a funciones administrativas

### 3. ADMIN (Administrador)
**Nivel jerárquico:** 3
**Descripción:** Usuario con acceso completo al sistema.

**Permisos adicionales a Organizer:**
- Gestionar todos los eventos del sistema
- Gestionar todos los usuarios
- Acceso al panel de administración
- Ver todos los eventos
- Ver todos los usuarios
- Auditar el sistema
- Acceso a funciones de administrador del sistema

## Autenticación

### JWT Tokens
- Los usuarios se autentican mediante tokens JWT
- El token incluye `userId` y `role`
- Debe enviarse en el header `Authorization: Bearer <token>`

### Endpoints de Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `POST /auth/verify-otp` - Verificación de OTP
- `GET /auth/verify-token` - Verificación de token válido

### Manejo de Tokens en el Frontend
```javascript
// Almacenar token después del login
localStorage.setItem('authToken', response.token);

// Incluir token en todas las peticiones
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
  'Content-Type': 'application/json'
};

// Verificar token al cargar la aplicación
fetch('/auth/verify-token', { headers })
  .then(response => {
    if (response.ok) {
      // Token válido, continuar
      setUser(response.user);
    } else {
      // Token inválido, redirigir a login
      logout();
    }
  });
```

## Permisos por Endpoint

### Eventos
| Endpoint | Método | Rol Mínimo | Descripción |
|----------|--------|------------|-------------|
| `/events` | GET | Authenticated | Lista eventos accesibles |
| `/events` | POST | Organizer | Crear evento |
| `/events/:id` | GET | Authenticated | Ver evento (filtrado por rol) |
| `/events/:id` | PUT | Owner/Admin | Actualizar evento |
| `/events/:id` | DELETE | Owner/Admin | Eliminar evento |

### Participantes
| Endpoint | Método | Rol Mínimo | Descripción |
|----------|--------|------------|-------------|
| `/events/:eventId/participants` | GET | Authenticated | Lista participantes |
| `/events/:eventId/participants` | POST | Owner/Admin | Agregar participante |
| `/events/:eventId/participants/:id` | PUT | Owner/Admin | Actualizar participante |
| `/events/:eventId/participants/:id` | DELETE | Owner/Admin | Eliminar participante |

### Reglas
| Endpoint | Método | Rol Mínimo | Descripción |
|----------|--------|------------|-------------|
| `/events/:eventId/rules` | GET | Owner/Admin | Ver reglas del evento |
| `/events/:eventId/rules` | PUT | Owner/Admin | Actualizar reglas |

### Asignaciones
| Endpoint | Método | Rol Mínimo | Descripción |
|----------|--------|------------|-------------|
| `/events/:eventId/assignments` | GET | Owner/Admin | Ver asignaciones |
| `/events/:eventId/assignments` | POST | Owner/Admin | Generar asignaciones |
| `/me/assignment` | GET | Authenticated | Ver asignación propia |

### Información Personal
| Endpoint | Método | Rol Mínimo | Descripción |
|----------|--------|------------|-------------|
| `/events/:eventId/my-info` | GET | Authenticated | Info del usuario en el evento |

### Administración
| Endpoint | Método | Rol Mínimo | Descripción |
|----------|--------|------------|-------------|
| `/admin/dashboard` | GET | Admin | Panel de administración |
| `/admin/events` | GET | Admin | Todos los eventos |
| `/admin/users` | GET | Admin | Todos los usuarios |

## Lógica de Acceso en el Frontend

### Verificación de Permisos
```javascript
// Función para verificar permisos
function hasPermission(userRole, requiredRole) {
  const hierarchy = {
    'participant': 1,
    'organizer': 2,
    'admin': 3
  };
  return hierarchy[userRole] >= hierarchy[requiredRole];
}

// Función para verificar propiedad
function isOwner(userId, resourceOwnerId) {
  return userId === resourceOwnerId;
}

// Verificar acceso a evento
function canAccessEvent(user, event) {
  if (user.role === 'admin') return true;
  if (event.owner_id === user.id) return true;
  // Verificar si es participante
  return event.participants.some(p => p.email === user.email);
}
```

### Filtrado de UI por Rol
```javascript
// Componente condicional por rol
function AdminOnly({ children, user }) {
  return user.role === 'admin' ? children : null;
}

function OrganizerOnly({ children, user }) {
  return hasPermission(user.role, 'organizer') ? children : null;
}

// En el JSX
<AdminOnly user={currentUser}>
  <AdminPanel />
</AdminOnly>

<OrganizerOnly user={currentUser}>
  <CreateEventButton />
</OrganizerOnly>
```

### Manejo de Errores de Permisos
```javascript
// Manejar respuestas 403
function handleApiError(error, navigate) {
  if (error.status === 403) {
    // Mostrar mensaje de acceso denegado
    showToast('No tienes permisos para esta acción', 'error');
  } else if (error.status === 401) {
    // Token expirado, redirigir a login
    localStorage.removeItem('authToken');
    navigate('/login');
  }
}
```

## Estados de Usuario

### Información del Usuario
```javascript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'participant' | 'organizer' | 'admin';
  email_verified: boolean;
}
```

### Contexto de Autenticación
```javascript
// AuthContext
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  hasRole: (role) => false,
  canAccessEvent: (event) => false
});

// Hook personalizado
function useAuth() {
  const context = useContext(AuthContext);
  return {
    ...context,
    hasRole: (requiredRole) => hasPermission(context.user?.role, requiredRole),
    canAccessEvent: (event) => canAccessEvent(context.user, event)
  };
}
```

## Flujo de Invitación de Usuarios

1. **Invitación**: Los organizadores pueden invitar usuarios a eventos
2. **Registro**: Usuario recibe email con enlace de invitación
3. **Verificación**: Usuario completa registro con OTP
4. **Participación**: Usuario puede acceder al evento como participante

### Endpoint de Invitación
- `POST /auth/invite` - Requiere autenticación de organizador

## Consideraciones de Seguridad

### Validación del Lado del Cliente
- Siempre validar permisos en el frontend
- Pero nunca confiar solo en validaciones del cliente
- El backend siempre valida permisos

### Manejo de Tokens
- Almacenar tokens de forma segura (localStorage/httpOnly cookies)
- Verificar expiración de tokens
- Renovar tokens automáticamente si es necesario

### Protección de Rutas
```javascript
// Route guard
function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !hasPermission(user.role, requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

// Uso
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

## Resumen de Responsabilidades por Rol

### Participant
- ✅ Ver su asignación
- ✅ Ver eventos en los que participa
- ✅ Actualizar su perfil

### Organizer
- ✅ Todo lo de Participant
- ✅ Crear y gestionar sus eventos
- ✅ Gestionar participantes y reglas
- ✅ Generar asignaciones

### Admin
- ✅ Todo lo de Organizer
- ✅ Gestionar todos los eventos y usuarios
- ✅ Acceso a paneles administrativos
- ✅ Funciones de sistema

Esta estructura asegura que cada usuario tenga acceso apropiado a las funcionalidades según su rol, manteniendo la seguridad y usabilidad de la aplicación.