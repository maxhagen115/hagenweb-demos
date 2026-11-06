// Demo-teller van Hagenweb: meldt een bezoek aan deze demo. Geen cookies, geen persoonsgegevens.
(function () {
  try {
    var ua = navigator.userAgent || ''
    // Bots, linkscanners, de screenshotdienst in de mail en previews in een iframe tellen niet mee.
    if (navigator.webdriver || /bot|crawl|spider|preview|headless|lighthouse|thum\.io|scanner|safelinks/i.test(ua) || window.top !== window) return
    // Eigen bezoek: open een demo een keer met ?intern, dan telt deze browser nooit meer mee.
    if (/[?&]intern\b/.test(location.search)) localStorage.setItem('hagenweb-intern', '1')
    if (localStorage.getItem('hagenweb-intern')) return
    var slug = location.pathname.split('/').filter(Boolean)[0]
    if (!slug) return
    // Pas na 3 seconden zichtbaar op het scherm: een scanner die de pagina alleen ophaalt telt niet.
    setTimeout(function () {
      if (document.visibilityState !== 'visible') return
      fetch('https://pzswgjccuztiylpcqdqf.supabase.co/rest/v1/demo_bezoeken', {
        method: 'POST',
        keepalive: true,
        headers: { apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6c3dnamNjdXp0aXlscGNxZHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTY3NTYsImV4cCI6MjA5MTIzMjc1Nn0.XXt2YmHlUtmb4Eia2exFEi6oYIaGharHxYo6KXYH9TY', Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6c3dnamNjdXp0aXlscGNxZHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTY3NTYsImV4cCI6MjA5MTIzMjc1Nn0.XXt2YmHlUtmb4Eia2exFEi6oYIaGharHxYo6KXYH9TY', 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ slug: slug, user_agent: ua.slice(0, 300) })
      }).catch(function () {})
    }, 3000)
  } catch (e) {}
})()
