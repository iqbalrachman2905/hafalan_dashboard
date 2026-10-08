async function loadSantriDashboard() {
    const listContainer = document.getElementById('mission-list');
    
    // Panggil Endpoint GAS (santri_get_dashboard)
    const res = await fetchAPI('santri_get_dashboard');
    
    if (res.success) {
        // Update Nama & Gamifikasi
        document.getElementById('user-name').innerText = res.nama || 'Santri';
        document.getElementById('stat-level').innerText = res.gamifikasi.level;
        document.getElementById('stat-xp').innerText = `${res.gamifikasi.xp} XP`;
        document.getElementById('stat-streak').innerText = res.gamifikasi.currentStreak;

        // Render Misi Murojaah (Sabaq, Sabqi, Manzil)
        listContainer.innerHTML = ''; 
        const allMissions = [
            ...res.missions.sabaq.map(m => ({...m, type: 'Sabaq'})),
            ...res.missions.sabqi.map(m => ({...m, type: 'Sabqi'})),
            ...res.missions.manzil.map(m => ({...m, type: 'Manzil'}))
        ];

        if (allMissions.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🎉</span>
                    <h3>Ruang masih lapang</h3>
                    <p>Misi murojaah akan muncul di sini.</p>
                </div>
            `;
            return;
        }

        allMissions.forEach(misi => {
            if(misi.completed) return; // Hide jika sudah selesai

            const card = document.createElement('div');
            card.className = 'mission-card';
            card.innerHTML = `
                <div>
                    <span class="subtitle">${misi.type.toUpperCase()} • +${misi.xp} XP</span>
                    <h3 style="margin-top:4px">${misi.surah}</h3>
                    <p class="text-muted" style="font-size:12px">Ayat ${misi.ayatMulai} - ${misi.ayatAkhir}</p>
                </div>
                <button class="btn-primary" onclick="confirmMurojaah('${misi.idMaster}', '${misi.surah}', ${misi.ayatMulai}, ${misi.ayatAkhir}, '${misi.type}')">Mulai</button>
            `;
            listContainer.appendChild(card);
        });
    } else {
        listContainer.innerHTML = `<p style="color:red">${res.message}</p>`;
    }
}

async function confirmMurojaah(idMaster, surah, ayatMulai, ayatAkhir, jenisMisi) {
    // Tombol loading state bisa ditambahkan di sini
    const res = await fetchAPI('santri_confirm_murojaah', {
        data: { idMaster, surah, ayatMulai, ayatAkhir, jenisMisi, kualitas: 'Lancar' }
    });

    if(res.success) {
        alert(res.message); // Notifikasi sukses (+XP)
        loadSantriDashboard(); // Reload data super cepat
    } else {
        alert("Gagal: " + res.message);
    }
}

// Inisialisasi saat script dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadSantriDashboard();
});
