# Plan de Implementación de i18n (ES/EN) - Secret Santa Web

## 🎯 **Objetivo**
Implementar internacionalización completa para soporte de Español e Inglés, permitiendo a los usuarios cambiar entre idiomas dinámicamente.

## 📦 **Tecnologías a Usar**
- **vue-i18n**: Biblioteca oficial para Vue 3
- **Pinia**: Para gestión del estado del idioma (ya está en el proyecto)
- **Composables**: Para lógica de cambio de idioma

## 📋 **Plan de Implementación**

### **Fase 1: Configuración Base** ⚙️

#### 1.1 Instalar Dependencias
```bash
npm install vue-i18n
```

#### 1.2 Crear Estructura de Archivos
```
src/
├── i18n/
│   ├── index.ts                 # Configuración principal
│   ├── locales/
│   │   ├── es.json             # Traducciones español
│   │   └── en.json             # Traducciones inglés
│   └── composables/
│       └── useI18n.ts          # Composables personalizados
```

#### 1.3 Configurar i18n Principal
```typescript
// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'es',
  fallbackLocale: 'es',
  messages: {
    es,
    en
  }
})
```

#### 1.4 Integrar en Main.ts
```typescript
// src/main.ts
import { i18n } from './i18n'

app.use(i18n)
```

### **Fase 2: Archivos de Traducción** 🌍

#### 2.1 Estructura de Traducciones
```json
// src/i18n/locales/es.json
{
  "common": {
    "loading": "Cargando...",
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "edit": "Editar",
    "create": "Crear",
    "back": "Volver",
    "close": "Cerrar"
  },
  "auth": {
    "login": {
      "title": "Iniciar Sesión",
      "email": "Correo electrónico",
      "password": "Contraseña",
      "submit": "Iniciar Sesión",
      "noAccount": "¿No tienes cuenta?",
      "register": "Registrarse"
    }
  },
  "dashboard": {
    "welcome": "¡Bienvenido de vuelta! Aquí tienes un resumen de tus actividades de Secret Santa.",
    "myEvents": "Mis Eventos",
    "quickActions": "Acciones Rápidas"
  }
}
```

```json
// src/i18n/locales/en.json
{
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "back": "Back",
    "close": "Close"
  },
  "auth": {
    "login": {
      "title": "Sign In",
      "email": "Email",
      "password": "Password",
      "submit": "Sign In",
      "noAccount": "Don't have an account?",
      "register": "Sign up"
    }
  },
  "dashboard": {
    "welcome": "Welcome back! Here's an overview of your Secret Santa activities.",
    "myEvents": "My Events",
    "quickActions": "Quick Actions"
  }
}
```

### **Fase 3: Gestión de Estado del Idioma** 🗂️

#### 3.1 Store de Idioma (Pinia)
```typescript
// src/stores/language.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()
  const currentLocale = ref(locale.value)

  const availableLocales = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  const setLocale = (newLocale: string) => {
    locale.value = newLocale
    currentLocale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  const toggleLocale = () => {
    const newLocale = currentLocale.value === 'es' ? 'en' : 'es'
    setLocale(newLocale)
  }

  return {
    currentLocale,
    availableLocales,
    setLocale,
    toggleLocale
  }
})
```

### **Fase 4: Selector de Idioma** 🌐

#### 4.1 Componente LanguageSwitcher
```vue
<!-- src/components/ui/LanguageSwitcher.vue -->
<template>
  <div class="language-switcher">
    <button
      v-for="lang in languages"
      :key="lang.code"
      @click="setLocale(lang.code)"
      :class="{ active: currentLocale === lang.code }"
      class="lang-btn"
    >
      <span class="flag">{{ lang.flag }}</span>
      <span class="name">{{ lang.name }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLanguageStore } from '@/stores/language'

const { currentLocale, availableLocales, setLocale } = useLanguageStore()
const languages = availableLocales
</script>
```

#### 4.2 Integrar en AppLayout
```vue
<!-- src/components/layout/AppLayout.vue -->
<template>
  <!-- ... existing code ... -->
  <div class="right-section">
    <LanguageSwitcher />
    <!-- ... rest of navigation ... -->
  </div>
</template>
```

### **Fase 5: Refactorización de Componentes** 🔄

#### 5.1 Patrón de Uso en Componentes
```vue
<!-- Ejemplo: LoginPage.vue -->
<template>
  <div class="auth-form-wrapper login-page">
    <h2>{{ $t('auth.login.title') }}</h2>
    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="form-group">
        <label for="email">{{ $t('auth.login.email') }}</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          :disabled="loading"
          :placeholder="$t('auth.login.emailPlaceholder')"
        />
      </div>
      <!-- ... -->
    </form>
  </div>
</template>

<script setup lang="ts">
// ... existing code ...
</script>
```

#### 5.2 Composables para i18n
```typescript
// src/i18n/composables/useI18n.ts
import { useI18n } from 'vue-i18n'

export const useAppI18n = () => {
  const { t, tm, rt, d, n, ...rest } = useI18n()

  // Helper functions for common patterns
  const translateWithCount = (key: string, count: number, params?: Record<string, any>) => {
    return t(key, { count, ...params })
  }

  const translateError = (errorKey: string) => {
    return t(`errors.${errorKey}`)
  }

  return {
    ...rest,
    t,
    tm,
    rt,
    d,
    n,
    translateWithCount,
    translateError
  }
}
```

### **Fase 6: Migración Sistemática** 📝

#### 6.1 Orden de Migración por Prioridad
1. **Componentes de Layout** (AppLayout, AuthLayout)
2. **Páginas de Autenticación** (LoginPage, RegisterPage)
3. **Dashboard y Navegación**
4. **Gestión de Eventos** (EventList, EventDetail, etc.)
5. **Componentes de UI** (Button, Modal, etc.)
6. **Mensajes de Error y Estados**

#### 6.2 Script de Migración
```bash
# Buscar todos los textos hardcodeados
grep -r ">[^<]*[A-Za-zÀ-ÿ][^<]*<" src/components/ --include="*.vue"
```

### **Fase 7: Manejo de Casos Especiales** ⚠️

#### 7.1 Textos Dinámicos
```typescript
// Para textos con variables
const message = t('assignment.message', {
  receiverName: assignment.receiverName,
  eventName: assignment.eventName
})
```

#### 7.2 Pluralización
```json
{
  "participants": "participante | participantes",
  "participants_count": "no participants | {count} participant | {count} participants"
}
```

#### 7.3 Fechas y Números
```typescript
// Usar dateTimeFormats y numberFormats de i18n
const formattedDate = d(new Date(), 'short')
const formattedNumber = n(1234, 'currency')
```

### **Fase 8: Testing y QA** ✅

#### 8.1 Tests Unitarios
```typescript
// tests/i18n.spec.ts
describe('i18n', () => {
  it('should translate login title', () => {
    const { t } = useI18n()
    expect(t('auth.login.title')).toBe('Iniciar Sesión')
  })

  it('should change locale', async () => {
    const languageStore = useLanguageStore()
    await languageStore.setLocale('en')
    expect(languageStore.currentLocale).toBe('en')
  })
})
```

#### 8.2 Tests de Integración
- Verificar que todos los textos se traduzcan correctamente
- Probar cambio de idioma en tiempo real
- Validar persistencia del idioma seleccionado

### **Fase 9: Documentación y Mantenimiento** 📚

#### 9.1 Guía para Desarrolladores
```markdown
# Guía de i18n

## Agregar Nuevas Traducciones
1. Agregar la clave en `es.json`
2. Agregar la traducción en `en.json`
3. Usar `$t('ruta.a.la.clave')` en el componente

## Convenciones
- Usar snake_case para las claves
- Agrupar por funcionalidad (auth, dashboard, events, etc.)
- Incluir placeholders como `{name}`, `{count}`
```

#### 9.2 Scripts de Mantenimiento
```json
// package.json
{
  "scripts": {
    "i18n:extract": "vue-i18n-extract",
    "i18n:check": "node scripts/check-translations.js"
  }
}
```

### **Fase 10: Despliegue** 🚀

#### 10.1 Configuración de Producción
- Precargar solo el idioma activo para mejor performance
- Implementar lazy loading de traducciones si es necesario
- Configurar CDN para archivos de traducción

#### 10.2 Monitoreo
- Rastrear uso de idiomas
- Identificar textos faltantes en producción
- Métricas de adopción de idiomas

## 📊 **Estimación de Esfuerzo**

| Fase | Tareas | Tiempo Estimado | Prioridad |
|------|--------|----------------|-----------|
| 1 | Configuración Base | 2-3 horas | Alta |
| 2 | Archivos de Traducción | 4-6 horas | Alta |
| 3 | Gestión de Estado | 2-3 horas | Alta |
| 4 | Selector de Idioma | 2-3 horas | Media |
| 5 | Refactorización (50% componentes) | 8-12 horas | Alta |
| 6 | Migración Completa | 6-8 horas | Media |
| 7 | Casos Especiales | 3-4 horas | Media |
| 8 | Testing | 4-6 horas | Alta |
| 9 | Documentación | 2-3 horas | Media |
| 10 | Despliegue | 2-3 horas | Baja |

**Total Estimado**: 35-51 horas de desarrollo

## 🎯 **Beneficios Esperados**

- ✅ **Accesibilidad Global**: Soporte para usuarios hispanohablantes e ingleses
- ✅ **Mejor UX**: Interfaz nativa en el idioma preferido
- ✅ **Mantenibilidad**: Centralización de textos
- ✅ **Escalabilidad**: Fácil agregar nuevos idiomas
- ✅ **SEO**: Mejor posicionamiento en mercados específicos

## 🔍 **Consideraciones Técnicas**

- **Bundle Size**: ~5-10KB adicional por vue-i18n
- **Performance**: Traducciones en memoria, cambio instantáneo
- **SEO**: Implementar hreflang tags si es necesario
- **RTL**: Preparado para idiomas RTL (árabe, hebreo) si se expanden
- **Fallbacks**: Sistema robusto de fallback a español

---

**Estado del Proyecto**: Listo para implementación inmediata
**Próximos Pasos**: Comenzar con Fase 1 (Configuración Base)