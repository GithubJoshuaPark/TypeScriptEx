// lesson14.ts
// ===============================
// 레슨 실행 함수 - Generic 함수 만들기 (기초)
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
    // 1. Generic 함수란?
    // ========================================
    console.log("📌 1. Generic 함수란?");
    console.log("- 함수가 다양한 타입을 유연하게 처리할 수 있도록 하는 기능입니다.");
    console.log("- any 대신, 타입 안전성(Type Safety)도 확보할 수 있습니다.");
    console.log("");

    f_printCodeBlock(
        "Generic 기본 형태",
        `function identity<T>(value: T): T {
    return value;
}

identity(10);       // T = number
identity("Hello");  // T = string`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. 가장 간단한 Generic 함수
    // ========================================
    console.log("📌 2. 가장 기본적인 Generic 함수");

    function identity<T>(value: T): T {
        return value;
    }

    console.log("identity(123) →", identity(123));
    console.log("identity('안녕하세요') →", identity("안녕하세요"));
    console.log("identity(true) →", identity(true));
    console.log("");

    await f_pause(rl);

    // ========================================
    // 3. Generic이 없다면? any의 문제점
    // ========================================
    console.log("📌 3. Generic이 없다면? (any의 문제)");

    function badIdentity(value: any): any {
        return value;
    }

    f_printCodeBlock(
        "any 사용의 위험",
        `function badIdentity(value: any): any {
    return value;
}

const x = badIdentity("hello");
x.toFixed(2);   // 런타임 오류! (TS에서 잡아주지 못함)`
    );

    console.log("- any 사용 시, 반환값의 실제 타입 체크가 불가능합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. Generic으로 타입 안전하게 만들기
    // ========================================
    console.log("📌 4. Generic으로 타입 안전성 제공하기");

    function safeIdentity<T>(value: T): T {
        return value;
    }

    const num = safeIdentity(123);
    const str = safeIdentity("TypeScript");
    const arr = safeIdentity([1, 2, 3]);

    f_printCodeBlock(
        "Generic 함수 예제",
        `function safeIdentity<T>(value: T): T {
    return value;
}

safeIdentity(123);             // number
safeIdentity("TypeScript");    // string
safeIdentity([1, 2, 3]);       // number[]`
    );

    console.log("safeIdentity 결과:");
    console.log("num →", num);
    console.log("str →", str);
    console.log("arr →", arr);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. Generic 함수 – 2개 이상의 타입 매개변수
    // ========================================
    console.log("📌 5. Generic 함수: 2개 이상의 타입 사용");

    function pair<A, B>(a: A, b: B) {
        return { a, b };
    }

    const p1 = pair<string, number>("나이", 33);
    const p2 = pair<boolean, string>(true, "성공");

    f_printCodeBlock(
        "두 개의 Generic 타입",
        `function pair<A, B>(a: A, b: B) {
    return { a, b };
}

pair("나이", 33);
pair(true, "성공");`
    );

    console.log("pair1:", p1);
    console.log("pair2:", p2);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. 제약 조건(Generic Constraints)
    // ========================================
    console.log("📌 6. 제약 조건(Generic Constraints) – extends 사용");

    interface Lengthy {
        length: number;
    }

    function logLength<T extends Lengthy>(value: T): T {
        console.log("길이:", value.length);
        return value;
    }

    f_printCodeBlock(
        "extends를 이용한 제약 조건",
        `interface Lengthy {
    length: number;
}

function logLength<T extends Lengthy>(value: T): T {
    console.log("길이:", value.length);
    return value;
}

// 문자열 → OK
logLength("Hello");

// 배열 → OK
logLength([1, 2, 3]);

// 숫자 → Error (length 없음)
// logLength(123);`
    );

    logLength("Hello");
    logLength([1, 2, 3]);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. 타입 추론(Inference)이 자동으로 적용되는 Generic
    // ========================================
    console.log("📌 7. Generic 타입 자동 추론");

    function wrap<T>(value: T) {
        return { value };
    }

    const w1 = wrap(10);             // T = number
    const w2 = wrap("자동 추론!");    // T = string
    const w3 = wrap({ a: 1 });       // T = { a: number }

    f_printCodeBlock(
        "Generic 타입 자동 추론 예제",
        `function wrap<T>(value: T) {
    return { value };
}

wrap(10);            // number
wrap("자동 추론!");   // string
wrap({ a: 1 });      // object`
    );

    console.log("wrap 결과:");
    console.log("w1:", w1);
    console.log("w2:", w2);
    console.log("w3:", w3);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 실전 예제: 배열 첫 요소 가져오기
    // ========================================
    console.log("📌 8. 실전 예제: 배열 첫 요소 가져오기");

    function first<T>(arr: T[]): T | undefined {
        return arr[0];
    }

    f_printCodeBlock(
        "배열 첫 요소 반환 Generic",
        `function first<T>(arr: T[]): T | undefined {
    return arr[0];
}

first([10, 20, 30]);     // number
first(["a", "b", "c"]);  // string`
    );

    console.log("first([10,20,30]) →", first([10, 20, 30]));
    console.log("first(['a','b','c']) →", first(["a", "b", "c"]));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 9. 실전 예제: 타입 안전한 fetch 변환기
    // ========================================
    console.log("📌 9. 실전 예제: API 응답 타입 보장");

    async function parseJson<T>(json: string): Promise<T> {
        return JSON.parse(json) as T; // parse (Object) -> T로 타입을 강제
    }

    f_printCodeBlock(
        "API JSON Parsing Generic",
        `async function parseJson<T>(json: string): Promise<T> {
    return JSON.parse(json) as T;
}

type User = { id: number; name: string };
const data = await parseJson<User>('{"id":1,"name":"Joshua"}');`
    );

    type User = { id: number; name: string };

    const json = '{"id":1,"name":"Joshua"}';
    const parsed = await parseJson<User>(json);

    console.log("parsed:", parsed);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Generic 함수 기초를 완전히 익혔습니다!");
    console.log("💡 Tip:");
    console.log("  - Generic은 다양한 타입을 유연하게 처리할 때 매우 유용합니다.");
    console.log("  - any 대신 Generic을 사용하면 타입 안전성을 확보할 수 있습니다.");
    console.log("  - 제약조건 extends를 사용하면 특정 속성을 가진 타입만 허용할 수 있습니다.");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
