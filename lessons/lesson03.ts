// ===============================
// 레슨 실행 함수
// ===============================
import * as readline from "node:readline";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import { getRandomEmoji, f_pause } from "../utils.js";

export async function run(rl: readline.Interface, title: string): Promise<void> {
    let filePath = `${basename(fileURLToPath(import.meta.url))}`;
    let baseNoExt = basename(filePath, '.js');
    console.log(`${getRandomEmoji()} --- ${baseNoExt}: ${title} ---`);
    console.log('');

    // ========================================
    // 1. 기본 타입 추론 (Basic Type Inference)
    // ========================================
    console.log("📌 1. 기본 타입 추론");

    // TypeScript는 변수 초기화 시 자동으로 타입을 추론합니다
    let inferredNumber = 42;  // number로 추론
    let inferredString = "Hello";  // string으로 추론
    let inferredBoolean = true;  // boolean으로 추론

    console.log("  inferredNumber:", inferredNumber, "→ 타입: number");
    console.log("  inferredString:", inferredString, "→ 타입: string");
    console.log("  inferredBoolean:", inferredBoolean, "→ 타입: boolean");

    // 추론된 타입은 명시적 타입과 동일하게 동작합니다
    // inferredNumber = "문자열";  // Error: Type 'string' is not assignable to type 'number'

    console.log("");

    await f_pause(rl);

    // ========================================
    // 2. 배열 타입 추론
    // ========================================
    console.log("📌 2. 배열 타입 추론");

    let numbers = [1, 2, 3, 4, 5];  // number[] 로 추론
    let fruits = ["사과", "바나나", "오렌지"];  // string[] 로 추론
    let mixed = [1, "two", 3, "four"];  // (string | number)[] 로 추론 (Union 타입)

    console.log("  numbers:", numbers, "→ 타입: number[]");
    console.log("  fruits:", fruits, "→ 타입: string[]");
    console.log("  mixed:", mixed, "→ 타입: (string | number)[]");

    // 빈 배열은 any[]로 추론됩니다 (주의!)
    let emptyArray = [];  // any[]
    emptyArray.push(1);
    emptyArray.push("문자열");
    console.log("  emptyArray:", emptyArray, "→ 타입: any[] (주의 필요!)");

    console.log("");

    await f_pause(rl);

    // ========================================
    // 3. 객체 타입 추론
    // ========================================
    console.log("📌 3. 객체 타입 추론");

    let person = {
        name: "홍길동",
        age: 30,
        isStudent: false
    };
    // 추론된 타입: { name: string; age: number; isStudent: boolean; }

    console.log("  person:", person);
    console.log("  → 타입: { name: string; age: number; isStudent: boolean; }");

    // 추론된 객체 구조에 맞지 않으면 에러 발생
    // person.name = 123;  // Error: Type 'number' is not assignable to type 'string'
    // person.email = "test@example.com";  // Error: Property 'email' does not exist

    console.log("");

    await f_pause(rl);

    // ========================================
    // 4. 함수 반환 타입 추론
    // ========================================
    console.log("📌 4. 함수 반환 타입 추론");

    // 함수의 반환 타입은 return 문을 기반으로 추론됩니다
    function add(a: number, b: number) {
        return a + b;  // 반환 타입: number로 추론
    }

    function greet(name: string) {
        return `안녕하세요, ${name}님!`;  // 반환 타입: string으로 추론
    }

    function isAdult(age: number) {
        return age >= 18;  // 반환 타입: boolean으로 추론
    }

    console.log("  add(10, 20):", add(10, 20), "→ 반환 타입: number");
    console.log("  greet('철수'):", greet("철수"), "→ 반환 타입: string");
    console.log("  isAdult(25):", isAdult(25), "→ 반환 타입: boolean");

    console.log("");

    await f_pause(rl);

    // ========================================
    // 5. Best Common Type (최적 공통 타입)
    // ========================================
    console.log("📌 5. Best Common Type (최적 공통 타입)");

    // 여러 타입이 섞인 배열에서 공통 타입을 찾습니다
    let mixedNumbers = [1, 2, 3.14, 5];  // number[]
    let mixedValues = [1, "two", true];  // (string | number | boolean)[]

    console.log("  mixedNumbers:", mixedNumbers, "→ 타입: number[]");
    console.log("  mixedValues:", mixedValues, "→ 타입: (string | number | boolean)[]");

    console.log("");

    await f_pause(rl);

    // ========================================
    // 6. Contextual Typing (문맥적 타입 지정)
    // ========================================
    console.log("📌 6. Contextual Typing (문맥적 타입 지정)");

    // 함수의 매개변수 타입이 문맥에서 추론됩니다
    const numberList = [1, 2, 3, 4, 5];

    // forEach의 콜백 함수에서 num은 자동으로 number로 추론됩니다
    numberList.forEach((num) => {
        console.log("  ", num, "→ num의 타입: number (문맥에서 추론)");
    });

    console.log("");

    await f_pause(rl);

    // ========================================
    // 7. const vs let 타입 추론 차이
    // ========================================
    console.log("📌 7. const vs let 타입 추론 차이");

    let mutableValue = "Hello";  // 타입: string (넓은 타입)
    const immutableValue = "World";  // 타입: "World" (리터럴 타입)

    console.log("  let mutableValue:", mutableValue, "→ 타입: string");
    console.log("  const immutableValue:", immutableValue, "→ 타입: 'World' (리터럴)");

    // let은 재할당 가능하므로 넓은 타입으로 추론
    // const는 재할당 불가능하므로 정확한 리터럴 타입으로 추론

    console.log("");

    await f_pause(rl);

    // ========================================
    // 8. 타입 추론의 한계와 명시적 타입의 필요성
    // ========================================
    console.log("📌 8. 타입 추론의 한계");

    // 경우 1: 초기값이 없는 경우
    let uninitializedValue;  // 타입: any (주의!)
    uninitializedValue = 42;
    uninitializedValue = "문자열";  // 에러 없음 (any 타입이므로)
    console.log("  초기값 없는 변수:", uninitializedValue, "→ 타입: any");

    // 경우 2: 더 구체적인 타입이 필요한 경우
    let userId: number | null = null;  // 명시적 타입 필요
    console.log("  userId (초기값 null):", userId, "→ 타입: number | null");

    console.log("");

    await f_pause(rl);

    // ========================================
    // 9. 실전 예제: 타입 추론 활용
    // ========================================
    console.log("📌 9. 실전 예제: 타입 추론 활용");

    // 함수 작성 시 매개변수는 명시, 반환값은 추론
    function calculateTotal(price: number, quantity: number) {
        const subtotal = price * quantity;  // number로 추론
        const tax = subtotal * 0.1;  // number로 추론
        return subtotal + tax;  // 반환 타입: number로 추론
    }

    const total = calculateTotal(1000, 3);  // total: number로 추론
    console.log("  총 금액:", total, "원");

    // 객체 생성 시 타입 추론
    const product = {
        id: 101,
        name: "노트북",
        price: 1500000,
        inStock: true
    };

    console.log("  상품 정보:", product);
    console.log("  → 타입이 자동으로 추론되어 안전하게 사용 가능!");

    console.log("");
    console.log("✅ 타입 추론의 원리를 이해했습니다!");
    console.log("💡 Tip: 타입 추론을 활용하되, 필요한 경우 명시적 타입을 사용하세요!");

    console.log('');
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);

    await f_pause(rl); // 레슨 내에서 독립적으로 일시정지
}
