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
    // 1. number 타입
    // ========================================
    console.log("📌 1. number 타입");

    let age: number = 25;
    let price: number = 19.99;
    let temperature: number = -5;
    let hexValue: number = 0xff;  // 16진수
    let binaryValue: number = 0b1010;  // 2진수

    console.log("  age:", age);
    console.log("  price:", price);
    console.log("  temperature:", temperature);
    console.log("  hexValue:", hexValue);
    console.log("  binaryValue:", binaryValue);

    // ❌ 타입 에러 예시 (주석 처리)
    // age = "25";  // Error: Type 'string' is not assignable to type 'number'

    console.log("");

    // ========================================
    // 2. string 타입
    // ========================================
    console.log("📌 2. string 타입");

    let userName: string = "홍길동";
    let greeting: string = 'Hello, TypeScript!';
    let templateStr: string = `안녕하세요, ${userName}님!`;
    let multiLine: string = `
        여러 줄의
        문자열도 가능합니다.
    `;

    console.log("  userName:", userName);
    console.log("  greeting:", greeting);
    console.log("  templateStr:", templateStr);
    console.log("  multiLine:", multiLine.trim());

    // ❌ 타입 에러 예시 (주석 처리)
    // userName = 123;  // Error: Type 'number' is not assignable to type 'string'

    console.log("");

    // ========================================
    // 3. boolean 타입
    // ========================================
    console.log("📌 3. boolean 타입");

    let isActive: boolean = true;
    let hasPermission: boolean = false;
    let isLoggedIn: boolean = age >= 18;  // 표현식 결과도 할당 가능

    console.log("  isActive:", isActive);
    console.log("  hasPermission:", hasPermission);
    console.log("  isLoggedIn:", isLoggedIn);

    // ❌ 타입 에러 예시 (주석 처리)
    // isActive = "true";  // Error: Type 'string' is not assignable to type 'boolean'
    // isActive = 1;  // Error: Type 'number' is not assignable to type 'boolean'

    console.log("");

    // ========================================
    // 4. any 타입 (타입 체크 비활성화)
    // ========================================
    console.log("📌 4. any 타입 (주의해서 사용!)");

    let dynamicValue: any = 42;
    console.log("  dynamicValue (number):", dynamicValue);

    dynamicValue = "이제 문자열입니다";
    console.log("  dynamicValue (string):", dynamicValue);

    dynamicValue = true;
    console.log("  dynamicValue (boolean):", dynamicValue);

    dynamicValue = { name: "객체", value: 100 };
    console.log("  dynamicValue (object):", dynamicValue);

    // ⚠️ any는 타입 안정성을 포기하므로 가능한 사용을 피해야 합니다!
    console.log("  ⚠️ any 타입은 모든 타입을 허용하지만, 타입 안정성을 잃게 됩니다.");

    console.log("");

    // ========================================
    // 5. 타입 명시 vs 타입 추론
    // ========================================
    console.log("📌 5. 타입 명시 vs 타입 추론");

    let explicitNumber: number = 100;  // 명시적 타입 선언
    let inferredNumber = 200;  // 타입 추론 (TypeScript가 자동으로 number로 추론)

    console.log("  explicitNumber:", explicitNumber, "(명시적 선언)");
    console.log("  inferredNumber:", inferredNumber, "(타입 추론)");

    // 두 변수 모두 number 타입으로 동작합니다
    // inferredNumber = "문자열";  // Error: Type 'string' is not assignable to type 'number'

    console.log("");

    // ========================================
    // 6. 실전 예제: 사용자 정보
    // ========================================
    console.log("📌 6. 실전 예제: 사용자 정보");

    let userId: number = 1001;
    let username: string = "developer123";
    let email: string = "dev@example.com";
    let isVerified: boolean = true;
    let lastLoginTime: any = new Date();  // Date 객체 (나중에 더 정확한 타입 배울 예정)

    console.log("  사용자 ID:", userId);
    console.log("  사용자명:", username);
    console.log("  이메일:", email);
    console.log("  인증 여부:", isVerified);
    console.log("  마지막 로그인:", lastLoginTime);

    console.log("");
    console.log("✅ 기본 타입 선언을 마스터했습니다!");

    console.log('');
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);

    await f_pause(rl); // 레슨 내에서 독립적으로 일시정지
}
