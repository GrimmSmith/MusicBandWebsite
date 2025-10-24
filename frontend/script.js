// Utility: safely update a status box
function updateStatus(element, message, color = '#ccc') {
  if (element) {
    element.textContent = message;
    element.style.color = color;
    element.setAttribute('role', 'status');
    element.focus();
  }
}

// Load tour events dynamically
function loadTourEvents() {
  const tourContainer = document.getElementById('event-list') || document.getElementById('tour-list');
  if (!tourContainer) return;

  fetch('/api/tour-dates')
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(events => {
      tourContainer.innerHTML = '';
      if (!events.length) {
        tourContainer.innerHTML = '<p class="no-events" role="status">No upcoming events at the moment.</p>';
        return;
      }

      events.forEach(event => {
        const card = document.createElement('article');
        card.className = 'event-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Event in ${event.city} on ${event.date}`);
        card.innerHTML = `
          <h3>${event.city || 'Unknown City'}</h3>
          <p><strong>Venue:</strong> ${event.venue || 'TBA'}</p>
          <p><strong>Date:</strong> ${event.date || 'TBA'}</p>
          <p><strong>Time:</strong> ${event.time || 'TBA'}</p>
          ${event.ticketLink ? `<p><a href="${event.ticketLink}" target="_blank" rel="noopener noreferrer">Buy Tickets</a></p>` : ''}
        `;
        tourContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading tour dates:', error);
      tourContainer.innerHTML = '<p class="error" role="alert">Failed to load tour dates. Please try again later.</p>';
    });
}

// Handle contact form submission
function handleContactForm() {
  const contactForm = document.getElementById('contact-form');
  const responseBox = document.getElementById('response');
  if (!contactForm || !responseBox) return;

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    updateStatus(responseBox, 'Sending...');

    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        updateStatus(responseBox, data.message || 'Message sent successfully!', 'lime');
        contactForm.reset();
      })
      .catch(error => {
        console.error('Error sending contact message:', error);
        updateStatus(responseBox, 'Failed to send message. Please try again later.', 'red');
      });
  });
}

// Handle mailing list signup
function handleSubscribeForm() {
  const subscribeForm = document.getElementById('subscribe-form');
  const responseBox = document.getElementById('subscribe-response');
  if (!subscribeForm || !responseBox) return;

  subscribeForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(subscribeForm);
    updateStatus(responseBox, 'Subscribing...');

    fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        updateStatus(responseBox, data.message || 'Thanks for subscribing!', 'lime');
        subscribeForm.reset();
      })
      .catch(error => {
        console.error('Error subscribing:', error);
        updateStatus(responseBox, 'Subscription failed. Try again.', 'red');
      });
  });
}

// Initialize all dynamic features
document.addEventListener('DOMContentLoaded', () => {
  loadTourEvents();
  handleContactForm();
  handleSubscribeForm();
});