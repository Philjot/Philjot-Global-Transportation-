// admin-script.js

// 1. THE PDF GENERATOR (With Price Prompt)
async function generateProposal(name, destination, service, date) {
    const price = prompt(`Enter the total quote amount for ${name}:`, "0.00");
    if (price === null) return; // Exit if they hit cancel

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Branding & Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 31, 63); // Navy
    doc.text("PHILJOT GLOBAL TRANSPORTATION LTD.", 20, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(255, 133, 27); // Orange
    doc.text("Global Standards in Every Mile", 20, 26);
    doc.line(20, 30, 190, 30);

    // Document Info
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Ref: PGT/PROP/${new Date().getFullYear()}/001`, 20, 46);
    doc.setFont("helvetica", "bold");
    doc.text(`TO: ${name}`, 20, 60);

    // Content
    doc.setFont("helvetica", "normal");
    const intro = `We are pleased to submit this proposal for your upcoming ${service} to ${destination} on ${new Date(date).toLocaleDateString()}.`;
    doc.text(doc.splitTextToSize(intro, 170), 20, 75);

    // Price Box
    doc.setFillColor(244, 247, 249);
    doc.rect(20, 100, 170, 30, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("INVESTMENT SUMMARY", 25, 110);
    doc.setFont("helvetica", "normal");
    doc.text(`Service: ${service}`, 25, 118);
    doc.setFontSize(14);
    doc.setTextColor(0, 31, 63);
    doc.text(`Total Quote: NGN ${price}`, 25, 126);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Head Office: Lagos, Nigeria | bookings@philjotglobal.com", 105, 285, { align: "center" });

    doc.save(`Philjot_Proposal_${name}.pdf`);
}

// 2. THE MAIN DATA LOADER
async function loadBookings() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/admin/bookings');
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

        // Render Table with both WhatsApp and PDF buttons
        tableBody.innerHTML = bookings.map(b => `
            <tr>
                <td>
                    <div style="font-weight: 700; color: var(--primary);">${b.name}</div>
                    <div style="font-size: 0.8rem; color: #666;">${b.email}</div>
                </td>
                <td>${b.service}</td>
                <td><i class="fa-solid fa-location-dot" style="color: var(--accent);"></i> ${b.destination}</td>
                <td>${new Date(b.tripDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                <td>${b.passengers}</td>
                <td><span class="status-pill pending">Pending</span></td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="contactClient('${b.phone}')" class="action-btn" title="WhatsApp Client">
                            <i class="fa-brands fa-whatsapp"></i>
                        </button>
                        <button onclick="generateProposal('${b.name}', '${b.destination}', '${b.service}', '${b.tripDate}')" 
                                class="action-btn" style="background: var(--primary);" title="Download Proposal">
                            <i class="fa-solid fa-file-pdf"></i>
                        </button>
                        <button onclick="removeBooking('${b._id}')" class="action-btn" style="background: #ff4d4d;">
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>
                
                    
                    
            
            </tr>
        `).join('');

    } catch (error) {
        console.error("Error loading admin data:", error);
        document.getElementById('next-trip').innerText = "Error loading";
    }
}

function contactClient(phone) {
    window.open(`https://wa.me/${phone}`, '_blank');
}

loadBookings();

async function removeBooking(id) {
    if (!confirm("Do you want to delete this booking?")) return;

    try {
        const response = await fetch(`http://localhost:5000/api/v1/admin/bookings/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert("Booking removed!");
            loadBookings(); // Refresh the table
        } else {
            alert("Failed to delete.");
        }
    } catch (error) {
        console.error("Delete error:", error);
    }
}

