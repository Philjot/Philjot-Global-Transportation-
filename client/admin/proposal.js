async function generateProposal(name, destination, service, date, price = "TBD") {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1. Header & Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 31, 63); // Philjot Navy
    doc.text("PHILJOT GLOBAL TRANSPORTATION LTD.", 20, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(255, 133, 27); // Philjot Orange
    doc.text("Global Standards in Every Mile", 20, 26);
    
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30); // Horizontal Line

    // 2. Client & Ref Info
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Ref: PGT/PROP/${new Date().getFullYear()}/001`, 20, 46);

    doc.setFont("helvetica", "bold");
    doc.text(`TO: ${name}`, 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text("SUBJECT: FORMAL PROPOSAL FOR INTEGRATED TRANSPORT SERVICES", 20, 70);

    // 3. The Body Text
    const body = `We are pleased to submit this proposal for your upcoming ${service} to ${destination}. 
At Philjot Global, we prioritize your safety and comfort through our P.I.L.O.T values.`;
    
    doc.text(doc.splitTextToSize(body, 170), 20, 80);

    // 4. Quote Table Box
    doc.setFillColor(244, 247, 249);
    doc.rect(20, 100, 170, 30, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("SERVICE DETAILS", 25, 110);
    doc.setFont("helvetica", "normal");
    doc.text(`Destination: ${destination}`, 25, 118);
    doc.text(`Investment Quote: NGN ${price}`, 25, 126);

    // 5. Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Head Office: Lagos, Nigeria | bookings@philjotglobal.com | www.philjotglobal.com", 105, 285, { align: "center" });

    // Save the PDF
    doc.save(`Philjot_Proposal_${name}.pdf`);
}