async function fetchAPI(action, payload = {}) {
    const token = localStorage.getItem('authToken');
    const requestBody = {
        action: action,
        token: token,
        requestId: Date.now() + Math.random().toString(36).substring(2), // Idempotency key
        ...payload
    };

    try {
        const response = await fetch(APP_CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        if (!data.success && data.unauthorized) {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html'; // Redirect jika sesi habis
        }
        return data;
    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: 'Koneksi jaringan terputus' };
    }
}
