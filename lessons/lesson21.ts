// lesson21.ts
// ===============================
// 레슨 실행 함수 - Conditional Types – 삼항 타입 활용하기
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

    // ========================================
    // 1. Conditional Type 기본 문법
    // ========================================
    console.log("📌 1. Conditional Type 기본 문법");
    console.log("- 형태:  T extends U ? X : Y");
    console.log("- T가 U에 할당 가능하면 X, 아니면 Y 타입을 선택합니다.");
    console.log("");

    type IsString<T> = T extends string ? "문자열" : "문자열 아님";

    type A1 = IsString<string>; // "문자열"
    type A2 = IsString<number>; // "문자열 아님"

    f_printCodeBlock(
        "Conditional Type 기본 구조",
        `type IsString<T> = T extends string ? "문자열" : "문자열 아님";

type A1 = IsString<string>; // "문자열"
type A2 = IsString<number>; // "문자열 아님";`
    );

    console.log("타입 레벨에서 if/else 같은 역할을 한다고 보면 됩니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. 간단한 변환 타입: ToArray<T>
    // ========================================
    console.log("📌 2. 간단한 변환 타입 – ToArray<T>");
    console.log("- 어떤 타입 T를 항상 배열 타입으로 감싸고 싶을 때:");
    console.log("");

    type ToArray<T> = T extends any ? T[] : never;

    type B1 = ToArray<number>;     // number[]
    type B2 = ToArray<string>;     // string[]
    type B3 = ToArray<number | string>; // (number | string)[] 가 아님! (중요 – 아래에서 설명)");

    f_printCodeBlock(
        "ToArray<T> 예제",
        `type ToArray<T> = T extends any ? T[] : never;

type B1 = ToArray<number>;         // number[]
type B2 = ToArray<string>;         // string[]
type B3 = ToArray<number | string>;`
    );

    console.log("잠깐 보류: B3의 결과는 뒤에 '분배(Distributive)'에서 다시 확인해 보겠습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. Distributive Conditional Types – 분배되는 특성
    // ========================================
    console.log("📌 3. Distributive Conditional Types – 분배되는 특성");
    console.log("- 조건 타입의 T 자리에 Union이 오면, 각 원소에 대해 조건이 '분배'됩니다.");
    console.log("");

    type ElementType<T> = T extends (infer U)[] ? U : T;

    type C1 = ElementType<string[]>;        // string
    type C2 = ElementType<number[]>;        // number
    type C3 = ElementType<(number | string)[]>; // number | string
    type C4 = ElementType<string>;          // string

    f_printCodeBlock(
        "배열 요소 타입 추출 예제",
        `type ElementType<T> = T extends (infer U)[] ? U : T;

type C1 = ElementType<string[]>;          // string
type C2 = ElementType<number[]>;          // number
type C3 = ElementType<(number | string)[]>; // number | string
type C4 = ElementType<string>;            // string`
    );

    console.log("- 여기서 핵심은 `T extends (infer U)[] ? U : T` 구조입니다.");
    console.log("- T가 배열이면 요소 타입 U, 아니면 T 그대로를 돌려줍니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. 분배를 눈으로 보기 – Union에 대한 Conditional
    // ========================================
    console.log("📌 4. 분배(Distributive) 동작 자세히 보기");
    console.log("- Conditional Type에서 T가 Union이면:");
    console.log("  (A | B) extends U ? X : Y");
    console.log("  → (A extends U ? X : Y) | (B extends U ? X : Y) 로 분배됩니다.");
    console.log("");

    type IsString2<T> = T extends string ? "S" : "N";

    type D1 = IsString2<number | string>;
    // => (number extends string ? "S" : "N") | (string extends string ? "S" : "N")
    // => "N" | "S"

    f_printCodeBlock(
        "Union에 대해 분배되는 예",
        `type IsString2<T> = T extends string ? "S" : "N";

type D1 = IsString2<number | string>;
// "N" | "S" 가 됨`
    );

    console.log("- 앞에서 ToArray<number | string> 결과도 비슷한 방식으로 분배됩니다.");
    console.log("  ToArray<number | string>");
    console.log("  → ToArray<number> | ToArray<string>");
    console.log("  → number[] | string[]");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. 분배를 막고 싶을 때 – [T] extends [U] 패턴
    // ========================================
    console.log("📌 5. 분배를 막고 싶을 때 – [T] extends [U] 패턴");
    console.log("- 가끔은 Union 전체를 한 번에 비교하고 싶을 때가 있습니다.");
    console.log("- 이때는 `T extends U` 대신 `[T] extends [U]`로 감싸면 분배가 멈춥니다.");
    console.log("");

    type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;

    type E1 = ToArrayNonDistributive<number | string>;
    // number | string 하나로 보고 → (number | string)[]

    f_printCodeBlock(
        "분배를 막는 패턴",
        `type ToArray<T> = T extends any ? T[] : never;
// number[] | string[]
type E0 = ToArray<number | string>;

type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;
// (number | string)[]
type E1 = ToArrayNonDistributive<number | string>;`
    );

    console.log("E1 타입은 (number | string)[] 입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. 기본 유틸리티 타입 구현해 보기: NonNullable, Extract, Exclude
    // ========================================
    console.log("📌 6. 기본 유틸리티 타입 구현하기 – NonNullable / Extract / Exclude");
    console.log("- Conditional Types로 이미 자주 쓰는 유틸리티 타입을 흉내 내봅니다.");
    console.log("");

    type MyNonNullable<T> = T extends null | undefined ? never : T;
    type MyExtract<T, U> = T extends U ? T : never;
    type MyExclude<T, U> = T extends U ? never : T;

    type F1 = MyNonNullable<string | null | undefined>; // string
    type F2 = MyExtract<"a" | "b" | "c", "a" | "c">;    // "a" | "c"
    type F3 = MyExclude<"a" | "b" | "c", "a" | "c">;    // "b"

    f_printCodeBlock(
        "NonNullable / Extract / Exclude 구현",
        `type MyNonNullable<T> = T extends null | undefined ? never : T;
type MyExtract<T, U> = T extends U ? T : never;
type MyExclude<T, U> = T extends U ? never : T;

type F1 = MyNonNullable<string | null | undefined>; // string
type F2 = MyExtract<"a" | "b" | "c", "a" | "c">;    // "a" | "c"
type F3 = MyExclude<"a" | "b" | "c", "a" | "c">;    // "b"`
    );

    console.log("이 세 가지 패턴만 이해해도 Conditional Type의 70%는 이해했다고 볼 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. infer 키워드와 함께 – 함수 ReturnType 추출
    // ========================================
    console.log("📌 7. infer 키워드 + Conditional Types – ReturnType 구현하기");
    console.log("- infer는 '여기서 타입 변수 하나를 추론해줘'라는 의미입니다.");
    console.log("");

    type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

    function add(a: number, b: number) {
        return a + b;
    }

    function greet(name: string) {
        return `Hello, ${name}`;
    }

    type G1 = MyReturnType<typeof add>;   // number
    type G2 = MyReturnType<typeof greet>; // string

    f_printCodeBlock(
        "MyReturnType 구현 예제",
        `type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function add(a: number, b: number) {
    return a + b;
}

function greet(name: string) {
    return \`Hello, \${name}\`;
}

type G1 = MyReturnType<typeof add>;   // number
type G2 = MyReturnType<typeof greet>; // string`
    );

    console.log("G1, G2 타입은 실제로 함수의 반환 타입이 됩니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. Promise 안의 타입 꺼내기 – Awaited 구현
    // ========================================
    console.log("📌 8. Promise 안의 타입 꺼내기 – Awaited 구현하기");
    console.log("- Promise<T> 가 있으면 T를 꺼내고 싶을 때가 많습니다.");
    console.log("");

    type MyAwaited<T> =
        T extends Promise<infer U>
        ? U extends Promise<any>
        ? MyAwaited<U>
        : U
        : T;

    type H1 = MyAwaited<Promise<string>>;                  // string
    type H2 = MyAwaited<Promise<Promise<number>>>;         // number
    type H3 = MyAwaited<Promise<Promise<Promise<boolean>>>>; // boolean
    type H4 = MyAwaited<string>;                           // string

    f_printCodeBlock(
        "MyAwaited 구현 예제",
        `type MyAwaited<T> =
    T extends Promise<infer U>
        ? U extends Promise<any>
            ? MyAwaited<U>
            : U
        : T;

type H1 = MyAwaited<Promise<string>>;                  // string
type H2 = MyAwaited<Promise<Promise<number>>>;         // number
type H3 = MyAwaited<Promise<Promise<Promise<boolean>>>>; // boolean
type H4 = MyAwaited<string>;                           // string`
    );

    console.log("중첩된 Promise도 재귀적으로 풀어주는 패턴입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 9. 실전 예제 – API 응답 타입 가공하기
    // ========================================
    console.log("📌 9. 실전 예제 – API 응답 타입 가공하기");
    console.log("- 성공/실패 응답을 하나의 타입으로 표현하고, Conditional Type으로 결과만 뽑아봅니다.");
    console.log("");

    type ApiSuccess<T> = {
        ok: true;
        data: T;
    };

    type ApiFail<E = string> = {
        ok: false;
        error: E;
    };

    type ApiResult<T, E = string> = ApiSuccess<T> | ApiFail<E>;

    type SuccessData<T> = T extends ApiSuccess<infer U> ? U : never;
    type ErrorType<T> = T extends ApiFail<infer E> ? E : never;

    type UserData = { id: number; name: string };

    type ApiUserResult = ApiResult<UserData, { code: string; message: string }>;

    // SuccessData<ApiUserResult> → UserData | never
    // ErrorType<ApiUserResult>   → { code: string; message: string } | never
    type ResultUserData = SuccessData<ApiUserResult>;
    type ResultErrorInfo = ErrorType<ApiUserResult>;

    f_printCodeBlock(
        "API 결과 타입에서 성공/에러 타입 뽑기",
        `type ApiSuccess<T> = {
    ok: true;
    data: T;
};

type ApiFail<E = string> = {
    ok: false;
    error: E;
};

type ApiResult<T, E = string> = ApiSuccess<T> | ApiFail<E>;

type SuccessData<T> = T extends ApiSuccess<infer U> ? U : never;
type ErrorType<T> = T extends ApiFail<infer E> ? E : never;

type UserData = { id: number; name: string };

type ApiUserResult = ApiResult<UserData, { code: string; message: string }>;

type ResultUserData = SuccessData<ApiUserResult>;
type ResultErrorInfo = ErrorType<ApiUserResult>;`
    );

    console.log("ResultUserData, ResultErrorInfo 타입을 통해 각 분기별 payload 타입을 추출할 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 10. 실전 예제 – Form Model에서 Optional/Required 전환
    // ========================================
    console.log("📌 10. 실전 예제 – Form Model에서 Required/Optional 전환");
    console.log("- 초깃값 단계에서는 전부 Optional, 서버 전송 전에는 Required 등으로 바꾸고 싶을 때.");
    console.log("");

    type FormModel<T> = {
        [K in keyof T]: T[K] | null;
    };

    type FinalModel<T> = {
        [K in keyof T]: T[K] extends null | undefined ? never : T[K];
    };

    type RawUserForm = {
        name: string | null;
        email: string | null;
        age: number | null;
    };

    type UserForm = FormModel<{
        name: string;
        email: string;
        age: number;
    }>;

    type UserFinal = FinalModel<RawUserForm>;

    f_printCodeBlock(
        "FormModel / FinalModel 예제",
        `type FormModel<T> = {
    [K in keyof T]: T[K] | null;
};

type FinalModel<T> = {
    [K in keyof T]: T[K] extends null | undefined ? never : T[K];
};

type RawUserForm = {
    name: string | null;
    email: string | null;
    age: number | null;
};

type UserForm = FormModel<{
    name: string;
    email: string;
    age: number;
}>;

type UserFinal = FinalModel<RawUserForm>;`
    );

    const formValue: UserForm = {
        name: "Joshua",
        email: null,
        age: 53
    };

    console.log("UserForm 예:", formValue);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Conditional Types – 삼항 타입 활용하기를 정리했습니다!");
    console.log("💡 핵심 정리:");
    console.log("  - 기본 형태:  T extends U ? X : Y");
    console.log("  - Union에 대해 자동으로 분배(Distributive)되는 성질이 있음");
    console.log("  - [T] extends [U] 패턴으로 분배를 막을 수 있음");
    console.log("  - infer와 함께 쓰면 ReturnType, Awaited 등 '타입 추출'에 매우 강력");
    console.log("  - NonNullable / Extract / Exclude 같은 기본 유틸리티의 원리도 Conditional Types");
    console.log("  - 도메인 모델, DTO, 폼 모델 등에서 '타입 재활용 + 변환' 패턴으로 자주 사용");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
