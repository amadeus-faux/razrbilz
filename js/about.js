// ============================================
// ABOUT: Typewriter Effect
// ============================================
function typewriterEffect() {
    const textElement = document.getElementById('aboutText');
    const text = textElement.textContent;
    textElement.textContent = '';
    textElement.classList.add('typewriter');
    
    let index = 0;
    
    function type() {
        if (index < text.length) {
            textElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, CONFIG.TYPEWRITER_SPEED);
        }
    }
    
    type();
}

// ============================================
// COMMUNITY UPLINK (FORMSPREE INTEGRATION)
// ============================================

async function handleJoinNetwork(event) {
    event.preventDefault(); // Mencegah reload halaman
    
    const form = document.getElementById('communityForm');
    const btn = document.getElementById('btnJoin');
    const status = document.getElementById('formStatus');
    const emailInput = form.querySelector('input[name="email"]');
    
    // 1. Ubah tampilan tombol jadi Loading
    const originalText = btn.innerText;
    btn.innerText = "[ ESTABLISHING CONNECTION... ]";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    // 2. Kirim Data ke Formspree
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xojvrojk'; 

    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // 3. Sukses
            btn.innerText = "[ UPLINK ESTABLISHED ]";
            btn.style.background = "#00ff00"; // Warna hijau hacker
            btn.style.color = "#000";
            
            status.innerText = "TRANSMISSION RECEIVED. WELCOME TO THE NETWORK.";
            status.style.color = "#00ff00";
            status.style.display = "block";
            
            emailInput.value = ""; // Bersihkan input
            
            // Reset tombol setelah 3 detik
            setTimeout(() => {
                btn.innerText = "[ INITIATE UPLINK ]";
                btn.style.background = "#fff";
                btn.style.color = "#000";
                btn.disabled = false;
                btn.style.opacity = "1";
                status.style.display = "none";
            }, 5000);
            
        } else {
            // Gagal (Response Error)
            throw new Error('Server rejected connection');
        }
    } catch (error) {
        // 4. Error (Internet mati / Salah URL)
        btn.innerText = "[ CONNECTION FAILED ]";
        btn.style.background = "#ff0000"; // Merah
        btn.style.color = "#fff";
        
        status.innerText = "ERROR: SIGNAL LOST. CHECK YOUR NETWORK.";
        status.style.color = "#ff0000";
        status.style.display = "block";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "#fff";
            btn.style.color = "#000";
            btn.disabled = false;
            btn.style.opacity = "1";
            status.style.display = "none";
        }, 3000);
    }
}