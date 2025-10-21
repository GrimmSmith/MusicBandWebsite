// Load tour events dynamically with enhanced layout
const tourContainer = document.getElementById('event-list') || document.getElementById('tour-list');
if (tourContainer) {
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

// Handle contact form submission with feedback and accessibility
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const responseBox = document.getElementById('response');
    responseBox.textContent = 'Sending...';
    responseBox.style.color = '#ccc';
    responseBox.setAttribute('role', 'status');

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
        responseBox.textContent = data.message || 'Message sent successfully!';
        responseBox.style.color = 'lime';
        contactForm.reset();
        responseBox.focus();
      })
      .catch(error => {
        console.error('Error sending contact message:', error);
        responseBox.textContent = 'Failed to send message. Please try again later.';
        responseBox.style.color = 'red';
        responseBox.focus();
      });
  });
}