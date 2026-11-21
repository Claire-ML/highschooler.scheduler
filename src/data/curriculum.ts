export type DayOfWeek = '월' | '화' | '수' | '목' | '금';

export type SubjectColorKey = 'indigo' | 'emerald' | 'amber';

export type ElectiveCategory = '일반선택' | '진로선택' | '융합선택' | '교양';

export type EvaluationType =
  | '성취도(A~E) · 5등급 병기'
  | '성취도(A~E) 절대평가'
  | '성취도(A~C) 절대평가'
  | '이수(P) 평가';

export interface TimeSlotCoord {
  day: DayOfWeek;
  period: number; // 1 to 7
}

export interface SubjectRecommendation {
  id: string;
  name: string;
  category: ElectiveCategory;
  credits: number;
  evaluation: EvaluationType;
  room: string;
  summary: string;
  topics: string[];
  activityTip: string;
  prerequisiteTip: string;
  colorKey: SubjectColorKey;
  defaultSlots: TimeSlotCoord[];
}

export interface InterestField {
  id: string;
  label: string;
  shortDesc: string;
  iconName:
    | 'Cpu'
    | 'HeartPulse'
    | 'TrendingUp'
    | 'Clapperboard'
    | 'Scale'
    | 'Building2'
    | 'Brain'
    | 'Globe';
  subjects: [SubjectRecommendation, SubjectRecommendation, SubjectRecommendation];
}

export interface CommonSlot {
  day: DayOfWeek;
  period: number;
  name: string;
  shortName: string;
  isCreative?: boolean;
}

export const DAYS: DayOfWeek[] = ['월', '화', '수', '목', '금'];

export const PERIODS: { period: number; time: string }[] = [
  { period: 1, time: '08:40' },
  { period: 2, time: '09:40' },
  { period: 3, time: '10:40' },
  { period: 4, time: '11:40' },
  { period: 5, time: '13:20' },
  { period: 6, time: '14:20' },
  { period: 7, time: '15:20' },
];

// Based on the 2024 High School Credit System Operation Guide (ORM 2024-55):
// 34 regular weekly periods (Mon-Thu 1~7, Fri 1~6; Fri 7 is off-schedule).
// 19 common subject credits + 3 creative experiential credits (금4~6) = 22 fixed slots,
// leaving 12 open slots for student-chosen electives & 공강(free study periods).
export const COMMON_TIMETABLE_SLOTS: CommonSlot[] = [
  // 월
  { day: '월', period: 1, name: '공통국어', shortName: '국어' },
  { day: '월', period: 2, name: '공통수학', shortName: '수학' },
  { day: '월', period: 3, name: '한국사', shortName: '한국사' },
  // 화
  { day: '화', period: 1, name: '공통수학', shortName: '수학' },
  { day: '화', period: 2, name: '공통국어', shortName: '국어' },
  { day: '화', period: 3, name: '공통영어', shortName: '영어' },
  { day: '화', period: 6, name: '체육', shortName: '체육' },
  // 수
  { day: '수', period: 1, name: '공통국어', shortName: '국어' },
  { day: '수', period: 2, name: '공통영어', shortName: '영어' },
  { day: '수', period: 3, name: '한국사', shortName: '한국사' },
  { day: '수', period: 5, name: '음악·미술', shortName: '예술' },
  { day: '수', period: 6, name: '음악·미술', shortName: '예술' },
  // 목
  { day: '목', period: 1, name: '공통수학', shortName: '수학' },
  { day: '목', period: 2, name: '공통영어', shortName: '영어' },
  { day: '목', period: 3, name: '공통국어', shortName: '국어' },
  { day: '목', period: 6, name: '체육', shortName: '체육' },
  // 금 (창의적 체험활동 3학점: 자율·자치, 동아리, 진로활동)
  { day: '금', period: 1, name: '공통영어', shortName: '영어' },
  { day: '금', period: 2, name: '공통수학', shortName: '수학' },
  { day: '금', period: 3, name: '한국사', shortName: '한국사' },
  { day: '금', period: 4, name: '창의적 체험활동', shortName: '창체', isCreative: true },
  { day: '금', period: 5, name: '창의적 체험활동', shortName: '창체', isCreative: true },
  { day: '금', period: 6, name: '창의적 체험활동', shortName: '창체', isCreative: true },
];

export const INTEREST_FIELDS: InterestField[] = [
  {
    id: 'ai-sw',
    label: 'AI · 소프트웨어',
    shortDesc: '코딩 · 데이터 · 인공지능',
    iconName: 'Cpu',
    subjects: [
      {
        id: 'ai-basic',
        name: '인공지능 기초',
        category: '진로선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: 'AI창의융합실',
        summary: '인공지능의 핵심 원리부터 머신러닝 모델 구현까지 다루는 과목입니다.',
        topics: [
          '인공지능의 역사와 탐색 알고리즘, 지식 표현 원리 이해',
          '지도학습·비지도학습 등 머신러닝 분류 및 예측 모델 실습',
          '이미지·텍스트 인식 체험 및 AI 윤리와 사회적 영향 탐구',
        ],
        activityTip: '학교 데이터를 활용한 간단한 분류 모델을 만들어 보고 윤리적 한계를 정리해 보세요.',
        prerequisiteTip: '1학년 공통 과목인 「정보」 이수 후 수강하면 훨씬 수월해요.',
        colorKey: 'indigo',
        defaultSlots: [
          { day: '월', period: 5 },
          { day: '수', period: 4 },
          { day: '목', period: 5 },
          { day: '목', period: 7 },
        ],
      },
      {
        id: 'data-science',
        name: '데이터 과학',
        category: '융합선택',
        credits: 3,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '정보검색실',
        summary: '실생활 데이터를 수집·정제·시각화하여 인사이트를 도출하는 과목입니다.',
        topics: [
          '공공 데이터 수집 및 결측치·이상치 전처리 기법 학습',
          '파이썬 또는 스프레드시트를 활용한 통계 그래프 시각화',
          '데이터 기반 의사결정 프로젝트 기획 및 결과 발표',
        ],
        activityTip: '급식 잔반량이나 교내 도서관 대출 데이터처럼 친숙한 주제를 분석해 보세요.',
        prerequisiteTip: '수학·정보 기초와 함께 공강 시간 주제 탐구 프로젝트와 연결하기 좋아요.',
        colorKey: 'emerald',
        defaultSlots: [
          { day: '화', period: 4 },
          { day: '수', period: 7 },
          { day: '목', period: 4 },
        ],
      },
      {
        id: 'prob-stat',
        name: '확률과 통계',
        category: '일반선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '가변형강의실',
        summary: '데이터 분석과 AI 알고리즘의 수학적 뼈대가 되는 확률과 통계를 배웁니다.',
        topics: [
          '경우의 수, 순열과 조합, 이항정리의 논리적 원리',
          '조건부확률과 베이즈 정리를 활용한 사건 예측 모델링',
          '확률분포, 정규분포 및 표본평균을 통한 통계적 추정',
        ],
        activityTip: '베이즈 정리가 스팸 메일 필터나 추천 알고리즘에 어떻게 쓰이는지 탐구해 보세요.',
        prerequisiteTip: '「공통수학1·2」 이수 후 선택하는 수학 일반선택 과목이에요.',
        colorKey: 'amber',
        defaultSlots: [
          { day: '월', period: 4 },
          { day: '월', period: 6 },
          { day: '화', period: 5 },
          { day: '화', period: 7 },
        ],
      },
    ],
  },
  {
    id: 'med-bio',
    label: '의학 · 생명과학',
    shortDesc: '의약 · 바이오 · 보건',
    iconName: 'HeartPulse',
    subjects: [
      {
        id: 'cell-metabolism',
        name: '세포와 물질대사',
        category: '진로선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '생명과학실',
        summary: '세포 구조와 효소 작용, 에너지 대사 등 의·생명과학의 핵심 원리를 탐구합니다.',
        topics: [
          '생명체의 기본 단위인 세포의 구조와 물질 수송 메커니즘',
          '효소의 작용 원리와 세포 호흡·광합성의 대사 경로',
          '생체 에너지 전환 과정과 대사 질환의 과학적 이해',
        ],
        activityTip: '효소 반응 실험을 설계하거나 특정 대사 질환의 치료 기전을 조사해 보세요.',
        prerequisiteTip: '일반선택 「생명과학」을 먼저 들은 뒤 심화로 선택하는 과목이에요.',
        colorKey: 'indigo',
        defaultSlots: [
          { day: '월', period: 4 },
          { day: '화', period: 5 },
          { day: '수', period: 7 },
          { day: '목', period: 4 },
        ],
      },
      {
        id: 'chem-world',
        name: '화학 반응의 세계',
        category: '진로선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '화학실험실',
        summary: '화학 평형, 산·염기 완충, 반응 속도 등 인체와 약학에 쓰이는 화학 원리를 배웁니다.',
        topics: [
          '가역 반응과 화학 평형 이동 원리(르샤틀리에 원리)',
          '산·염기 평형과 혈액 내 pH를 유지하는 완충 용액 작용',
          '화학 반응 속도, 활성화 에너지 및 생체 촉매의 역할',
        ],
        activityTip: '혈액 내 탄산-중탄산염 완충 작용이나 약물 반응 속도를 실험으로 탐구해 보세요.',
        prerequisiteTip: '일반선택 「화학」을 선이수하면 개념 연결이 매끄럽습니다.',
        colorKey: 'emerald',
        defaultSlots: [
          { day: '월', period: 5 },
          { day: '수', period: 4 },
          { day: '목', period: 5 },
          { day: '화', period: 7 },
        ],
      },
      {
        id: 'health',
        name: '보건',
        category: '교양',
        credits: 3,
        evaluation: '이수(P) 평가',
        room: '보건교육실',
        summary: '질병 예방, 공중보건, 응급처치, 의료 윤리 등 실생활 건강 지식을 다룹니다.',
        topics: [
          '감염병과 만성질환의 역학적 특성과 예방 관리 체계',
          '심폐소생술 등 응급처치 및 약물 오남용 예방 지식',
          '보건의료 제도와 청소년 정신건강, 생명·의료 윤리 쟁점',
        ],
        activityTip: '교내 건강 캠페인을 기획하거나 감염병 예방 수칙을 카드뉴스로 제작해 보세요.',
        prerequisiteTip: '교양 교과(군) 과목으로 출석률 기준을 충족하면 이수(P)로 처리돼요.',
        colorKey: 'amber',
        defaultSlots: [
          { day: '월', period: 6 },
          { day: '화', period: 4 },
          { day: '목', period: 7 },
        ],
      },
    ],
  },
  {
    id: 'biz-econ',
    label: '경영 · 경제',
    shortDesc: '금융 · 마케팅 · 창업',
    iconName: 'TrendingUp',
    subjects: [
      {
        id: 'economics',
        name: '경제',
        category: '일반선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '사회탐구실',
        summary: '시장 가격 결정, 거시경제 흐름, 무역과 환율 등 경제 원리 전반을 배웁니다.',
        topics: [
          '희소성과 합리적 선택, 수요·공급에 따른 시장 균형 분석',
          'GDP, 물가, 실업률, 금리와 중앙은행의 통화정책 이해',
          '환율 변동, 국제 무역 원리 및 정부의 경제적 역할',
        ],
        activityTip: '최근 기준금리 변화가 청소년 소비와 기업 투자에 미치는 영향을 분석해 보세요.',
        prerequisiteTip: '1학년 「통합사회」 경제 단원을 바탕으로 2학년 때 많이 선택해요.',
        colorKey: 'indigo',
        defaultSlots: [
          { day: '월', period: 4 },
          { day: '수', period: 4 },
          { day: '목', period: 4 },
          { day: '화', period: 7 },
        ],
      },
      {
        id: 'econ-math',
        name: '경제 수학',
        category: '진로선택',
        credits: 3,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '다목적교실',
        summary: '이자 계산, 지수·로그, 미분을 활용해 경제·경영 지표를 수리적으로 해석합니다.',
        topics: [
          '단리·복리 계산, 연금의 현재가치와 미래가치 산출',
          '수요·공급 함수와 탄력성, 한계비용·한계수입 미분 분석',
          '경제 지표의 변화율과 최적 생산량·이윤 극대화 모델',
        ],
        activityTip: '예적금 복리 상품과 인플레이션율을 비교하는 시뮬레이션 표를 만들어 보세요.',
        prerequisiteTip: '「대수」와 「미적분Ⅰ」 기초를 이해하고 들으면 도움이 됩니다.',
        colorKey: 'emerald',
        defaultSlots: [
          { day: '화', period: 4 },
          { day: '수', period: 7 },
          { day: '목', period: 5 },
        ],
      },
      {
        id: 'finance-econ-life',
        name: '금융과 경제생활',
        category: '융합선택',
        credits: 3,
        evaluation: '성취도(A~E) 절대평가',
        room: '세미나실',
        summary: '금융 상품, 신용 관리, 재무 설계와 합리적 의사결정을 실전 중심으로 익힙니다.',
        topics: [
          '생애 주기별 재무 설계와 예금·투자·보험의 특징 이해',
          '신용 관리, 금융 사기 예방 및 디지털 금융 환경 분석',
          '합리적 소비·창업 의사결정과 금융 윤리 탐구',
        ],
        activityTip: '가상 용돈 관리 포트폴리오를 짜고 위험 분산 투자 원리를 발표해 보세요.',
        prerequisiteTip: '사회 융합선택 과목으로 석차등급 없이 성취도(A~E)만 기재됩니다.',
        colorKey: 'amber',
        defaultSlots: [
          { day: '월', period: 6 },
          { day: '화', period: 5 },
          { day: '목', period: 7 },
        ],
      },
    ],
  },
  {
    id: 'media-design',
    label: '미디어 · 콘텐츠',
    shortDesc: '영상 · 디자인 · 저널리즘',
    iconName: 'Clapperboard',
    subjects: [
      {
        id: 'media-comm',
        name: '매체 의사소통',
        category: '진로선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '토론식학습실',
        summary: '뉴스·유튜브·SNS 등 다양한 매체의 문법을 읽고 콘텐츠를 기획·제작합니다.',
        topics: [
          '매체별 정보 전달 특성과 팩트체크, 미디어 리터러시',
          '스토리텔링 기획, 카드뉴스·영상 콘티 및 내러티브 구성',
          '디지털 매체 윤리, 저작권 이해와 비판적 수용 태도',
        ],
        activityTip: '학교 행사나 사회 이슈를 주제로 3분 다큐멘터리 기획안과 스토리보드를 써 보세요.',
        prerequisiteTip: '1학년 「공통국어」 매체 영역과 연결되는 국어 진로선택 과목이에요.',
        colorKey: 'indigo',
        defaultSlots: [
          { day: '월', period: 5 },
          { day: '화', period: 4 },
          { day: '수', period: 4 },
          { day: '목', period: 5 },
        ],
      },
      {
        id: 'art-creation',
        name: '미술 창작',
        category: '진로선택',
        credits: 3,
        evaluation: '성취도(A~C) 절대평가',
        room: '디자인실',
        summary: '시각 디자인, 드로잉, 디지털 표현 기법을 통해 아이디어를 시각화합니다.',
        topics: [
          '조형 요소와 원리(색채, 구도, 타이포그래피) 심화 탐구',
          '포스터·패키지·UI 등 목적에 맞는 시각 디자인 프로젝트',
          '작품 비평 및 포트폴리오 제작과 전시 기획 실습',
        ],
        activityTip: '자신만의 브랜드 로고나 학교 동아리 홍보 포스터를 제작해 피드백을 받아보세요.',
        prerequisiteTip: '예술 교과(군) 과목으로 3단계 성취도(A·B·C)로 평가됩니다.',
        colorKey: 'emerald',
        defaultSlots: [
          { day: '월', period: 6 },
          { day: '수', period: 7 },
          { day: '목', period: 7 },
        ],
      },
      {
        id: 'topic-reading',
        name: '주제 탐구 독서',
        category: '진로선택',
        credits: 3,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '복합도서실',
        summary: '인문·예술·문화 분야의 책을 깊이 읽고 비평문과 콘텐츠 시나리오로 확장합니다.',
        topics: [
          '관심 주제에 맞는 도서 선정 및 능동적·비판적 읽기 전략',
          '서로 다른 관점의 텍스트 비교 분석 및 독서 토론',
          '독서 결과를 바탕으로 비평문·에세이·영상 각본 창작',
        ],
        activityTip: '영화와 원작 소설을 비교 분석해 각색의 연출 의도를 발표해 보세요.',
        prerequisiteTip: '공강 시간 독서 활동 및 동아리와 연계해 포트폴리오로 남기기 좋아요.',
        colorKey: 'amber',
        defaultSlots: [
          { day: '월', period: 4 },
          { day: '화', period: 5 },
          { day: '목', period: 4 },
        ],
      },
    ],
  },
  {
    id: 'law-society',
    label: '법 · 행정 · 사회',
    shortDesc: '법학 · 정치 · 공공정책',
    iconName: 'Scale',
    subjects: [
      {
        id: 'law-society-subj',
        name: '법과 사회',
        category: '진로선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '사회1실',
        summary: '헌법, 민법, 형법의 기본 원리와 청소년·생활 속 법률 쟁점을 다룹니다.',
        topics: [
          '법의 이념과 기본권 보장, 헌법 재판 제도의 역할',
          '계약·손해배상·근로기준 등 일상생활 속 민사·노동법',
          '범죄 성립 요건과 형사 절차, 모의재판을 통한 판결 연습',
        ],
        activityTip: 'AI 저작권이나 청소년 아르바이트 근로계약 관련 실제 판례를 찾아 분석해 보세요.',
        prerequisiteTip: '「정치」와 함께 들으면 사회·법학 계열 기초를 탄탄히 다질 수 있어요.',
        colorKey: 'indigo',
        defaultSlots: [
          { day: '월', period: 4 },
          { day: '수', period: 4 },
          { day: '목', period: 4 },
          { day: '화', period: 7 },
        ],
      },
      {
        id: 'politics',
        name: '정치',
        category: '일반선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '계단형강의실',
        summary: '민주주의 제도, 입법·행정·사법 과정, 정책 결정과 국제 정치를 학습합니다.',
        topics: [
          '민주주의 발전 과정과 선거 제도, 정당·이익집단 참여',
          '국회 입법 과정과 정부 정책 결정의 이해관계 분석',
          '국제 관계 이론과 외교·안보, 글로벌 거버넌스 이슈',
        ],
        activityTip: '관심 있는 공공정책(청소년 교통·교육 정책 등)을 골라 입법 제안서를 써 보세요.',
        prerequisiteTip: '1학년 「통합사회」 정치·인권 단원의 확장 과목입니다.',
        colorKey: 'emerald',
        defaultSlots: [
          { day: '월', period: 5 },
          { day: '화', period: 4 },
          { day: '수', period: 7 },
          { day: '목', period: 5 },
        ],
      },
      {
        id: 'social-problem-inquiry',
        name: '사회문제 탐구',
        category: '융합선택',
        credits: 3,
        evaluation: '성취도(A~E) 절대평가',
        room: '소규모세미나실',
        summary: '정보 사회, 저출산, 노동·환경 등 현대 사회문제를 연구 방법론으로 분석합니다.',
        topics: [
          '사회과학 탐구 절차(연구 설계, 설문·면접, 통계 자료 해석)',
          '사이버 공간·사회적 소수자·세대 갈등 등 실제 쟁점 분석',
          '소주제 팀 프로젝트 보고서 작성 및 정책 해결 방안 제안',
        ],
        activityTip: '우리 지역의 공공시설 접근성이나 청소년 노동 인권 설문조사를 진행해 보세요.',
        prerequisiteTip: '사회 융합선택 과목으로 석차등급 없이 성취도(A~E)만 기재됩니다.',
        colorKey: 'amber',
        defaultSlots: [
          { day: '월', period: 6 },
          { day: '화', period: 5 },
          { day: '목', period: 7 },
        ],
      },
    ],
  },
  {
    id: 'arch-env',
    label: '건축 · 도시 · 환경',
    shortDesc: '공간설계 · 지구 · 지속가능성',
    iconName: 'Building2',
    subjects: [
      {
        id: 'geometry',
        name: '기하',
        category: '진로선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '수학2실',
        summary: '이차곡선, 평면벡터, 공간도형과 좌표를 통해 구조와 공간 감각을 기릅니다.',
        topics: [
          '포물선·타원·쌍곡선 등 이차곡선의 성질과 건축 구조 응용',
          '평면벡터의 연산과 내적을 통한 힘과 방향의 표현',
          '공간도형, 정사영, 공간좌표를 활용한 3차원 입체 분석',
        ],
        activityTip: '현수교나 돔 지붕 건축물에 숨어 있는 이차곡선과 벡터 구조를 탐구해 보세요.',
        prerequisiteTip: '「공통수학」 도형·좌표 단원 이수 후 선택하는 수학 진로선택 과목이에요.',
        colorKey: 'indigo',
        defaultSlots: [
          { day: '월', period: 4 },
          { day: '화', period: 4 },
          { day: '수', period: 7 },
          { day: '목', period: 4 },
        ],
      },
      {
        id: 'climate-eco',
        name: '기후변화와 환경생태',
        category: '융합선택',
        credits: 3,
        evaluation: '성취도(A~E) 절대평가',
        room: '창의융합실',
        summary: '기후 위기, 탄소중립, 친환경 도시 등 생태계와 인간 공간의 공존을 탐구합니다.',
        topics: [
          '기후 변화의 과학적 메커니즘과 도시·생태계 영향 분석',
          '재생에너지 전환, 그린 빌딩 등 지속가능한 공간 설계 사례',
          '생태 감수성과 지역 사회 탄소중립 실천 프로젝트',
        ],
        activityTip: '우리 학교 건물의 에너지 효율을 높이거나 열섬 현상을 줄이는 아이디어를 설계해 보세요.',
        prerequisiteTip: '융합선택 과목으로 석차등급 없이 성취도(A~E)만 기재됩니다.',
        colorKey: 'emerald',
        defaultSlots: [
          { day: '월', period: 5 },
          { day: '수', period: 4 },
          { day: '목', period: 5 },
        ],
      },
      {
        id: 'earth-system',
        name: '지구시스템과학',
        category: '진로선택',
        credits: 3,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '지구과학실',
        summary: '지권·기권·수권의 상호작용과 지질 구조, 기상 예측 등 지구 시스템을 다룹니다.',
        topics: [
          '지구의 내부 구조, 판 구조론 심화와 지진·지반 안정성',
          '대기와 해수의 순환, 기상 현상과 기후 예측 원리',
          '한반도의 지질과 자원, 국토·공간 환경의 과학적 이해',
        ],
        activityTip: '도시 개발 시 고려해야 하는 지질 구조와 지진 내진 설계 원리를 연결해 보세요.',
        prerequisiteTip: '일반선택 「지구과학」 이수 후 심화 과목으로 선택하면 좋아요.',
        colorKey: 'amber',
        defaultSlots: [
          { day: '화', period: 5 },
          { day: '화', period: 7 },
          { day: '목', period: 7 },
        ],
      },
    ],
  },
  {
    id: 'psych-edu',
    label: '심리 · 교육',
    shortDesc: '마음 · 상담 · 배움',
    iconName: 'Brain',
    subjects: [
      {
        id: 'human-psych',
        name: '인간과 심리',
        category: '교양',
        credits: 3,
        evaluation: '이수(P) 평가',
        room: '진로상담실',
        summary: '인간의 인지, 감정, 성격 발달과 대인관계 심리를 과학적으로 이해합니다.',
        topics: [
          '감각·지각, 기억과 학습 등 인지 심리학의 기초 실험 원리',
          '동기와 정서, 스트레스 대처 및 청소년기 자아 정체성 발달',
          '집단 행동, 편견과 설득, 건강한 대인관계 의사소통',
        ],
        activityTip: '시험 불안을 줄이는 인지행동 전략이나 기억력 향상 기법을 실험해 보고 기록하세요.',
        prerequisiteTip: '교양 교과(군) 과목으로 과목 출석률 2/3 이상 충족 시 이수(P)됩니다.',
        colorKey: 'indigo',
        defaultSlots: [
          { day: '월', period: 5 },
          { day: '수', period: 4 },
          { day: '목', period: 4 },
        ],
      },
      {
        id: 'understanding-edu',
        name: '교육의 이해',
        category: '교양',
        credits: 3,
        evaluation: '이수(P) 평가',
        room: '세미나실',
        summary: '배움의 본질, 교수·학습 방법, 교육 제도와 미래 교육의 변화를 탐구합니다.',
        topics: [
          '교육의 목적과 역사, 교육 철학 및 교사의 역할 이해',
          '학습자 중심 수업 설계, 과정 중심 평가와 피드백의 원리',
          '에듀테크 활용, 교육 평등과 미래 사회의 학습 방향',
        ],
        activityTip: '또래 멘토링 활동을 진행하며 효과적인 설명 방법과 학습 동기 변화를 관찰해 보세요.',
        prerequisiteTip: '교양 교과(군) 과목으로, 학교 미개설 시 공동교육과정으로 자주 열려요.',
        colorKey: 'emerald',
        defaultSlots: [
          { day: '화', period: 4 },
          { day: '수', period: 7 },
          { day: '목', period: 5 },
        ],
      },
      {
        id: 'modern-ethics',
        name: '현대사회와 윤리',
        category: '일반선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '인문실',
        summary: '생명, 과학기술, 사회 정의 등 현대인이 마주하는 윤리적 딜레마를 성찰합니다.',
        topics: [
          '동서양 윤리 사상의 적용과 도덕적 추론 과정',
          '생명 윤리, 정보 윤리, 직업 윤리와 공정성의 기준',
          '분배 정의, 환경 윤리, 다문화 사회의 관용과 연대',
        ],
        activityTip: '상담 현장에서 마주할 수 있는 비밀 보장 의무와 안전 사이의 윤리적 판단을 정리해 보세요.',
        prerequisiteTip: '인문·사회 전반과 연결되는 대표적인 도덕 일반선택 과목입니다.',
        colorKey: 'amber',
        defaultSlots: [
          { day: '월', period: 4 },
          { day: '화', period: 5 },
          { day: '화', period: 7 },
          { day: '목', period: 7 },
        ],
      },
    ],
  },
  {
    id: 'global-lang',
    label: '국제 · 외국어',
    shortDesc: '외교 · 통번역 · 세계시민',
    iconName: 'Globe',
    subjects: [
      {
        id: 'deep-english',
        name: '심화 영어',
        category: '진로선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '어학실',
        summary: '시사·학술 영어 텍스트를 깊이 읽고 영어로 논리적인 토론과 에세이를 씁니다.',
        topics: [
          '국제 뉴스, 학술 아티클 등 다양한 장르의 영어 원문 독해',
          '글로벌 이슈에 대한 영어 프레젠테이션 및 찬반 토론',
          '논증적 영어 에세이 작성 및 어휘·문맥 표현력 확장',
        ],
        activityTip: '관심 분야의 해외 기사 두 편을 비교해 서로 다른 시각을 영어로 요약해 보세요.',
        prerequisiteTip: '「영어Ⅰ·Ⅱ」를 기반으로 2~3학년에 심화로 듣기 좋습니다.',
        colorKey: 'indigo',
        defaultSlots: [
          { day: '월', period: 4 },
          { day: '수', period: 4 },
          { day: '목', period: 4 },
          { day: '화', period: 7 },
        ],
      },
      {
        id: 'world-citizen-geo',
        name: '세계시민과 지리',
        category: '일반선택',
        credits: 4,
        evaluation: '성취도(A~E) · 5등급 병기',
        room: '사회탐구실',
        summary: '세계 각 지역의 문화, 분쟁, 경제 협력을 공간적 관점에서 이해합니다.',
        topics: [
          '대륙별 자연환경과 종교·문화적 다양성의 형성 배경',
          '세계화와 글로벌 공급망, 다국적 기업의 공간적 분업',
          '국제 분쟁 지역, 난민·기후 정의와 세계시민의 연대',
        ],
        activityTip: '특정 국제기구(UNHCR, UNESCO 등)의 활동 사례와 지역별 과제를 조사해 보세요.',
        prerequisiteTip: '외교·국제통상·지리 관련 학과 진학을 희망할 때 핵심 과목입니다.',
        colorKey: 'emerald',
        defaultSlots: [
          { day: '월', period: 5 },
          { day: '화', period: 4 },
          { day: '수', period: 7 },
          { day: '목', period: 5 },
        ],
      },
      {
        id: 'travel-geo',
        name: '여행지리',
        category: '융합선택',
        credits: 3,
        evaluation: '성취도(A~E) 절대평가',
        room: '그룹활동실',
        summary: '세계 여러 지역의 문화유산, 생태 관광, 인문 지리를 여행 관점으로 탐구합니다.',
        topics: [
          '자연·문화유산의 지리적 배경과 공정 여행의 의미',
          '지역별 음식·축제·건축 문화와 글로벌 교류 역사',
          '지속가능한 관광 루트 기획 및 지역 문화 탐구 보고서',
        ],
        activityTip: '관심 국가의 역사·문화 유적지를 연결한 공정 여행 코스를 기획해 발표해 보세요.',
        prerequisiteTip: '사회 융합선택 과목으로 석차등급 없이 성취도(A~E)만 기재됩니다.',
        colorKey: 'amber',
        defaultSlots: [
          { day: '월', period: 6 },
          { day: '화', period: 5 },
          { day: '목', period: 7 },
        ],
      },
    ],
  },
];

export const COLOR_STYLES: Record<
  SubjectColorKey,
  {
    bg: string;
    border: string;
    text: string;
    subtext: string;
    dot: string;
    badgeText: string;
  }
> = {
  indigo: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-950',
    subtext: 'text-blue-700',
    dot: 'bg-blue-600',
    badgeText: 'text-blue-700',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-950',
    subtext: 'text-emerald-700',
    dot: 'bg-emerald-600',
    badgeText: 'text-emerald-700',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-950',
    subtext: 'text-amber-800',
    dot: 'bg-amber-600',
    badgeText: 'text-amber-800',
  },
};

export const FREE_PERIOD_ACTIVITIES = [
  {
    title: '진로 · 학업 설계 상담',
    desc: '담임선생님·진로선생님과 과목 선택과 3개년 이수 계획을 점검해요.',
  },
  {
    title: '자기주도학습 · 독서',
    desc: '홈베이스나 도서관에서 복습, 진로 독서, 수행평가를 준비해요.',
  },
  {
    title: '또래 멘토링 · 주제 탐구',
    desc: '친구들과 모둠 탐구 프로젝트를 하거나 학습 멘토링에 참여해요.',
  },
  {
    title: '소인수 · 공동교육과정 수강',
    desc: '학교 미개설 과목을 온라인학교나 거점학교 수업으로 이수해요.',
  },
];
