// lesson07.ts
// ===============================
// 레슨 실행 함수 - Union 타입 & Literal 타입 활용 예제
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
    // 1. Union 타입 기본
    // ========================================
    console.log("📌 1. Union 타입 기본");

    let value: string | number;
    value = "Hello";
    value = 123;

    f_printCodeBlock(
        "Union 타입 기본 예제",
        `let value: string | number;
value = "Hello";
value = 123;`
    );

    console.log("value:", value);
    console.log("Union 타입은 지정된 여러 타입 중 하나를 가질 수 있습니다!");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. Union 타입으로 함수 매개변수 받기
    // ========================================
    console.log("📌 2. Union 타입으로 매개변수 받기");

    function printId(id: string | number): void {
        console.log("ID:", id);
    }

    printId(101);
    printId("user-001");

    f_printCodeBlock(
        "Union 타입 함수",
        `function printId(id: string | number): void {
    console.log("ID:", id);
}

printId(101);
printId("user-001");`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. 타입 좁히기(Type Narrowing)
    // ========================================
    console.log("📌 3. 타입 좁히기 (Type Narrowing)");

    function formatValue(v: string | number) {
        if (typeof v === "number") {
            return v.toFixed(2);
        }
        return v.toUpperCase();
    }

    f_printCodeBlock(
        "타입 좁히기 예제",
        `function formatValue(v: string | number) {
    if (typeof v === "number") {
        return v.toFixed(2);  // v는 number
    }
    return v.toUpperCase();   // v는 string
}

formatValue(3.14159);
formatValue("hello");`
    );

    console.log("formatValue(3.14159) →", formatValue(3.14159));
    console.log("formatValue('hello') →", formatValue("hello"));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. Literal 타입 기본
    // ========================================
    console.log("📌 4. Literal 타입 기본");

    let direction: "left" | "right" | "up" | "down";
    direction = "left";
    direction = "down";

    f_printCodeBlock(
        "Literal 타입 기본",
        `let direction: "left" | "right" | "up" | "down";
direction = "left";
direction = "down";
// direction = "forward";  // ❌ Error`
    );

    console.log("direction:", direction);
    console.log("Literal 타입은 지정된 값만 허용합니다!");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. Literal 타입 응용 - 상태값(Status)
    // ========================================
    console.log("📌 5. Literal 타입으로 상태값 만들기");

    type Status = "loading" | "success" | "error";

    function setStatus(s: Status) {
        console.log("현재 상태:", s);
    }

    setStatus("loading");
    setStatus("success");
    setStatus("error");

    f_printCodeBlock(
        "Literal 타입 상태값 예제",
        `type Status = "loading" | "success" | "error";

function setStatus(s: Status) {
    console.log("현재 상태:", s);
}

setStatus("loading");
setStatus("success");
setStatus("error");`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. Union + Literal 조합
    // ========================================
    console.log("📌 6. Union + Literal 타입 조합");

    type Result = number | "fail";

    function calculatePrice(qty: number, price: number): Result {
        if (qty <= 0 || price <= 0) return "fail";
        return qty * price;
    }

    f_printCodeBlock(
        "Union + Literal 조합 예제",
        `type Result = number | "fail";

function calculatePrice(qty: number, price: number): Result {
    if (qty <= 0 || price <= 0) return "fail";
    return qty * price;
}`
    );

    console.log("calculatePrice(5, 1000):", calculatePrice(5, 1000));
    console.log("calculatePrice(-1, 1000):", calculatePrice(-1, 1000));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. Discriminated Union 맛보기
    // ========================================
    console.log("📌 7. Discriminated Union 간단 예제");

    type Shape =
        | { kind: "circle"; radius: number }
        | { kind: "square"; size: number };

    function getArea(shape: Shape): number {
        if (shape.kind === "circle") {
            return Math.PI * shape.radius * shape.radius;
        } else {
            return shape.size * shape.size;
        }
    }

    f_printCodeBlock(
        "Discriminated Union 간단 예제",
        `type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "square"; size: number };

function getArea(shape: Shape): number {
    if (shape.kind === "circle") {
        return Math.PI * shape.radius * shape.radius;
    } else {
        return shape.size * shape.size;
    }
}`
    );

    console.log("circle area:", getArea({ kind: "circle", radius: 10 }));
    console.log("square area:", getArea({ kind: "square", size: 5 }));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Union 타입과 Literal 타입의 핵심 개념을 정리했습니다!");
    console.log("💡 Tip:");
    console.log("  - Union: 여러 타입 중 하나를 허용할 때");
    console.log("  - Literal: 특정 값만 허용하여 안전한 상태/모드 정의할 때");
    console.log("  - Narrowing: 조건문으로 타입을 정확히 좁혀서 안전한 코드 작성");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
