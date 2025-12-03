// lesson27.ts
// ===============================
// 레슨 실행 함수 - 타입 안전한 Form Model 설계하기 (React 예제)
// 사용 API: https://jsonplaceholder.typicode.com/posts
// apiService.ts 사용
// ===============================
import * as readline from "node:readline";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import { getRandomEmoji, f_pause, f_printCodeBlock } from "../utils.js";
import {
    getPostById,
    createPost,
    type Post,
    type Result
} from "../apiService.js";

export async function run(rl: readline.Interface, title: string): Promise<void> {
    const filePath = `${basename(fileURLToPath(import.meta.url))}`;
    const baseNoExt = basename(filePath, ".js");

    console.log(`${getRandomEmoji()} --- ${baseNoExt}: ${title} ---`);
    console.log("");
    console.log("🎯 목표:");
    console.log("  1) 도메인 타입(Post)과 별도의 Form Model 타입을 분리해서 설계");
    console.log("  2) 타입 안전한 검증 함수(validate) 정의");
    console.log("  3) API용 payload 변환 함수 만들기");
    console.log("  4) React 컴포넌트 코드 예시(실제 렌더링 X, 타입 설계에 집중)");
    console.log("");

    // ========================================
    // 1. 도메인 타입(Post) vs Form Model 타입
    // ========================================
    console.log("📌 1. 도메인 타입(Post) vs Form Model 타입 분리");
    console.log("- 도메인(Post) 타입은 서버 API와 1:1 대응:");
    console.log("  interface Post { userId; id; title; body }");
    console.log("- Form은 '입력 중' 상태를 표현해야 해서,");
    console.log("  문자열, optional, 기본값 등 Form 전용 타입이 따로 있으면 편합니다.");
    console.log("");

    type PostFormValues = {
        userId: number; // 이 예제에서는 number 고정 (혹은 select로 선택)
        title: string;
        body: string;
    };

    type PostFormErrors = {
        userId?: string;
        title?: string;
        body?: string;
    };

    type SubmitStatus = "idle" | "submitting" | "success" | "error";

    type PostFormState = {
        values: PostFormValues;
        errors: PostFormErrors;
        status: SubmitStatus;
        lastResult?: Result<Post>;
    };

    f_printCodeBlock(
        "도메인 타입 vs Form Model 타입",
        `// 도메인 타입 (apiService.ts 에서 가져온 타입)
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Form 전용 타입
type PostFormValues = {
  userId: number;
  title: string;
  body: string;
};

type PostFormErrors = {
  userId?: string;
  title?: string;
  body?: string;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type PostFormState = {
  values: PostFormValues;
  errors: PostFormErrors;
  status: SubmitStatus;
  lastResult?: Result<Post>;
};`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. Form 초기값 & 도메인 → Form 변환 함수
    // ========================================
    console.log("📌 2. Form 초기값 & 도메인(Post) → Form 변환 함수");

    const defaultPostFormValues: PostFormValues = {
        userId: 1,
        title: "",
        body: ""
    };

    function fromPostToFormValues(post: Post): PostFormValues {
        return {
            userId: post.userId,
            title: post.title,
            body: post.body
        };
    }

    f_printCodeBlock(
        "초기값 / 도메인 → Form 변환",
        `const defaultPostFormValues: PostFormValues = {
  userId: 1,
  title: "",
  body: "",
};

function fromPostToFormValues(post: Post): PostFormValues {
  return {
    userId: post.userId,
    title: post.title,
    body: post.body,
  };
}`
    );

    console.log("→ React 컴포넌트에서는 이 함수를 써서 서버 데이터로 Form을 prefill 할 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. Form → API payload 변환 함수
    // ========================================
    console.log("📌 3. Form → API payload 변환 함수");
    console.log("- JSONPlaceholder POST /posts 는 { userId, title, body } 를 받고 id 는 서버에서 부여됩니다.");
    console.log("- 따라서 payload는 Omit<Post, 'id'> 타입으로 표현할 수 있습니다.");
    console.log("");

    type PostCreatePayload = Omit<Post, "id">;

    function toCreatePayload(values: PostFormValues): PostCreatePayload {
        return {
            userId: values.userId,
            title: values.title,
            body: values.body
        };
    }

    f_printCodeBlock(
        "Form → API payload 변환",
        `type PostCreatePayload = Omit<Post, "id">;

function toCreatePayload(values: PostFormValues): PostCreatePayload {
  return {
    userId: values.userId,
    title: values.title,
    body: values.body,
  };
}`
    );

    console.log("→ Form과 API 사이에서 타입 안전한 변환 계층을 두는 것이 핵심입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. 검증 함수(validate) – 타입 안전한 Form Validation
    // ========================================
    console.log("📌 4. 타입 안전한 Form Validation");
    console.log("- 값은 PostFormValues, 결과는 PostFormErrors 로 고정");
    console.log("- 필드는 keyof PostFormValues 에 한정되므로 오타/누락을 줄일 수 있습니다.");
    console.log("");

    function validatePostForm(values: PostFormValues): PostFormErrors {
        const errors: PostFormErrors = {};

        if (!values.title || values.title.trim().length === 0) {
            errors.title = "제목은 필수입니다.";
        } else if (values.title.trim().length < 3) {
            errors.title = "제목은 최소 3자 이상이어야 합니다.";
        }

        if (!values.body || values.body.trim().length === 0) {
            errors.body = "내용은 필수입니다.";
        } else if (values.body.trim().length < 10) {
            errors.body = "내용은 최소 10자 이상이어야 합니다.";
        }

        if (!values.userId || values.userId <= 0) {
            errors.userId = "userId는 1 이상의 정수여야 합니다.";
        }

        return errors;
    }

    f_printCodeBlock(
        "validatePostForm 구현",
        `function validatePostForm(values: PostFormValues): PostFormErrors {
  const errors: PostFormErrors = {};

  if (!values.title || values.title.trim().length === 0) {
    errors.title = "제목은 필수입니다.";
  } else if (values.title.trim().length < 3) {
    errors.title = "제목은 최소 3자 이상이어야 합니다.";
  }

  if (!values.body || values.body.trim().length === 0) {
    errors.body = "내용은 필수입니다.";
  } else if (values.body.trim().length < 10) {
    errors.body = "내용은 최소 10자 이상이어야 합니다.";
  }

  if (!values.userId || values.userId <= 0) {
    errors.userId = "userId는 1 이상의 정수여야 합니다.";
  }

  return errors;
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. React 예제 – 타입 안전한 PostForm 컴포넌트 (TSX 코드 예시)
    // ========================================
    console.log("📌 5. React 예제 – 타입 안전한 PostForm 컴포넌트 (TSX 코드, 문자열로만 제시)");
    console.log("- 여기서는 실제로 React를 실행하진 않고,");
    console.log("- 타입 설계 관점에서 예시 TSX 코드를 보여줍니다.");
    console.log("");

    f_printCodeBlock(
        "PostForm.tsx (예시)",
        `import React, { useState } from "react";
import {
  type Post,
  type Result,
  createPost,
  getPostById
} from "../apiService";
import {
  type PostFormValues,
  type PostFormErrors,
  validatePostForm,
  fromPostToFormValues,
  toCreatePayload,
  defaultPostFormValues
} from "./formModel";

type PostFormProps = {
  initialValues?: PostFormValues;
  onSubmitted?(result: Result<Post>): void;
};

export function PostForm({ initialValues, onSubmitted }: PostFormProps) {
  const [values, setValues] = useState<PostFormValues>(
    initialValues ?? defaultPostFormValues
  );
  const [errors, setErrors] = useState<PostFormErrors>({});
  const [status, setStatus] =
    useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === "userId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validatePostForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    const payload = toCreatePayload(values);
    const result = await createPost(payload);

    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
    }

    onSubmitted?.(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          User ID:
          <input
            name="userId"
            type="number"
            value={values.userId}
            onChange={handleChange}
          />
        </label>
        {errors.userId && <div className="error">{errors.userId}</div>}
      </div>

      <div>
        <label>
          Title:
          <input
            name="title"
            value={values.title}
            onChange={handleChange}
          />
        </label>
        {errors.title && <div className="error">{errors.title}</div>}
      </div>

      <div>
        <label>
          Body:
          <textarea
            name="body"
            value={values.body}
            onChange={handleChange}
          />
        </label>
        {errors.body && <div className="error">{errors.body}</div>}
      </div>

      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}`
    );

    console.log("→ 코드 안에서 apiService.createPost, formModel.* 타입들이 모두 연결되어 타입 안전하게 동작합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. React에서 기존 Post 편집하기 – getPostById + fromPostToFormValues
    // ========================================
    console.log("📌 6. 기존 Post 편집하기 – getPostById + fromPostToFormValues (예시 코드)");
    console.log("- React 컴포넌트에서 특정 id의 Post를 불러와 Form에 채워 넣는 패턴입니다.");
    console.log("");

    f_printCodeBlock(
        "기존 Post 편집용 React 예시",
        `import React, { useEffect, useState } from "react";
import { getPostById, type Result, type Post } from "../apiService";
import { PostForm } from "./PostForm";
import { fromPostToFormValues } from "./formModel";

export function EditPostPage({ postId }: { postId: number }) {
  const [initialValues, setInitialValues] = useState<PostFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await getPostById(postId);
      if (result.ok) {
        setInitialValues(fromPostToFormValues(result.data));
      }
      setLoading(false);
    })();
  }, [postId]);

  if (loading) return <div>불러오는 중...</div>;
  if (!initialValues) return <div>Post를 불러오지 못했습니다.</div>;

  return (
    <PostForm
      initialValues={initialValues}
      onSubmitted={(res: Result<Post>) => {
        if (res.ok) {
          console.log("저장 성공:", res.data);
        } else {
          console.log("저장 실패:", res.error);
        }
      }}
    />
  );
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. Node 환경에서 간단 시뮬레이션 (Form Model + apiService)
    // ========================================
    console.log("📌 7. Node 환경에서 간단 시뮬레이션 (Form Model + apiService)");
    console.log("- 실제로 getPostById 를 호출해서 Form 값으로 변환하고,");
    console.log("- 검증 후 createPost 를 호출해 보는 흐름을 간단히 시연합니다.");
    console.log("");

    try {
        console.log("🌐 GET /posts/1 호출 중...");
        const result = await getPostById(1);
        if (!result.ok) {
            console.log("❌ Post 1 가져오기 실패:", result.status, result.error);
        } else {
            console.log("✅ Post 1 가져오기 성공, Form으로 변환");
            const formValues = fromPostToFormValues(result.data);
            console.log("FormValues:", formValues);

            console.log("🧪 검증 실행");
            const errors = validatePostForm(formValues);
            console.log("Errors:", errors);

            console.log("📦 payload로 변환 후 POST /posts 호출 시뮬레이션 (실제 저장 X - JSONPlaceholder)");
            const payload = toCreatePayload(formValues);
            const createResult = await createPost(payload);

            if (createResult.ok) {
                console.log("✅ createPost 성공 (테스트 API용, 실제 저장 아님):");
                console.log(createResult.data);
            } else {
                console.log("❌ createPost 실패:", createResult.status, createResult.error);
            }
        }
    } catch (e) {
        console.log("❌ 시뮬레이션 중 오류:", e);
    }

    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ 타입 안전한 Form Model 설계하기 (React 예제) – 정리 완료!");
    console.log("💡 핵심 정리:");
    console.log("  - 도메인 타입(Post)과 Form 전용 타입(PostFormValues)을 분리해서 설계한다.");
    console.log("  - validate 함수는 FormValues → FormErrors 로 타입이 고정되어야 한다.");
    console.log("  - Form ↔ API 사이에 변환 함수 계층(fromPostToFormValues, toCreatePayload)을 두면 변경에 강해진다.");
    console.log("  - React 컴포넌트에서는 이 타입들을 그대로 끌어와서 안전하게 상태 관리 & API 호출을 할 수 있다.");
    console.log("");
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
