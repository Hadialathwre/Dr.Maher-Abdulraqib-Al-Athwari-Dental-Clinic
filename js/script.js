  const WA_NUMBER = "967735943854"; // 967 كود اليمن + الرقم بدون صفر

  /* ---- Header shrink on scroll ---- */
  const siteHeader = document.getElementById('siteHeader');
  function handleHeaderScroll(){
    if(window.scrollY > 12){ siteHeader.classList.add('scrolled'); }
    else{ siteHeader.classList.remove('scrolled'); }
  }
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll, { passive:true });

  /* ---- Burger menu ---- */
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinks = document.querySelector('nav.links');

  burgerBtn.addEventListener('click', function(){
    const isOpen = navLinks.classList.toggle('open');
    burgerBtn.classList.toggle('open', isOpen);
    burgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(link=>{
    link.addEventListener('click', ()=>{
      navLinks.classList.remove('open');
      burgerBtn.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('resize', function(){
    if(window.innerWidth > 920){
      navLinks.classList.remove('open');
      burgerBtn.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- Active nav link on scroll ---- */
  const navAnchors = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
  const trackedSections = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if('IntersectionObserver' in window && trackedSections.length){
    const navObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const id = '#' + entry.target.id;
          navAnchors.forEach(a=>{
            a.classList.toggle('active', a.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    trackedSections.forEach(sec => navObserver.observe(sec));
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---- Back to top ---- */
  const topBtn = document.getElementById('topBtn');
  window.addEventListener('scroll', function(){
    topBtn.classList.toggle('show', window.scrollY > 500);
  }, { passive:true });
  topBtn.addEventListener('click', function(){
    window.scrollTo({ top:0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  /* ---- Booking form ---- */
  const form = document.getElementById('bookingForm');
  const statusMsg = document.getElementById('statusMsg');
  const requiredFields = ['name','phone','age','service','date','time'];

  const dateInput = document.getElementById('date');
  const todayStr = new Date().toISOString().split('T')[0];
  dateInput.min = todayStr;

  requiredFields.forEach(id=>{
    document.getElementById(id).addEventListener('input', function(){
      this.classList.remove('field-error');
    });
    document.getElementById(id).addEventListener('change', function(){
      this.classList.remove('field-error');
    });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();

    let valid = true;
    requiredFields.forEach(id=>{
      const el = document.getElementById(id);
      if(!el.value){
        el.classList.add('field-error');
        valid = false;
      } else {
        el.classList.remove('field-error');
      }
    });
    if(!valid){
      statusMsg.textContent = 'يرجى تعبئة جميع الحقول المطلوبة قبل الإرسال.';
      statusMsg.classList.add('show');
      return;
    }

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const age = document.getElementById('age').value.trim();
    const service = document.getElementById('service').value;
    const doctor = document.getElementById('doctor').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const notes = document.getElementById('notes').value.trim();

    let message = "مرحباً، أرغب في حجز موعد في عيادة الدكتور ماهر عبدالرقيب الأثوري لطب الأسنان:\n";
    message += "— الاسم: " + name + "\n";
    message += "— رقم الهاتف: " + phone + "\n";
    message += "— عمر المريض: " + age + "\n";
    message += "— الخدمة: " + service + "\n";
    if(doctor){ message += "— الطبيب المفضل: " + doctor + "\n"; }
    message += "— التاريخ المفضل: " + date + "\n";
    message += "— الوقت المفضل: " + time + "\n";
    if(notes){ message += "— ملاحظات: " + notes + "\n"; }

    const url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(url, '_blank');

    statusMsg.textContent = 'تم تجهيز رسالتك — تحقق من نافذة واتساب الجديدة لإتمام الإرسال.';
    statusMsg.classList.add('show');
  });
