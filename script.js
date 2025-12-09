// 데이터 불러오기 및 초기화
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        init(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
    });

const mainScreen = document.getElementById('main-screen');
const archiveScreen = document.getElementById('archive-screen');
const yearList = document.getElementById('year-list');
const videoList = document.getElementById('video-list');
const backBtn = document.getElementById('back-btn');
const selectedYearTitle = document.getElementById('selected-year-title');

function init(data) {
    // 1. 연도 추출 및 정렬
    const years = [...new Set(data.map(item => item.year))].sort();

    // 2. 메인 화면에 연도 목록 생성
    years.forEach(year => {
        const li = document.createElement('li');
        li.textContent = `${year}`;
        li.addEventListener('click', () => showArchive(year, data));
        yearList.appendChild(li);
    });
}

function showArchive(year, data) {
    // 화면 전환
    mainScreen.classList.add('hidden');
    archiveScreen.classList.remove('hidden');
    selectedYearTitle.textContent = year; 

    // 목록 비우기
    videoList.innerHTML = '';

    // 데이터 필터링
    const filteredData = data.filter(item => item.year === year);

    // 목록 생성
    filteredData.forEach(item => {
        let contentHTML = ''; 

        // [로직 1] 사진(photo)일 경우
        if (item.type === 'photo') {
            const longText = item.text ? `<p class="long-text">${item.text}</p>` : '';
            let imagesHTML = '';
            let containerClass = 'photo-wrapper'; // 기본(한장)

            // 여러 장인 경우 (가로 스크롤)
            if (item.images && item.images.length > 0) {
                containerClass = 'horizontal-scroll-container'; 
                item.images.forEach(img => {
                    // div.scroll-item으로 감싸기
                    imagesHTML += `<div class="scroll-item"><img src="${img}" alt="${item.title}"></div>`;
                });
            } 
            // 한 장인 경우
            else if (item.imageSrc) {
                imagesHTML = `<img src="${item.imageSrc}" alt="${item.title}">`;
            }

            contentHTML = `
                <div class="${containerClass}">
                    ${imagesHTML}
                </div>
                ${longText}
            `;
        } 
        // [로직 2] 영상(video)일 경우
        else {
            let videoSrc = '';
            if (item.vimeoId) {
                videoSrc = `https://player.vimeo.com/video/${item.vimeoId}`;
            } else {
                videoSrc = `https://www.youtube.com/embed/${item.youtubeId}`;
            }
            contentHTML = `
                <div class="video-wrapper">
                    <iframe src="${videoSrc}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                </div>
            `;
        }

        const itemHTML = `
            <div class="video-item">
                ${contentHTML}
                <div class="video-info">
                    <h3>${item.title}</h3>
                    <span class="date">${item.date}</span>
                    <p>${item.description}</p>
                </div>
            </div>
        `;
        videoList.innerHTML += itemHTML;
    });
    
    window.scrollTo(0, 0);
}

// [중요] 아까 잘렸던 부분입니다!
backBtn.addEventListener('click', () => {
    archiveScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    videoList.innerHTML = '';
});
