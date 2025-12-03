# ✅ TypeScript Step-by-Step — 30 Example Source Titles

### TypeScript Fundamentals

Why TypeScript?
- 타입 추론(Type Inference): 타입을 명시적으로 선언하지 않아도, TypeScript가 코드를 분석하여 타입을 추론하는 기능
- 타입 체크(Type Checking): 컴파일 시점에서 타입 오류를 검출하여 런타임 오류를 방지
- 코드 자동완성(Autocomplete): IDE에서 타입 정보를 기반으로 코드를 자동완성
- 문서화(Documentation): 타입 정보를 통해 코드의 의도를 문서화
- 유지보수(Maintenance): 타입 시스템을 통해 코드의 일관성을 유지

---

(기초 → 중급 → 고급/실전)
🔹 1단계: 기초 Fundamentals (1–10)
1. Hello TypeScript – ts-node 환경에서 첫 출력하기
2. 타입 선언 기초 – number, string, boolean, any 실습
3. 타입 추론(Type Inference) 이해하기
4. 배열 & 튜플 타입 선언하기
5. 객체 타입(Object Types) 기초 만들기
6. 함수 타입 정의 – parameter / return 타입 지정
7. Union 타입 & Literal 타입 활용 예제
8. Type Alias(타입 별칭) 활용하기
9. Enum 사용법 – 상수 그룹 정의하기
10. Interface 기본 사용 – 구조적 타입 시스템 이해

🔹 2단계: 중급 Intermediate (11–20)
11. Interface 확장 & Intersection Types(교차 타입)
12. Optional / Readonly / readonly 배열 다루기
13. Narrowing – 타입 좁히기 (typeof, in, instanceof)
14. Generic 함수 만들기 (기초)
15. Generic Interface & Generic Type Alias
16. 클래스(Class) 문법 – 생성자, 접근 제한자, 상속
17. 클래스 + 인터페이스 implements 적용 예제
18. 타입 가드(Type Guard) 직접 구현하기
19. 유틸리티 타입(Partial, Pick, Omit, Record)
20. Mapped Types – 재활용 타입 만들기

🔹 3단계: 고급/실전 Advanced & Expert (21–30)
21. Conditional Types – 삼항 타입 활용하기
22. Infer 키워드로 타입 추론 제어하기
23. Template Literal Types – 문자열 기반 타입 생성하기
24. Discriminated Union으로 안전한 상태머신 만들기
25. Deep Readonly, Deep Partial 직접 구현하기
26. 타입 안전한 API Client 만들기 (Fetch + TS)
27. 타입 안전한 Form Model 설계하기 (React 예제 포함)
28. Node.js + TypeScript 프로젝트 구조 설계
29. tsconfig 고급 옵션 이해 (paths, baseUrl, strict 등)
30. TypeScript로 라이브러리/SDK 개발하기 (d.ts 포함)

```bash
# Project structure
typeScriptEx/
├── main.ts                 # 메인 진입점 (메뉴 시스템)
├── utils.ts                # 공통 유틸리티 함수
├── lessons/                # 30개의 레슨 파일
│   ├── lesson01.ts
│   ├── lesson02.ts
│   └── ... (lesson30.ts까지)
├── dist/                   # 컴파일된 JavaScript 파일
├── package.json
├── tsconfig.json
└── make_empty_lesson_files.sh  # 레슨 파일 생성 스크립트
```

```bash
npm init -y
npm install --save-dev typescript @types/node

```

```json
// package.json
{
  "name": "typescript-ex",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/main.js"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^22.0.0"
  }
}

// tsconfig.json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "rootDir": "./",
        "outDir": "./dist",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "types": [
            "node"
        ]
    },
    "include": [
        "./**/*.ts"
    ]
}
```

```bash
  🎯 주요 구성 요소
  1. main.ts - 메뉴 시스템
    - 30개의 레슨 목록을 표시하는 대화형 메뉴
    - 사용자가 번호를 입력하면 해당 레슨을 동적으로 로드하여 실행
    - readline 모듈을 사용한 터미널 입력/출력 처리
    - 각 레슨의
      run(rl, title)
      함수를 호출
  2. utils.ts - 공통 유틸리티
    - getRandomEmoji(): 랜덤 이모지 생성 (메뉴와 레슨에서 사용)
    - f_pause(rl): 사용자가 Enter를 누를 때까지 일시정지
    - ask(rl, question)
  : 사용자 입력을 받는 헬퍼 함수
```

🛠️ 기술 스택
ES Modules 사용
json
{
  "type": "module",  // package.json
  "module": "NodeNext",  // tsconfig.json
  "moduleResolution": "NodeNext"
}
중요한 차이점:

❌ CommonJS: __filename, __dirname, require()
✅ ES Modules: import.meta.url, fileURLToPath(), import
TypeScript 설정
Target: ES2022
Strict Mode: 활성화
출력: dist/ 폴더에 컴파일된 .js 파일 생성

```bash
실행 흐름:

1. tsc 명령으로 모든 .ts 파일을 .js로 변환 → dist/ 폴더
2. node dist/main.js 실행
3. 메뉴에서 레슨 번호 입력
4. 동적 import로 해당 레슨 모듈 로드
5. 레슨의 run() 함수 실행
```

---

```bash
npm run build # build js files into dist folder
npm run start # run node dist/main.js
```

> 결국, *.ts 파일들은 tsc (TypeScript compiler)를 통해 *.js 파일로 변환됩니다.
> 변환된 js 파일들은 node.js 환경에서 실행됩니다.

---

## JavaScript에서 `null` vs `undefined` 비교

### 📊 비교 표

| 구분 | `null` | `undefined` |
|------|--------|-------------|
| **의미** | "값이 없음"을 **명시적으로** 나타냄 | "값이 할당되지 않음"을 나타냄 |
| **타입** | `object` (역사적 버그) | `undefined` |
| **할당 방식** | 개발자가 **의도적으로** 할당 | 자동으로 할당됨 (기본값) |
| **사용 시나리오** | 값을 비우고 싶을 때 | 변수 선언만 하고 초기화 안 했을 때 |
| **함수 반환값** | 명시적으로 `return null` | `return` 없거나 `return;`만 있을 때 |
| **객체 프로퍼티** | 명시적으로 `obj.key = null` | 존재하지 않는 프로퍼티 접근 시 |
| **함수 매개변수** | 명시적으로 `func(null)` | 인자를 전달하지 않았을 때 |
| **JSON 지원** | ✅ 지원 (`JSON.stringify`) | ❌ 지원 안 됨 (생략됨) |
| **typeof 결과** | `"object"` | `"undefined"` |
| **== 비교** | `null == undefined` → `true` | `null == undefined` → `true` |
| **=== 비교** | `null === undefined` → `false` | `null === undefined` → `false` |
| **Boolean 변환** | `false` (falsy) | `false` (falsy) |
| **숫자 변환** | `0` | `NaN` |