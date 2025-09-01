document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tourImage = document.getElementById('tour-image');
    const interactiveElementsContainer = document.getElementById('interactive-elements-container');
    const currentLocationHud = document.getElementById('current-location-hud');
    const crestCounterHud = document.getElementById('crest-counter');
    const totalCrestsHud = document.getElementById('total-crests');
    const missionButton = document.getElementById('mission-button');
    const prevButton = document.getElementById('prev-location');
    const nextButton = document.getElementById('next-location');
    const thumbnailGalleryContainer = document.getElementById('thumbnail-gallery-container');
    const loadingOverlay = document.getElementById('loading-overlay');
    const resetProgressButton = document.getElementById('reset-progress-button');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalActions = document.getElementById('modal-actions');

    const yearSpanVt = document.getElementById('currentYearVt');

    // Game Data
    const locations = [
        {
            id: 'entrance',
            name: 'Κεντρική Είσοδος',
            image: 'images/entrance_compResize.jpg',
            hotspots: [
                { x: 55, y: 55, title: 'Είσοδος', text: 'Για να δούμε , θα τα καταφέρεις ; ' },
            ],
            hiddenCrests: [ { id: 'crest_entrance_1', x: 85, y: 70, found: false } ]
        },
        {
            id: 'grammateia',
            name: 'Γραμματεία',
            image: 'images/grammatia.jpg',
            hotspots: [
                { x: 45, y: 40, title: 'Γραφείο Πληροφοριών', text: 'Γενικές πληροφορίες εύκολα προσβάσιμες στους μαθητές.' },
                { x: 67, y: 50, title: 'Αρχειοθήκη', text: 'Σχολικά έγγραφα και χαρτιά.' }
            ],
            hiddenCrests: [ { id: 'crest_grammatia_1', x: 48, y: 8, found: false } ]
        },
        {
            id: 'classroom1',
            name: 'Αίθουσα Διδασκαλίας 1',
            image: 'images/classroom1.jpg',
            hotspots: [
                { x: 47, y: 2, title: 'Προτζέκτορας', text: 'Για δυναμικές παρουσιάσεις.' },
                { x: 20, y: 45, title: 'Εργονομικά Θρανία', text: 'Άνετοι χώροι μελέτης.' }
            ],
            hiddenCrests: [ { id: 'crest_classroom1_1', x: 90, y: 85, found: false } ]
        },
        {
            id: 'workshop',
            name: 'Εργαστήριο Ειδικότητας',
            image: 'images/workshop.jpg',
            hotspots: [
                { x: 30, y: 65, title: 'Πάγκοι Εργασίας', text: 'Για πρακτική εξάσκηση.' },
                { x: 75, y: 50, title: 'Συσκευές προσωμίωσης', text: 'Συσκεύες για την πρακτική άσκηση της ειδικότητας.' }
            ],
            hiddenCrests: [ { id: 'crest_workshop_1', x: 55, y: 80, found: false } ]
        },
        {
            id: 'computer-lab',
            name: 'Εργαστήριο Πληροφορικής',
            image: 'images/computer_lab.jpg',
            hotspots: [
                { x: 65, y: 50, title: 'Σταθμοί Η/Υ', text: 'Ισχυροί υπολογιστές και γρήγορο internet.' },
                { x: 30, y: 20, title: 'Διαδραστικός Πίνακας', text: 'Για σύγχρονη διδασκαλία.' }
            ],
            hiddenCrests: [ { id: 'crest_comlab_1', x: 90, y: 20, found: false } ]
        },
        {
            id: 'nursery',
            name: 'Εργαστίριο Νοσηλευτικής',
            image: 'images/nursery.jpg',
            hotspots: [
                { x: 35, y: 45, title: 'Πίνακας', text: 'Θεμελιώδες εργαλείο για την διδασκαλία.' },
                { x: 70, y: 60, title: 'Κούκλες Προσωμίωσης', text: 'Για πρακτική εφαρμογή γνώσεων.' }
            ],
            hiddenCrests: [ { id: 'crest_nursery_1', x: 40, y: 85, found: false } ]
        },
        {
            id: 'outside',
            name: 'Εξωτερικός Χώρος - Αίθριο',
            image: 'images/outside.jpg',
            hotspots: [
                { x: 70, y: 40, title: 'Βρύσες', text: 'Καθαρό νερό για τους μαθητές.' },
                { x: 40, y: 60, title: 'Χώρος Εκδηλώσεων', text: 'Για υπαίθριες συγκεντρώσεις.' }
            ],
            hiddenCrests: [ { id: 'crest_outdoor_1', x: 45, y: 35, found: false } ]
        }
    ];

    // Game State
    let currentLocationIndex = 0;
    let allCrestsData = []; 
    let totalCrestsGlobally = 0;
    let foundCrestsGlobally = 0;
    let isLoading = true;

    // --- LocalStorage Functions ---
    const STORAGE_KEY = 'saekExplorerCrestsFound';

    function loadCrestsStatus() {
        const storedCrests = localStorage.getItem(STORAGE_KEY);
        if (storedCrests) {
            const foundCrestIds = JSON.parse(storedCrests);
            allCrestsData.forEach(crest => {
                if (foundCrestIds.includes(crest.id)) {
                    crest.found = true;
                }
            });
            updateFoundCrestsCount();
        }
    }

    function saveCrestsStatus() {
        const foundCrestIds = allCrestsData.filter(crest => crest.found).map(crest => crest.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(foundCrestIds));
    }
    
    function updateFoundCrestsCount() {
        foundCrestsGlobally = allCrestsData.filter(crest => crest.found).length;
    }


    // --- Modal Functions ---
    function showModal(title, bodyHtml, actionsHtml = '') {
        modalTitle.textContent = title;
        modalBody.innerHTML = bodyHtml;
        modalActions.innerHTML = actionsHtml;
        modalOverlay.classList.remove('modal-hidden');
        const firstFocusable = modalActions.querySelector('button, a') || modalCloseButton;
        if (firstFocusable) firstFocusable.focus();
    }

    function hideModal() {
        modalOverlay.classList.add('modal-hidden');
    }

    // --- Loading State Functions ---
    function showLoading() {
        isLoading = true;
        loadingOverlay.classList.add('loading-active');
        tourImage.classList.add('image-loading');
        prevButton.disabled = true;
        nextButton.disabled = true;
    }

    function hideLoading() {
        isLoading = false;
        loadingOverlay.classList.remove('loading-active');
        tourImage.classList.remove('image-loading');
        updateNavigationButtons();
    }

    // --- Game Logic & Rendering ---
    function initGame() {
        showLoading();

        // Populate allCrestsData and totalCrestsGlobally
        locations.forEach(loc => {
            loc.hiddenCrests.forEach(crest => {
                allCrestsData.push({ ...crest, locationId: loc.id });
            });
        });
        totalCrestsGlobally = allCrestsData.length;
        totalCrestsHud.textContent = totalCrestsGlobally;
        
        loadCrestsStatus(); 
        updateGameUI(); 

        populateThumbnails();
        loadLocation(0); 

        missionButton.addEventListener('click', showMissionBriefing);
        modalCloseButton.addEventListener('click', hideModal);

        if (foundCrestsGlobally === 0) {
            setTimeout(showMissionBriefing, 1000); 
        }
        hideLoading(); 
    }

    function showMissionBriefing() {
        const briefingText = `
            <p>Καλώς ήρθες στον <strong>Εξερευνητή του ΣΑΕΚ Σίνδου</strong>!</p>
            <p>Η αποστολή σου, αν την αποδεχτείς, είναι να βρεις όλα τα <strong>κρυμμένα Σύμβολα του ΣΑΕΚ</strong> που βρίσκονται διάσπαρτα στις εγκαταστάσεις.</p>
            <p>Εξερεύνησε κάθε γωνιά, κάνε κλικ στα Σύμβολα (<img src="images/school_crest.png" alt="Crest Icon" style="width:20px; vertical-align:middle;">) όταν τα εντοπίσεις, και μάζεψέ τα όλα!</p>
            <p>Καλή τύχη, εξερευνητή!</p>
        `;
        showModal("Η Αποστολή Σου!", briefingText, `<button class="modal-button" id="start-mission-button">Κατάλαβα!</button>`);
        document.getElementById('start-mission-button').addEventListener('click', hideModal);
        document.getElementById('start-mission-button').focus();
    }

    function loadLocation(index) {
        if (index < 0 || index >= locations.length || isLoading) return;
        showLoading();

        currentLocationIndex = index;
        const location = locations[currentLocationIndex];

        // Preload image
        const img = new Image();
        img.src = location.image;
        img.alt = location.name;

        img.onload = () => {
            tourImage.src = img.src;
            tourImage.alt = img.alt;
            currentLocationHud.textContent = location.name;

            interactiveElementsContainer.innerHTML = ''; 

            // Render Hotspots
            location.hotspots.forEach(spot => {
                const hotspotEl = document.createElement('div');
                hotspotEl.classList.add('hotspot');
                hotspotEl.style.left = `${spot.x}%`;
                hotspotEl.style.top = `${spot.y}%`;
                hotspotEl.setAttribute('aria-label', `Πληροφορίες για ${spot.title}`);
                hotspotEl.setAttribute('role', 'button');
                hotspotEl.title = spot.title;
                hotspotEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showModal(spot.title, `<p>${spot.text}</p>`);
                });
                interactiveElementsContainer.appendChild(hotspotEl);
            });

            // Render Hidden Crests for this location
            allCrestsData.filter(c => c.locationId === location.id).forEach(crest => {
                const crestEl = document.createElement('div');
                crestEl.classList.add('hidden-crest');
                crestEl.id = crest.id;
                crestEl.style.left = `${crest.x}%`;
                crestEl.style.top = `${crest.y}%`;
                crestEl.style.backgroundImage = `url('images/school_crest.png')`; 
                crestEl.setAttribute('aria-label', `Κρυμμένο Σύμβολο ΣΑΕΚ`);
                crestEl.setAttribute('role', 'button');

                if (crest.found) {
                    crestEl.classList.add('found');
                } else {
                    crestEl.addEventListener('click', (e) => {
                        e.stopPropagation();
                        handleCrestClick(crest, crestEl);
                    });
                }
                interactiveElementsContainer.appendChild(crestEl);
            });

            updateNavigationButtons();
            updateActiveThumbnail();
            hideLoading();
        };
        img.onerror = () => {
            console.error("Error loading image:", location.image);
            currentLocationHud.textContent = "Σφάλμα Εικόνας";
            interactiveElementsContainer.innerHTML = '';
            hideLoading();
        };
    }

    function handleCrestClick(crestData, crestElement) {
        if (crestData.found) return;

        crestData.found = true;
        crestElement.classList.add('found');

        updateFoundCrestsCount();
        updateGameUI();
        saveCrestsStatus(); 

        // Check for game win
        if (foundCrestsGlobally === totalCrestsGlobally) {
            triggerGameWin();
        } else {
             showModal("Σύμβολο Βρέθηκε!", `<p>Εξαιρετικά! Βρήκες ένα Σύμβολο του ΣΑΕΚ!</p><p>Συνέχισε την αναζήτηση!</p>`, `<button class="modal-button" id="continue-hunt-button">Συνέχεια!</button>`);
             document.getElementById('continue-hunt-button').addEventListener('click', hideModal);
             document.getElementById('continue-hunt-button').focus();
        }
    }

    function updateGameUI() {
        crestCounterHud.textContent = foundCrestsGlobally;
    }

    function triggerGameWin() {
        const winTitle = "Συγχαρητήρια Εξερευνητή!";
        const winBody = `
            <p class="certificate-title">ΠΙΣΤΟΠΟΙΗΤΙΚΟ ΕΞΕΡΕΥΝΗΣΗΣ</p>
            <p>Κατόρθωσες να βρεις όλα τα <strong>${totalCrestsGlobally} κρυμμένα Σύμβολα του ΣΑΕΚ Σίνδου</strong>!</p>
            <p>Η παρατηρητικότητα και η επιμονή σου είναι αξιοθαύμαστες.</p>
            <p>Ως επιβράβευση, ξεκλειδώνεις την πρόσβαση στην...</p>
        `;
        const winActions = '<iframe src="https://archive.org/embed/Rick_Astley_Never_Gonna_Give_You_Up" width="640" height="480" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>;' // Replace with actual secret link
        showModal(winTitle, winBody, winActions);
    }

    function resetGameProgress() {
    if (confirm("Είστε σίγουροι ότι θέλετε να επαναφέρετε την πρόοδό σας; Αυτή η ενέργεια δεν αναιρείται.")) {
        localStorage.removeItem(STORAGE_KEY);
        allCrestsData.forEach(crest => {
            crest.found = false;
        });
        foundCrestsGlobally = 0;
        updateGameUI();
        loadLocation(currentLocationIndex);
        location.reload();
    }
}

    function populateThumbnails() {
        thumbnailGalleryContainer.innerHTML = '';
        locations.forEach((location, index) => {
            const imgEl = document.createElement('img');
            imgEl.classList.add('thumbnail-item');
            imgEl.src = location.image;
            imgEl.alt = `Thumbnail of ${location.name}`;
            imgEl.title = location.name;
            imgEl.addEventListener('click', () => loadLocation(index));
            thumbnailGalleryContainer.appendChild(imgEl);
        });
    }

    function updateActiveThumbnail() {
        const thumbnails = thumbnailGalleryContainer.querySelectorAll('.thumbnail-item');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active-thumbnail', index === currentLocationIndex);
        });
    }

    function updateNavigationButtons() {
        prevButton.disabled = currentLocationIndex === 0 || isLoading;
        nextButton.disabled = currentLocationIndex === locations.length - 1 || isLoading;
    }

    // --- Event Listeners ---
    prevButton.addEventListener('click', () => loadLocation(currentLocationIndex - 1));
    nextButton.addEventListener('click', () => loadLocation(currentLocationIndex + 1));
    resetProgressButton.addEventListener('click', resetGameProgress);

    document.addEventListener('keydown', (e) => {
        if (modalOverlay.classList.contains('modal-hidden')) { 
            if (e.key === 'ArrowRight' && !nextButton.disabled) {
                loadLocation(currentLocationIndex + 1);
            } else if (e.key === 'ArrowLeft' && !prevButton.disabled) {
                loadLocation(currentLocationIndex - 1);
            }
        } else { 
             if (e.key === 'Escape') {
                hideModal();
            }
        }
    });
    
    if (yearSpanVt) {
        yearSpanVt.textContent = new Date().getFullYear();
    }

    // --- Start the Game ---
    initGame();
});
