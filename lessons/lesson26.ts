// lesson26.ts
// ===============================
// 레슨 실행 함수 - 타입 안전한 API Client 만들기 (Fetch + TS)
// 사용 API: https://jsonplaceholder.typicode.com/posts
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
    console.log("  1) JSONPlaceholder posts API 타입 정의");
    console.log("  2) 제네릭 fetch 래퍼 함수 만들기");
    console.log("  3) Result 타입(성공/실패)으로 안전하게 다루기");
    console.log("  4) 실제로 posts 데이터를 가져와서 타입 안전하게 사용하는 예제");
    console.log("");

    // ========================================
    // 1. API 응답 타입 정의 (Post)
    // ========================================
    console.log("📌 1. JSONPlaceholder Post 타입 정의");
    console.log("URL: https://jsonplaceholder.typicode.com/posts");
    console.log("- 응답 예(1개):");
    console.log('  { "userId": 1, "id": 1, "title": "...", "body": "..." }');
    console.log("");

    interface Post {
        userId: number;
        id: number;
        title: string;
        body: string;
    }

    f_printCodeBlock(
        "Post 인터페이스",
        `interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}`
    );

    console.log("→ 앞으로 이 Post 타입을 기반으로 타입 안전한 Client를 만들어 봅니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. HTTP 메서드 & 기본 옵션 타입 정의
    // ========================================
    console.log("📌 2. HTTP 메서드 & 기본 옵션 타입 정의");

    type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

    interface RequestOptions {
        method?: HttpMethod;
        headers?: Record<string, string>;
        body?: unknown;
    }

    f_printCodeBlock(
        "HttpMethod / RequestOptions",
        `type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
}`
    );

    console.log("→ body는 아직 unknown 으로 두고, 실제로 보낼 때 JSON.stringify 해서 사용합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. Result 타입 (성공 / 실패) 정의
    // ========================================
    console.log("📌 3. Result 타입 정의 – 성공 / 실패를 타입으로 표현");
    console.log("- API 호출은 항상 성공/실패가 함께 따라다니므로,");
    console.log("  이를 Discriminated Union으로 표현해 두면 쓰기가 편합니다.");
    console.log("");

    type Ok<T> = {
        ok: true;
        status: number;
        data: T;
    };

    type Err = {
        ok: false;
        status: number;
        error: string;
    };

    type Result<T> = Ok<T> | Err;

    f_printCodeBlock(
        "Result 타입 정의",
        `type Ok<T> = {
  ok: true;
  status: number;
  data: T;
};

type Err = {
  ok: false;
  status: number;
  error: string;
};

type Result<T> = Ok<T> | Err;`
    );

    console.log("→ 이제 fetch 래퍼는 항상 Result<T> 형태로 값을 돌려주게 만들어 봅니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. 제네릭 fetch 래퍼: requestJson<T>
    // ========================================
    console.log("📌 4. 제네릭 fetch 래퍼: requestJson<T>");
    console.log("- T에는 '기대하는 응답 타입(Post, Post[], ...)' 을 넣습니다.");
    console.log("- 내부에서 JSON.parse 결과를 T로 단언(as T)하지만,");
    console.log("  실제 데이터 구조는 우리가 정의한 타입과 맞도록 API를 잘 파악해야 합니다.");
    console.log("");

    async function requestJson<T>(
        url: string,
        options: RequestOptions = {}
    ): Promise<Result<T>> {
        const { method = "GET", headers = {}, body } = options;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    ...headers
                },
                body: body != null ? JSON.stringify(body) : undefined
            });

            const status = response.status;

            if (!response.ok) {
                // 에러 응답도 가능하면 메시지 추출 시도
                let message = `HTTP Error: ${status}`;
                try {
                    const errorJson = (await response.json()) as { error?: string };
                    if (errorJson && typeof errorJson.error === "string") {
                        message = errorJson.error;
                    }
                } catch {
                    // ignore json parse error
                }
                return {
                    ok: false,
                    status,
                    error: message
                };
            }

            const data = (await response.json()) as T;

            return {
                ok: true,
                status,
                data
            };
        } catch (e) {
            const message =
                e instanceof Error ? e.message : "Unknown fetch error (network?)";
            return {
                ok: false,
                status: 0,
                error: message
            };
        }
    }

    f_printCodeBlock(
        "requestJson<T> 구현",
        `async function requestJson<T>(
  url: string,
  options: RequestOptions = {}
): Promise<Result<T>> {
  const { method = "GET", headers = {}, body } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...headers,
      },
      body: body != null ? JSON.stringify(body) : undefined,
    });

    const status = response.status;

    if (!response.ok) {
      let message = \`HTTP Error: \${status}\`;
      try {
        const errorJson = (await response.json()) as { error?: string };
        if (errorJson && typeof errorJson.error === "string") {
          message = errorJson.error;
        }
      } catch {
        // ignore
      }
      return { ok: false, status, error: message };
    }

    const data = (await response.json()) as T;

    return { ok: true, status, data };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unknown fetch error (network?)";
    return { ok: false, status: 0, error: message };
  }
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. posts 전용 타입 안전한 Client 함수들
    // ========================================
    console.log("📌 5. posts 전용 타입 안전한 Client 함수들");
    console.log("- JSONPlaceholder posts API 전용 헬퍼를 만들어 봅니다.");
    console.log("");

    const POSTS_BASE_URL = "https://jsonplaceholder.typicode.com/posts";

    async function getPosts(): Promise<Result<Post[]>> {
        return requestJson<Post[]>(POSTS_BASE_URL);
    }

    async function getPostById(id: number): Promise<Result<Post>> {
        return requestJson<Post>(`${POSTS_BASE_URL}/${id}`);
    }

    async function createPost(
        post: Omit<Post, "id">
    ): Promise<Result<Post>> {
        return requestJson<Post>(POSTS_BASE_URL, {
            method: "POST",
            body: post
        });
    }

    f_printCodeBlock(
        "타입 안전한 posts 전용 Client",
        `const POSTS_BASE_URL = "https://jsonplaceholder.typicode.com/posts";

async function getPosts(): Promise<Result<Post[]>> {
  return requestJson<Post[]>(POSTS_BASE_URL);
}

async function getPostById(id: number): Promise<Result<Post>> {
  return requestJson<Post>(\`\${POSTS_BASE_URL}/\${id}\`);
}

async function createPost(post: Omit<Post, "id">): Promise<Result<Post>> {
  return requestJson<Post>(POSTS_BASE_URL, {
    method: "POST",
    body: post,
  });
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. Result<Post[]> 를 안전하게 사용하는 패턴
    // ========================================
    console.log("📌 6. Result<Post[]> 안전하게 사용하기");

    function printPostsResult(result: Result<Post[]>): void {
        if (!result.ok) {
            console.log("❌ posts 가져오기 실패:");
            console.log("   status :", result.status);
            console.log("   error  :", result.error);
            return;
        }

        console.log("✅ posts 가져오기 성공!");
        console.log(`   status: ${result.status}`);
        console.log(`   총 개수: ${result.data.length}`);
        console.log("");

        const first3 = result.data.slice(0, 3);
        first3.forEach((post) => {
            console.log(`- [${post.id}] userId=${post.userId}`);
            console.log(`  title: ${post.title}`);
            console.log("");
        });
    }

    f_printCodeBlock(
        "Result<Post[]> 사용 예",
        `function printPostsResult(result: Result<Post[]>): void {
  if (!result.ok) {
    console.log("❌ posts 가져오기 실패:", result.status, result.error);
    return;
  }

  console.log("✅ posts 가져오기 성공!");
  console.log("총 개수:", result.data.length);

  const first3 = result.data.slice(0, 3);
  first3.forEach((post) => {
    console.log(\`[\${post.id}] \${post.title}\`);
  });
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. 실제 호출 – getPosts, getPostById
    // ========================================
    console.log("📌 7. 실제 API 호출 (네트워크 필요)");
    console.log("- 아래 코드는 실제로 인터넷 연결이 되어 있어야 동작합니다.");
    console.log("- JSONPlaceholder는 테스트용 공개 API 입니다.");
    console.log("");

    try {
        console.log("🌐 1) GET /posts 호출 중...");
        const postsResult = await getPosts();
        printPostsResult(postsResult);
    } catch (e) {
        console.log("❌ getPosts() 실행 중 알 수 없는 오류:", e);
    }

    console.log("");
    await f_pause(rl);

    try {
        console.log("🌐 2) GET /posts/1 호출 중...");
        const post1Result = await getPostById(1);
        if (post1Result.ok) {
            console.log("✅ 1번 Post:");
            console.log(post1Result.data);
        } else {
            console.log("❌ 1번 Post 가져오기 실패:", post1Result.status, post1Result.error);
        }
    } catch (e) {
        console.log("❌ getPostById(1) 실행 중 알 수 없는 오류:", e);
    }

    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. (선택) createPost 예제 – JSONPlaceholder 특징 안내
    // ========================================
    console.log("📌 8. createPost 예제 (JSONPlaceholder는 실제로 저장되진 않음)");
    console.log("- JSONPlaceholder는 테스트용이기 때문에,");
    console.log("  POST 요청은 항상 성공처럼 보이지만 실제로 서버에 저장되지는 않습니다.");
    console.log("");

    try {
        const newPost: Omit<Post, "id"> = {
            userId: 999,
            title: "Hello TypeScript API Client",
            body: "This is a fake post created for TypeScript practice."
        };

        console.log("🌐 POST /posts 호출 중...");
        const createResult = await createPost(newPost);

        if (createResult.ok) {
            console.log("✅ 새 Post 응답:");
            console.log(createResult.data);
        } else {
            console.log("❌ 새 Post 생성 실패:", createResult.status, createResult.error);
        }
    } catch (e) {
        console.log("❌ createPost 실행 중 알 수 없는 오류:", e);
    }

    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ 타입 안전한 API Client 만들기 (Fetch + TS) 정리 완료!");
    console.log("💡 핵심 정리:");
    console.log("  - API 응답 구조를 먼저 Type / Interface 로 정확히 정의한다.");
    console.log("  - 제네릭 fetch 래퍼(requestJson<T>) 를 만들어 재사용성을 높인다.");
    console.log("  - Result<T> (성공/실패) 타입으로 오류 처리 흐름을 명확하게 만든다.");
    console.log("  - 도메인별 전용 함수(getPosts, getPostById, createPost 등)를 만들어 사용 측을 단순하게 유지한다.");
    console.log("");
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
