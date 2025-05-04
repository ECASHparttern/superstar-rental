const form = document.getElementById('rentalForm');
    const customersDiv = document.getElementById('customers');
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];

    function renderRentals() {
      customersDiv.innerHTML = '';
      rentals.forEach((rental, index) => {
        const days = rental.settled ? rental.days : calculateDays(rental.rentalDate);
        const total = rental.settled ? rental.totalAmount : rental.amount * days;

        const card = document.createElement('div');
        card.className = 'customer-card';
        card.innerHTML = `
          <strong>Name:</strong> ${rental.name}<br>
          <strong>Phone:</strong> ${rental.phone}<br>
          <strong>Property:</strong> ${rental.property} (${rental.size})<br>
          <strong>Rental Date:</strong> ${rental.rentalDate}<br>
          <strong>Days Rented:</strong> ${days}<br>
          <strong>Total Amount:</strong> N${total.toFixed(2)}<br>
          <img src="${rental.picture}" alt="Property Image"><br>
          <div class="actions">
            <button onclick="settleRental(${index})" ${rental.settled ? 'disabled' : ''}>
              ${rental.settled ? 'Settled' : 'Settle'}
            </button>
            <button onclick="deleteRental(${index})">Delete</button>
          </div>
        `;
        customersDiv.appendChild(card);
      });
    }

    function calculateDays(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  const diff = now - start;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days >= 1 ? days : 1; // Minimum 1 day
    }

    function settleRental(index) {
      const rental = rentals[index];
      rental.settled = true;
      rental.days = calculateDays(rental.rentalDate);
      rental.totalAmount = rental.amount * rental.days;
      localStorage.setItem('rentals', JSON.stringify(rentals));
      renderRentals();
    }

    function deleteRental(index) {
      if (confirm("Are you sure you want to delete this rental?")) {
        rentals.splice(index, 1);
        localStorage.setItem('rentals', JSON.stringify(rentals));
        renderRentals();
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const reader = new FileReader();
      const file = document.getElementById('picture').files[0];

      reader.onloadend = () => {
        const newRental = {
          name: document.getElementById('name').value,
          phone: document.getElementById('phone').value,
          amount: parseFloat(document.getElementById('amount').value),
          property: document.getElementById('property').value,
          size: document.getElementById('size').value,
          rentalDate: document.getElementById('rentalDate').value,
          picture: reader.result,
          settled: false
        };

        rentals.push(newRental);
        localStorage.setItem('rentals', JSON.stringify(rentals));
        form.reset();
        renderRentals();
      };

      if (file) reader.readAsDataURL(file);
    });

    // Initial render
    renderRentals();
