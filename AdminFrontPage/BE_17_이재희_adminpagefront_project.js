// 제품 데이터
const product_data = [
  { category: "상의", brand: 'Supreme', product: '슈프림 박스로고 후드티', price: '390,000' },
  { category: "상의", brand: 'DIESEL', product: '디젤 박스 후드티', price: '190,000' },
  { category: "상의", brand: 'Nike', product: '나이키 집업 후드티', price: '150,000' },
  { category: "하의", brand: 'Supreme', product: '슈프림 숏 팬츠', price: '88,000' },
  { category: "하의", brand: 'DIESEL', product: '디젤 트랙 팬츠', price: '188,000' },
  { category: "하의", brand: 'Nike', product: '스웨트 팬츠', price: '120,000' },
  { category: "신발", brand: 'Nike', product: '에어맥스', price: '350,000' },
  { category: "신발", brand: 'Nike', product: '에어포스 high', price: '187,000' },
  { category: "신발", brand: 'Nike', product: '에어포스 1', price: '137,000' },
  { category: "패션잡화", brand: 'Music&Goods', product: '빵빵이 키링', price: '29,000' },
  { category: "패션잡화", brand: 'Music&Goods', product: '빵빵이 피규어', price: '59,000' },
  { category: "패션잡화", brand: 'Music&Goods', product: '빵빵이 스티커', price: '5,000' },
];

// 제품 테이블
const product_data_Table = document.getElementById('product_data_Table');

// 페이지네이션 변수
let currentPage = 1;
const itemsPerPage = 4;
let currentData = [...product_data];

// 테이블 렌더링 함수
function renderTable(page) {
  if (!product_data_Table) return;
  product_data_Table.innerHTML = '';
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = currentData.slice(startIndex, endIndex);
  
  if (pageData.length > 0) {
    pageData.forEach((item) => {
      const row = product_data_Table.insertRow();
      row.insertCell(0).innerHTML = item.category;
      row.insertCell(1).innerHTML = item.brand;
      row.insertCell(2).innerHTML = item.product;
      row.insertCell(3).innerHTML = item.price;
    });
  } else {
    const row = product_data_Table.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 4;
    cell.innerHTML = '<p class="text-center text-muted">검색 결과가 없습니다.</p>';
  }
  
  updatePagination();
}

// 페이지네이션 업데이트 함수
function updatePagination() {
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginationUl = document.querySelector('.pagination');
  
  if (!paginationUl) return;

  let paginationHTML = `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="prev">Previous</a>
    </li>
  `;
  
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li class="page-item ${currentPage === i ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }
  
  paginationHTML += `
    <li class="page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="next">Next</a>
    </li>
  `;
  
  paginationUl.innerHTML = paginationHTML;
  
  paginationUl.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      
      if (page === 'prev') {
        if (currentPage > 1) {
          currentPage--;
          renderTable(currentPage);
        }
      } else if (page === 'next') {
        if (currentPage < totalPages) {
          currentPage++;
          renderTable(currentPage);
        }
      } else {
        const targetPage = parseInt(page);
        if (currentPage !== targetPage) {
          currentPage = targetPage;
          renderTable(currentPage);
        }
      }
    });
  });
}

// 초기 데이터 로딩
renderTable(currentPage);

// 다크모드 기능
const darkModeBtn = document.getElementById('darkModeBtn');
const body = document.body;

if (darkModeBtn) {
  darkModeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    body.classList.toggle('dark-mode');
    darkModeBtn.textContent = body.classList.contains('dark-mode') ? '라이트모드' : '다크모드';
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
  });
}

if (localStorage.getItem('darkMode') === 'true') {
  body.classList.add('dark-mode');
  if (darkModeBtn) darkModeBtn.textContent = '라이트모드';
}

// 검색 기능
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const categorySelect = document.getElementById('inlineFormSelectPref').value;
    const searchTerm = document.getElementById('productSearch').value.toLowerCase().trim();
    
    let filteredData = product_data;
    
    if (categorySelect && categorySelect !== 'category') {
      filteredData = filteredData.filter(item => {
        if (categorySelect === 'sconsultation') return item.category === '상의';
        if (categorySelect === 'Bottoms') return item.category === '하의';
        if (categorySelect === 'shoes') return item.category === '신발';
        if (categorySelect === 'Fashion') return item.category === '패션잡화';
        return true;
      });
    }
    
    if (searchTerm !== '') {
      filteredData = filteredData.filter(item => 
        item.product.toLowerCase().includes(searchTerm) ||
        item.brand.toLowerCase().includes(searchTerm)
      );
    }
    
    currentData = filteredData;
    currentPage = 1;
    renderTable(currentPage);
  });
}

// Enter 키 검색
const productSearchInput = document.getElementById('productSearch');
if (productSearchInput) {
  productSearchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('searchBtn').click();
    }
  });
}

// 초기화 버튼
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('productSearch').value = '';
    document.getElementById('inlineFormSelectPref').value = 'category';
    currentData = [...product_data];
    currentPage = 1;
    renderTable(currentPage);
  });
}

// 회원가입 처리 및 리다이렉트
const signupSubmit = document.getElementById('signupSubmit');
if (signupSubmit) {
  signupSubmit.addEventListener('click', function() {
    const id = document.getElementById('signupId').value;
    const password = document.getElementById('signupPassword').value;
    const rePassword = document.getElementById('signupRecheckPassword').value;
    const name = document.getElementById('signupName').value;
    const phone = document.getElementById('phonenumber').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const email = document.getElementById('email').value;
    
    if(id.length < 6){
      alert("아이디가 너무 짧습니다. 6자 이상 입력해주세요.");
      return;
    }

    if (password !== rePassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/;
    if (!passwordRegex.test(password)) {
      alert('비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상 30자 미만이어야 합니다.');
      return;
    }
    
    if (id && password && name && phone && gender && email) {
      const signupModalElement = document.getElementById('signupModal');
      const signupModal = bootstrap.Modal.getInstance(signupModalElement);
      if (signupModal) signupModal.hide();
      
      document.getElementById('signupForm').reset();
      
      // 환영 모달 표시 및 리다이렉트 로직
      setTimeout(() => {
        document.getElementById('welcomeName').textContent = `${name}님, 어서오세요! 반갑습니다.`;
        const welcomeModalElement = document.getElementById('welcomeModal');
        const welcomeModal = new bootstrap.Modal(welcomeModalElement);
        welcomeModal.show();
        
        // 3초 후 메인 페이지(또는 지정된 URL)로 이동
        let countdown = 3;
        const redirectMsg = document.getElementById('redirectMessage');
        
        const timer = setInterval(() => {
          countdown--;
          if (redirectMsg) {
            redirectMsg.textContent = `${countdown}초 후 메인 페이지로 이동합니다...`;
          }
          
          if (countdown <= 0) {
            clearInterval(timer);
            // 여기에 이동할 URL을 입력하세요. 예: 'index.html' 또는 'https://naver.com'
            window.location.href = 'BE_17_이재희_adminpagefront_project2.html'; 
          }
        }, 1000);
        
      }, 500);
      
    } else {
      alert('모든 항목을 입력해주세요.');
    }
  });
}

const signupModalElement = document.getElementById('signupModal');
if (signupModalElement) {
  signupModalElement.addEventListener('hidden.bs.modal', function () {
    document.getElementById('signupForm').reset();
  });
}
