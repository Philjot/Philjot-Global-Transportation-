// admin-script.js

// 1. SECURITY CHECK: Run as soon as the page loads
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('philjot_token');
    
    // If no token exists, immediately send them to the login page
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    loadBookings();
});

// 2. THE PDF GENERATOR (Unchanged, just ensuring it looks clean)
async function generateProposal(name, destination, service, date) {
    const price = prompt(`Enter the total quote amount for ${name}:`, "0.00");
    if (price === null) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 31, 63); 
    doc.text("PHILJOT GLOBAL TRANSPORTATION LTD.", 20, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(255, 133, 27); 
    doc.text("Global Standards in Every Mile", 20, 26);
    doc.line(20, 30, 190, 30);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Ref: PGT/PROP/${new Date().getFullYear()}/001`, 20, 46);
    doc.setFont("helvetica", "bold");
    doc.text(`TO: ${name}`, 20, 60);

    const intro = `We are pleased to submit this proposal for your upcoming ${service} to ${destination} on ${new Date(date).toLocaleDateString()}.`;
    doc.text(doc.splitTextToSize(intro, 170), 20, 75);

    doc.setFillColor(244, 247, 249);
    doc.rect(20, 100, 170, 30, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("INVESTMENT SUMMARY", 25, 110);
    doc.setFont("helvetica", "normal");
    doc.text(`Service: ${service}`, 25, 118);
    doc.setFontSize(14);
    doc.setTextColor(0, 31, 63);
    doc.text(`Total Quote: NGN ${price}`, 25, 126);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Head Office: Lagos, Nigeria | bookings@philjotglobal.com", 105, 285, { align: "center" });

    doc.save(`Philjot_Proposal_${name}.pdf`);
}

// 3. THE MAIN DATA LOADER (Updated with Security Headers)
async function loadBookings() {
    const token = localStorage.getItem('philjot_token');

    try {
        const response = await fetch('/api/v1/admin/bookings', {
            headers: {
                'Authorization': `Bearer ${token}` // THE VIP PASS
            }
        });

        // If the token is invalid or expired, kick to login
        if (response.status === 401 || response.status === 403) {
            handleLogout();
            return;
        }

        const bookings = await response.json();
        const tableBody = document.getElementById('bookings-table-body');
        
        // Update Stats
        document.getElementById('total-count').innerText = bookings.length;
        const pending = bookings.filter(b => !b.status || b.status === 'pending').length;
        document.getElementById('pending-count').innerText = pending;

        if (bookings.length > 0) {
            const dates = bookings.map(b => new Date(b.tripDate)).filter(d => d >= new Date());
            if (dates.length > 0) {
                const nextDate = new Date(Math.min(...dates));
                document.getElementById('next-trip').innerText = nextDate.toLocaleDateString();
            } else {
                document.getElementById('next-trip').innerText = "No upcoming trips";
            }
        }

        // Render Table
        tableBody.innerHTML = bookings.map(b => `
            <tr>
                <td>
                    <div style="font-weight: 700; color: #001f3f;">${b.name}</div>
                    <div style="font-size: 0.8rem; color: #666;">${b.email}</div>
                </td>
                <td>${b.service}</td>
                <td><i class="fa-solid fa-location-dot" style="color: #ff851b;"></i> ${b.destination}</td>
                <td>${new Date(b.tripDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                <td>${b.passengers}</td>
                <td><span class="status-pill pending">Pending</span></td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="contactClient('${b.phone}')" class="action-btn" title="WhatsApp Client">
                            <i class="fa-brands fa-whatsapp"></i>
                        </button>
                        <button onclick="generateProposal('${b.name}', '${b.destination}', '${b.service}', '${b.tripDate}')" 
                                class="action-btn" style="background: #001f3f;" title="Download Proposal">
                            <i class="fa-solid fa-file-pdf"></i>
                        </button>
                        <button onclick="removeBooking('${b._id}')" class="action-btn" style="background: #ff4d4d;" title="Delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error("Error loading admin data:", error);
    }
}

// 4. LOGOUT FUNCTION
function handleLogout() {
    localStorage.removeItem('philjot_token');
    window.location.href = 'login.html';
}

// 5. CONTACT CLIENT
function contactClient(phone) {
    window.open(`https://wa.me/${phone}`, '_blank');
}

// 6. DELETE BOOKING (Updated with Security Headers)
async function removeBooking(id) {
    if (!confirm("Do you want to delete this booking?")) return;

    const token = localStorage.getItem('philjot_token');

    try {
        const response = await fetch(`/api/v1/admin/bookings/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Booking removed!");
            loadBookings(); 
        } else {
            alert("Failed to delete. Access denied.");
        }
    } catch (error) {
        console.error("Delete error:", error);
    }
}