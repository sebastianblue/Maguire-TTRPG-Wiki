// The Witch's Wake - GM Dashboard Audio Player
const DashboardAudio = (() => {
  'use strict';

  // Audio library configuration
  const AUDIO_LIBRARY = {
    ambient: [
      { id: '01-estate-approach', name: 'Estate Approach', file: 'audio/01-estate-approach.mp3', loop: true },
      { id: '02-inside-estate', name: 'Inside Estate (Default)', file: 'audio/02-inside-estate.mp3', loop: true },
      { id: '03-cemetery', name: 'Cemetery', file: 'audio/03-cemetery.mp3', loop: true },
      { id: '04-library-ambient', name: 'Library', file: 'audio/04-library-ambient.mp3', loop: true },
      { id: '05-chapel-ambient', name: 'Chapel/Observatory', file: 'audio/05-chapel-ambient.mp3', loop: true }
    ],
    musicBoxes: [
      { id: '06-musicbox-simple', name: 'Simple Wood (CORRECT)', file: 'audio/06-musicbox-simple-CORRECT.mp3', loop: false, correct: true },
      { id: '07-musicbox-brass', name: 'Brass Ornate (Wrong)', file: 'audio/07-musicbox-brass-WRONG.mp3', loop: false },
      { id: '08-musicbox-flowers', name: 'Painted Flowers (Wrong)', file: 'audio/08-musicbox-flowers-WRONG.mp3', loop: false },
      { id: '09-musicbox-lacquer', name: 'Black Lacquer (Wrong)', file: 'audio/09-musicbox-lacquer-WRONG.mp3', loop: false },
      { id: '10-musicbox-backwards', name: 'Backwards (Hint)', file: 'audio/10-musicbox-backwards.mp3', loop: false }
    ],
    sfx: [
      { id: '11-sfx-piano-slam', name: 'Piano Slam', file: 'audio/11-sfx-piano-slam.mp3' },
      { id: '12-sfx-applause', name: 'Distant Applause', file: 'audio/12-sfx-applause.mp3' },
      { id: '13-sfx-bell-chime', name: 'Bell Chime', file: 'audio/13-sfx-bell-chime.mp3' },
      { id: '14-sfx-portrait-weeping', name: 'Portrait Weeping', file: 'audio/14-sfx-portrait-weeping.mp3' },
      { id: '15-sfx-whispers', name: 'Whispered Accusations', file: 'audio/15-sfx-whispers.mp3' },
      { id: '16-sfx-shelves-moving', name: 'Shelves Rearranging', file: 'audio/16-sfx-shelves-moving.mp3' },
      { id: '17-sfx-cards-scatter', name: 'Cards Scattering', file: 'audio/17-sfx-cards-scatter.mp3' },
      { id: '18-sfx-mirrors-shatter', name: 'Mirrors Shattering', file: 'audio/18-sfx-mirrors-shatter.mp3' },
      { id: '19-sfx-candles-light', name: 'Candles Lighting', file: 'audio/19-sfx-candles-light.mp3' },
      { id: '24-sfx-seal-complete', name: 'Seal Complete', file: 'audio/24-sfx-seal-complete.mp3' },
      { id: '25-sfx-cabinet-open', name: 'Cabinet Opening', file: 'audio/25-sfx-cabinet-open.mp3' }
    ],
    combat: [
      { id: '20-combat-yackle-phase1', name: 'Phase 1: The Hostess', file: 'audio/20-combat-yackle-phase1.mp3', loop: true },
      { id: '21-combat-yackle-phase2', name: 'Phase 2: The Ancient', file: 'audio/21-combat-yackle-phase2.mp3', loop: true },
      { id: '22-combat-yackle-phase3', name: 'Phase 3: Desperation', file: 'audio/22-combat-yackle-phase3.mp3', loop: true },
      { id: '23-combat-yackle-phase4', name: 'Phase 4: The End', file: 'audio/23-combat-yackle-phase4.mp3', loop: true }
    ],
    emotional: [
      { id: '26-emotional-iloveu', name: 'I LOVE U Reveal', file: 'audio/26-emotional-iloveu.mp3' },
      { id: '27-emotional-letter', name: 'The Letter', file: 'audio/27-emotional-letter.mp3', loop: true },
      { id: '28-emotional-reveal', name: 'The Reveal (Viridian→Yackle)', file: 'audio/28-emotional-reveal.mp3' }
    ],
    timeline: [
      { id: '29-timeline-midnight', name: 'Midnight (Start)', file: 'audio/29-timeline-midnight.mp3' },
      { id: '30-timeline-2am', name: '2 AM Warning', file: 'audio/30-timeline-2am.mp3' },
      { id: '31-timeline-4am', name: '4 AM Urgency', file: 'audio/31-timeline-4am.mp3' },
      { id: '32-timeline-6am', name: '6 AM Desperate', file: 'audio/32-timeline-6am.mp3' },
      { id: '33-timeline-730am', name: '7:30 AM Final Warning', file: 'audio/33-timeline-730am.mp3' },
      { id: '34-timeline-8am-failure', name: '8 AM Failure', file: 'audio/34-timeline-8am-failure.mp3' }
    ],
    ending: [
      { id: '35-victory', name: 'Victory', file: 'audio/35-victory.mp3' },
      { id: '36-escape', name: 'House Collapsing', file: 'audio/36-escape.mp3', loop: true },
      { id: '37-dawn', name: 'Dawn (Survivors)', file: 'audio/37-dawn.mp3' }
    ]
  };

  // Audio player state
  let ambientPlayer = null;
  let musicPlayer = null;
  let sfxPlayer = null;
  let currentAmbient = null;
  let currentMusic = null;
  let masterVolume = 0.7;
  let ambientVolume = 0.5;
  let musicVolume = 0.7;
  let sfxVolume = 0.8;

  function init() {
    console.log('[Audio] Initializing audio player...');

    // Create audio elements
    ambientPlayer = new Audio();
    ambientPlayer.loop = true;
    ambientPlayer.volume = ambientVolume * masterVolume;

    musicPlayer = new Audio();
    musicPlayer.volume = musicVolume * masterVolume;

    sfxPlayer = new Audio();
    sfxPlayer.volume = sfxVolume * masterVolume;

    // Render the audio UI
    renderAudioUI();

    // Set up event listeners
    setupEventListeners();

    console.log('[Audio] Audio player initialized');
  }

  function renderAudioUI() {
    // Find or create audio panel in dashboard
    let audioPanel = document.getElementById('audio-panel');
    if (!audioPanel) {
      // Create new panel if it doesn't exist
      const mainContainer = document.querySelector('.dashboard-main');
      if (!mainContainer) return;

      audioPanel = document.createElement('section');
      audioPanel.id = 'audio-panel';
      audioPanel.className = 'panel panel-audio collapsed';
      audioPanel.innerHTML = `
        <div class="panel-header clickable" id="audio-header">
          <h2>🎵 Audio Player <span class="expand-icon">▼</span></h2>
          <div class="audio-controls-header">
            <button id="audio-stop-all" class="btn-audio-small" title="Stop All Audio">⏹</button>
          </div>
        </div>
        <div id="audio-content" class="audio-content"></div>
      `;

      // Insert before combat panel or at end
      const combatPanel = document.querySelector('.panel-combat');
      if (combatPanel) {
        mainContainer.insertBefore(audioPanel, combatPanel);
      } else {
        mainContainer.appendChild(audioPanel);
      }

      // Make header clickable to expand/collapse
      document.getElementById('audio-header').addEventListener('click', function() {
        audioPanel.classList.toggle('collapsed');
        const icon = this.querySelector('.expand-icon');
        icon.textContent = audioPanel.classList.contains('collapsed') ? '▼' : '▲';
      });

      document.getElementById('audio-stop-all').addEventListener('click', (e) => {
        e.stopPropagation();
        stopAll();
      });
    }

    // Render audio controls
    const content = document.getElementById('audio-content');
    if (!content) return;

    content.innerHTML = `
      <!-- Master Volume -->
      <div class="audio-section">
        <h3>🔊 Master Volume</h3>
        <input type="range" id="master-volume" min="0" max="100" value="${masterVolume * 100}" class="volume-slider">
        <span id="master-volume-display">${Math.round(masterVolume * 100)}%</span>
      </div>

      <!-- Ambient Music -->
      <div class="audio-section">
        <h3>🏚️ Ambient / Room Music</h3>
        <div class="volume-control">
          <input type="range" id="ambient-volume" min="0" max="100" value="${ambientVolume * 100}" class="volume-slider">
          <span id="ambient-volume-display">${Math.round(ambientVolume * 100)}%</span>
        </div>
        <div class="audio-current">
          <strong>Now Playing:</strong> <span id="ambient-now-playing">None</span>
        </div>
        <div class="audio-buttons">
          ${AUDIO_LIBRARY.ambient.map(track => `
            <button class="btn-audio" data-track="${track.id}" data-type="ambient">
              ${track.name}
            </button>
          `).join('')}
          <button class="btn-audio btn-audio-stop" id="stop-ambient">⏹ Stop</button>
        </div>
      </div>

      <!-- Music Boxes (Seal 1) -->
      <div class="audio-section music-box-section">
        <h3>🎼 Music Boxes (Seal 1)</h3>
        <p class="audio-hint">Players must identify which melody is CORRECT</p>
        <div class="audio-buttons">
          ${AUDIO_LIBRARY.musicBoxes.map(track => `
            <button class="btn-audio ${track.correct ? 'btn-audio-correct' : ''}" data-track="${track.id}" data-type="musicbox">
              ${track.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Sound Effects -->
      <div class="audio-section">
        <h3>🔔 Sound Effects</h3>
        <div class="volume-control">
          <input type="range" id="sfx-volume" min="0" max="100" value="${sfxVolume * 100}" class="volume-slider">
          <span id="sfx-volume-display">${Math.round(sfxVolume * 100)}%</span>
        </div>
        <div class="audio-buttons audio-buttons-grid">
          ${AUDIO_LIBRARY.sfx.map(track => `
            <button class="btn-audio-sfx" data-track="${track.id}">
              ${track.name.replace(/^.+: /, '')}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Combat Music -->
      <div class="audio-section">
        <h3>⚔️ Combat Music (Yackle)</h3>
        <div class="volume-control">
          <input type="range" id="music-volume" min="0" max="100" value="${musicVolume * 100}" class="volume-slider">
          <span id="music-volume-display">${Math.round(musicVolume * 100)}%</span>
        </div>
        <div class="audio-current">
          <strong>Now Playing:</strong> <span id="music-now-playing">None</span>
        </div>
        <div class="audio-buttons">
          ${AUDIO_LIBRARY.combat.map(track => `
            <button class="btn-audio" data-track="${track.id}" data-type="combat">
              ${track.name}
            </button>
          `).join('')}
          <button class="btn-audio btn-audio-stop" id="stop-music">⏹ Stop</button>
        </div>
      </div>

      <!-- Emotional Moments -->
      <div class="audio-section">
        <h3>💔 Emotional Moments</h3>
        <div class="audio-buttons">
          ${AUDIO_LIBRARY.emotional.map(track => `
            <button class="btn-audio-sfx" data-track="${track.id}">
              ${track.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Timeline Markers (Optional) -->
      <div class="audio-section">
        <h3>⏰ Timeline Markers</h3>
        <div class="audio-buttons audio-buttons-grid">
          ${AUDIO_LIBRARY.timeline.map(track => `
            <button class="btn-audio-sfx" data-track="${track.id}">
              ${track.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Ending -->
      <div class="audio-section">
        <h3>🌅 Ending</h3>
        <div class="audio-buttons">
          ${AUDIO_LIBRARY.ending.map(track => `
            <button class="btn-audio" data-track="${track.id}" data-type="ending">
              ${track.name}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function setupEventListeners() {
    const content = document.getElementById('audio-content');
    if (!content) return;

    // Master volume
    const masterVolumeSlider = document.getElementById('master-volume');
    if (masterVolumeSlider) {
      masterVolumeSlider.addEventListener('input', (e) => {
        masterVolume = e.target.value / 100;
        document.getElementById('master-volume-display').textContent = `${e.target.value}%`;
        updateVolumes();
      });
    }

    // Ambient volume
    const ambientVolumeSlider = document.getElementById('ambient-volume');
    if (ambientVolumeSlider) {
      ambientVolumeSlider.addEventListener('input', (e) => {
        ambientVolume = e.target.value / 100;
        document.getElementById('ambient-volume-display').textContent = `${e.target.value}%`;
        updateVolumes();
      });
    }

    // Music volume
    const musicVolumeSlider = document.getElementById('music-volume');
    if (musicVolumeSlider) {
      musicVolumeSlider.addEventListener('input', (e) => {
        musicVolume = e.target.value / 100;
        document.getElementById('music-volume-display').textContent = `${e.target.value}%`;
        updateVolumes();
      });
    }

    // SFX volume
    const sfxVolumeSlider = document.getElementById('sfx-volume');
    if (sfxVolumeSlider) {
      sfxVolumeSlider.addEventListener('input', (e) => {
        sfxVolume = e.target.value / 100;
        document.getElementById('sfx-volume-display').textContent = `${e.target.value}%`;
        updateVolumes();
      });
    }

    // Ambient/Combat/Ending buttons
    content.querySelectorAll('.btn-audio[data-track]').forEach(btn => {
      btn.addEventListener('click', () => {
        const trackId = btn.dataset.track;
        const type = btn.dataset.type;
        playTrack(trackId, type);
      });
    });

    // SFX buttons
    content.querySelectorAll('.btn-audio-sfx[data-track]').forEach(btn => {
      btn.addEventListener('click', () => {
        const trackId = btn.dataset.track;
        playSFX(trackId);
      });
    });

    // Stop buttons
    const stopAmbient = document.getElementById('stop-ambient');
    if (stopAmbient) {
      stopAmbient.addEventListener('click', () => stopAmbient());
    }

    const stopMusic = document.getElementById('stop-music');
    if (stopMusic) {
      stopMusic.addEventListener('click', () => stopMusic());
    }
  }

  function findTrack(trackId) {
    for (const category in AUDIO_LIBRARY) {
      const track = AUDIO_LIBRARY[category].find(t => t.id === trackId);
      if (track) return track;
    }
    return null;
  }

  function playTrack(trackId, type) {
    const track = findTrack(trackId);
    if (!track) {
      console.warn(`[Audio] Track not found: ${trackId}`);
      return;
    }

    if (type === 'ambient' || type === 'ending') {
      currentAmbient = trackId;
      ambientPlayer.src = track.file;
      ambientPlayer.loop = track.loop !== false;
      ambientPlayer.volume = ambientVolume * masterVolume;

      ambientPlayer.play().catch(err => {
        console.warn(`[Audio] Could not play ambient: ${err.message}`);
        document.getElementById('ambient-now-playing').textContent = `⚠️ ${track.name} (file not found)`;
      });

      document.getElementById('ambient-now-playing').textContent = track.name;

    } else if (type === 'combat') {
      currentMusic = trackId;
      musicPlayer.src = track.file;
      musicPlayer.loop = track.loop !== false;
      musicPlayer.volume = musicVolume * masterVolume;

      musicPlayer.play().catch(err => {
        console.warn(`[Audio] Could not play combat music: ${err.message}`);
        document.getElementById('music-now-playing').textContent = `⚠️ ${track.name} (file not found)`;
      });

      document.getElementById('music-now-playing').textContent = track.name;

    } else if (type === 'musicbox') {
      // Music boxes use the music player but don't loop
      currentMusic = trackId;
      musicPlayer.src = track.file;
      musicPlayer.loop = false;
      musicPlayer.volume = musicVolume * masterVolume;

      musicPlayer.play().catch(err => {
        console.warn(`[Audio] Could not play music box: ${err.message}`);
      });

      document.getElementById('music-now-playing').textContent = track.name;

      // Auto-clear after playing
      musicPlayer.onended = () => {
        document.getElementById('music-now-playing').textContent = 'None';
        currentMusic = null;
      };
    }
  }

  function playSFX(trackId) {
    const track = findTrack(trackId);
    if (!track) {
      console.warn(`[Audio] SFX not found: ${trackId}`);
      return;
    }

    // SFX don't interrupt each other, just play
    sfxPlayer.src = track.file;
    sfxPlayer.volume = sfxVolume * masterVolume;
    sfxPlayer.loop = track.loop === true;

    sfxPlayer.play().catch(err => {
      console.warn(`[Audio] Could not play SFX: ${err.message}`);
    });
  }

  function stopAmbient() {
    ambientPlayer.pause();
    ambientPlayer.currentTime = 0;
    currentAmbient = null;
    document.getElementById('ambient-now-playing').textContent = 'None';
  }

  function stopMusic() {
    musicPlayer.pause();
    musicPlayer.currentTime = 0;
    currentMusic = null;
    document.getElementById('music-now-playing').textContent = 'None';
  }

  function stopAll() {
    stopAmbient();
    stopMusic();
    sfxPlayer.pause();
    sfxPlayer.currentTime = 0;
  }

  function updateVolumes() {
    if (ambientPlayer) ambientPlayer.volume = ambientVolume * masterVolume;
    if (musicPlayer) musicPlayer.volume = musicVolume * masterVolume;
    if (sfxPlayer) sfxPlayer.volume = sfxVolume * masterVolume;
  }

  // Public API
  return {
    init,
    playTrack,
    playSFX,
    stopAmbient,
    stopMusic,
    stopAll
  };
})();

// Auto-initialize when dashboard loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DashboardAudio.init());
} else {
  DashboardAudio.init();
}
