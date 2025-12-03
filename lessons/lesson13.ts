// lesson13.ts
// ===============================
// 레슨 실행 함수 - Narrowing – 타입 좁히기 (typeof, in, instanceof)
// ===============================
import * as readline from "node:readline";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import { getRandomEmoji, f_pause, f_printCodeBlock } from "../utils.js";

export async function run(
    rl: readline.Interface,
    title: string
): Promise<void> {
    const filePath = `${basename(fileURLToPath(import.meta.url))}`;
    const baseNoExt = basename(filePath, ".js");

    console.log(`${getRandomEmoji()} --- ${baseNoExt}: ${title} ---`);
    console.log("");

    // ========================================
    // 1. Narrowing 개념 맛보기
    // ========================================
    console.log("📌 1. Narrowing(타입 좁히기)란?");
    console.log("- Union 타입처럼 여러 타입이 섞여 있을 때,");
    console.log("  조건문 등을 통해 특정 분기 안에서는 타입을 더 구체적으로 '좁혀' 사용하는 기법입니다.");
    console.log("");

    type StringOrNumber = string | number;

    function printLengthOrFixed(value: StringOrNumber) {
        if (typeof value === "string") {
            console.log("문자열 길이:", value.length); // string으로 좁혀짐
        } else {
            console.log("숫자(소수점 두 자리):", value.toFixed(2)); // number로 좁혀짐
        }
    }

    f_printCodeBlock(
        "간단 Narrowing 예제",
        `type StringOrNumber = string | number;

function printLengthOrFixed(value: StringOrNumber) {
    if (typeof value === "string") {
        console.log("문자열 길이:", value.length);     // value: string
    } else {
        console.log("숫자(소수점 두 자리):", value.toFixed(2)); // value: number
    }
}`
    );

    printLengthOrFixed("Hello");
    printLengthOrFixed(3.14159);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. typeof 를 이용한 Narrowing
    // ========================================
    console.log("📌 2. typeof 를 이용한 Narrowing");

    function formatValue(value: string | number | boolean) {
        if (typeof value === "string") {
            return `문자열(${value.toUpperCase()})`;
        } else if (typeof value === "number") {
            return `숫자(${value.toFixed(1)})`;
        } else {
            return `불리언(${value ? "참" : "거짓"})`;
        }
    }

    f_printCodeBlock(
        "typeof Narrowing 예제",
        `function formatValue(value: string | number | boolean) {
    if (typeof value === "string") {
        return \`문자열(\${value.toUpperCase()})\`;
    } else if (typeof value === "number") {
        return \`숫자(\${value.toFixed(1)})\`;
    } else {
        return \`불리언(\${value ? "참" : "거짓"})\`;
    }
}

formatValue("hello");
formatValue(3.14);
formatValue(true);`
    );

    console.log("formatValue('hello') →", formatValue("hello"));
    console.log("formatValue(3.14) →", formatValue(3.14));
    console.log("formatValue(true) →", formatValue(true));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. Truthy/Falsy 체크로 Narrowing
    // ========================================
    console.log("📌 3. Truthy / Falsy 체크로 Narrowing");

    function printMessage(msg?: string | null) {
        if (!msg) {
            // msg가 '', null, undefined, 0 등일 때
            console.log("메시지가 없습니다.");
            return;
        }
        // 여기 들어오면 msg는 string으로 좁혀짐
        console.log("메시지:", msg.toUpperCase());
    }

    f_printCodeBlock(
        "Truthy/Falsy Narrowing 예제",
        `function printMessage(msg?: string | null) {
    if (!msg) {
        console.log("메시지가 없습니다.");
        return;
    }
    // 이 구간에서는 msg는 string
    console.log("메시지:", msg.toUpperCase());
}`
    );

    printMessage();
    printMessage(null);
    printMessage("Hello Narrowing");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. 'in' 연산자로 프로퍼티 존재 여부 검사
    // ========================================
    console.log("📌 4. 'in' 연산자로 Narrowing (프로퍼티 검사)");

    type Dog = {
        kind: "dog";
        name: string;
        bark: () => void;
    };

    type Cat = {
        kind: "cat";
        name: string;
        meow: () => void;
    };

    type Pet = Dog | Cat;

    function speak(pet: Pet) {
        if ("bark" in pet) {
            // Dog로 좁혀짐
            pet.bark();
        } else {
            // Cat으로 좁혀짐
            pet.meow();
        }
    }

    const dog: Dog = {
        kind: "dog",
        name: "멍멍이",
        bark: () => console.log("🐶 멍멍!")
    };

    const cat: Cat = {
        kind: "cat",
        name: "야옹이",
        meow: () => console.log("🐱 야옹~")
    };

    f_printCodeBlock(
        "'in' 연산자 Narrowing 예제",
        `type Dog = {
    kind: "dog";
    name: string;
    bark: () => void;
};

type Cat = {
    kind: "cat";
    name: string;
    meow: () => void;
};

type Pet = Dog | Cat;

function speak(pet: Pet) {
    if ("bark" in pet) {
        pet.bark(); // Dog
    } else {
        pet.meow(); // Cat
    }
}`
    );

    speak(dog);
    speak(cat);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. instanceof 를 이용한 Narrowing
    // ========================================
    console.log("📌 5. instanceof 를 이용한 Narrowing");

    class Person {
        constructor(public name: string) { }
    }

    class Employee extends Person {
        constructor(name: string, public department: string) {
            super(name);
        }
    }

    function printPersonInfo(p: Person | Employee) {
        if (p instanceof Employee) {
            console.log(`직원: ${p.name}, 부서: ${p.department}`);
        } else {
            console.log(`사람: ${p.name}`);
        }
    }

    const p1 = new Person("홍길동");
    const p2 = new Employee("Joshua", "개발팀");

    f_printCodeBlock(
        "instanceof Narrowing 예제",
        `class Person {
    constructor(public name: string) {}
}

class Employee extends Person {
    constructor(name: string, public department: string) {
        super(name);
    }
}

function printPersonInfo(p: Person | Employee) {
    if (p instanceof Employee) {
        console.log(\`직원: \${p.name}, 부서: \${p.department}\`);
    } else {
        console.log(\`사람: \${p.name}\`);
    }
}`
    );

    printPersonInfo(p1);
    printPersonInfo(p2);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. Discriminated Union + Narrowing (kind 필드)
    // ========================================
    console.log("📌 6. Discriminated Union + Narrowing");

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

    function printApiState(state: ApiState) {
        switch (state.state) {
            case "loading":
                console.log("⏳ 로딩 중입니다...");
                break;
            case "success":
                console.log("✅ 성공! 데이터:", state.data);
                break;
            case "error":
                console.log("❌ 에러:", state.message);
                break;
        }
    }

    const s1: ApiState = { state: "loading" };
    const s2: ApiState = { state: "success", data: "완료되었습니다." };
    const s3: ApiState = { state: "error", message: "네트워크 오류" };

    f_printCodeBlock(
        "Discriminated Union Narrowing 예제",
        `type LoadingState = { state: "loading" };
type SuccessState = { state: "success"; data: string };
type ErrorState = { state: "error"; message: string };

type ApiState = LoadingState | SuccessState | ErrorState;

function printApiState(state: ApiState) {
    switch (state.state) {
        case "loading":
            console.log("로딩 중...");
            break;
        case "success":
            console.log("성공:", state.data);
            break;
        case "error":
            console.log("에러:", state.message);
            break;
    }
}`
    );

    printApiState(s1);
    printApiState(s2);
    printApiState(s3);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. 사용자 정의 타입 가드 (is 키워드)
    // ========================================
    console.log("📌 7. 사용자 정의 타입 가드 (is 키워드)");

    type Fish = { kind: "fish"; swim: () => void };
    type Bird = { kind: "bird"; fly: () => void };
    type Animal = Fish | Bird;

    function isFish(animal: Animal): animal is Fish {
        return animal.kind === "fish";
    }

    function move(animal: Animal) {
        if (isFish(animal)) {
            // 여기서 animal은 Fish로 좁혀짐
            animal.swim();
        } else {
            // 여기서는 Bird
            animal.fly();
        }
    }

    const fish: Fish = { kind: "fish", swim: () => console.log("🐟 수영!") };
    const bird: Bird = { kind: "bird", fly: () => console.log("🕊 날기!") };

    f_printCodeBlock(
        "사용자 정의 타입 가드 예제",
        `type Fish = { kind: "fish"; swim: () => void };
type Bird = { kind: "bird"; fly: () => void };
type Animal = Fish | Bird;

function isFish(animal: Animal): animal is Fish {
    return animal.kind === "fish";
}

function move(animal: Animal) {
    if (isFish(animal)) {
        animal.swim(); // Fish
    } else {
        animal.fly();  // Bird
    }
}`
    );

    move(fish);
    move(bird);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 실전 예제: 폼 입력 값 처리 시 Narrowing
    // ========================================
    console.log("📌 8. 실전 예제: 폼 입력 값 처리 시 Narrowing");

    type RawValue = string | number | null | undefined;

    function normalizeInput(value: RawValue): string {
        if (value == null) {
            // null 또는 undefined
            return "";
        }
        if (typeof value === "number") {
            return value.toString();
        }
        // 여기서 value는 string
        return value.trim();
    }

    f_printCodeBlock(
        "실전 폼 입력 Narrowing 예제",
        `type RawValue = string | number | null | undefined;

function normalizeInput(value: RawValue): string {
    if (value == null) {
        // null 또는 undefined
        return "";
    }
    if (typeof value === "number") {
        return value.toString();
    }
    // 여기서 value는 string
    return value.trim();
}`
    );

    console.log("normalizeInput(undefined) →", `"${normalizeInput(undefined)}"`);
    console.log("normalizeInput(1234) →", `"${normalizeInput(1234)}"`);
    console.log('normalizeInput("  hello  ") →', `"${normalizeInput("  hello  ")}"`);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Narrowing(타입 좁히기)의 핵심 패턴들을 정리했습니다!");
    console.log("💡 Tip:");
    console.log("  - typeof: 원시 타입 구분 (string, number, boolean, object, function, undefined)");
    console.log("  - in: 특정 프로퍼티 존재 여부로 타입 구분");
    console.log("  - instanceof: 클래스 기반 타입 구분");
    console.log("  - Discriminated Union: state 같은 공통 필드로 안전하게 분기");
    console.log("  - 사용자 정의 타입 가드: 복잡한 조건을 함수로 추출해서 재사용");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
