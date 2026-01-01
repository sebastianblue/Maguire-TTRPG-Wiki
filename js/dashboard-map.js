// Map Rendering Module
const DashboardMap = (function() {
  'use strict';

  let state = null;
  let mapContainer = null;
  let currentRoomEl = null;

  function init(dashboardState) {
    state = dashboardState;
    mapContainer = document.getElementById('map-container');

    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }

    renderMap();
    setupFloorTabs();
  }

  function setupFloorTabs() {
    const floorTabs = document.querySelectorAll('.floor-tab');
    floorTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        floorTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const floor = tab.dataset.floor;
        DashboardState.update('currentFloor', floor);
        renderMap();
      });
    });
  }

  function renderMap() {
    const currentFloor = state.currentFloor;
    mapContainer.innerHTML = '';

    const floorDiv = document.createElement('div');
    floorDiv.className = 'map-floor active';
    floorDiv.style.position = 'relative';
    floorDiv.style.width = '100%';
    floorDiv.style.minHeight = '400px';

    // Get rooms for current floor
    const roomsOnFloor = Object.values(state.rooms).filter(r => r.floor === currentFloor);

    // Render each room
    roomsOnFloor.forEach(room => {
      const roomEl = createRoomElement(room);
      floorDiv.appendChild(roomEl);
    });

    mapContainer.appendChild(floorDiv);
  }

  function createRoomElement(room) {
    const roomEl = document.createElement('div');
    roomEl.className = 'room';
    roomEl.dataset.roomId = room.id;
    roomEl.textContent = room.name;

    // Position
    roomEl.style.left = room.position.x + '%';
    roomEl.style.top = room.position.y + '%';
    roomEl.style.transform = 'translate(-50%, -50%)';

    // State classes
    if (room.explored) {
      roomEl.classList.add('explored');
    }
    if (room.partyHere) {
      roomEl.classList.add('current');
      currentRoomEl = roomEl;
    }
    if (room.hasSeal) {
      const seal = state.seals[room.sealId];
      if (seal && seal.status !== 'complete') {
        roomEl.classList.add('has-seal');
      }
    }

    // Click handler
    roomEl.addEventListener('click', () => {
      selectRoom(room.id);
    });

    // Right-click handler
    roomEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      toggleExplored(room.id);
    });

    return roomEl;
  }

  function selectRoom(roomId) {
    const room = state.rooms[roomId];
    if (!room) return;

    DashboardState.update('currentRoom', roomId);
    DashboardTrackers.renderRoomDetails(room);

    // Update visual
    document.querySelectorAll('.room').forEach(el => {
      el.classList.remove('current');
    });
    document.querySelector(`[data-room-id="${roomId}"]`)?.classList.add('current');
  }

  function toggleExplored(roomId) {
    const room = state.rooms[roomId];
    if (!room) return;

    room.explored = !room.explored;
    DashboardState.save();
    renderMap();
  }

  function moveParty(roomId) {
    // Remove partyHere from all rooms
    Object.values(state.rooms).forEach(r => r.partyHere = false);

    // Set new location
    const room = state.rooms[roomId];
    if (room) {
      room.partyHere = true;
      DashboardState.save();
      renderMap();
      selectRoom(roomId);
    }
  }

  return {
    init,
    renderMap,
    selectRoom,
    moveParty
  };
})();
