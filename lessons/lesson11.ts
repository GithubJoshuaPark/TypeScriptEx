// lesson11.ts
// ===============================
// 레슨 실행 함수 - Interface 확장 & Intersection Types(교차 타입)
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
    // 1. interface 확장 (extends) 기본
    // ========================================
    console.log("📌 1. interface 확장 (extends) 기본");

    interface Person {
        name: string;
        age: number;
    }

    interface Employee extends Person {
        employeeId: number;
        department: string;
    }

    const emp: Employee = {
        name: "Joshua",
        age: 53,
        employeeId: 1001,
        department: "Backend"
    };

    f_printCodeBlock(
        "interface 확장 기본 예제",
        `interface Person {
    name: string;
    age: number;
}

interface Employee extends Person {
    employeeId: number;
    department: string;
}

const emp: Employee = {
    name: "Joshua",
    age: 53,
    employeeId: 1001,
    department: "Backend",
};`
    );

    console.log("emp:", emp);
    console.log("");
    console.log("💡 상속처럼 기존 타입에 필드를 '추가'해서 확장합니다.");
    await f_pause(rl);

    // ========================================
    // 2. 다중 interface 확장
    // ========================================
    console.log("📌 2. 다중 interface 확장");

    interface Timestamped {
        createdAt: Date;
        updatedAt: Date;
    }

    interface SoftDeletable {
        deletedAt?: Date;
        isDeleted: boolean;
    }

    interface Entity extends Timestamped, SoftDeletable {
        id: number;
    }

    const entity: Entity = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false
    };

    f_printCodeBlock(
        "다중 interface 확장 예제",
        `interface Timestamped {
    createdAt: Date;
    updatedAt: Date;
}

interface SoftDeletable {
    deletedAt?: Date;
    isDeleted: boolean;
}

interface Entity extends Timestamped, SoftDeletable {
    id: number;
}

const entity: Entity = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
};`
    );

    console.log("entity:", entity);
    console.log("");
    console.log("✅ 여러 특성을 묶어 하나의 interface로 표현할 수 있습니다.");
    await f_pause(rl);

    // ========================================
    // 3. Intersection Type (교차 타입) 기본
    // ========================================
    console.log("📌 3. Intersection Type (A & B) 기본");

    type WithId = { id: number };
    type WithName = { name: string };

    type WithIdAndName = WithId & WithName;

    const obj: WithIdAndName = {
        id: 10,
        name: "TypeScript"
    };

    f_printCodeBlock(
        "Intersection Type 기본 예제",
        `type WithId = { id: number };
type WithName = { name: string };

type WithIdAndName = WithId & WithName;

const obj: WithIdAndName = {
    id: 10,
    name: "TypeScript",
};`
    );

    console.log("obj:", obj);
    console.log("");
    console.log("💡 A & B: 두 타입의 필드를 모두 가진 새 타입을 생성합니다.");
    await f_pause(rl);

    // ========================================
    // 4. interface extends vs & (Intersection) 비교
    // ========================================
    console.log("📌 4. interface extends vs Intersection(&) 비교");

    interface Animal {
        name: string;
    }

    interface Dog extends Animal {
        bark(): void;
    }

    type AnimalType = { name: string };
    type DogType = AnimalType & { bark(): void };

    const dog1: Dog = {
        name: "멍멍이",
        bark() {
            console.log("Woof!");
        }
    };

    const dog2: DogType = {
        name: "댕댕이",
        bark() {
            console.log("멍멍!");
        }
    };

    f_printCodeBlock(
        "extends vs & 비교 예제",
        `interface Animal {
    name: string;
}

interface Dog extends Animal {
    bark(): void;
}

type AnimalType = { name: string };
type DogType = AnimalType & { bark(): void };

const dog1: Dog = {
    name: "멍멍이",
    bark() {
        console.log("Woof!");
    },
};

const dog2: DogType = {
    name: "댕댕이",
    bark() {
        console.log("멍멍!");
    },
};`
    );

    dog1.bark();
    dog2.bark();
    console.log("");
    console.log("💡 interface extends 와 type A & B 는 결과적으로 비슷한 구조를 만들 수 있습니다.");
    await f_pause(rl);

    // ========================================
    // 5. 교차 타입으로 Mixin 스타일 만들기
    // ========================================
    console.log("📌 5. Intersection Type으로 Mixin 스타일 만들기");

    type CanLog = {
        log(message: string): void;
    };

    type HasToken = {
        token: string;
    };

    type AuthenticatedLogger = CanLog & HasToken;

    const logger: AuthenticatedLogger = {
        token: "secret-token-123",
        log(message: string) {
            console.log(`[token=${this.token}] ${message}`);
        }
    };

    f_printCodeBlock(
        "Mixin 느낌의 Intersection 예제",
        `type CanLog = {
    log(message: string): void;
};

type HasToken = {
    token: string;
};

type AuthenticatedLogger = CanLog & HasToken;

const logger: AuthenticatedLogger = {
    token: "secret-token-123",
    log(message: string) {
        console.log(\`[token=\${this.token}] \${message}\`);
    },
};`
    );

    logger.log("로그인이 성공했습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. Nullable & 교차 타입으로 안전한 타입 만들기
    // ========================================
    console.log("📌 6. Optional / Nullable 조합 + 교차 타입");

    type Nullable<T> = T | null;
    type Optional<T> = T | undefined;

    type UserBase = {
        id: number;
        name: string;
    };

    type UserMeta = {
        email?: string;
        phone?: string;
    };

    type UserFull = UserBase & UserMeta & {
        deletedAt?: Nullable<Date>;
    };

    const userFull: UserFull = {
        id: 1,
        name: "Joshua",
        email: "joshua@example.com",
        deletedAt: null
    };

    f_printCodeBlock(
        "교차 타입을 이용한 복합 타입",
        `type Nullable<T> = T | null;
type Optional<T> = T | undefined;

type UserBase = {
    id: number;
    name: string;
};

type UserMeta = {
    email?: string;
    phone?: string;
};

type UserFull = UserBase & UserMeta & {
    deletedAt?: Nullable<Date>;
};

const userFull: UserFull = {
    id: 1,
    name: "Joshua",
    email: "joshua@example.com",
    deletedAt: null,
};`
    );

    console.log("userFull:", userFull);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. 교차 타입의 주의점 (상충되는 타입)
    // ========================================
    console.log("📌 7. 교차 타입의 주의점 (상충되는 필드 타입)");

    type A = {
        value: string;
    };

    type B = {
        value: number;
    };

    type C = A & B;

    // ❗ 실제로 C는 value: never 로 추론되며, 사용 시 문제가 된다.
    // const c: C = { value: "test" }; // Error

    f_printCodeBlock(
        "교차 타입 주의 예제",
        `type A = { value: string };
type B = { value: number };
type C = A & B;

// C의 value는 string & number → never 로 추론되어 사실상 사용 불가!
// const c: C = { value: "test" };  // ❌ Error`
    );

    console.log("❗ A & B 처럼 같은 프로퍼티에 서로 다른 타입이 있으면 교차 타입이 오히려 쓸모없어질 수 있습니다.");
    console.log("→ 이런 경우에는 구조를 다시 설계하거나, Union 타입으로 바꾸는 것이 좋습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 정리: interface 확장 vs Intersection Type
    // ========================================
    console.log("📌 8. 정리 – 언제 interface, 언제 Intersection?");

    f_printCodeBlock(
        "정리 메모",
        `// interface extends
// - '역할/모델'을 점점 확장해 나갈 때 사용 (OOP 상속 느낌)
// - 여러 interface를 조합하여 도메인 모델 표현

// Intersection Type (A & B)
// - 이미 정의된 여러 타입을 조합해서 '하나의 값'이 모두를 만족해야 할 때
// - Mixin, 여러 기능을 가진 객체 타입 설계에 유용
//
// 교차 타입 사용 시 주의:
// - 같은 이름의 프로퍼티가 서로 다른 타입이면 never로 추론되어 문제가 됨`
    );

    console.log("✅ Interface 확장과 Intersection Types(교차 타입)의 개념을 정리했습니다.");
    console.log("💡 Tip:");
    console.log("   - 도메인 모델(사용자, 주문, 상품 등)은 interface + extends를 선호하는 경향이 있고,");
    console.log("   - 유틸/조합 타입은 type + & (Intersection)을 많이 사용합니다.");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
