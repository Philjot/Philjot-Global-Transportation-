document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Apply it to the date input field
    const datePicker = document.getElementById('tripDate');
    datePicker.setAttribute('min', today);

    //  Set the default value to today
    datePicker.value = today;
    
    const submitBtn = e.target.querySelector('button');
    const originalBtnText = submitBtn.innerHTML; // Save "Book Now" text
    
    // 1. Show Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> Processing...`;

    try {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            service: document.getElementById('serviceType').value,
            passengers: document.getElementById('passengers').value,
            tripDate: document.getElementById('tripDate').value,
            destination: document.getElementById('destination').value
        };

        const response = await fetch('http://localhost:5000/api/v1/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            window.location.href = 'thank-you.html';
        } else {
            const result = await response.json();
            alert("Error: " + result.message);
            // 2. Restore button if there is an error so they can try again
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    } catch (error) {
        alert("Could not connect to server.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});