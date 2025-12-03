// lesson06.ts
// ===============================
// 레슨 실행 함수 - 함수 타입 정의 (parameter / return 타입 지정)
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
    // 1. 매개변수 타입 지정
    // ========================================
    console.log("📌 1. 매개변수 타입 지정 (Parameter Type)");

    function greet(name: string): void {
        console.log(`안녕하세요, ${name}님!`);
    }

    f_printCodeBlock(
        "매개변수 타입 지정 예제",
        `function greet(name: string): void {
    console.log(\`안녕하세요, \${name}님!\`);
}

greet("Joshua");`
    );

    greet("Joshua");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. 반환 타입 지정 (Return Type)
    // ========================================
    console.log("📌 2. 반환 타입 지정 (Return Type)");

    function add(a: number, b: number): number {
        return a + b;
    }

    const sum = add(10, 20);

    f_printCodeBlock(
        "반환 타입 지정 예제",
        `function add(a: number, b: number): number {
    return a + b;
}

const sum = add(10, 20);`
    );

    console.log("sum:", sum);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. Optional Parameter (선택적 매개변수)
    // ========================================
    console.log("📌 3. Optional Parameter (선택적 매개변수)");

    function printMessage(msg: string, prefix?: string): void {
        if (prefix) console.log(prefix, msg);
        else console.log(msg);
    }

    f_printCodeBlock(
        "Optional Parameter 예제",
        `function printMessage(msg: string, prefix?: string): void {
    if (prefix) console.log(prefix, msg);
    else console.log(msg);
}

printMessage("Hello");
printMessage("Hello", "[INFO]");`
    );

    printMessage("Hello");
    printMessage("Hello", "[INFO]");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. Default Parameter (기본값 매개변수)
    // ========================================
    console.log("📌 4. Default Parameter (기본값 지정)");

    function multiply(a: number, b: number = 1): number {
        return a * b;
    }

    const m1 = multiply(5);
    const m2 = multiply(5, 3);

    f_printCodeBlock(
        "기본값 매개변수 예제",
        `function multiply(a: number, b: number = 1): number {
    return a * b;
}

multiply(5);    // 5
multiply(5, 3); // 15`
    );

    console.log("multiply(5):", m1);
    console.log("multiply(5, 3):", m2);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. Rest Parameter (...args)
    // ========================================
    console.log("📌 5. Rest Parameter (...args)");

    function sumAll(...nums: number[]): number {
        return nums.reduce((acc, cur) => acc + cur, 0);
    }

    const total = sumAll(1, 2, 3, 4, 5);

    f_printCodeBlock(
        "Rest Parameter 예제",
        `function sumAll(...nums: number[]): number {
    return nums.reduce((acc, cur) => acc + cur, 0);
}

sumAll(1, 2, 3, 4, 5);`
    );

    console.log("sumAll:", total);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. 함수 타입(Type Annotation to Variables)
    // ========================================
    console.log("📌 6. 함수 타입 정의 (함수를 변수에 저장)");

    // 타입을 먼저 선언 (함수 시그니처)
    let calculator: (x: number, y: number) => number;

    // 해당 타입에 맞는 함수 할당
    calculator = (x, y) => x + y;

    f_printCodeBlock(
        "함수를 변수에 타입 지정",
        `let calculator: (x: number, y: number) => number;

calculator = (x, y) => x + y;

calculator(10, 20);`
    );

    console.log("calculator(10, 20):", calculator(10, 20));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. Type Alias를 이용한 함수 타입 정의
    // ========================================
    console.log("📌 7. Type Alias로 함수 타입 선언");

    type MathOp = (a: number, b: number) => number;

    const subtract: MathOp = (a, b) => a - b;
    const multiplyOp: MathOp = (a, b) => a * b;

    f_printCodeBlock(
        "Type Alias로 함수 타입 선언",
        `type MathOp = (a: number, b: number) => number;

const subtract: MathOp = (a, b) => a - b;
const multiplyOp: MathOp = (a, b) => a * b;`
    );

    console.log("subtract(10, 3):", subtract(10, 3));
    console.log("multiplyOp(4, 5):", multiplyOp(4, 5));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. void 타입 & never 타입
    // ========================================
    console.log("📌 8. void 타입과 never 타입");

    function printLog(msg: string): void {
        console.log("LOG:", msg);
    }

    function alwaysError(message: string): never {
        throw new Error(message);
    }

    f_printCodeBlock(
        "void & never 예제",
        `function printLog(msg: string): void {
    console.log("LOG:", msg);
}

function alwaysError(message: string): never {
    throw new Error(message);
}`
    );

    printLog("기록중...");
    console.log("alwaysError('에러!')는 실제로 프로그램을 종료합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 끝
    // ========================================
    console.log("✅ 함수 타입의 핵심 요소들을 모두 정리했습니다!");
    console.log("💡 Tip:");
    console.log("  - 매개변수/반환 타입을 명확히 지정하면 코드가 안전해지고");
    console.log("  - 함수 타입을 변수로 분리하면 재사용성이 대폭 증가합니다!");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
