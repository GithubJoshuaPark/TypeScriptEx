// lesson22.ts
// ===============================
// 레슨 실행 함수 - infer 키워드로 타입 추론 제어하기
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
    // 1. infer 개념 잡기
    // ========================================
    console.log("📌 1. infer란 무엇인가?");
    console.log("- Conditional Types 안에서, 특정 위치의 타입을 변수처럼 '추론해서 꺼내는' 키워드입니다.");
    console.log("- 형태:  T extends SomeType<infer U> ? U : never");
    console.log("- 여기서 U는 infer로 새로 도입되는 타입 변수입니다.");
    console.log("");

    f_printCodeBlock(
        "infer 기본 예제 (ReturnType 구현)",
        `type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function add(a: number, b: number) {
    return a + b;
}

type AddReturn = MyReturnType<typeof add>;  // number`
    );

    console.log("→ 함수의 반환 타입을 꺼낼 때 infer R 을 사용하는 패턴입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. 함수 반환 타입 추출 – MyReturnType
    // ========================================
    console.log("📌 2. 함수 반환 타입 추출 – MyReturnType");

    type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

    function multiply(a: number, b: number) {
        return a * b;
    }

    function buildUser(name: string, age: number) {
        return {
            name,
            age,
            createdAt: new Date()
        };
    }

    type MultiplyReturn = MyReturnType<typeof multiply>;
    type BuildUserReturn = MyReturnType<typeof buildUser>;

    f_printCodeBlock(
        "MyReturnType 예제",
        `type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function multiply(a: number, b: number) {
    return a * b;
}

function buildUser(name: string, age: number) {
    return {
        name,
        age,
        createdAt: new Date(),
    };
}

type MultiplyReturn = MyReturnType<typeof multiply>;   // number
type BuildUserReturn = MyReturnType<typeof buildUser>; // { name: string; age: number; createdAt: Date }`
    );

    console.log("MultiplyReturn, BuildUserReturn 과 같이 함수의 반환 타입을 추출할 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. 함수 파라미터 타입 추출 – MyParameters / MyFirstParam
    // ========================================
    console.log("📌 3. 함수 파라미터 타입 추출 – MyParameters / MyFirstParam");

    type MyParameters<T> = T extends (...args: infer P) => any ? P : never;
    type MyFirstParam<T> = T extends (arg: infer A, ...rest: any[]) => any
        ? A
        : never;

    function logUser(id: number, name: string, isAdmin: boolean) {
        console.log(id, name, isAdmin);
    }

    type LogUserParams = MyParameters<typeof logUser>; // [number, string, boolean]
    type LogUserFirstParam = MyFirstParam<typeof logUser>; // number

    f_printCodeBlock(
        "파라미터 타입 추출 예제",
        `type MyParameters<T> = T extends (...args: infer P) => any ? P : never;
type MyFirstParam<T> = T extends (arg: infer A, ...rest: any[]) => any ? A : never;

function logUser(id: number, name: string, isAdmin: boolean) {
    console.log(id, name, isAdmin);
}

type LogUserParams = MyParameters<typeof logUser>;      // [number, string, boolean]
type LogUserFirstParam = MyFirstParam<typeof logUser>;  // number`
    );

    console.log("→ 기존 함수 시그니처에서 파라미터 타입만 재활용할 때 매우 유용합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. 배열/튜플에서 요소 타입 추출 – ElementType / First / Last
    // ========================================
    console.log("📌 4. 배열/튜플에서 요소 타입 추출 – ElementType / First / Last");

    type ElementType<T> = T extends (infer U)[] ? U : T;

    type First<T extends any[]> = T extends [infer H, ...any[]] ? H : never;
    type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;

    type E1 = ElementType<string[]>; // string
    type E2 = ElementType<number[]>; // number
    type E3 = ElementType<(number | string)[]>; // number | string

    type T1 = First<[string, number, boolean]>; // string
    type T2 = Last<[string, number, boolean]>;  // boolean

    f_printCodeBlock(
        "배열/튜플 요소 타입 추출",
        `type ElementType<T> = T extends (infer U)[] ? U : T;

type First<T extends any[]> = T extends [infer H, ...any[]] ? H : never;
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;

type E1 = ElementType<string[]>;                 // string
type E2 = ElementType<number[]>;                 // number
type E3 = ElementType<(number | string)[]>;      // number | string

type T1 = First<[string, number, boolean]>;      // string
type T2 = Last<[string, number, boolean]>;       // boolean`
    );

    console.log("→ 튜플의 첫 번째/마지막 요소 타입 등도 infer로 깔끔하게 분해할 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. Promise / 비동기 타입에서 내부 타입 꺼내기 – MyAwaited
    // ========================================
    console.log("📌 5. Promise / 비동기 타입 – MyAwaited 구현");

    type MyAwaited<T> =
        T extends Promise<infer U>
        ? U extends Promise<any>
        ? MyAwaited<U>
        : U
        : T;

    type A1 = MyAwaited<Promise<number>>; // number
    type A2 = MyAwaited<Promise<Promise<string>>>; // string
    type A3 = MyAwaited<string>; // string (Promise 가 아니면 그대로)

    f_printCodeBlock(
        "MyAwaited – 중첩 Promise 풀기",
        `type MyAwaited<T> =
    T extends Promise<infer U>
        ? U extends Promise<any>
            ? MyAwaited<U>
            : U
        : T;

type A1 = MyAwaited<Promise<number>>;                // number
type A2 = MyAwaited<Promise<Promise<string>>>;       // string
type A3 = MyAwaited<string>;                         // string`
    );

    console.log("→ 실제 TS 내장 Awaited<T> 도 비슷한 패턴으로 구현되어 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. this/메서드 시그니처에서 타입 추출 – InstanceType, Constructor Params
    // ========================================
    console.log("📌 6. 생성자 타입에서 인스턴스/파라미터 타입 추출하기");

    type MyConstructorParams<T> = T extends new (...args: infer P) => any
        ? P
        : never;

    type MyInstanceType<T> = T extends new (...args: any[]) => infer R ? R : never;

    class Person {
        constructor(public name: string, public age: number) { }
    }

    type PersonCtorParams = MyConstructorParams<typeof Person>; // [string, number]
    type PersonInstance = MyInstanceType<typeof Person>; // Person

    f_printCodeBlock(
        "생성자 타입에서 infer 사용",
        `type MyConstructorParams<T> =
    T extends new (...args: infer P) => any ? P : never;

type MyInstanceType<T> =
    T extends new (...args: any[]) => infer R ? R : never;

class Person {
    constructor(public name: string, public age: number) {}
}

type PersonCtorParams = MyConstructorParams<typeof Person>; // [string, number]
type PersonInstance = MyInstanceType<typeof Person>;        // Person`
    );

    console.log("→ 클래스의 생성자 시그니처를 재사용할 때도 infer 패턴이 유용합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. 템플릿 리터럴 타입과 infer – 문자열 파싱
    // ========================================
    console.log("📌 7. 템플릿 리터럴 타입과 infer – 문자열 파싱 패턴");

    type SplitByColon<T> =
        T extends `${infer Left}:${infer Right}` ? [Left, Right] : [T];

    type S1 = SplitByColon<"key:value">;     // ["key", "value"]
    type S2 = SplitByColon<"noColonHere">;   // ["noColonHere"]

    type ExtractPathParams<T> =
        T extends `${string}:${infer Param}/${infer Rest}`
        ? Param | ExtractPathParams<`/${Rest}`>
        : T extends `${string}:${infer Param}`
        ? Param
        : never;

    type P1 = ExtractPathParams<"/users/:userId/posts/:postId">;
    // "userId" | "postId"

    f_printCodeBlock(
        "템플릿 리터럴 타입 + infer",
        `type SplitByColon<T> =
    T extends \`\${infer Left}:\${infer Right}\` ? [Left, Right] : [T];

type S1 = SplitByColon<"key:value">;      // ["key", "value"]
type S2 = SplitByColon<"noColonHere">;    // ["noColonHere"]

// URL Path에서 파라미터 이름 추출
type ExtractPathParams<T> =
    T extends \`\${string}:\${infer Param}/\${infer Rest}\`
        ? Param | ExtractPathParams<\`/\${Rest}\`>
        : T extends \`\${string}:\${infer Param}\`
            ? Param
            : never;

type P1 = ExtractPathParams<"/users/:userId/posts/:postId">;
// "userId" | "postId"`
    );

    console.log("→ 문자열 기반 라우팅, 로그 포맷 파싱 등에서 강력하게 활용 가능합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. Mapped Types + infer – 객체의 값 타입에 따른 변환
    // ========================================
    console.log("📌 8. Mapped Types + infer – 객체 필드 타입 기반 변환");

    type FunctionPropertyNames<T> = {
        [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
    }[keyof T];

    type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

    type PropertyReturnTypes<T> = {
        [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never;
    };

    class Service {
        getUser(id: number) {
            return { id, name: "User" + id };
        }
        log(message: string) {
            console.log("LOG:", message);
        }
        version = "1.0.0";
    }

    type ServiceMethods = FunctionProperties<Service>;
    type ServiceMethodReturns = PropertyReturnTypes<ServiceMethods>;

    f_printCodeBlock(
        "객체 메서드들의 반환 타입 추출 예제",
        `type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type PropertyReturnTypes<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never;
};

class Service {
    getUser(id: number) {
        return { id, name: "User" + id };
    }
    log(message: string) {
        console.log("LOG:", message);
    }
    version = "1.0.0";
}

type ServiceMethods = FunctionProperties<Service>;
type ServiceMethodReturns = PropertyReturnTypes<ServiceMethods>;`
    );

    console.log("→ ServiceMethodReturns 타입을 통해 각 메서드 반환 타입들의 집합을 얻을 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 9. Distributive Conditional + infer – Union 변환
    // ========================================
    console.log("📌 9. Distributive Conditional + infer – Union 변환");

    type Flatten<T> = T extends (infer U)[] ? U : T;

    type U1 = Flatten<string[]>;        // string
    type U2 = Flatten<number | number[]>; // number | number

    type AwaitAll<T> = T extends Promise<infer U> ? Promise<U> : Promise<T>;

    type AA1 = AwaitAll<string>; // Promise<string>
    type AA2 = AwaitAll<Promise<number>>; // Promise<number>

    f_printCodeBlock(
        "Distributive + infer 예제",
        `type Flatten<T> = T extends (infer U)[] ? U : T;

type U1 = Flatten<string[]>;            // string
type U2 = Flatten<number | number[]>;   // number | number = number

type AwaitAll<T> = T extends Promise<infer U> ? Promise<U> : Promise<T>;

type AA1 = AwaitAll<string>;           // Promise<string>
type AA2 = AwaitAll<Promise<number>>;  // Promise<number>`
    );

    console.log("→ Union을 다룰 때도 infer를 이용해 '각 원소에 대해 변환'하는 패턴을 만들 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 10. 실전 예제 – API Handler에서 Request/Response 타입 추출
    // ========================================
    console.log("📌 10. 실전 예제 – API Handler에서 Request/Response 타입 추출");
    console.log("- 핸들러 함수 시그니처만 정의해두고, 거기서 Request/Response 타입을 뽑아내기.");

    type ApiHandler<Req, Res> = (req: Req) => Promise<Res>;

    type HandlerRequest<T> = T extends ApiHandler<infer R, any> ? R : never;
    type HandlerResponse<T> = T extends ApiHandler<any, infer R> ? R : never;

    type GetUserReq = { id: number };
    type GetUserRes = { id: number; name: string };

    const getUserHandler: ApiHandler<GetUserReq, GetUserRes> = async (req) => {
        return { id: req.id, name: "User" + req.id };
    };

    type ExtractedReq = HandlerRequest<typeof getUserHandler>; // GetUserReq
    type ExtractedRes = HandlerResponse<typeof getUserHandler>; // GetUserRes

    f_printCodeBlock(
        "API Handler에서 Req/Res 타입 추출",
        `type ApiHandler<Req, Res> = (req: Req) => Promise<Res>;

type HandlerRequest<T> = T extends ApiHandler<infer R, any> ? R : never;
type HandlerResponse<T> = T extends ApiHandler<any, infer R> ? R : never;

type GetUserReq = { id: number };
type GetUserRes = { id: number; name: string };

const getUserHandler: ApiHandler<GetUserReq, GetUserRes> = async (req) => {
    return { id: req.id, name: "User" + req.id };
};

type ExtractedReq = HandlerRequest<typeof getUserHandler>; // GetUserReq
type ExtractedRes = HandlerResponse<typeof getUserHandler>; // GetUserRes`
    );

    console.log("→ 프레임워크 레벨에서 핸들러 타입만 받아서 자동으로 타입 세이프한 클라이언트/라우터를 생성하는 패턴에 많이 쓰입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ infer 키워드로 타입 추론 제어하기 – 핵심 패턴들을 모두 살펴봤습니다!");
    console.log("💡 핵심 정리:");
    console.log("  - infer는 Conditional Types 안에서만 사용 가능");
    console.log("  - 패턴 매칭 위치에서 타입 변수를 '추론해서 꺼내는' 역할");
    console.log("  - 함수: ReturnType / Parameters / Constructor Parameters / InstanceType");
    console.log("  - 배열/튜플: ElementType / First / Last");
    console.log("  - Promise: Awaited, 중첩 Promise 풀기");
    console.log("  - 템플릿 리터럴 타입: 문자열 파싱, 라우트 파라미터 추출");
    console.log("  - Mapped Types와 조합해서 객체 메서드/필드 타입을 동적으로 변환");
    console.log("");
    console.log("→ 이번 레슨까지 오면, 타입 레벨에서 '메타 프로그래밍'을 할 수 있게 되는 단계입니다. 😎");

    console.log("");
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
