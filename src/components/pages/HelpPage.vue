<template>
  <div class="help-page">
    <div class="page-header">
      <h1>Centro de Ayuda</h1>
    </div>

    <!-- Search -->
    <div class="search-section">
      <div class="search-container">
        <input v-model="searchQuery" type="text" placeholder="Buscar en la ayuda..." class="search-input"
          @input="filterContent" />
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <div class="action-card" @click="scrollToSection('getting-started')">
        <div class="action-icon">🚀</div>
        <h3>Primeros Pasos</h3>
        <p>Aprende lo básico de Secret Santa</p>
      </div>
      <div class="action-card" @click="scrollToSection('managing-events')">
        <div class="action-icon">🎄</div>
        <h3>Gestionar Eventos</h3>
        <p>Crea y administra tus eventos</p>
      </div>
      <div class="action-card" @click="scrollToSection('troubleshooting')">
        <div class="action-icon">🔧</div>
        <h3>Solucionar Problemas</h3>
        <p>Resuelve problemas comunes</p>
      </div>
      <div class="action-card" @click="showContactForm">
        <div class="action-icon">💬</div>
        <h3>Contactar Soporte</h3>
        <p>Obtén ayuda personalizada</p>
      </div>
    </div>

    <div class="help-content">
      <!-- Getting Started -->
      <section id="getting-started" class="help-section">
        <h2>🚀 Primeros Pasos</h2>

        <div class="faq-item">
          <h3>¿Qué es Secret Santa?</h3>
          <p>Secret Santa es un intercambio de regalos donde cada participante es asignado aleatoriamente para comprar
            un regalo para otra persona del grupo. ¡Es una forma divertida de celebrar las fiestas!</p>
        </div>

        <div class="faq-item">
          <h3>¿Cómo crear mi primer evento?</h3>
          <ol>
            <li>Inicia sesión en tu cuenta</li>
            <li>Haz clic en Crear Nuevo Evento en la página de eventos</li>
            <li>Asigna un nombre descriptivo a tu evento</li>
            <li>Invita a los participantes por email</li>
            <li>Configura las reglas opcionales</li>
            <li>Genera las asignaciones cuando todos estén listos</li>
          </ol>
        </div>

        <div class="faq-item">
          <h3>¿Cuántos participantes necesito?</h3>
          <p>Puedes crear eventos con tan solo 2 participantes, pero recomendamos al menos 3 para una experiencia
            óptima.</p>
        </div>
      </section>

      <!-- Managing Events -->
      <section id="managing-events" class="help-section">
        <h2>🎄 Gestionar Eventos</h2>

        <div class="faq-item">
          <h3>¿Cómo invitar participantes?</h3>
          <p>Después de crear un evento, ve a los detalles del evento y haz clic en "Add Participant". Ingresa su nombre
            y email. Recibirán una invitación automática por email.</p>
        </div>

        <div class="faq-item">
          <h3>¿Qué son las reglas de asignación?</h3>
          <p>Las reglas te permiten controlar cómo se hacen las asignaciones:</p>
          <ul>
            <li><strong>Evitar mismo grupo:</strong> Asegura que personas del mismo grupo no se asignen entre sí</li>
            <li><strong>Máximo intentos:</strong> Controla cuántos intentos hace el algoritmo para encontrar
              asignaciones justas</li>
            <li><strong>Evitar asignaciones previas:</strong> Evita repetir asignaciones de años anteriores</li>
          </ul>
        </div>

        <div class="faq-item">
          <h3>¿Cuándo generar las asignaciones?</h3>
          <p>Genera las asignaciones cuando todos los participantes hayan confirmado su asistencia. Una vez generadas,
            se envían emails automáticos con las asignaciones secretas.</p>
        </div>

        <div class="faq-item">
          <h3>¿Puedo modificar un evento después de generar asignaciones?</h3>
          <p>No recomendamos modificar eventos con asignaciones activas, ya que podría comprometer el secreto. Si
            necesitas cambios, considera crear un nuevo evento.</p>
        </div>
      </section>

      <!-- Troubleshooting -->
      <section id="troubleshooting" class="help-section">
        <h2>🔧 Solucionar Problemas</h2>

        <div class="faq-item">
          <h3>No puedo iniciar sesión</h3>
          <div class="troubleshooting-steps">
            <p><strong>Posibles causas:</strong></p>
            <ul>
              <li>Email o contraseña incorrectos</li>
              <li>Cuenta no verificada (revisa tu email)</li>
              <li>Token expirado (intenta iniciar sesión nuevamente)</li>
            </ul>
            <p><strong>Soluciones:</strong></p>
            <ul>
              <li>Verifica tus credenciales</li>
              <li>Revisa tu bandeja de spam por el email de verificación</li>
              <li>Si olvidaste tu contraseña, contacta soporte</li>
            </ul>
          </div>
        </div>

        <div class="faq-item">
          <h3>Los participantes no reciben emails</h3>
          <div class="troubleshooting-steps">
            <p><strong>Verifica:</strong></p>
            <ul>
              <li>Que los emails estén escritos correctamente</li>
              <li>Que no estén en la carpeta de spam</li>
              <li>Que el participante haya aceptado la invitación</li>
            </ul>
            <p><strong>Si el problema persiste:</strong> Contacta soporte con los detalles del evento.</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Contact Support -->
    <div v-if="showContact" class="contact-section">
      <h2>💬 Contactar Soporte</h2>
      <div class="contact-form">
        <p>¿No encontraste lo que buscabas? Envíanos un mensaje y te ayudaremos.</p>
        <form @submit.prevent="submitSupportRequest" class="support-form">
          <div class="form-group">
            <label for="contact-subject">Asunto</label>
            <input id="contact-subject" v-model="contactForm.subject" type="text" required
              placeholder="Breve descripción del problema" />
          </div>
          <div class="form-group">
            <label for="contact-message">Mensaje</label>
            <textarea id="contact-message" v-model="contactForm.message" required rows="5"
              placeholder="Describe tu problema o pregunta en detalle"></textarea>
          </div>
          <div class="form-actions">
            <Button type="submit" :loading="submitting" variant="primary">
              Enviar Mensaje
            </Button>
            <Button type="button" @click="hideContactForm" variant="outline">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/ui/Button.vue';

const router = useRouter();

const searchQuery = ref('');
const showContact = ref(false);
const submitting = ref(false);

const contactForm = ref({
  subject: '',
  message: ''
});

// Filter content based on search
const filterContent = () => {
  const query = searchQuery.value.toLowerCase();
  const sections = document.querySelectorAll('.help-section');

  sections.forEach(section => {
    const sectionTitle = section.querySelector('h2')?.textContent?.toLowerCase() || '';
    const faqItems = section.querySelectorAll('.faq-item');

    let hasVisibleContent = false;
    faqItems.forEach(item => {
      const itemContent = item.textContent?.toLowerCase() || '';
      if (itemContent.includes(query) || sectionTitle.includes(query) || query === '') {
        (item as HTMLElement).style.display = 'block';
        hasVisibleContent = true;
      } else {
        (item as HTMLElement).style.display = 'none';
      }
    });

    (section as HTMLElement).style.display = hasVisibleContent ? 'block' : 'none';
  });
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const showContactForm = () => {
  // Navigate to support page instead of showing inline form
  router.push('/support');
};

const hideContactForm = () => {
  showContact.value = false;
  contactForm.value = { subject: '', message: '' };
};

const submitSupportRequest = async () => {
  if (!contactForm.value.subject.trim() || !contactForm.value.message.trim()) {
    alert('Por favor completa todos los campos');
    return;
  }

  submitting.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert('¡Mensaje enviado! Te responderemos lo antes posible.');
    hideContactForm();
  } catch (error) {
    alert('Error al enviar el mensaje. Inténtalo de nuevo.');
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  // Initialize with all content visible
  filterContent();
});
</script>

<style scoped>
.help-page {
  max-width: var(--max-width-lg);
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.page-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
}

.page-header p {
  color: var(--color-gray-600);
  font-size: var(--font-size-lg);
  margin: 0;
}

.search-section {
  margin-bottom: var(--space-2xl);
  padding: var(--space-xl);
  background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-white) 100%);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.search-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: var(--space-lg) var(--space-2xl);
  border: 2px solid var(--color-gray-200);
  border-radius: 50px;
  font-size: var(--font-size-base);
  background: var(--color-white);
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.search-input::placeholder {
  color: var(--color-gray-400);
  font-style: italic;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);
}

.action-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 140px;
}

.action-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  border-color: var(--color-accent);
}

.action-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-md);
}

.action-card h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
}

.action-card p {
  color: var(--color-gray-600);
  margin: 0;
  font-size: var(--font-size-sm);
}

.help-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4xl);
  margin-bottom: var(--space-4xl);
}

.help-section {
  padding: var(--space-2xl) 0;
}

.help-section h2 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-xl) 0;
  padding-bottom: var(--space-md);
  border-bottom: 2px solid var(--color-gray-100);
}

.faq-item {
  margin-bottom: var(--space-2xl);
}

.faq-item:last-child {
  margin-bottom: 0;
}

.faq-item h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-md) 0;
}

.faq-item p,
.faq-item li {
  color: var(--color-gray-600);
  line-height: 1.6;
  margin: 0 0 var(--space-sm) 0;
}

.faq-item ol,
.faq-item ul {
  margin: var(--space-md) 0;
  padding-left: var(--space-xl);
}

.faq-item li {
  margin-bottom: var(--space-xs);
}

.troubleshooting-steps {
  background: var(--color-gray-50);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-accent);
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.role-card {
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  border: 1px solid var(--color-gray-200);
}

.role-card h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
}

.role-card>p {
  color: var(--color-gray-600);
  margin: 0 0 var(--space-md) 0;
  font-size: var(--font-size-sm);
}

.role-card ul {
  margin: 0;
  padding-left: var(--space-lg);
}

.role-card li {
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-xs);
}

.contact-section {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  margin-top: var(--space-3xl);
}

.contact-section h2 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-lg) 0;
}

.contact-form p {
  color: var(--color-gray-600);
  margin: 0 0 var(--space-xl) 0;
}

.support-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: var(--space-lg);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: var(--space-sm);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-start;
  margin-top: var(--space-xl);
}

/* Responsive */
@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: 1fr;
  }

  .roles-grid {
    grid-template-columns: 1fr;
  }

  .action-card,
  .role-card {
    text-align: left;
  }

  .action-icon {
    text-align: center;
  }

  .help-section {
    padding: var(--space-xl);
  }

  .search-input {
    font-size: var(--font-size-base);
  }
}
</style>