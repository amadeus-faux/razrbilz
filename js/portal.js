// ============================================
// PORTAL: Entry Animation
// ============================================
function enterSite() {
    const portal = document.getElementById('portal');
    
    // Fade out portal without glitch effect
    portal.style.transition = 'opacity 0.5s ease';
    portal.style.opacity = '0';
    
    setTimeout(() => {
        portal.classList.add('hidden');
        portal.style.opacity = '1';
        navigate('archive');
    }, 500);
}
