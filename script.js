// 데이터 불러오기 및 초기화
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        init(data);
    });

const mainScreen = document.getElementById('main-screen');
const archiveScreen = document.getElementById('archive-screen');
const yearList = document.getElementById('year-list');
const videoList = document.getElementById('video-list');
const backBtn = document.getElementById('back-btn');
const selectedYearTitle = document.getElementById('selected-year-title');

function init(data) {
    // 1. 데이터에서 연도만 추출해서 중복 제거 (Set 사용) 및 오름차순 정렬
    const years = [...new Set(data.map(item => item.year))].sort();

    // 2. 메인 화면에 연도 목록 생성
    years.forEach(year => {
        const li = document.createElement('li');
        li.textContent = `${year}`;
        li.addEventListener('click', () => showArchive(year, data));
        yearList.appendChild(li);
    });
}

// 아카이브 화면 보여주기 함수
function showArchive(year, data) {
    // 화면 전환
    mainScreen.classList.add('hidden');
    archiveScreen.classList.remove('hidden');
    selectedYearTitle.textContent = year; // 헤더에 연도 표시

    // 기존 목록 비우기
    videoList.innerHTML = '';

    // 해당 연도 데이터만 필터링
    const filteredData = data.filter(item => item.year === year);

    // HTML 생성하여 목록에 추가
    filteredData.forEach(item => {
        let contentHTML = ''; // 영상이나 사진이 들어갈 변수

        // [변경됨] 1. 사진(photo)일 경우: 이미지 태그 사용
        if (item.type === 'photo') {
            // 텍스트(긴 글)가 있으면 문단 태그로 감싸기
            const longText = item.text ? `<p class="long-text">${item.text}</p>` : '';
            
            contentHTML = `
                <div class="photo-wrapper">
                    <img src="${item.imageSrc}" alt="${item.title}">
                </div>
                ${longText}
            `;
        } 
        // [변경됨] 2. 영상(video)일 경우: 기존 로직 유지 (유튜브/비메오)
        else {
            let videoSrc = '';
            // 비메오 ID가 있으면 비메오 주소 사용, 아니면 유튜브 주소 사용
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

        // 최종 HTML 조립
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
    
    // 화면 최상단으로 이동
    window.scrollTo(0, 0);
}

// 뒤로가기 버튼 클릭 이벤트
backBtn.addEventListener('click', () => {
    archiveScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    
    // 비디오 정지를 위해 목록 비우기 (선택사항)
    videoList.innerHTML = '';
});
