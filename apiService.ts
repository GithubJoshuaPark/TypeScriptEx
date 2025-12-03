// apiService.ts
// ===============================
// 타입 안전한 API Client (JSONPlaceholder posts)
// 사용 API: https://jsonplaceholder.typicode.com/posts
// ===============================

// ▸ JSONPlaceholder Post 타입
export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

// ▸ HTTP 메서드 & 옵션 타입
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: unknown;
}

// ▸ Result 타입 (성공 / 실패)
export type Ok<T> = {
    ok: true;
    status: number;
    data: T;
};

export type Err = {
    ok: false;
    status: number;
    error: string;
};

export type Result<T> = Ok<T> | Err;

// ▸ 공통 fetch 래퍼: requestJson<T>
export async function requestJson<T>(
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

        // HTTP 에러 상태 처리
        if (!response.ok) {
            let message = `HTTP Error: ${status}`;
            try {
                const errorJson = (await response.json()) as { error?: string };
                if (errorJson && typeof errorJson.error === "string") {
                    message = errorJson.error;
                }
            } catch {
                // 에러 바디 JSON 파싱 실패는 무시
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

// ▸ posts 전용 Client 함수들
export const POSTS_BASE_URL = "https://jsonplaceholder.typicode.com/posts";

export async function getPosts(): Promise<Result<Post[]>> {
    return requestJson<Post[]>(POSTS_BASE_URL);
}

export async function getPostById(id: number): Promise<Result<Post>> {
    return requestJson<Post>(`${POSTS_BASE_URL}/${id}`);
}

export async function createPost(
    post: Omit<Post, "id">
): Promise<Result<Post>> {
    return requestJson<Post>(POSTS_BASE_URL, {
        method: "POST",
        body: post
    });
}

// ▸ Result<Post[]> 출력 유틸
export function printPostsResult(result: Result<Post[]>): void {
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
