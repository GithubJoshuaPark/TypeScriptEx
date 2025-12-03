// lesson05.ts
// ===============================
// 레슨 실행 함수 - 객체 타입(Object Types) 기초 만들기
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
    // 1. 가장 기본적인 객체 타입 선언
    // ========================================
    console.log("📌 1. 가장 기본적인 객체 타입 선언");

    // (1) 타입을 명시하지 않고 객체 생성 → TS가 구조를 추론
    const user1 = {
        name: "Joshua",
        age: 53,
        isDeveloper: true
    };
    // 추론된 타입: { name: string; age: number; isDeveloper: boolean; }

    // (2) 명시적으로 타입을 지정하는 방식
    const user2: {
        name: string;
        age: number;
        isDeveloper: boolean;
    } = {
        name: "Alice",
        age: 30,
        isDeveloper: false
    };

    f_printCodeBlock(
        "기본 객체 타입 선언",
        `const user1 = {
    name: "Joshua",
    age: 53,
    isDeveloper: true,
};

const user2: {
    name: string;
    age: number;
    isDeveloper: boolean;
} = {
    name: "Alice",
    age: 30,
    isDeveloper: false,
};`
    );

    console.log("user1:", user1);
    console.log("user2:", user2);
    console.log("");

    console.log("✅ 기본 객체 구조와 타입 추론/명시 방식을 확인했습니다.");
    await f_pause(rl);

    // ========================================
    // 2. Type Alias(타입 별칭)으로 객체 타입 정의하기
    // ========================================
    console.log("📌 2. Type Alias(타입 별칭)으로 객체 타입 정의");

    type User = {
        name: string;
        age: number;
        isDeveloper: boolean;
    };

    const user3: User = {
        name: "Bob",
        age: 40,
        isDeveloper: true
    };

    const user4: User = {
        name: "Carol",
        age: 28,
        isDeveloper: false
    };

    f_printCodeBlock(
        "Type Alias로 객체 타입 정의",
        `type User = {
    name: string;
    age: number;
    isDeveloper: boolean;
};

const user3: User = {
    name: "Bob",
    age: 40,
    isDeveloper: true,
};

const user4: User = {
    name: "Carol",
    age: 28,
    isDeveloper: false,
};`
    );

    console.log("user3:", user3);
    console.log("user4:", user4);
    console.log("");
    console.log("💡 같은 구조를 여러 곳에서 사용할 때는 Type Alias가 훨씬 깔끔합니다.");
    await f_pause(rl);

    // ========================================
    // 3. Optional(선택) 프로퍼티 & Readonly 프로퍼티
    // ========================================
    console.log("📌 3. Optional(선택) & Readonly 프로퍼티");

    type Profile = {
        id: number;
        name: string;
        email?: string;        // 있어도 되고, 없어도 되는 선택 프로퍼티
        readonly createdAt: Date; // 한 번 설정 후 변경 불가
    };

    const profile1: Profile = {
        id: 1,
        name: "Joshua",
        createdAt: new Date()
        // email은 생략 가능
    };

    const profile2: Profile = {
        id: 2,
        name: "Alice",
        email: "alice@example.com",
        createdAt: new Date()
    };

    f_printCodeBlock(
        "Optional & Readonly 프로퍼티 예제",
        `type Profile = {
    id: number;
    name: string;
    email?: string;          // 선택 프로퍼티
    readonly createdAt: Date; // 읽기 전용 프로퍼티
};

const profile1: Profile = {
    id: 1,
    name: "Joshua",
    createdAt: new Date(),
};

const profile2: Profile = {
    id: 2,
    name: "Alice",
    email: "alice@example.com",
    createdAt: new Date(),
};

// profile1.createdAt = new Date(); // ❌ Error: readonly 프로퍼티는 변경 불가`
    );

    console.log("profile1:", profile1);
    console.log("profile2:", profile2);
    console.log("");
    console.log("✅ email은 있어도 되고 없어도 되며, createdAt은 이후 변경할 수 없습니다.");
    await f_pause(rl);

    // ========================================
    // 4. 중첩 객체 타입 (Nested Object Types)
    // ========================================
    console.log("📌 4. 중첩 객체 타입 (Nested Object Types)");

    type Address = {
        city: string;
        street: string;
        zipCode: string;
    };

    type Employee = {
        id: number;
        name: string;
        position: string;
        address: Address; // 중첩 객체 타입
    };

    const employee: Employee = {
        id: 101,
        name: "Kim",
        position: "Backend Developer",
        address: {
            city: "Seoul",
            street: "Teheran-ro 123",
            zipCode: "06235"
        }
    };

    f_printCodeBlock(
        "중첩 객체 타입 예제",
        `type Address = {
    city: string;
    street: string;
    zipCode: string;
};

type Employee = {
    id: number;
    name: string;
    position: string;
    address: Address;
};

const employee: Employee = {
    id: 101,
    name: "Kim",
    position: "Backend Developer",
    address: {
        city: "Seoul",
        street: "Teheran-ro 123",
        zipCode: "06235",
    },
};`
    );

    console.log("employee:", employee);
    console.log("employee.address.city:", employee.address.city);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. 인덱스 시그니처(Index Signature)와 Record
    // ========================================
    console.log("📌 5. 인덱스 시그니처(Index Signature) & Record");

    // key가 문자열이고, 값이 number인 객체들을 표현해야 할 때:
    type ScoreMap = {
        [key: string]: number; // 인덱스 시그니처
    };

    const scoresByName: ScoreMap = {
        Joshua: 95,
        Alice: 88,
        Bob: 77
    };

    // 같은 표현을 Record 유틸리티 타입으로도 가능
    type ScoreRecord = Record<string, number>;
    const scoresById: ScoreRecord = {
        "user-1": 100,
        "user-2": 90
    };

    f_printCodeBlock(
        "인덱스 시그니처 & Record 예제",
        `type ScoreMap = {
    [key: string]: number; // key는 string, 값은 number
};

const scoresByName: ScoreMap = {
    Joshua: 95,
    Alice: 88,
    Bob: 77,
};

type ScoreRecord = Record<string, number>;

const scoresById: ScoreRecord = {
    "user-1": 100,
    "user-2": 90,
};`
    );

    console.log("scoresByName:", scoresByName);
    console.log("scoresById:", scoresById);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. 객체 구조 분해 & 타입
    // ========================================
    console.log("📌 6. 객체 구조 분해 & 타입");

    const settings = {
        theme: "dark",
        language: "ko",
        showLineNumber: true
    };

    // 구조 분해 할당 시에도 타입이 유지/추론됩니다.
    const { theme, language, showLineNumber } = settings;

    f_printCodeBlock(
        "객체 구조 분해 예제",
        `const settings = {
    theme: "dark",
    language: "ko",
    showLineNumber: true,
};

const { theme, language, showLineNumber } = settings;

// theme: string
// language: string
// showLineNumber: boolean`
    );

    console.log("settings:", settings);
    console.log("theme:", theme);
    console.log("language:", language);
    console.log("showLineNumber:", showLineNumber);
    console.log("");

    console.log("✅ 객체 타입(Object Types)의 기본기를 정리했습니다.");
    console.log("💡 Tip:");
    console.log("   - 반복해서 쓰이는 객체 구조는 Type Alias 또는 Interface로 정의하고,");
    console.log("   - 선택/읽기전용/중첩 구조를 잘 활용하면 유지보수가 쉬워집니다.");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
