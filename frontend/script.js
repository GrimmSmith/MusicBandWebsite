// Load tour dates dynamically
if (document.getElementById('tour-list')) {
  fetch('/api/tour-dates')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('tour-list');
      list.innerHTML = '';
      data.forEach(date => {
        const li = document.createElement('li');
        li.textContent = `${date.city} - ${date.date}`;
        list.appendChild(li);
      });
    })
    .catch(() => {
      document.getElementById('tour-list').textContent = 'Failed to load tour dates.';
    });
}

// Handle contact form submission
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        document.getElementById('response').textContent = data.message || 'Message sent!';
        form.reset();
      })
      .catch(() => {
        document.getElementById('response').textContent = 'Failed to send message.';
      });
  });
}