// lesson18.ts
// ===============================
// 레슨 실행 함수 - 타입 가드(Type Guard) 직접 구현하기
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
    // 1. 타입 가드(Type Guard)란?
    // ========================================
    console.log("📌 1. 타입 가드(Type Guard)란?");
    console.log("- Union 타입 등 여러 타입이 섞여 있을 때,");
    console.log("  특정 조건을 통해 TypeScript에게 '지금 이 분기 안에서는 이 타입이야'라고 알려주는 장치입니다.");
    console.log("- typeof, instanceof, in 연산자도 넓은 의미의 타입 가드입니다.");
    console.log("- 여기서는 '사용자 정의 타입 가드'에 집중해 보겠습니다.");
    console.log("");

    f_printCodeBlock(
        "타입 가드 기본 형태",
        `// 타입 가드 함수 시그니처
function isSomething(arg: unknown): arg is Something {
    // boolean을 반환하는 조건식
    return /* ... */;
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. typeof / instanceof / in 복습 (내장 타입 가드)
    // ========================================
    console.log("📌 2. 내장 타입 가드 간단 복습 (typeof / instanceof / in)");

    function printValue(v: string | number) {
        if (typeof v === "string") {
            console.log("문자열 길이:", v.length); // v: string
        } else {
            console.log("숫자 제곱:", v * v); // v: number
        }
    }

    class Animal {
        constructor(public name: string) { }
    }

    class Dog extends Animal {
        bark() {
            console.log("🐶 멍멍!");
        }
    }

    function processAnimal(a: Animal | Dog) {
        if (a instanceof Dog) {
            a.bark(); // a: Dog
        } else {
            console.log("일반 동물:", a.name);
        }
    }

    type HasId = { id: number };
    type HasName = { name: string };

    function printInfo(obj: HasId | HasName) {
        if ("id" in obj) {
            console.log("ID:", obj.id);
        } else {
            console.log("이름:", obj.name);
        }
    }

    f_printCodeBlock(
        "내장 타입 가드 예제",
        `function printValue(v: string | number) {
    if (typeof v === "string") {
        console.log("문자열 길이:", v.length);
    } else {
        console.log("숫자 제곱:", v * v);
    }
}

class Animal {
    constructor(public name: string) {}
}

class Dog extends Animal {
    bark() {
        console.log("🐶 멍멍!");
    }
}

function processAnimal(a: Animal | Dog) {
    if (a instanceof Dog) {
        a.bark();  // Dog
    } else {
        console.log("일반 동물:", a.name);
    }
}

type HasId = { id: number };
type HasName = { name: string };

function printInfo(obj: HasId | HasName) {
    if ("id" in obj) {
        console.log("ID:", obj.id);
    } else {
        console.log("이름:", obj.name);
    }
}`
    );

    printValue("hello");
    printValue(7);
    processAnimal(new Animal("동물1"));
    processAnimal(new Dog("댕댕이"));
    printInfo({ id: 1 });
    printInfo({ name: "Joshua" });
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. 사용자 정의 타입 가드 – 가장 기본 예제
    // ========================================
    console.log("📌 3. 사용자 정의 타입 가드 – 가장 기본 예제");

    type Fish = {
        kind: "fish";
        swim: () => void;
    };

    type Bird = {
        kind: "bird";
        fly: () => void;
    };

    type AnimalUnion = Fish | Bird;

    // 타입 가드 함수
    function isFish(animal: AnimalUnion): animal is Fish {
        return animal.kind === "fish";
    }

    function move(animal: AnimalUnion) {
        if (isFish(animal)) {
            // 여기서는 animal: Fish
            animal.swim();
        } else {
            // 여기서는 animal: Bird
            animal.fly();
        }
    }

    const f: Fish = { kind: "fish", swim: () => console.log("🐟 수영!") };
    const b: Bird = { kind: "bird", fly: () => console.log("🕊 날기!") };

    f_printCodeBlock(
        "사용자 정의 타입 가드 기본 예제",
        `type Fish = {
    kind: "fish";
    swim: () => void;
};

type Bird = {
    kind: "bird";
    fly: () => void;
};

type AnimalUnion = Fish | Bird;

function isFish(animal: AnimalUnion): animal is Fish {
    return animal.kind === "fish";
}

function move(animal: AnimalUnion) {
    if (isFish(animal)) {
        animal.swim(); // Fish
    } else {
        animal.fly();  // Bird
    }
}`
    );

    move(f);
    move(b);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. unknown / any에 타입 가드 적용하기
    // ========================================
    console.log("📌 4. unknown / any 값에 타입 가드 적용하기");
    console.log("- 실무에서 API 응답이나 외부 라이브러리 값은 종종 unknown 또는 any 로 들어옵니다.");
    console.log("- 이때, 타입 가드를 통해 '검증 + 안전한 좁히기'를 할 수 있습니다.");
    console.log("");

    type User = {
        id: number;
        name: string;
    };

    function isUser(value: unknown): value is User {
        if (typeof value !== "object" || value === null) return false;

        const v = value as { id?: unknown; name?: unknown };

        return (
            typeof v.id === "number" &&
            typeof v.name === "string"
        );
    }

    function printUserMaybe(value: unknown) {
        if (isUser(value)) {
            console.log(`👤 유저: #${value.id} - ${value.name}`);
        } else {
            console.log("❌ 유저 타입이 아닙니다:", value);
        }
    }

    f_printCodeBlock(
        "unknown 값에 대한 타입 가드",
        `type User = {
    id: number;
    name: string;
};

function isUser(value: unknown): value is User {
    if (typeof value !== "object" || value === null) return false;

    const v = value as { id?: unknown; name?: unknown };

    return (
        typeof v.id === "number" &&
        typeof v.name === "string"
    );
}

function printUserMaybe(value: unknown) {
    if (isUser(value)) {
        console.log(\`유저: #\${value.id} - \${value.name}\`);
    } else {
        console.log("유저 타입이 아닙니다:", value);
    }
}`
    );

    printUserMaybe({ id: 1, name: "Joshua" });
    printUserMaybe({ id: "1", name: "Oops" });
    printUserMaybe("Hello");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. Discriminated Union + 사용자 정의 타입 가드
    // ========================================
    console.log("📌 5. Discriminated Union + 사용자 정의 타입 가드");

    type LoadingState = {
        state: "loading";
    };

    type SuccessState = {
        state: "success";
        data: string;
    };

    type ErrorState = {
        state: "error";
        message: string;
    };

    type ApiState = LoadingState | SuccessState | ErrorState;

    function isLoading(state: ApiState): state is LoadingState {
        return state.state === "loading";
    }

    function isSuccess(state: ApiState): state is SuccessState {
        return state.state === "success";
    }

    function isError(state: ApiState): state is ErrorState {
        return state.state === "error";
    }

    function printApiState(state: ApiState) {
        if (isLoading(state)) {
            console.log("⏳ 로딩 중입니다...");
        } else if (isSuccess(state)) {
            console.log("✅ 성공! 데이터:", state.data);
        } else if (isError(state)) {
            console.log("❌ 에러 발생:", state.message);
        } else {
            // 이 분기는 발생하지 않음 (타입 상에서 막혀 있음)
            const _exhaustiveCheck: never = state;
            console.log(_exhaustiveCheck);
        }
    }

    const s1: ApiState = { state: "loading" };
    const s2: ApiState = { state: "success", data: "완료!" };
    const s3: ApiState = { state: "error", message: "네트워크 오류" };

    f_printCodeBlock(
        "Discriminated Union + 타입 가드",
        `type LoadingState = { state: "loading" };
type SuccessState = { state: "success"; data: string };
type ErrorState = { state: "error"; message: string };

type ApiState = LoadingState | SuccessState | ErrorState;

function isLoading(state: ApiState): state is LoadingState {
    return state.state === "loading";
}

function isSuccess(state: ApiState): state is SuccessState {
    return state.state === "success";
}

function isError(state: ApiState): state is ErrorState {
    return state.state === "error";
}

function printApiState(state: ApiState) {
    if (isLoading(state)) {
        console.log("로딩 중...");
    } else if (isSuccess(state)) {
        console.log("성공:", state.data);
    } else if (isError(state)) {
        console.log("에러:", state.message);
    } else {
        const _exhaustiveCheck: never = state;
        console.log(_exhaustiveCheck);
    }
}`
    );

    printApiState(s1);
    printApiState(s2);
    printApiState(s3);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. 컬렉션 필터링에서 타입 가드 활용하기
    // ========================================
    console.log("📌 6. 배열 필터링에서 타입 가드 활용하기");
    console.log("- filter, map 등에서 타입 가드를 사용하면 결과 배열의 타입이 자동으로 좁혀집니다.");
    console.log("");

    type AdminUser = {
        role: "admin";
        name: string;
        permission: string[];
    };

    type NormalUser = {
        role: "user";
        name: string;
    };

    type AnyUser = AdminUser | NormalUser;

    function isAdmin(user: AnyUser): user is AdminUser {
        return user.role === "admin";
    }

    const users: AnyUser[] = [
        { role: "admin", name: "관리자1", permission: ["ALL"] },
        { role: "user", name: "사용자1" },
        { role: "admin", name: "관리자2", permission: ["READ", "WRITE"] }
    ];

    const admins = users.filter(isAdmin); // AdminUser[]
    const normals = users.filter((u) => !isAdmin(u)); // NormalUser[]

    f_printCodeBlock(
        "filter 에서 타입 가드 활용",
        `type AdminUser = {
    role: "admin";
    name: string;
    permission: string[];
};

type NormalUser = {
    role: "user";
    name: string;
};

type AnyUser = AdminUser | NormalUser;

function isAdmin(user: AnyUser): user is AdminUser {
    return user.role === "admin";
}

const users: AnyUser[] = [
    { role: "admin", name: "관리자1", permission: ["ALL"] },
    { role: "user", name: "사용자1" },
    { role: "admin", name: "관리자2", permission: ["READ", "WRITE"] },
];

const admins = users.filter(isAdmin);        // AdminUser[]
const normals = users.filter((u) => !isAdmin(u)); // NormalUser[]`
    );

    console.log("admins:", admins);
    console.log("normals:", normals);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. Generic 타입 가드 – 재사용 가능한 패턴
    // ========================================
    console.log("📌 7. Generic 타입 가드 – 재사용 가능한 패턴");

    type WithId = { id: number };

    function hasId(value: unknown): value is WithId {
        return (
            typeof value === "object" &&
            value !== null &&
            "id" in value &&
            typeof (value as any).id === "number"
        );
    }

    function findById<T extends WithId>(items: T[], id: number): T | undefined {
        return items.find((item) => item.id === id);
    }

    const item1 = { id: 1, name: "아이템1" };
    const item2 = { id: 2, title: "아이템2" };
    const list = [item1, item2];

    const found = findById(list, 2);
    console.log("findById(list, 2) →", found);

    f_printCodeBlock(
        "Generic + 타입 가드 패턴",
        `type WithId = { id: number };

function hasId(value: unknown): value is WithId {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        typeof (value as any).id === "number"
    );
}

function findById<T extends WithId>(items: T[], id: number): T | undefined {
    return items.find((item) => item.id === id);
}`
    );

    console.log("hasId({ id: 1 }) →", hasId({ id: 1 }));
    console.log("hasId({ id: '1' }) →", hasId({ id: "1" }));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 잘못된 타입 가드의 위험성
    // ========================================
    console.log("📌 8. 잘못된 타입 가드의 위험성");
    console.log("- 타입 가드는 'TS에게 이건 이런 타입이야!'라고 강하게 주장하는 장치입니다.");
    console.log("- 조건이 틀리면, 컴파일은 통과하지만 런타임에는 문제가 될 수 있습니다.");
    console.log("");

    type PersonLike = { name: string };

    // ❌ 나쁜 예시: 항상 true를 반환하는 타입 가드
    function isPersonLikeBad(value: unknown): value is PersonLike {
        // 이렇게 구현하면 사실상 any 강제 캐스팅과 다를 바가 없습니다.
        return true;
    }

    function printPersonNameUnsafe(value: unknown) {
        if (isPersonLikeBad(value)) {
            // TS는 PersonLike 라고 믿지만, 실제로는 전혀 아닐 수 있음
            console.log("이름:", value.name); // 런타임에서 에러 가능
        }
    }

    f_printCodeBlock(
        "잘못된 타입 가드의 예",
        `type PersonLike = { name: string };

// ❌ 잘못된 타입 가드: 항상 true 반환
function isPersonLikeBad(value: unknown): value is PersonLike {
    return true;
}

function printPersonNameUnsafe(value: unknown) {
    if (isPersonLikeBad(value)) {
        // 여기서 value는 사실상 any와 비슷
        console.log("이름:", value.name); // 런타임 에러 가능
    }
}`
    );

    console.log("⚠️ 타입 가드를 구현할 때는 조건을 최대한 엄격하고 정확하게 작성해야 합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ 타입 가드(Type Guard)를 직접 구현하는 방법을 정리했습니다!");
    console.log("💡 Tip 정리:");
    console.log("  - 시그니처:  function isX(arg: unknown): arg is X { ... }");
    console.log("  - unknown / any / API 응답 등에 필수적인 패턴");
    console.log("  - Discriminated Union + 타입 가드 조합은 상태머신 설계에 매우 유용");
    console.log("  - filter, map 등 컬렉션 처리에서 타입 가드를 쓰면 결과 타입이 깔끔하게 좁혀짐");
    console.log("  - 조건이 틀린 타입 가드는 '위험한 any'가 될 수 있으므로, 검증 로직을 신중하게 작성해야 함");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
