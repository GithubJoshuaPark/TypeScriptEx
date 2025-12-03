// lesson12.ts
// ===============================
// 레슨 실행 함수 - Optional / Readonly / readonly 배열 다루기
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
    // 1. Optional 프로퍼티 (객체 속성 선택적 지정)
    // ========================================
    console.log("📌 1. Optional 프로퍼티 (객체 속성 선택적 지정)");

    type UserProfile = {
        id: number;
        name: string;
        email?: string;      // 있어도 되고 없어도 되는 속성
        phone?: string;      // 있어도 되고 없어도 되는 속성
    };

    const u1: UserProfile = {
        id: 1,
        name: "Joshua"
        // email, phone 생략
    };

    const u2: UserProfile = {
        id: 2,
        name: "Alice",
        email: "alice@example.com"
    };

    f_printCodeBlock(
        "Optional 프로퍼티 예제",
        `type UserProfile = {
    id: number;
    name: string;
    email?: string;   // 선택 속성
    phone?: string;   // 선택 속성
};

const u1: UserProfile = {
    id: 1,
    name: "Joshua",
};

const u2: UserProfile = {
    id: 2,
    name: "Alice",
    email: "alice@example.com",
};`
    );

    console.log("u1:", u1);
    console.log("u2:", u2);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. Optional 프로퍼티 사용 시 안전하게 접근하기
    // ========================================
    console.log("📌 2. Optional 프로퍼티 안전하게 사용하기");

    function printContact(u: UserProfile): void {
        console.log(`- 이름: ${u.name}`);
        if (u.email) {
            console.log(`  이메일: ${u.email}`);
        } else {
            console.log("  이메일: (미입력)");
        }
        if (u.phone) {
            console.log(`  연락처: ${u.phone}`);
        } else {
            console.log("  연락처: (미입력)");
        }
    }

    f_printCodeBlock(
        "Optional 프로퍼티 사용 예제",
        `function printContact(u: UserProfile): void {
    console.log(\`- 이름: \${u.name}\`);
    if (u.email) {
        console.log(\`  이메일: \${u.email}\`);
    } else {
        console.log("  이메일: (미입력)");
    }
    if (u.phone) {
        console.log(\`  연락처: \${u.phone}\`);
    } else {
        console.log("  연락처: (미입력)");
    }
}`
    );

    printContact(u1);
    printContact(u2);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. Readonly 프로퍼티 (읽기 전용 속성)
    // ========================================
    console.log("📌 3. Readonly 프로퍼티 (읽기 전용 속성)");

    type Account = {
        readonly id: number; // 한 번 정해지면 변경 불가
        owner: string;
        balance: number;
    };

    const acc: Account = {
        id: 1001,
        owner: "Joshua",
        balance: 1_000_000
    };

    // acc.id = 9999; // ❌ Error: 읽기 전용

    f_printCodeBlock(
        "Readonly 프로퍼티 예제",
        `type Account = {
    readonly id: number; // 읽기 전용
    owner: string;
    balance: number;
};

const acc: Account = {
    id: 1001,
    owner: "Joshua",
    balance: 1_000_000,
};

// acc.id = 9999; // ❌ Error: 'id'는 읽기 전용 프로퍼티입니다.`
    );

    console.log("acc:", acc);
    console.log("→ id는 생성 시에만 설정하고 이후에는 변경할 수 없습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. Readonly<T> 유틸리티 타입
    // ========================================
    console.log("📌 4. Readonly<T> 유틸리티 타입");

    type Config = {
        host: string;
        port: number;
        useSSL: boolean;
    };

    const mutableConfig: Config = {
        host: "localhost",
        port: 3306,
        useSSL: false
    };

    // 전체를 읽기 전용으로 만든 버전
    type ReadonlyConfig = Readonly<Config>;

    const readonlyConfig: ReadonlyConfig = {
        host: "prod.db.server",
        port: 5432,
        useSSL: true
    };

    // readonlyConfig.port = 9999; // ❌ Error

    f_printCodeBlock(
        "Readonly<T> 예제",
        `type Config = {
    host: string;
    port: number;
    useSSL: boolean;
};

type ReadonlyConfig = Readonly<Config>;

const readonlyConfig: ReadonlyConfig = {
    host: "prod.db.server",
    port: 5432,
    useSSL: true,
};

// readonlyConfig.port = 9999; // ❌ Error`
    );

    console.log("mutableConfig:", mutableConfig);
    console.log("readonlyConfig:", readonlyConfig);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. readonly 배열: readonly number[]
    // ========================================
    console.log("📌 5. readonly 배열 (1) – readonly number[]");

    const numbers: readonly number[] = [10, 20, 30];

    // numbers.push(40);     // ❌ Error
    // numbers[0] = 999;     // ❌ Error

    f_printCodeBlock(
        "readonly number[] 예제",
        `const numbers: readonly number[] = [10, 20, 30];

// numbers.push(40);   // ❌ Error
// numbers[0] = 999;   // ❌ Error`
    );

    console.log("numbers:", numbers);
    console.log("→ length를 변경하거나 요소를 대입해서 바꿀 수 없습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. readonly 배열: ReadonlyArray<T>
    // ========================================
    console.log("📌 6. readonly 배열 (2) – ReadonlyArray<T>");

    const names: ReadonlyArray<string> = ["Joshua", "Alice", "Bob"];

    // names.push("Carol");  // ❌ Error
    // names[1] = "Kim";     // ❌ Error

    f_printCodeBlock(
        "ReadonlyArray<T> 예제",
        `const names: ReadonlyArray<string> = ["Joshua", "Alice", "Bob"];

// names.push("Carol");  // ❌ Error
// names[1] = "Kim";     // ❌ Error`
    );

    console.log("names:", names);
    console.log("→ ReadonlyArray<T>도 요소 수정/추가가 모두 막혀 있습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. const 배열 vs readonly 배열의 차이
    // ========================================
    console.log("📌 7. const 배열 vs readonly 배열의 차이");

    const arrConst = [1, 2, 3];              // 타입: number[]
    const arrReadonly: readonly number[] = [1, 2, 3];

    arrConst.push(4);                        // ✅ OK
    arrConst[0] = 99;                        // ✅ OK

    // arrReadonly.push(4);                  // ❌ Error
    // arrReadonly[0] = 99;                  // ❌ Error

    f_printCodeBlock(
        "const vs readonly 비교",
        `const arrConst = [1, 2, 3];              // number[]
const arrReadonly: readonly number[] = [1, 2, 3];

arrConst.push(4);      // ✅ OK
arrConst[0] = 99;      // ✅ OK

// arrReadonly.push(4); // ❌ Error
// arrReadonly[0] = 99; // ❌ Error`
    );

    console.log("arrConst (수정 가능):", arrConst);
    console.log("arrReadonly (수정 불가):", arrReadonly);
    console.log("");
    console.log("💡 const는 '변수 재할당'을 막는 것이고, readonly는 '내부 요소 변경'까지 막는 개념입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 객체 + readonly 배열 같이 사용하기
    // ========================================
    console.log("📌 8. 객체 안에 readonly 배열 사용하기");

    type Todo = {
        id: number;
        title: string;
        done: boolean;
    };

    type TodoState = {
        readonly list: ReadonlyArray<Todo>;
    };

    const todoState: TodoState = {
        list: [
            { id: 1, title: "TypeScript 설치하기", done: true },
            { id: 2, title: "기본 타입 공부하기", done: false }
        ]
    };

    f_printCodeBlock(
        "객체 + readonly 배열 예제",
        `type Todo = {
    id: number;
    title: string;
    done: boolean;
};

type TodoState = {
    readonly list: ReadonlyArray<Todo>;
};

const todoState: TodoState = {
    list: [
        { id: 1, title: "TypeScript 설치하기", done: true },
        { id: 2, title: "기본 타입 공부하기", done: false },
    ],
};

// todoState.list.push({ id: 3, title: "새 할일", done: false }); // ❌ Error
// todoState.list[0].done = false; // ❌ (ReadonlyArray 요소 자체는 수정 가능 여부가 상황에 따라 달라질 수 있음!)`
    );

    console.log("todoState:", todoState);
    console.log("→ list 자체를 바꾸거나 push 하는 것은 막고,");
    console.log("  내부 각 Todo 객체까지 불변으로 만들고 싶다면, 별도로 깊은 복사/불변 구조를 설계해야 합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 9. Optional + Readonly를 함께 사용하는 패턴
    // ========================================
    console.log("📌 9. Optional + Readonly를 함께 사용하기");

    type UserSettings = {
        readonly id: number;
        theme?: "light" | "dark";
        language?: "ko" | "en";
        readonly createdAt: Date;
    };

    const settings: UserSettings = {
        id: 1,
        theme: "dark",
        createdAt: new Date()
    };

    f_printCodeBlock(
        "Optional + Readonly 패턴",
        `type UserSettings = {
    readonly id: number;
    theme?: "light" | "dark";
    language?: "ko" | "en";
    readonly createdAt: Date;
};

const settings: UserSettings = {
    id: 1,
    theme: "dark",
    createdAt: new Date(),
};

// settings.id = 2;        // ❌ Error
// settings.createdAt = new Date(); // ❌ Error
// settings.theme = "light";        // ✅ Optional + 변경 가능`
    );

    console.log("settings:", settings);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Optional / Readonly / readonly 배열의 핵심 개념을 정리했습니다!");
    console.log("💡 Tip:");
    console.log("   - Optional: 있어도 되고 없어도 되는 값, 입력/설정 유연성 확보");
    console.log("   - Readonly 프로퍼티: 한 번 정한 값은 바꾸지 않는 '스냅샷' 용 데이터에 적합");
    console.log("   - readonly 배열 / ReadonlyArray: 컬렉션을 불변(Immutable)하게 관리할 때 필수");
    console.log("   - 실무에서는 상태관리(Redux, Zustand 등)나 Domain 모델에서 매우 자주 쓰입니다.");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
