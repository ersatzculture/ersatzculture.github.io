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

    // 2. 메인 화면에 연도 목록 생성 (대괄호 없이 숫자만 출력)
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

        // [로직 1] 사진(photo)일 경우: 한 장 또는 여러 장 처리
        if (item.type === 'photo') {
            const longText = item.text ? `<p class="long-text">${item.text}</p>` : '';
            let imagesHTML = '';
            // 기본 컨테이너 클래스 (한 장일 때 사용)
            let containerClass = 'photo-wrapper'; 

            // 1-1. 여러 장인 경우 (images: ["a.jpg", "b.jpg"]) -> 가로 스크롤 적용
            if (item.images && item.images.length > 0) {
                containerClass = 'horizontal-scroll-container'; // 클래스 변경
                item.images.forEach(img => {
                    // 각 이미지를 .scroll-item div로 감쌈
                    imagesHTML += `<div class="scroll-item"><img src="${img}" alt="${item.title}"></div>`;
                });
            } 
            // 1-2. 한 장인 경우 (imageSrc: "a.jpg") - 기존 방식 호환
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
        // [로직 2] 영상(video)일 경우 (기본값)
        else {
            let videoSrc = '';
            // 비메오 ID가 있으면 비메오 주소 사용, 아니면 유튜브 주소 사용
            if (item.vimeoId) {
                videoSrc = `https://player.vimeo.com/video/${item.vimeoId}`;
