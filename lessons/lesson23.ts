// lesson23.ts
// ===============================
// 레슨 실행 함수 - Template Literal Types – 문자열 기반 타입 생성
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
    // 1. Template Literal Types 기본 개념
    // ========================================
    console.log("📌 1. Template Literal Types 기본 개념");
    console.log("- 문자열 리터럴 타입들을 조합해서 새로운 문자열 타입을 만들어내는 기능입니다.");
    console.log("- 문자열 버전의 '타입 안전한 포맷팅'이라고 생각하시면 됩니다.");
    console.log("");

    type Lang = "ko" | "en";
    type Screen = "home" | "settings";

    type TranslationKey = `${Lang}_${Screen}`; // "ko_home" | "ko_settings" | "en_home" | "en_settings"

    f_printCodeBlock(
        "Template Literal Types 기본 예제",
        `type Lang = "ko" | "en";
type Screen = "home" | "settings";

type TranslationKey = \`\${Lang}_\${Screen}\`;
// 결과:
// type TranslationKey =
//   | "ko_home"
//   | "ko_settings"
//   | "en_home"
//   | "en_settings";`
    );

    console.log("→ 문자열 조합을 타입 레벨에서 안전하게 관리할 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. 유니온을 조합해서 문자열 타입 만들기
    // ========================================
    console.log("📌 2. 유니온들을 조합해서 문자열 타입 만들기");
    console.log("- 여러 유니온 타입을 템플릿 리터럴 안에서 조합하면,");
    console.log("  가능한 모든 조합을 자동으로 만들어 줍니다.");
    console.log("");

    type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
    type Resource = "users" | "posts";

    type EndpointKey = `${HttpMethod} /${Resource}`;
    // "GET /users" | "GET /posts" | "POST /users" | ... 등등

    f_printCodeBlock(
        "HTTP 메서드 + 리소스 조합 예제",
        `type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Resource = "users" | "posts";

type EndpointKey = \`\${HttpMethod} /\${Resource}\`;
// 가능한 값 예:
// "GET /users"
// "GET /posts"
// "POST /users"
// "POST /posts"
// ...`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. 대소문자 변환 유틸리티 (Uppercase, Lowercase, Capitalize, Uncapitalize)
    // ========================================
    console.log("📌 3. 대소문자 변환 유틸리티 타입들");
    console.log("- Uppercase<T>, Lowercase<T>, Capitalize<T>, Uncapitalize<T>");
    console.log("- Template Literal Types와 함께 쓸 때 자주 등장합니다.");
    console.log("");

    type EventBase = "click" | "change" | "focus";
    type DomEventName = `on${Capitalize<EventBase>}`;
    // "onClick" | "onChange" | "onFocus"

    type Uppered = Uppercase<"hello">; // "HELLO"
    type Lowered = Lowercase<"HeLLo">; // "hello"

    f_printCodeBlock(
        "대소문자 변환 유틸리티 예제",
        `type EventBase = "click" | "change" | "focus";

// "onClick" | "onChange" | "onFocus"
type DomEventName = \`on\${Capitalize<EventBase>}\`;

type Uppered = Uppercase<"hello">;  // "HELLO"
type Lowered = Lowercase<"HeLLo">;  // "hello"`
    );

    console.log("→ React의 onClick, onChange, onFocus 같은 패턴을 타입으로 표현할 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. 객체의 키 이름을 문자열로 변환하기
    // ========================================
    console.log("📌 4. 객체의 키 이름을 문자열로 변환하기");
    console.log("- keyof와 Template Literal을 조합하면,");
    console.log("  객체의 프로퍼티 이름을 이용한 문자열 타입을 만들 수 있습니다.");
    console.log("");

    type User = {
        id: number;
        name: string;
        email: string;
    };

    type UserFieldName = keyof User; // "id" | "name" | "email"

    type UserLabelKey = `user.${UserFieldName}`;
    // "user.id" | "user.name" | "user.email"

    f_printCodeBlock(
        "객체 키 기반 문자열 타입",
        `type User = {
    id: number;
    name: string;
    email: string;
};

type UserFieldName = keyof User; // "id" | "name" | "email"

// "user.id" | "user.name" | "user.email"
type UserLabelKey = \`user.\${UserFieldName}\`;`
    );

    console.log("→ i18n 키, 로그 필드 이름, GraphQL 필드 경로 등에서 유용합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. 타입 안전한 Route Path 정의
    // ========================================
    console.log("📌 5. 타입 안전한 Route Path 정의");
    console.log("- 문자열 경로를 직접 string으로 관리하면 오타가 자주 납니다.");
    console.log("- Template Literal Types로 '허용되는 경로'를 타입으로 제한할 수 있습니다.");
    console.log("");

    type RoutePrefix = "/users" | "/posts";
    type RouteSuffix = "" | "/:id" | "/:id/edit";

    type RoutePath = `${RoutePrefix}${RouteSuffix}`;

    // 사용 예 (런타임에선 그냥 string 이지만, 선언 시 타입 체크)
    const route1: RoutePath = "/users";           // OK
    const route2: RoutePath = "/posts/:id/edit";  // OK
    // const route3: RoutePath = "/comments";     // ❌ 타입 에러

    f_printCodeBlock(
        "RoutePath 타입 예제",
        `type RoutePrefix = "/users" | "/posts";
type RouteSuffix = "" | "/:id" | "/:id/edit";

type RoutePath = \`\${RoutePrefix}\${RouteSuffix}\`;

const route1: RoutePath = "/users";          // OK
const route2: RoutePath = "/posts/:id/edit"; // OK
// const route3: RoutePath = "/comments";    // ❌ 허용되지 않는 경로`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. 상태(state) 키를 문자열로 만들기 – Loading / Success / Error
    // ========================================
    console.log("📌 6. 상태 키를 문자열로 만들기 – Loading / Success / Error");

    type BaseState = "loading" | "success" | "error";
    type Entity = "user" | "post";

    type StoreKey = `${Entity}_${BaseState}`;
    // "user_loading" | "user_success" | "user_error" | "post_loading" | ...

    f_printCodeBlock(
        "상태 키 조합 예제",
        `type BaseState = "loading" | "success" | "error";
type Entity = "user" | "post";

type StoreKey = \`\${Entity}_\${BaseState}\`;
// "user_loading" | "user_success" | "user_error"
// "post_loading" | "post_success" | "post_error"`
    );

    console.log("→ Redux/RTK, Zustand 등 상태 관리 라이브러리에서 key를 만들 때 응용할 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. Template Literal Types + Record – 타입 안전한 맵
    // ========================================
    console.log("📌 7. Template Literal Types + Record – 타입 안전한 맵 구조");

    type LogLevel = "info" | "warn" | "error";
    type LogKey = `app.${LogLevel}`;

    type LogConfig = Record<LogKey, boolean>;

    const logConfig: LogConfig = {
        "app.info": true,
        "app.warn": true,
        "app.error": false
        // "app.debug": true // ❌ 허용되지 않는 키
    };

    f_printCodeBlock(
        "Template Literal + Record 예제",
        `type LogLevel = "info" | "warn" | "error";
type LogKey = \`app.\${LogLevel}\`;

type LogConfig = Record<LogKey, boolean>;

const logConfig: LogConfig = {
    "app.info": true,
    "app.warn": true,
    "app.error": false,
};`
    );

    console.log("→ 콘피그 키 이름을 '열거 가능한 문자열'로 만들면 나중에 유지보수가 훨씬 수월해집니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 템플릿 리터럴 타입으로 이벤트 이름 패턴 정의하기
    // ========================================
    console.log("📌 8. 이벤트 이름 패턴 정의 – on + 도메인 + 액션");

    type Domain = "user" | "post";
    type Action = "created" | "updated" | "deleted";

    type EventName = `on${Capitalize<Domain>}${Capitalize<Action>}`;
    // "onUserCreated" | "onUserUpdated" | "onUserDeleted" | "onPostCreated" | ...

    f_printCodeBlock(
        "이벤트 이름 패턴 예제",
        `type Domain = "user" | "post";
type Action = "created" | "updated" | "deleted";

type EventName = \`on\${Capitalize<Domain>}\${Capitalize<Action>}\`;
// "onUserCreated" | "onUserUpdated" | "onUserDeleted"
// "onPostCreated" | "onPostUpdated" | "onPostDeleted"`
    );

    console.log("→ Vue/React 컴포넌트 이벤트 이름, 상태머신 이벤트 이름 등에서 쓰기 좋습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 9. 객체 키를 기반으로 Template Literal Types 만들기
    // ========================================
    console.log("📌 9. 객체 키 기반 Template Literal – 'get/set' 메서드 이름 만들기");

    type Model = {
        id: number;
        name: string;
        age: number;
    };

    type GetterName<K extends string> = `get${Capitalize<K>}`;
    type SetterName<K extends string> = `set${Capitalize<K>}`;

    type ModelGetterNames = GetterName<Extract<keyof Model, string>>;
    type ModelSetterNames = SetterName<Extract<keyof Model, string>>;

    // "getId" | "getName" | "getAge"
    // "setId" | "setName" | "setAge"

    f_printCodeBlock(
        "객체 키 기반 getter/setter 이름 생성",
        `type Model = {
    id: number;
    name: string;
    age: number;
};

type GetterName<K extends string> = \`get\${Capitalize<K>}\`;
type SetterName<K extends string> = \`set\${Capitalize<K>}\`;

type ModelGetterNames = GetterName<Extract<keyof Model, string>>;
// "getId" | "getName" | "getAge"

type ModelSetterNames = SetterName<Extract<keyof Model, string>>;
// "setId" | "setName" | "setAge"`
    );

    console.log("→ 실제 구현은 자유롭게, 타입 레벨에서 이름 규칙만 딱 정해둘 수 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 10. 실전 예제 – CSS 변수 이름, 환경 변수 키 등
    // ========================================
    console.log("📌 10. 실전 예제 – CSS 변수 이름 / 환경 변수 키 관리");

    type ColorToken = "primary" | "secondary" | "danger";
    type ColorState = "default" | "hover" | "active";

    type CssVarName = `--color-${ColorToken}-${ColorState}`;
    // "--color-primary-default" | "--color-primary-hover" | ...

    type EnvPrefix = "DEV" | "PROD";
    type EnvVarName = `${EnvPrefix}_API_URL`;

    f_printCodeBlock(
        "CSS 변수 / 환경 변수 키 예제",
        `type ColorToken = "primary" | "secondary" | "danger";
type ColorState = "default" | "hover" | "active";

type CssVarName = \`--color-\${ColorToken}-\${ColorState}\`;
// "--color-primary-default" | "--color-primary-hover" | ...

type EnvPrefix = "DEV" | "PROD";
type EnvVarName = \`\${EnvPrefix}_API_URL\`;
// "DEV_API_URL" | "PROD_API_URL"`
    );

    console.log("→ 디자인 시스템, 환경 설정 등 문자열 키가 많은 곳에서 Template Literal Types가 빛을 발합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 11. Template Literal Types + Conditional Types – 간단 파서
    // ========================================
    console.log("📌 11. Template Literal + Conditional Types – 간단 문자열 파서");
    console.log("- infer와 조합하면, 문자열을 타입 레벨에서 '분해'해서 의미 있는 타입을 뽑을 수 있습니다.");
    console.log("");

    type EventString = "user:created" | "user:deleted" | "post:created";

    type ExtractDomain<T> =
        T extends `${infer DomainName}:${string}` ? DomainName : never;

    type ExtractAction<T> =
        T extends `${string}:${infer ActionName}` ? ActionName : never;

    type EventDomain = ExtractDomain<EventString>; // "user" | "post"
    type EventAction = ExtractAction<EventString>; // "created" | "deleted"

    f_printCodeBlock(
        "Template Literal + infer 로 문자열 파싱",
        `type EventString = "user:created" | "user:deleted" | "post:created";

type ExtractDomain<T> =
    T extends \`\${infer DomainName}:\${string}\` ? DomainName : never;

type ExtractAction<T> =
    T extends \`\${string}:\${infer ActionName}\` ? ActionName : never;

type EventDomain = ExtractDomain<EventString>; // "user" | "post"
type EventAction = ExtractAction<EventString>; // "created" | "deleted"`
    );

    console.log("→ 앞서 배운 Conditional Types / infer 와 자연스럽게 연결됩니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Template Literal Types – 문자열 기반 타입 생성 정리 완료!");
    console.log("💡 핵심 정리:");
    console.log("  - 문자열 리터럴 타입과 유니온을 조합해서 '타입 안전한 문자열'을 만들 수 있습니다.");
    console.log("  - keyof, Record, Capitalize/Uppercase 등과 조합하면 강력한 네이밍 규칙을 타입으로 강제할 수 있습니다.");
    console.log("  - 라우트 경로, 이벤트 이름, 상태 키, CSS 변수, 환경 변수 등에서 활용도가 매우 높습니다.");
    console.log("  - Conditional Types + infer와 합치면 '문자열 파서' 역할까지 수행할 수 있습니다.");
    console.log("");
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
