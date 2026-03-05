document.addEventListener('DOMContentLoaded', function() {
    // ====== تكبير وتصغير الخط ======
    let min = 12, max = 28;
    let step = 2;
    let defaultSize = 16;
    let current = parseInt(localStorage.getItem('fontSize')) || defaultSize;
    
    function setFont(size) {
        const tags = ['p','h1','h2','h3','h4','h5','h6','span','a','li','td','th','div','button','label'];
        tags.forEach(tag => {
            document.querySelectorAll(tag).forEach(function(el) {
                // Skip if element is in accessibility toolbar
                if (!el.closest('.accessibility-toolbar')) {
                    el.style.fontSize = size + 'px';
                }
            });
        });
        localStorage.setItem('fontSize', size);
    }
    setFont(current);
    
    let incBtns = document.querySelectorAll('#incFont');
    let decBtns = document.querySelectorAll('#decFont');
    
    incBtns.forEach(function(incBtn) {
        incBtn.onclick = function() {
            if(current < max) {
                current += step;
                setFont(current);
            }
        };
    });
    
    decBtns.forEach(function(decBtn) {
        decBtn.onclick = function() {
            if(current > min) {
                current -= step;
                setFont(current);
            }
        };
    });

    // ====== الوضع الليلي (Dark Mode) ======
    const darkModeBtns = document.querySelectorAll('#darkModeBtn');
    if (darkModeBtns.length > 0) {
        // استعادة الوضع المحفوظ
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
        
        darkModeBtns.forEach(function(darkModeBtn) {
            darkModeBtn.onclick = function() {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDark);
            };
        });
    }

    // ====== القارئ الآلي (Text-to-Speech) ======
    const ttsBtns = document.querySelectorAll('#ttsBtn');
    let isSpeaking = false;
    
    // دالة لإيقاف القراءة
    function stopSpeaking() {
        if (isSpeaking) {
            speechSynthesis.cancel();
            isSpeaking = false;
            ttsBtns.forEach(function(btn) {
                btn.innerHTML = '🔊';
                btn.title = 'تشغيل القارئ الآلي';
            });
        }
    }
    
    // إيقاف القراءة عند مغادرة الصفحة
    window.addEventListener('beforeunload', function() {
        stopSpeaking();
    });
    
    // إيقاف القراءة عند النقر على أي رابط
    document.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            stopSpeaking();
        });
    });
    
    if (ttsBtns.length > 0) {
        
        ttsBtns.forEach(function(ttsBtn) {
            ttsBtn.onclick = function() {
                if (isSpeaking) {
                    // إيقاف القراءة
                    speechSynthesis.cancel();
                    isSpeaking = false;
                    ttsBtn.innerHTML = '🔊';
                    ttsBtn.title = 'تشغيل القارئ الآلي';
                } else {
                    // قراءة محتوى الصفحة (مع استثناء شريط الأدوات)
                    const mainContent = document.querySelector('main') || 
                                      document.querySelector('.container') ||
                                      document.querySelector('.full-screen-card-container') ||
                                      document.querySelector('.main-content') ||
                                      document.body;
                    
                    // استخراج النص مع تجاهل شريط الأدوات
                    let text = '';
                    mainContent.childNodes.forEach(function(node) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            text += node.textContent + ' ';
                        } else if (node.nodeType === Node.ELEMENT_NODE && 
                                   !node.classList.contains('accessibility-toolbar') &&
                                   !node.closest('.accessibility-toolbar')) {
                            text += node.innerText + ' ';
                        }
                    });
                    
                    // قراءة النصوص من العناصر الرئيسية
                    const contentElements = document.querySelectorAll('h1, h2, h3, h4, p, li, td, th, span, div');
                    text = '';
                    contentElements.forEach(function(el) {
                        if (!el.closest('.accessibility-toolbar') && 
                            !el.closest('nav') &&
                            el.innerText.trim() !== '') {
                            text += el.innerText + '. ';
                        }
                    });
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'ar-SA';
                    utterance.rate = 0.9;
                    
                    utterance.onend = function() {
                        isSpeaking = false;
                        speechSynthesis.cancel(); // إيقاف كامل للقارئ
                        ttsBtns.forEach(function(btn) {
                            btn.innerHTML = '🔊';
                            btn.title = 'تشغيل القارئ الآلي';
                        });
                    };
                    
                    speechSynthesis.speak(utterance);
                    isSpeaking = true;
                    ttsBtn.innerHTML = '⏹️';
                    ttsBtn.title = 'إيقاف القارئ الآلي';
                }
            };
        });
    }

    // ====== معالجة نموذج الاتصال ======
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('تم الإرسال!');
            contactForm.reset();
        });
    }
});

