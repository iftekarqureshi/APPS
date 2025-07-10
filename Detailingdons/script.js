function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username && password) {
    localStorage.setItem('dd_user', username);
    document.getElementById('user-name').innerText = username;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    loadCars();
    checkWarranties();
  } else {
    alert("Please enter both ID and password.");
  }
}

function logout() {
  localStorage.removeItem('dd_user');
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

document.getElementById('car-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const reader = new FileReader();
  const file = document.getElementById('car-image').files[0];

  reader.onload = function () {
    const car = {
      id: Date.now(),
      number: document.getElementById('car-number').value,
      color: document.getElementById('car-color').value,
      make: document.getElementById('car-make').value,
      model: document.getElementById('car-model').value,
      service: document.getElementById('car-service').value,
      serviceDate: document.getElementById('service-date').value,
      warranty: document.getElementById('warranty-expiry').value,
      image: reader.result || null,
    };

    const cars = JSON.parse(localStorage.getItem('dd_cars') || '[]');
    cars.push(car);
    localStorage.setItem('dd_cars', JSON.stringify(cars));

    document.getElementById('car-form').reset();
    loadCars();
    checkWarranties();
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();
});

function deleteCar(id) {
  let cars = JSON.parse(localStorage.getItem('dd_cars') || '[]');
  cars = cars.filter(car => car.id !== id);
  localStorage.setItem('dd_cars', JSON.stringify(cars));
  loadCars();
  checkWarranties();
}

function loadCars() {
  const carList = document.getElementById('car-list');
  carList.innerHTML = '';
  const cars = JSON.parse(localStorage.getItem('dd_cars') || '[]');

  cars.forEach(car => {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
      <strong>${car.number}</strong> - ${car.make} ${car.model} (${car.color})<br>
      Service: ${car.service}<br>
      Date: ${car.serviceDate}<br>
      Warranty Expires: ${car.warranty || 'N/A'}<br>
      <button onclick="deleteCar(${car.id})" style="margin-top:5px; background:#dc3545; color:white">Delete</button>
    `;

    if (car.image) {
      const img = document.createElement('img');
      img.src = car.image;
      card.appendChild(img);
    }

    carList.appendChild(card);
  });
}

function checkWarranties() {
  const cars = JSON.parse(localStorage.getItem('dd_cars') || '[]');
  const now = new Date();
  const upcoming = cars.filter(car => {
    if (!car.warranty) return false;
    const expiry = new Date(car.warranty);
    const diff = (expiry - now) / (1000 * 60 * 60 * 24);
    return diff <= 15 && diff >= 0;
  });

  const notifBox = document.getElementById('notifications');
  const notifList = document.getElementById('notification-list');
  notifList.innerHTML = '';

  if (upcoming.length > 0) {
    notifBox.classList.remove('hidden');
    upcoming.forEach(car => {
      const li = document.createElement('li');
      li.textContent = `Warranty for ${car.number} (${car.service}) expires on ${car.warranty}`;
      notifList.appendChild(li);
    });
  } else {
    notifBox.classList.add('hidden');
  }
}

window.onload = () => {
  const user = localStorage.getItem('dd_user');
  if (user) {
    document.getElementById('user-name').innerText = user;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    loadCars();
    checkWarranties();
  }
};
