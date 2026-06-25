/* ============================================================
   js/script.js
   Portal Sistem Informasi Akademik - KuliahTI
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ---------- 1. INISIALISASI LUCDIE ICONS ----------
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ---------- 2. INTERSECTION OBSERVER UNTUK ANIMASI FADE-IN ----------
    // Ambil semua elemen dengan class .fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Jika ada elemen dengan class fade-in, kita set opacity awal dan animasi
    fadeElements.forEach(el => {
        // Set opacity 0 sebagai default (kecuali sudah diatur inline)
        if (!el.style.opacity) {
            el.style.opacity = '0';
        }
        if (!el.style.transform) {
            el.style.transform = 'translateY(30px)';
        }
        el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.9, 0.3, 1)';
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // ---------- 3. FUNGSI SEARCH (jika ada di halaman materi.html) ----------
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            const term = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.course-card, .modern-card');
            
            let found = false;
            cards.forEach(card => {
                const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                if (title.includes(term)) {
                    card.style.display = 'block';
                    found = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // Tampilkan pesan jika tidak ada hasil
            const noResult = document.getElementById('noResult');
            if (noResult) {
                if (!found && term !== '') {
                    noResult.classList.remove('d-none');
                } else {
                    noResult.classList.add('d-none');
                }
            }
        });
    }

    // ---------- 4. NAVBAR SHADOW SAAT SCROLL (opsional) ----------
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // ---------- 5. SMOOTH SCROLL UNTUK LINK ANCHOR (opsional) ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 70; // kompensasi navbar sticky
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- 6. AKTIFKAN MENU NAVBAR BERDASARKAN SCROLL (SCROLL SPY) ----------
    // Fungsi ini sudah ada di inline script index.html, 
    // tapi kita pindahkan ke sini agar lebih rapi
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-item');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            const scrollY = window.scrollY;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ---------- 7. COUNTER ANIMASI (UNTUK STATISTIK DI BERANDA) ----------
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (isNaN(target)) return;
            
            const duration = 2000;
            const step = Math.max(1, Math.floor(target / 60));
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current >= target) {
                    stat.textContent = target;
                    return;
                }
                stat.textContent = current;
                requestAnimationFrame(updateCounter);
            };

            setTimeout(() => {
                updateCounter();
            }, 200);
        });
    }

    // Jalankan counter ketika section statistik terlihat
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // ---------- 8. BACK TO TOP (opsional) ----------
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});