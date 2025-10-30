document.addEventListener("DOMContentLoaded", () => {

    // === REAL-TIME LAST UPDATE FUNCTIONALITY ===
    function updateLastUpdateTime() {
        const now = new Date();
        const options = { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = now.toLocaleDateString('en-GB', options);
        }
    }

    // Update timestamp saat page load
    updateLastUpdateTime();

    // Update otomatis setiap 1 detik untuk menunjukkan waktu real-time
    setInterval(updateLastUpdateTime, 1000);

    // Update timestamp saat file CSV di-upload
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                // Proses file CSV di sini...
                console.log('File uploaded:', e.target.files[0].name);
                
                // Update timestamp setelah file berhasil di-upload
                updateLastUpdateTime();
                
                // Tampilkan notifikasi (optional)
                showUploadNotification();
            }
        });
    }

    // Fungsi notifikasi upload (optional)
    function showUploadNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        notification.textContent = 'Data updated successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // === 1. DATA AND CHART INITIALIZATION (Placeholder) ===
    if (typeof initPLSummaryChart === 'function') initPLSummaryChart();
    if (typeof initPLPerProductChart === 'function') initPLPerProductChart();
    if (typeof initPLDeviationChart === 'function') initPLDeviationChart();
    if (typeof initCustomerPieChart === 'function') initCustomerPieChart();
    if (typeof populatePLProductTable === 'function') populatePLProductTable();

    // === 2. SIDEBAR NAVIGATION LOGIC ===
    const commercialToggle = document.getElementById("commercialToggle");
    const commercialSubmenu = document.getElementById("commercialSubmenu");
    const commercialIcon = commercialToggle ? commercialToggle.querySelector("svg") : null;
    
    const tabButtons = document.querySelectorAll('#sidebarNav .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Inisialisasi: Default tab yang aktif adalah P/L
    const defaultTabId = 'pl';
    
    /**
     * Mengubah tampilan konten dan status tombol sidebar
     * @param {string} tabId - ID tab yang akan ditampilkan (e.g., 'pl', 'operation')
     */
    const switchTab = (tabId) => {
        // Sembunyikan semua konten dan hapus status 'active' dari tombol
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });

        tabButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-gray-100');
            // Menghapus gaya khusus untuk Commercial Toggle
            if (btn.id !== 'commercialToggle') {
                btn.classList.remove('font-semibold');
                btn.classList.add('font-medium', 'text-gray-700', 'hover:bg-gray-100');
            }
        });
        
        // Atur konten target menjadi aktif
        const targetContent = document.getElementById(`tab-${tabId}`);
        if (targetContent) {
            targetContent.classList.remove('hidden');
        }

        // Atur tombol target menjadi aktif
        const activeButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (activeButton) {
            activeButton.classList.add('active', 'bg-gray-100');
            activeButton.classList.remove('font-medium', 'text-gray-700', 'hover:bg-gray-100');
        }
        
        // Pastikan Commercial Toggle tetap aktif jika sub-menu yang dipilih
        if (['pl', 'salesfunnel'].includes(tabId)) {
            if (commercialToggle) {
                commercialToggle.classList.add('active', 'bg-gradient-to-r', 'from-[#001f3f]/80', 'to-[#b71c1c]/80', 'text-white');
                commercialIcon.classList.add('rotate-180');
                commercialSubmenu.classList.remove('hidden');
            }
        } else {
             if (commercialToggle) {
                commercialToggle.classList.remove('active', 'bg-gradient-to-r', 'from-[#001f3f]/80', 'to-[#b71c1c]/80', 'text-white');
                commercialToggle.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
             }
        }
    };

    // Event Listener untuk Commercial Toggle
    if(commercialToggle) {
        commercialToggle.addEventListener("click", () => {
            commercialSubmenu.classList.toggle("hidden");
            commercialIcon.classList.toggle("rotate-180");
        });
    }

    // Event Listener untuk Navigasi Tab
    tabButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const tabId = e.currentTarget.getAttribute("data-tab");
            switchTab(tabId);
            
            if (e.currentTarget.id === 'commercialToggle') {
                if (!commercialSubmenu.classList.contains('hidden')) {
                    // Sub-menu dibuka
                } else {
                    switchTab(defaultTabId); 
                }
            }
        });
    });

    // Inisialisasi default tab
    switchTab(defaultTabId);
    
    // === 4. EXPORT LOGIC ===
    const exportPLPdfBtn = document.getElementById('exportPLPdf');
    if (exportPLPdfBtn) {
        exportPLPdfBtn.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.text("P/L Analysis — YTD September 2025", 14, 10);
            
            // Mengambil data tabel P/L per produk
            const tableData = plProductData.map(item => [
                item.produk,
                formatCurrency(item.revenue),
                formatCurrency(item.cost),
                formatCurrency(item.pl)
            ]);
            
            doc.autoTable({
                head: [['Produk', 'Revenue (M)', 'Cost (M)', 'P/L (M)']],
                body: tableData,
                startY: 20
            });
            
            doc.save('PL_Analysis_YTD_Sept_2025.pdf');
        });
    }
});