// lesson30.ts
// ===============================================
// 레슨 실행 함수 - TypeScript로 라이브러리/SDK 개발하기 (d.ts 포함)
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
    console.log("  1) 라이브러리/SDK 관점에서의 TypeScript 구조 이해");
    console.log("  2) Public API를 index.ts(또는 barrel)로 설계하는 방법");
    console.log("  3) declaration(.d.ts) 자동 생성 설정");
    console.log("  4) 필요 시 수동 .d.ts 파일 작성 예시");
    console.log("");

    // ========================================
    // 1. 라이브러리/SDK 관점에서의 구조
    // ========================================
    console.log("📌 1. 라이브러리/SDK 관점에서의 구조");
    console.log("- 일반 앱과 달리 라이브러리는 '내가 제공하는 API 표면' 이 중요합니다.");
    console.log("- 그 API 표면을 index.ts 에서 명확하게 정리해 두는 패턴이 많이 쓰입니다.");
    console.log("");

    f_printCodeBlock(
        "예시 프로젝트 구조 (string-utils 라이브러리)",
        `ts-string-utils/
  ├─ src/
  │   ├─ core/
  │   │   ├─ pad.ts
  │   │   └─ case.ts
  │   ├─ types/
  │   │   └─ index.ts
  │   └─ index.ts      // Public API (barrel)
  ├─ dist/             // 빌드 결과 (JS + d.ts)
  ├─ package.json
  └─ tsconfig.json`
    );

    console.log("→ src 내부의 세부 구조는 바뀔 수 있지만,");
    console.log("   외부에 노출되는 것은 src/index.ts 에서 export 하는 것들로 제한하는 것이 포인트입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. Public API 설계 – index.ts (barrel)
    // ========================================
    console.log("📌 2. Public API 설계 – index.ts (barrel 파일)");
    console.log("- 라이브러리 사용자 입장에서는 '어떤 함수/타입을 import 할 수 있느냐' 가 중요합니다.");
    console.log("- index.ts 에서 내보내고 싶은 것만 export 해서, 내부 구현 세부사항을 숨깁니다.");
    console.log("");

    f_printCodeBlock(
        "src/core/pad.ts",
        `export function padLeft(value: string, length: number, fill = " "): string {
  if (value.length >= length) return value;
  return fill.repeat(length - value.length) + value;
}

export function padRight(value: string, length: number, fill = " "): string {
  if (value.length >= length) return value;
  return value + fill.repeat(length - value.length);
}`
    );

    f_printCodeBlock(
        "src/core/case.ts",
        `export function toTitleCase(value: string): string {
  return value
    .split(/\\s+/)
    .map((word) =>
      word.length === 0
        ? ""
        : word[0].toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

export function toSnakeCase(value: string): string {
  return value
    .trim()
    .replace(/\\s+/g, "_")
    .toLowerCase();
}`
    );

    f_printCodeBlock(
        "src/types/index.ts",
        `export interface PadOptions {
  length: number;
  fill?: string;
}

export interface StringTransformOptions {
  trim?: boolean;
  maxLength?: number;
}`
    );

    f_printCodeBlock(
        "src/index.ts (Public API)",
        `export { padLeft, padRight } from "./core/pad.js";
export { toTitleCase, toSnakeCase } from "./core/case.js";
export type { PadOptions, StringTransformOptions } from "./types/index.js";`
    );

    console.log("→ 사용자 입장에서는:");
    console.log('   import { padLeft, toTitleCase } from "ts-string-utils";');
    console.log("   처럼 index.ts 에서 export 한 것만 쓸 수 있게 됩니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. tsconfig – declaration(.d.ts) 자동 생성 설정
    // ========================================
    console.log("📌 3. tsconfig – declaration(.d.ts) 자동 생성 설정");
    console.log("- 라이브러리는 JS 코드뿐 아니라 타입 정보(.d.ts)도 함께 제공하는 것이 중요합니다.");
    console.log("- TS 컴파일러에서 declaration 옵션을 켜면 자동으로 .d.ts 를 생성해 줍니다.");
    console.log("");

    f_printCodeBlock(
        "tsconfig.json (라이브러리용 예시)",
        `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,             // ✅ .d.ts 생성
    "declarationMap": true,          // (선택) d.ts -> ts 소스 맵
    "emitDeclarationOnly": false,    // JS + d.ts 함께 출력
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`
    );

    console.log("→ 빌드(tsc)를 실행하면 dist/ 아래에:");
    console.log("   - dist/index.js");
    console.log("   - dist/index.d.ts");
    console.log("   - dist/core/pad.js / pad.d.ts ...");
    console.log("   등으로 JS + 타입 선언 파일이 같이 생성됩니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. package.json – main / module / types 필드
    // ========================================
    console.log("📌 4. package.json – main / module / types 필드");
    console.log("- 라이브러리 배포 시, JS 번들과 타입 선언 파일 위치를 package.json 에 알려야 합니다.");
    console.log("");

    f_printCodeBlock(
        "package.json (라이브러리 예시)",
        `{
  "name": "ts-string-utils",
  "version": "1.0.0",
  "description": "Simple string utility library written in TypeScript",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",        // ✅ 타입 선언 진입점
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "devDependencies": {
    "typescript": "^5.x"
  }
}`
    );

    console.log("→ 'types' 필드는 TypeScript/IDE에게 타입 선언 파일의 위치를 알려줍니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. 자동 생성된 .d.ts 가 어떻게 생기는지
    // ========================================
    console.log("📌 5. 자동 생성된 index.d.ts 가 어떻게 생기는지 (예상 형태)");
    console.log("- 실제 생성 결과는 약간 다를 수 있지만, 개념적으로는 아래와 비슷합니다.");
    console.log("");

    f_printCodeBlock(
        "dist/index.d.ts (예상)",
        `export declare function padLeft(value: string, length: number, fill?: string): string;
export declare function padRight(value: string, length: number, fill?: string): string;
export declare function toTitleCase(value: string): string;
export declare function toSnakeCase(value: string): string;

export interface PadOptions {
  length: number;
  fill?: string;
}

export interface StringTransformOptions {
  trim?: boolean;
  maxLength?: number;
}`
    );

    console.log("→ 이 파일만 있으면 JS 환경에서 이 라이브러리를 쓸 때도 IDE/TS가 타입 정보를 알 수 있게 됩니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. 수동 .d.ts 작성 예시 (타입 선언만 제공하는 경우)
    // ========================================
    console.log("📌 6. 수동 .d.ts 작성 예시");
    console.log("- 이미 JS로 작성된 라이브러리, 또는 JS 빌드 결과만 있는 경우");
    console.log("  타입 정보만 따로 .d.ts 로 제공할 수도 있습니다.");
    console.log("");

    f_printCodeBlock(
        "index.d.ts (수동 작성 예시)",
        `// JS로 구현되어 있는 string-utils에 대한 타입 선언
// ex) dist/index.js 를 위한 타입 선언이라고 가정

export function padLeft(value: string, length: number, fill?: string): string;
export function padRight(value: string, length: number, fill?: string): string;

export function toTitleCase(value: string): string;
export function toSnakeCase(value: string): string;

export interface PadOptions {
  length: number;
  fill?: string;
}`
    );

    console.log("→ 이 경우 package.json 의 'types': './index.d.ts' 로 연결해 주면 됩니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. 작은 SDK 예시 – API Client를 라이브러리 형태로
    // ========================================
    console.log("📌 7. 작은 SDK 예시 – JSONPlaceholder Posts Client 라이브러리");
    console.log("- lesson26에서 만들었던 형태를 라이브러리로 추출한다고 가정해 봅니다.");
    console.log("");

    f_printCodeBlock(
        "src/postsClient.ts (SDK Core)",
        `export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type Result<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string };

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

async function requestJson<T>(url: string): Promise<Result<T>> {
  try {
    const res = await fetch(url);
    const status = res.status;
    if (!res.ok) {
      return { ok: false, status, error: \`HTTP Error: \${status}\` };
    }
    const data = (await res.json()) as T;
    return { ok: true, status, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, status: 0, error: msg };
  }
}

export async function getPosts(): Promise<Result<Post[]>> {
  return requestJson<Post[]>(BASE_URL);
}

export async function getPostById(id: number): Promise<Result<Post>> {
  return requestJson<Post>(\`\${BASE_URL}/\${id}\`);
}`
    );

    f_printCodeBlock(
        "src/index.ts (SDK Public API)",
        `export type { Post, Result } from "./postsClient.js";
export { getPosts, getPostById } from "./postsClient.js";`
    );

    console.log("→ 빌드 후 dist/index.d.ts 가 자동 생성되면,");
    console.log("   이 작은 SDK를 npm에 publish하여 다른 프로젝트에서 재사용할 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 라이브러리 소비자 관점에서의 사용 예시
    // ========================================
    console.log("📌 8. 라이브러리 소비자 관점에서의 사용 예시");
    console.log("- 'ts-string-utils' 또는 'posts-sdk' 를 실제로 사용하는 쪽 코드 관점입니다.");
    console.log("");

    f_printCodeBlock(
        "다른 프로젝트에서 사용 예 (ESM)",
        `import { padLeft, toTitleCase } from "ts-string-utils";
import { getPosts, type Result, type Post } from "posts-sdk";

async function demo() {
  const padded = padLeft("42", 5, "0"); // 타입 추론: string
  console.log("padded:", padded);

  const title = toTitleCase("hello typescript library world");
  console.log("title:", title);

  const result: Result<Post[]> = await getPosts();
  if (result.ok) {
    console.log("총 post 개수:", result.data.length);
  }
}

void demo();`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 9. 라이브러리/SDK 설계 시 타입 관점에서의 팁
    // ========================================
    console.log("📌 9. 라이브러리/SDK 설계 시 타입 관점에서의 팁");
    console.log("- 1) Public API를 '좁고 명확하게' 설계 (index.ts)");
    console.log("- 2) 내부 구현 타입은 export 하지 않고 숨기기 (구현 교체 자유도 ↑)");
    console.log("- 3) Result<T> / Error 타입 등을 일관되게 사용 (사용자 경험 ↑)");
    console.log("- 4) generics를 사용해 입력/출력 타입을 유연하게 만들기");
    console.log("- 5) 디폴트 타입 매개변수, 유틸리티 타입(Partial, Readonly 등)을 적극 활용");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 10. lesson30 내에서 아주 간단한 데모
    // ========================================
    console.log("📌 10. lesson30 안에서 간단한 타입 시연");
    console.log("- 간단한 string-utils 느낌의 함수를 정의하고,");
    console.log("- 이 함수를 라이브러리 내부에서 사용한다고 가정합니다.");
    console.log("");

    // 내부 구현이라고 가정
    type StringUtilOptions = {
        trim?: boolean;
        maxLength?: number;
    };

    function transform(
        input: string,
        options: StringUtilOptions = {}
    ): string {
        let result = input;
        if (options.trim) {
            result = result.trim();
        }
        if (typeof options.maxLength === "number") {
            result = result.slice(0, options.maxLength);
        }
        return result;
    }

    console.log("transform('   Hello TypeScript SDK   ', { trim: true, maxLength: 12 })");
    const demoResult = transform("   Hello TypeScript SDK   ", {
        trim: true,
        maxLength: 12
    });
    console.log("→ 결과:", demoResult);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ TypeScript로 라이브러리/SDK 개발하기 (d.ts 포함) – 정리 완료!");
    console.log("💡 핵심 정리:");
    console.log("  - 라이브러리는 'Public API(무엇을 export 할 것인가?)' 가 가장 중요하다.");
    console.log("  - tsconfig에서 declaration 옵션을 켜면 .d.ts를 자동으로 생성할 수 있다.");
    console.log("  - package.json 의 main/module/types/exports 를 통해 번들 + 타입 파일 경로를 노출한다.");
    console.log("  - 필요시 수동 .d.ts를 작성해 기존 JS 라이브러리에도 타입을 붙일 수 있다.");
    console.log("  - 작은 util/SDK부터 직접 만들어 보고 npm publish 까지 경험해 보면 실무 감각이 확 올라간다.");
    console.log("");
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
