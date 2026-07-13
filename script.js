(function () {
  // ---------- DAFTAR LAGU ----------
  // Tambah / hapus / urutkan item di sini sesuai isi folder assets/.
  const TRACKS = [
    { file: 'assets/1__True_-_2003_Remaster.mp3', title: 'True (2003 Remaster)' },
    { file: 'assets/2__Can_t_Take_My_Eyes_off_You.mp3', title: "Can't Take My Eyes off You" },
    { file: 'assets/3__Enchanted.mp3', title: 'Enchanted' },
    { file: 'assets/4__There_She_Goes.mp3', title: 'There She Goes' },
    { file: 'assets/5__Just_the_Way_You_Are.mp3', title: 'Just the Way You Are' },
    { file: 'assets/6__Somethin__Stupid.mp3', title: "Somethin' Stupid" },
    { file: 'assets/7__Baby_I_m_Yours.mp3', title: "Baby I'm Yours" },
    { file: 'assets/8__An_Art_Gallery_Could_Never_Be_As_Unique_As_You.mp3', title: 'An Art Gallery Could Never Be As Unique As You' },
    { file: 'assets/9__I_Will_-_Remastered_2009.mp3', title: 'I Will (Remastered 2009)' },
    { file: 'assets/10__Semua_lagu_cinta.mp3', title: 'Semua Lagu Cinta' },
    { file: 'assets/11__Mata_Ke_Hati__Acoustic_Version_.mp3', title: 'Mata Ke Hati (Acoustic Version)' },
    { file: 'assets/12__Film_Favorit.mp3', title: 'Film Favorit' },
    { file: 'assets/13__Timur.mp3', title: 'Timur' },
    { file: 'assets/14__Sssst___.mp3', title: 'Sssst...' },
    { file: 'assets/15__Pastikan_Riuh_Akhiri_Malammu.mp3', title: 'Pastikan Riuh Akhiri Malammu' },
    { file: 'assets/16__semua_lagu_cinta_terdengar_sama.mp3', title: 'Semua Lagu Cinta Terdengar Sama' }
  ];

  const audio = document.getElementById('audio');
  const btnPlay = document.getElementById('btnPlay');
  const btnStop = document.getElementById('btnStop');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const counter = document.getElementById('counter');
  const trackName = document.getElementById('trackName');
  const trackIndex = document.getElementById('trackIndex');
  const sideTag = document.getElementById('sideTag');
  const progressTrack = document.getElementById('progressTrack');
  const progressFill = document.getElementById('progressFill');
  const reelLeft = document.getElementById('reelLeft');
  const reelRight = document.getElementById('reelRight');
  const coilLeft = reelLeft.querySelector('.tape-coil');
  const coilRight = reelRight.querySelector('.tape-coil');
  const volume = document.getElementById('volume');
  const vuRow = document.getElementById('vuRow');
  const playlistItemsEl = document.getElementById('playlistItems');

  audio.volume = parseFloat(volume.value);

  let currentIndex = 0;
  let wasPlayingBeforeLoad = false;

  // ---------- Bangun daftar playlist di UI ----------
  const itemEls = TRACKS.map((track, i) => {
    const el = document.createElement('div');
    el.className = 'playlist-item';
    el.innerHTML =
      '<span class="num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="pname">' + track.title + '</span>' +
      '<span class="note">♪</span>';
    el.addEventListener('click', () => loadTrack(i, true));
    playlistItemsEl.appendChild(el);
    return el;
  });

  // ---------- Bangun bar VU meter ----------
  const BAR_COUNT = 20;
  const bars = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    const b = document.createElement('div');
    b.className = 'vu-bar';
    vuRow.appendChild(b);
    bars.push(b);
  }

  function fmt(t) {
    if (!isFinite(t)) return '00:00';
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return m + ':' + s;
  }

  function setSpinning(on) {
    reelLeft.classList.toggle('spin', on);
    reelRight.classList.toggle('spin', on);
  }

  function loadTrack(index, autoplay) {
    currentIndex = (index + TRACKS.length) % TRACKS.length;
    const track = TRACKS[currentIndex];

    audio.src = track.file;
    trackName.textContent = track.title;
    trackIndex.textContent = 'TRACK ' + String(currentIndex + 1).padStart(2, '0') + '/' + String(TRACKS.length).padStart(2, '0');
    sideTag.textContent = currentIndex < TRACKS.length / 2 ? '— side a —' : '— side b —';
    progressFill.style.width = '0%';
    counter.textContent = '00:00';
    coilLeft.style.width = '52px'; coilLeft.style.height = '52px';
    coilRight.style.width = '14px'; coilRight.style.height = '14px';

    itemEls.forEach((el, i) => el.classList.toggle('active', i === currentIndex));
    itemEls[currentIndex].scrollIntoView({ block: 'nearest' });

    if (autoplay) {
      audio.play().then(() => {
        setSpinning(true);
        btnPlay.textContent = '❚❚';
      }).catch(() => {
        setSpinning(false);
        btnPlay.textContent = '▶';
      });
    } else {
      setSpinning(false);
      btnPlay.textContent = '▶';
    }
  }

  btnPlay.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      setSpinning(true);
      btnPlay.textContent = '❚❚';
    } else {
      audio.pause();
      setSpinning(false);
      btnPlay.textContent = '▶';
    }
  });

  btnStop.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    setSpinning(false);
    btnPlay.textContent = '▶';
  });

  btnPrev.addEventListener('click', () => loadTrack(currentIndex - 1, true));
  btnNext.addEventListener('click', () => loadTrack(currentIndex + 1, true));

  // Lagu berikutnya otomatis diputar saat lagu saat ini selesai
  audio.addEventListener('ended', () => {
    loadTrack(currentIndex + 1, true);
  });

  // Klik di progress bar untuk lompat ke posisi tertentu
  progressTrack.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressTrack.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  volume.addEventListener('input', () => {
    audio.volume = parseFloat(volume.value);
  });

  audio.addEventListener('timeupdate', () => {
    const dur = audio.duration || 0;
    const cur = audio.currentTime || 0;
    const pct = dur ? cur / dur : 0;
    progressFill.style.width = pct * 100 + '%';
    counter.textContent = fmt(cur);

    // Ukuran gulungan pita: kiri mengecil, kanan membesar
    const minSize = 14, maxSize = 52;
    const leftSize = maxSize - pct * (maxSize - minSize);
    const rightSize = minSize + pct * (maxSize - minSize);
    coilLeft.style.width = leftSize + 'px';
    coilLeft.style.height = leftSize + 'px';
    coilRight.style.width = rightSize + 'px';
    coilRight.style.height = rightSize + 'px';
  });

  // VU meter yang hidup mengikuti status playback
  function animateVU() {
    requestAnimationFrame(animateVU);
    const playing = !audio.paused;
    bars.forEach((b, i) => {
      if (playing) {
        const t = Date.now() / 180 + i * 0.6;
        const h = 15 + Math.abs(Math.sin(t) * Math.cos(t * 0.7 + i)) * 85;
        b.style.height = h + '%';
        b.classList.toggle('active', h > 30);
      } else {
        b.style.height = '10%';
        b.classList.remove('active');
      }
    });
  }
  animateVU();

  // Muat track pertama (tanpa autoplay, menunggu interaksi user)
  loadTrack(0, false);
})();
