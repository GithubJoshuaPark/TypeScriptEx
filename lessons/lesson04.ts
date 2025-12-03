// lesson04.ts
// ===============================
// 레슨 실행 함수 - 배열 & 튜플 타입 선언하기
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
    // 1. 기본 배열 선언 (number[], string[])
    // ========================================
    console.log("📌 1. 기본 배열 타입 선언");

    const numbers: number[] = [1, 2, 3, 4, 5];
    const fruits: string[] = ["사과", "바나나", "오렌지"];

    f_printCodeBlock(
        "기본 배열 선언 예제",
        `const numbers: number[] = [1, 2, 3, 4, 5];
const fruits: string[] = ["사과", "바나나", "오렌지"];`
    );

    console.log("numbers:", numbers);
    console.log("fruits:", fruits);
    console.log("");

    await f_pause(rl);

    // ========================================
    // 2. 제네릭 문법을 이용한 배열 선언 (Array<T>)
    // ========================================
    console.log("📌 2. Array<T> 제네릭 문법");

    const scores: Array<number> = [80, 90, 100];
    const cities: Array<string> = ["Seoul", "Tokyo", "New York"];

    f_printCodeBlock(
        "Array<T> 스타일 선언 예제",
        `const scores: Array<number> = [80, 90, 100];
const cities: Array<string> = ["Seoul", "Tokyo", "New York"];`
    );

    console.log("scores:", scores);
    console.log("cities:", cities);
    console.log("");

    await f_pause(rl);

    // ========================================
    // 3. Union 타입을 가진 배열
    // ========================================
    console.log("📌 3. Union 타입 배열");

    const mixed: (number | string)[] = [1, "two", 3, "four"];
    const flags: Array<boolean | "Y" | "N"> = [true, false, "Y", "N"];

    f_printCodeBlock(
        "Union 타입 배열 예제",
        `const mixed: (number | string)[] = [1, "two", 3, "four"];
const flags: Array<boolean | "Y" | "N"> = [true, false, "Y", "N"];`
    );

    console.log("mixed:", mixed);
    console.log("flags:", flags);
    console.log("");

    await f_pause(rl);

    // ========================================
    // 4. ReadonlyArray - 읽기 전용 배열
    // ========================================
    console.log("📌 4. ReadonlyArray<T> (읽기 전용 배열)");

    const readonlyNumbers: ReadonlyArray<number> = [10, 20, 30];

    f_printCodeBlock(
        "ReadonlyArray 예제",
        `const readonlyNumbers: ReadonlyArray<number> = [10, 20, 30];

// readonlyNumbers.push(40);   // ❌ Error
// readonlyNumbers[0] = 99;    // ❌ Error`
    );

    console.log("readonlyNumbers:", readonlyNumbers);
    console.log("→ push, pop 등으로 변경할 수 없습니다.");
    console.log("");

    await f_pause(rl);

    // ========================================
    // 5. 배열 메서드와 타입 추론
    // ========================================
    console.log("📌 5. 배열 메서드와 타입 추론");

    const priceList: number[] = [1000, 2500, 3000];

    const withTax = priceList.map((price) => {
        // price는 number로 자동 추론
        return price * 1.1;
    });

    const expensive = priceList.filter((price) => price >= 2000);

    f_printCodeBlock(
        "배열 메서드 예제",
        `const priceList: number[] = [1000, 2500, 3000];

const withTax = priceList.map((price) => price * 1.1);
const expensive = priceList.filter((price) => price >= 2000);`
    );

    console.log("원가 priceList:", priceList);
    console.log("부가세 포함 withTax:", withTax);
    console.log("고가 상품 expensive:", expensive);
    console.log("");

    await f_pause(rl);

    // ========================================
    // 6. 튜플(Tuple) 기본 - 고정 길이 & 위치별 타입
    // ========================================
    console.log("📌 6. 튜플(Tuple) 기본");

    // [string, number] 형태의 튜플
    const user1: [string, number] = ["Joshua", 53];
    const user2: [string, number] = ["Alice", 30];

    f_printCodeBlock(
        "기본 튜플 선언 예제",
        `const user1: [string, number] = ["Joshua", 53];
const user2: [string, number] = ["Alice", 30];`
    );

    console.log("user1:", user1, "→ [name: string, age: number]");
    console.log("user2:", user2, "→ [name: string, age: number]");
    console.log("");

    await f_pause(rl);

    // ========================================
    // 7. 튜플 + 구조 분해 할당
    // ========================================
    console.log("📌 7. 튜플과 구조 분해 할당");

    const point: [number, number] = [10, 20];
    const [x, y] = point; // x: number, y: number

    f_printCodeBlock(
        "튜플 구조 분해 예제",
        `const point: [number, number] = [10, 20];
const [x, y] = point;`
    );

    console.log("point:", point);
    console.log("x:", x, ", y:", y);
    console.log("");

    await f_pause(rl);

    // ========================================
    // 8. 튜플에서 선택적 요소(Optional Element)
    // ========================================
    console.log("📌 8. 선택적 요소가 있는 튜플");

    type UserTuple = [id: number, name: string, email?: string];

    const tUser1: UserTuple = [1, "홍길동"];
    const tUser2: UserTuple = [2, "김영희", "younghee@example.com"];

    f_printCodeBlock(
        "Optional 튜플 예제",
        `type UserTuple = [id: number, name: string, email?: string];

const tUser1: UserTuple = [1, "홍길동"];
const tUser2: UserTuple = [2, "김영희", "younghee@example.com"];`
    );

    console.log("tUser1:", tUser1);
    console.log("tUser2:", tUser2);
    console.log("");

    await f_pause(rl);

    // ========================================
    // 9. readonly 튜플 (불변 튜플)
    // ========================================
    console.log("📌 9. readonly 튜플");

    const CONFIG: readonly [string, number] = ["PORT", 3000];

    f_printCodeBlock(
        "readonly 튜플 예제",
        `const CONFIG: readonly [string, number] = ["PORT", 3000];

// CONFIG[0] = "HOST";  // ❌ Error
// CONFIG[1] = 8080;    // ❌ Error`
    );

    console.log("CONFIG:", CONFIG);
    console.log("→ CONFIG의 각 요소를 변경할 수 없습니다.");
    console.log("");

    await f_pause(rl);

    // ========================================
    // 10. 함수 반환 타입으로 튜플 사용
    // ========================================
    console.log("📌 10. 함수에서 튜플 반환하기");

    function getUserInfo(id: number): [string, number] {
        if (id === 1) {
            return ["Joshua", 53];
        }
        return ["Unknown", 0];
    }

    const [userName, userAge] = getUserInfo(1);

    f_printCodeBlock(
        "함수 반환 튜플 예제",
        `function getUserInfo(id: number): [string, number] {
    if (id === 1) {
        return ["Joshua", 53];
    }
    return ["Unknown", 0];
}

const [userName, userAge] = getUserInfo(1);`
    );

    console.log("userName:", userName);
    console.log("userAge:", userAge);
    console.log("");

    await f_pause(rl);

    // ========================================
    // 11. 가변 튜플 (Variadic Tuple) 살짝 맛보기
    // ========================================
    console.log("📌 11. 가변 튜플 (Variadic Tuple) 간단 예제");

    type LogEntry = [level: "INFO" | "WARN" | "ERROR", ...details: string[]];

    const log1: LogEntry = ["INFO", "서버 시작", "포트: 3000"];
    const log2: LogEntry = ["ERROR", "DB 연결 실패", "코드: 500", "재시도 예정"];

    f_printCodeBlock(
        "가변 튜플 예제",
        `type LogEntry = [level: "INFO" | "WARN" | "ERROR", ...details: string[]];

const log1: LogEntry = ["INFO", "서버 시작", "포트: 3000"];
const log2: LogEntry = ["ERROR", "DB 연결 실패", "코드: 500", "재시도 예정"];`
    );

    console.log("log1:", log1);
    console.log("log2:", log2);
    console.log("");

    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ 배열 & 튜플 타입 선언/활용의 핵심을 정리했습니다.");
    console.log("💡 Tip:");
    console.log("   - 일반적인 리스트는 배열(number[], string[])을 사용하고,");
    console.log("   - '정확히 몇 개, 어떤 순서'로 값이 나와야 할 때는 튜플을 사용하면 좋습니다.");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl); // 레슨 내에서 일시정지
}
