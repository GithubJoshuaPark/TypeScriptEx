// lesson10.ts
// ===============================
// 레슨 실행 함수 - Interface 기본 사용 – 구조적 타입 시스템 이해
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
    // 1. interface 기본 선언
    // ========================================
    console.log("📌 1. interface 기본 선언");

    interface User {
        id: number;
        name: string;
        isAdmin: boolean;
    }

    const user1: User = {
        id: 1,
        name: "Joshua",
        isAdmin: true
    };

    f_printCodeBlock(
        "interface 기본 예제",
        `interface User {
    id: number;
    name: string;
    isAdmin: boolean;
}

const user1: User = {
    id: 1,
    name: "Joshua",
    isAdmin: true,
};`
    );

    console.log("user1:", user1);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. Optional / Readonly 프로퍼티
    // ========================================
    console.log("📌 2. Optional / Readonly 프로퍼티");

    interface Profile {
        readonly id: number; // 읽기 전용
        nickname: string;
        email?: string; // 선택 프로퍼티
    }

    const profileA: Profile = {
        id: 100,
        nickname: "devJoshua"
        // email 생략 가능
    };

    const profileB: Profile = {
        id: 101,
        nickname: "typescriptFan",
        email: "ts@example.com"
    };

    f_printCodeBlock(
        "Optional / Readonly 예제",
        `interface Profile {
    readonly id: number;
    nickname: string;
    email?: string;  // 있어도 되고 없어도 되는 속성
}

const profileA: Profile = {
    id: 100,
    nickname: "devJoshua",
};

const profileB: Profile = {
    id: 101,
    nickname: "typescriptFan",
    email: "ts@example.com",
};

// profileA.id = 200; // ❌ Error: 읽기 전용 프로퍼티는 수정 불가`
    );

    console.log("profileA:", profileA);
    console.log("profileB:", profileB);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. 메서드를 가진 interface
    // ========================================
    console.log("📌 3. 메서드를 가진 interface");

    interface Greeter {
        name: string;
        greet(message: string): void;
    }

    const consoleGreeter: Greeter = {
        name: "콘솔 인사봇",
        greet(message: string) {
            console.log(`[${this.name}] ${message}`);
        }
    };

    f_printCodeBlock(
        "메서드 포함 interface 예제",
        `interface Greeter {
    name: string;
    greet(message: string): void;
}

const consoleGreeter: Greeter = {
    name: "콘솔 인사봇",
    greet(message: string) {
        console.log(\`[\${this.name}] \${message}\`);
    },
};

consoleGreeter.greet("안녕하세요!");`
    );

    consoleGreeter.greet("안녕하세요! TypeScript interface 입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. 구조적 타입 시스템(Structural Typing) 이해
    // ========================================
    console.log("📌 4. 구조적 타입 시스템(Structural Typing) 이해");

    interface Point {
        x: number;
        y: number;
    }

    // "모양"만 맞으면 추가 속성이 있어도 Point로 사용 가능
    const p1: Point = { x: 10, y: 20 };
    const p2 = { x: 5, y: 7, z: 99 }; // z가 추가로 있음

    const p2AsPoint: Point = p2; // OK: x, y가 있으므로 Point로 간주

    f_printCodeBlock(
        "구조적 타입 시스템 예제",
        `interface Point {
    x: number;
    y: number;
}

const p1: Point = { x: 10, y: 20 };

const p2 = { x: 5, y: 7, z: 99 };

const p2AsPoint: Point = p2; // OK: x, y를 모두 가지고 있기 때문`
    );

    console.log("p1:", p1);
    console.log("p2:", p2);
    console.log("p2AsPoint:", p2AsPoint);
    console.log("");
    console.log("💡 구조적 타입 시스템: '이름'이 아니라 '구조(프로퍼티 모양)'가 타입 호환성의 기준입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. 함수 타입 interface
    // ========================================
    console.log("📌 5. 함수 타입을 interface로 표현");

    interface StringFormatter {
        (value: string, upper?: boolean): string;
    }

    const formatter: StringFormatter = (value, upper = false) => {
        return upper ? value.toUpperCase() : value.toLowerCase();
    };

    f_printCodeBlock(
        "함수 타입 interface 예제",
        `interface StringFormatter {
    (value: string, upper?: boolean): string;
}

const formatter: StringFormatter = (value, upper = false) => {
    return upper ? value.toUpperCase() : value.toLowerCase();
};

formatter("Hello", true);   // "HELLO"
formatter("Hello", false);  // "hello"`
    );

    console.log('formatter("Hello", true):', formatter("Hello", true));
    console.log('formatter("Hello", false):', formatter("Hello", false));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. interface 확장 (extends)
    // ========================================
    console.log("📌 6. interface 확장 (extends)");

    interface Person {
        name: string;
        age: number;
    }

    interface Developer extends Person {
        skills: string[];
        level: "junior" | "mid" | "senior";
    }

    const dev: Developer = {
        name: "Joshua",
        age: 53,
        skills: ["TypeScript", "Node.js", "React"],
        level: "senior"
    };

    f_printCodeBlock(
        "interface 확장 예제",
        `interface Person {
    name: string;
    age: number;
}

interface Developer extends Person {
    skills: string[];
    level: "junior" | "mid" | "senior";
}

const dev: Developer = {
    name: "Joshua",
    age: 53,
    skills: ["TypeScript", "Node.js", "React"],
    level: "senior",
};`
    );

    console.log("dev:", dev);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. class implements interface
    // ========================================
    console.log("📌 7. class implements interface");

    interface Repository {
        getAll(): string[];
        add(item: string): void;
    }

    class MemoryRepository implements Repository {
        private items: string[] = [];

        getAll(): string[] {
            return this.items;
        }

        add(item: string): void {
            this.items.push(item);
        }
    }

    const repo = new MemoryRepository();
    repo.add("TypeScript");
    repo.add("Interface");
    repo.add("Structural Typing");

    f_printCodeBlock(
        "class implements interface 예제",
        `interface Repository {
    getAll(): string[];
    add(item: string): void;
}

class MemoryRepository implements Repository {
    private items: string[] = [];

    getAll(): string[] {
        return this.items;
    }

    add(item: string): void {
        this.items.push(item);
    }
}

const repo = new MemoryRepository();
repo.add("TypeScript");
repo.add("Interface");
repo.add("Structural Typing");`
    );

    console.log("repo.getAll():", repo.getAll());
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. interface와 Type Alias 간단 정리
    // ========================================
    console.log("📌 8. interface vs Type Alias 간단 정리");

    interface IPoint {
        x: number;
        y: number;
    }

    type PointAlias = {
        x: number;
        y: number;
    };

    const pA: IPoint = { x: 1, y: 2 };
    const pB: PointAlias = { x: 3, y: 4 };

    f_printCodeBlock(
        "interface vs type alias",
        `interface IPoint {
    x: number;
    y: number;
}

type PointAlias = {
    x: number;
    y: number;
};

const pA: IPoint = { x: 1, y: 2 };
const pB: PointAlias = { x: 3, y: 4 };`
    );

    console.log("pA:", pA);
    console.log("pB:", pB);
    console.log("");
    console.log("💡 요약:");
    console.log(" - 둘 다 객체 구조를 정의할 수 있음");
    console.log(" - interface는 주로 '모델, 계약(Contract)' 느낌으로 많이 사용");
    console.log(" - interface는 extends, implements와 잘 어울림");
    console.log(" - type alias는 Union, Tuple, Primitive 조합까지 폭넓게 사용");
    console.log("");

    console.log("✅ Interface 기본 사용과 구조적 타입 시스템의 감을 잡았습니다!");
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
