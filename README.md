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
TypeScriptEx
├─ package.json
├─ tsconfig.json
├─ main.ts
├─ utils.ts
└─ lessons
   ├─ lesson01.ts
   ├─ lesson02.ts
   ├─ ...
   └─ lesson30.ts

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

---

```bash
npm run build # build js files into dist folder
npm run start # run node dist/main.js
```

> 결국, *.ts 파일들은 tsc (TypeScript compiler)를 통해 *.js 파일로 변환됩니다.
> 변환된 js 파일들은 node.js 환경에서 실행됩니다.

---
