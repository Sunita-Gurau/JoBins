import './styles/tailwind.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App);

app.use(router);
// Use plugin defaults (optional)
app.use(setupCalendar, {});

// Use the components
app.component('VCalendar', Calendar);
app.component('VDatePicker', DatePicker);

app.mount('#app');
