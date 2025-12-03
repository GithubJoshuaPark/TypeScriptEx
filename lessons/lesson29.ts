// lesson29.ts
// ===============================================
// 레슨 실행 함수 - tsconfig 고급 옵션 이해
// (paths, baseUrl, strict)
// ===============================================
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
    console.log("  1) tsconfig의 baseUrl 옵션 이해");
    console.log("  2) paths 를 이용한 절대 경로 alias 설계");
    console.log("  3) strict 옵션이 TypeScript에서 왜 중요한지 이해");
    console.log("  4) 실제 예시 코드로 baseUrl & paths 구조 확인");
    console.log("");

    // ========================================
    // 1. baseUrl 옵션
    // ========================================
    console.log("📌 1. baseUrl 옵션");
    console.log("- import 경로의 기준 디렉터리를 지정합니다.");
    console.log("- 일반적으로 src 를 baseUrl 로 둡니다.");
    console.log("- 그러면 ../../ 없이 src 기준 절대경로 import 가 가능합니다.");
    console.log("");

    f_printCodeBlock(
        "baseUrl 사용 예",
        `{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}

// 기존
import { getPostList } from "../../../app/postService";

// baseUrl 사용 후
import { getPostList } from "app/postService";`
    );

    console.log("→ NodeNext + TS 조합에서 매우 자주 사용됩니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. paths 옵션
    // ========================================
    console.log("📌 2. paths 옵션");
    console.log("- baseUrl + paths 조합으로 import alias 를 만들 수 있습니다.");
    console.log("- '@app/*' → 'src/app/*' 와 같은 방식으로 매핑 가능합니다.");
    console.log("");

    f_printCodeBlock(
        "paths 사용 예시",
        `{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"],
      "@domain/*": ["domain/*"],
      "@infra/*": ["infra/*"],
      "@config/*": ["config/*"]
    }
  }
}

// 사용 예
import { Post } from "@domain/post";
import { getPostList } from "@app/postService";
import { fetchPosts } from "@infra/postRepository";`
    );

    console.log("→ 프로젝트 구조가 커질수록 alias가 유지보수를 쉽게 만들어 줍니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. strict 옵션
    // ========================================
    console.log("📌 3. strict 옵션");
    console.log("- strict 는 TypeScript 타입 안정성을 극대화하는 최상위 플래그입니다.");
    console.log("- strict: true 를 켜면, 여러 소규모 strict 옵션들이 전부 활성화됩니다.");
    console.log("");
    console.log("strict가 포함하는 주요 옵션:");
    console.log("  - strictNullChecks");
    console.log("  - strictBindCallApply");
    console.log("  - strictFunctionTypes");
    console.log("  - strictPropertyInitialization");
    console.log("  - noImplicitAny");
    console.log("");

    f_printCodeBlock(
        "strict 옵션 예시",
        `{
  "compilerOptions": {
    "strict": true
  }
}

// noImplicitAny 예시
function sum(a, b) {  // Error: a, b 타입이 any 추론
  return a + b;
}

// strictNullChecks 예시
let title: string = null;
// Error: Type 'null' is not assignable to type 'string'.`
    );

    console.log("→ strict 를 켜면 초기엔 귀찮지만, 큰 프로젝트에서 안정성을 높여줍니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. baseUrl + paths 조합 실제 프로젝트 구조 예시
    // ========================================
    console.log("📌 4. baseUrl + paths 조합 실제 프로젝트 구조");
    console.log("");

    f_printCodeBlock(
        "프로젝트 구조 예시",
        `my-ts-app/
  ├─ src/
  │   ├─ app/
  │   │   └─ postService.ts
  │   ├─ domain/
  │   │   └─ post.ts
  │   ├─ infra/
  │   │   └─ postRepository.ts
  │   ├─ config/
  │   │   └─ config.ts
  │   └─ main.ts
  ├─ tsconfig.json
  └─ package.json`
    );

    f_printCodeBlock(
        "tsconfig.json 예시 (정리버전)",
        `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",

    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"],
      "@domain/*": ["domain/*"],
      "@infra/*": ["infra/*"],
      "@config/*": ["config/*"]
    },

    "rootDir": "./src",
    "outDir": "./dist",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. baseUrl + paths 활용 예시 코드
    // ========================================
    console.log("📌 5. baseUrl + paths 활용 예시 코드");
    console.log("- 아래 예시는 '@domain/post', '@infra/postRepository' 같은 alias를 사용한 실제 import 예입니다.");
    console.log("");

    f_printCodeBlock(
        "src/main.ts",
        `import { Post } from "@domain/post";
import { getPostList } from "@app/postService";

async function main() {
  console.log("=== baseUrl + paths 테스트 ===");
  const result = await getPostList();
  if (result.ok) {
    console.log("첫 번째 제목:", result.data[0].title);
  }
}

void main();`
    );

    console.log("→ ../../../ 복잡한 상대경로를 완전히 제거할 수 있어 유지보수성이 뛰어납니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. tsconfig를 통한 구조 개선 — before & after
    // ========================================
    console.log("📌 6. before & after 비교");
    console.log("");

    f_printCodeBlock(
        "Before (상대경로 지옥)",
        `import { getPostDetail } from "../../../app/postService";
import { Post } from "../../../domain/post";`
    );

    f_printCodeBlock(
        "After (paths + baseUrl)",
        `import { getPostDetail } from "@app/postService";
import { Post } from "@domain/post";`
    );

    console.log("→ 가독성 개선 + 경로 변경 시 수정 범위 최소화");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. 실전 팁: VSCode + TS 절대경로 자동완성
    // ========================================
    console.log("📌 7. 실전 팁: VSCode 자동완성");
    console.log("- tsconfig에 baseUrl, paths 를 설정하면 VSCode에서도 자동완성 경로가 깔끔하게 뜹니다.");
    console.log("- 또한 Node.js 실행 시 ts-node (또는 ts-node-esm) 설정도 baseUrl을 존중합니다.");
    console.log("- 빌드 후 dist/ 폴더에서도 ESM import 경로를 유지하려면 NodeNext 조합이 안정적입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ tsconfig 고급 옵션 이해 (paths / baseUrl / strict) – 정리 완료!");
    console.log("💡 핵심 정리:");
    console.log("  - baseUrl: import 기준을 src 로 고정하여 유지보수 편리");
    console.log("  - paths: @app/* 같은 alias 로 경로 지옥 해결");
    console.log("  - strict: 타입 안정성의 핵심. 초반엔 빡세도 후반에 큰 가치 제공");
    console.log("  - NodeNext + baseUrl + paths 조합은 현대 Node + TS 표준 패턴");
    console.log("");
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
