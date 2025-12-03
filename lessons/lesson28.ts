// lesson28.ts
// ===============================
// 레슨 실행 함수 - Node.js + TypeScript 프로젝트 구조 설계
// ===============================
import * as readline from "node:readline";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import { getRandomEmoji, f_pause, f_printCodeBlock } from "../utils.js";

export async function run(rl: readline.Interface, title: string): Promise<void> {
    const filePath = `${basename(fileURLToPath(import.meta.url))}`;
    const baseNoExt = basename(filePath, ".js");

    console.log(`${getRandomEmoji()} --- ${baseNoExt}: ${title} ---`);
    console.log("");
    console.log("🎯 목표:");
    console.log("  1) 기본적인 Node.js + TypeScript 프로젝트 폴더 구조");
    console.log("  2) tsconfig.json, package.json 스크립트 설계");
    console.log("  3) 계층 구조 (config / domain / app / infra) 아이디어");
    console.log("  4) 간단한 예제 코드 (Express 없이 순수 Node 기준)");
    console.log("");

    // ========================================
    // 1. 최소 구성 폴더 구조
    // ========================================
    console.log("📌 1. 최소 구성 폴더 구조 예시");
    console.log("- Node.js + TS 프로젝트를 새로 만든다고 가정하고,");
    console.log("- 가장 기본적인 구조부터 잡아 봅니다.");
    console.log("");

    f_printCodeBlock(
        "기본 폴더 구조 예시",
        `my-node-ts-app/
  ├─ src/
  │   ├─ app/
  │   │   └─ index.ts
  │   ├─ config/
  │   │   └─ config.ts
  │   ├─ domain/
  │   │   └─ post.ts
  │   ├─ infra/
  │   │   └─ postRepository.ts
  │   └─ main.ts
  ├─ dist/              // 컴파일 결과물(.js) (빌드 후 생성)
  ├─ node_modules/
  ├─ package.json
  ├─ tsconfig.json
  └─ .gitignore`
    );

    console.log("→ src 에는 순수 TypeScript 소스만, dist 에는 빌드된 JS 파일만 들어가게 하는 패턴입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. tsconfig.json 기본 설계
    // ========================================
    console.log("📌 2. tsconfig.json 기본 설정 예시");
    console.log("- Node.js 20+ + ESM + TS 조합을 가정한 설정 예입니다.");
    console.log("- Joshua님 환경에 맞춰 module/target 은 필요시 조정 가능합니다.");
    console.log("");

    f_printCodeBlock(
        "tsconfig.json 예시",
        `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`
    );

    console.log("→ NodeNext 조합을 쓰면 import 경로에 .js 확장자를 붙이는 방식과 잘 맞습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. package.json 스크립트 설계
    // ========================================
    console.log("📌 3. package.json – 스크립트 설계");
    console.log("- dev(개발 서버), build(빌드), start(빌드 후 실행) 세 가지를 기본으로 두면 편합니다.");
    console.log("");

    f_printCodeBlock(
        "package.json 예시",
        `{
  "name": "my-node-ts-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "ts-node-esm src/main.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/main.js"
  },
  "dependencies": {
    // 예: "node-fetch": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "ts-node": "^10.x"
  }
}`
    );

    console.log("→ 학습용이라면 ts-node를 dev 모드에서 사용하고,");
    console.log("  실제 배포/서비스 단계에서는 build + start 조합을 추천합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. 계층 구조 아이디어 (config / domain / app / infra)
    // ========================================
    console.log("📌 4. 계층 구조 아이디어");
    console.log("- 강하게 정해진 정답은 없지만, 패턴을 가지면 큰 프로젝트가 편해집니다.");
    console.log("- 예시 레이어:");
    console.log("  - config : 설정값 / 환경변수 정리");
    console.log("  - domain : 핵심 도메인 모델, 비즈니스 규칙");
    console.log("  - infra  : 외부 시스템 (DB, API, 파일 시스템 등)");
    console.log("  - app    : use-case / 서비스 레이어 (애플리케이션 흐름)");
    console.log("  - main   : 프로그램 진입점 (bootstrap)");
    console.log("");

    f_printCodeBlock(
        "레이어 구분 예시",
        `src/
  ├─ config/
  │   └─ config.ts       // 환경 설정, URL, API 키 등
  ├─ domain/
  │   └─ post.ts         // 도메인 모델, 타입, 규칙
  ├─ infra/
  │   └─ postRepository.ts // 실제 API 호출, DB 접근 등
  ├─ app/
  │   └─ postService.ts  // 유즈케이스: 목록 조회, 단일 조회 등
  └─ main.ts             // CLI, 서버 시작, 초기화`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. config 레이어 예시 (config.ts)
    // ========================================
    console.log("📌 5. config 레이어 예시 (config.ts)");
    console.log("- 환경에 따라 바뀔 수 있는 값들을 한 곳에 모읍니다.");
    console.log("- 여기서는 JSONPlaceholder posts API URL을 사용합니다.");
    console.log("");

    f_printCodeBlock(
        "src/config/config.ts",
        `export const config = {
  apiBaseUrl: "https://jsonplaceholder.typicode.com",
  postsPath: "/posts",
};

export const ENDPOINTS = {
  posts: \`\${config.apiBaseUrl}\${config.postsPath}\`,
};`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. domain 레이어 예시 (post.ts)
    // ========================================
    console.log("📌 6. domain 레이어 예시 (post.ts)");
    console.log("- API와 1:1 대응하는 타입 + 도메인 규칙(간단한 validation 등)을 정의해 둘 수 있습니다.");
    console.log("");

    f_printCodeBlock(
        "src/domain/post.ts",
        `// API 도메인 타입
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// 간단한 도메인 유효성 검사 예시
export function isValidPostTitle(title: string): boolean {
  return title.trim().length >= 3;
}

export function isValidPostBody(body: string): boolean {
  return body.trim().length >= 10;
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. infra 레이어 예시 (postRepository.ts)
    // ========================================
    console.log("📌 7. infra 레이어 예시 (postRepository.ts)");
    console.log("- 실제로 fetch를 사용하여 JSONPlaceholder API와 통신하는 모듈입니다.");
    console.log("- 이전에 만들었던 apiService.ts 와 유사하지만,");
    console.log("  여기서는 'Repository' 개념으로 둔 예시입니다.");
    console.log("");

    f_printCodeBlock(
        "src/infra/postRepository.ts",
        `import { ENDPOINTS } from "../config/config.js";
import type { Post } from "../domain/post.js";

export type Result<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string };

async function requestJson<T>(url: string, init?: RequestInit): Promise<Result<T>> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      ...init,
    });

    const status = res.status;

    if (!res.ok) {
      return {
        ok: false,
        status,
        error: \`HTTP Error: \${status}\`,
      };
    }

    const data = (await res.json()) as T;
    return {
      ok: true,
      status,
      data,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown fetch error";
    return {
      ok: false,
      status: 0,
      error: msg,
    };
  }
}

export async function fetchPosts(): Promise<Result<Post[]>> {
  return requestJson<Post[]>(ENDPOINTS.posts);
}

export async function fetchPostById(id: number): Promise<Result<Post>> {
  return requestJson<Post>(\`\${ENDPOINTS.posts}/\${id}\`);
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. app 레이어 예시 (postService.ts)
    // ========================================
    console.log("📌 8. app 레이어 예시 (postService.ts)");
    console.log("- Repository를 사용하여 비즈니스 규칙/흐름을 담당하는 레이어입니다.");
    console.log("- 실제 서비스 코드는 여기서 조립합니다.");
    console.log("");

    f_printCodeBlock(
        "src/app/postService.ts",
        `import { fetchPosts, fetchPostById, type Result } from "../infra/postRepository.js";
import type { Post } from "../domain/post.js";

export async function getPostList(): Promise<Result<Post[]>> {
  // 필요시 여기서 캐싱, 정렬, 필터링 등 로직 추가
  return fetchPosts();
}

export async function getPostDetail(id: number): Promise<Result<Post>> {
  // 필요시 접근 권한 체크, 로깅, 에러 변환 등 추가
  return fetchPostById(id);
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 9. main.ts – Node 엔트리 포인트 예시
    // ========================================
    console.log("📌 9. main.ts – Node 엔트리 포인트 예시");
    console.log("- CLI 도구처럼 한 번 실행하고 끝나는 앱을 예시로 보여줍니다.");
    console.log("- 나중에 Express 서버를 붙이더라도 main.ts 에서 bootstrap 하면 됩니다.");
    console.log("");

    f_printCodeBlock(
        "src/main.ts",
        `import { getPostList, getPostDetail } from "./app/postService.js";

async function main() {
  console.log("=== Node + TypeScript 프로젝트 구조 데모 ===");

  console.log("\\n📂 1) 전체 Post 목록 일부 가져오기");
  const listResult = await getPostList();
  if (listResult.ok) {
    console.log("총 개수:", listResult.data.length);
    console.log("앞에서 3개만:");
    listResult.data.slice(0, 3).forEach((p) => {
      console.log(\`- [\${p.id}] \${p.title}\`);
    });
  } else {
    console.error("목록 가져오기 실패:", listResult.status, listResult.error);
  }

  console.log("\\n📂 2) 특정 Post 상세 가져오기 (id = 1)");
  const detailResult = await getPostDetail(1);
  if (detailResult.ok) {
    console.log("상세:", detailResult.data);
  } else {
    console.error("상세 가져오기 실패:", detailResult.status, detailResult.error);
  }

  console.log("\\n✅ 데모 종료");
}

void main();`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 10. lesson28 내에서 간단 시뮬레이션 (개념만)
    // ========================================
    console.log("📌 10. lesson28 안에서 개념만 간단히 시뮬레이션");
    console.log("- 실제로는 my-node-ts-app/ 구조로 새 프로젝트를 만들고,");
    console.log("- 오늘 정리한 구조를 따라 한 번 손으로 만들어 보는 것을 추천드립니다.");
    console.log("- 여기서는 단순히 '구조를 머릿속에 그려본다' 수준으로만 마무리합니다.");
    console.log("");

    console.log("1) src/config/config.ts 에 API 주소를 모아둔다.");
    console.log("2) src/domain/post.ts 에 도메인 타입(Post)과 도메인 규칙을 둔다.");
    console.log("3) src/infra/postRepository.ts 에 fetch 기반 구현을 둔다.");
    console.log("4) src/app/postService.ts 에 유즈케이스/서비스 로직을 둔다.");
    console.log("5) src/main.ts 에 프로그램 진입점을 둔다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Node.js + TypeScript 프로젝트 구조 설계 – 정리 완료!");
    console.log("💡 핵심 정리:");
    console.log("  - src / dist 를 분리하고, TS는 src, JS는 dist 에만 존재하도록 한다.");
    console.log("  - tsconfig.json / package.json 스크립트를 일관되게 설계한다.");
    console.log("  - config / domain / infra / app / main 같은 레이어로 나눠두면 큰 프로젝트에도 확장 가능하다.");
    console.log("  - 실제로 작은 샘플 프로젝트를 하나 만들어 손으로 구조를 따라가 보는 것이 가장 큰 도움이 된다.");
    console.log("");
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
