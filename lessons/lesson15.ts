// lesson15.ts
// ===============================
// 레슨 실행 함수 - Generic Interface & Generic Type Alias
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
    // 1. Generic Interface – 가장 기본형
    // ========================================
    console.log("📌 1. Generic Interface – 가장 기본형");

    interface Box<T> {
        value: T;
    }

    const numberBox: Box<number> = { value: 123 };
    const stringBox: Box<string> = { value: "Generic Interface" };

    f_printCodeBlock(
        "기본 Generic Interface 예제",
        `interface Box<T> {
    value: T;
}

const numberBox: Box<number> = { value: 123 };
const stringBox: Box<string> = { value: "Generic Interface" };`
    );

    console.log("numberBox:", numberBox);
    console.log("stringBox:", stringBox);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. 메서드를 포함한 Generic Interface
    // ========================================
    console.log("📌 2. 메서드를 포함한 Generic Interface");

    interface Repository<T> {
        items: T[];
        add(item: T): void;
        getAll(): T[];
    }

    const numberRepo: Repository<number> = {
        items: [],
        add(item: number) {
            this.items.push(item);
        },
        getAll() {
            return this.items;
        }
    };

    numberRepo.add(10);
    numberRepo.add(20);
    numberRepo.add(30);

    f_printCodeBlock(
        "Repository<T> 인터페이스 예제",
        `interface Repository<T> {
    items: T[];
    add(item: T): void;
    getAll(): T[];
}

const numberRepo: Repository<number> = {
    items: [],
    add(item: number) {
        this.items.push(item);
    },
    getAll() {
        return this.items;
    },
};

numberRepo.add(10);
numberRepo.add(20);
numberRepo.add(30);`
    );

    console.log("numberRepo.getAll():", numberRepo.getAll());
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. Generic Type Alias – 객체 타입
    // ========================================
    console.log("📌 3. Generic Type Alias – 객체 타입 정의하기");

    type ApiResponse<T> = {
        success: boolean;
        data: T;
        error?: string;
    };

    type User = {
        id: number;
        name: string;
    };

    const userResponse: ApiResponse<User> = {
        success: true,
        data: {
            id: 1,
            name: "Joshua"
        }
    };

    f_printCodeBlock(
        "Generic Type Alias (객체) 예제",
        `type ApiResponse<T> = {
    success: boolean;
    data: T;
    error?: string;
};

type User = {
    id: number;
    name: string;
};

const userResponse: ApiResponse<User> = {
    success: true,
    data: {
        id: 1,
        name: "Joshua",
    },
};`
    );

    console.log("userResponse:", userResponse);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. Generic Type Alias – 함수 타입
    // ========================================
    console.log("📌 4. Generic Type Alias – 함수 타입 정의");

    type Mapper<T, R> = (input: T) => R;

    const lengthMapper: Mapper<string, number> = (s) => s.length;
    const doubleMapper: Mapper<number, number> = (n) => n * 2;

    f_printCodeBlock(
        "Generic 함수 타입 Alias 예제",
        `type Mapper<T, R> = (input: T) => R;

const lengthMapper: Mapper<string, number> = (s) => s.length;
const doubleMapper: Mapper<number, number> = (n) => n * 2;

lengthMapper("hello"); // 5
doubleMapper(10);      // 20`
    );

    console.log('lengthMapper("hello") →', lengthMapper("hello"));
    console.log("doubleMapper(10) →", doubleMapper(10));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. Interface vs Type Alias – Generic 형태 비교
    // ========================================
    console.log("📌 5. Interface vs Type Alias – Generic 형태 비교");

    interface BoxInterface<T> {
        value: T;
    }

    type BoxAlias<T> = {
        value: T;
    };

    const bi: BoxInterface<string> = { value: "Interface Box" };
    const ba: BoxAlias<string> = { value: "Type Alias Box" };

    f_printCodeBlock(
        "Generic Interface vs Generic Type Alias",
        `interface BoxInterface<T> {
    value: T;
}

type BoxAlias<T> = {
    value: T;
};

const bi: BoxInterface<string> = { value: "Interface Box" };
const ba: BoxAlias<string> = { value: "Type Alias Box" };`
    );

    console.log("bi:", bi);
    console.log("ba:", ba);
    console.log("");
    console.log("💡 둘 다 '제네릭 객체 타입'을 정의할 수 있습니다.");
    console.log("   - interface는 extends/implements와 잘 어울리고,");
    console.log("   - type alias는 Union, Tuple 등과 조합하기 좋습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. 제네릭 인터페이스에 제약 조건 걸기
    // ========================================
    console.log("📌 6. 제네릭 인터페이스에 제약 조건 걸기");

    interface HasId {
        id: number;
    }

    interface EntityRepository<T extends HasId> {
        items: T[];
        add(item: T): void;
        findById(id: number): T | undefined;
    }

    type Product = {
        id: number;
        name: string;
        price: number;
    };

    const productRepo: EntityRepository<Product> = {
        items: [],
        add(item: Product) {
            this.items.push(item);
        },
        findById(id: number) {
            return this.items.find((item) => item.id === id);
        }
    };

    productRepo.add({ id: 1, name: "노트북", price: 1500000 });
    productRepo.add({ id: 2, name: "마우스", price: 30000 });

    f_printCodeBlock(
        "제약 조건이 있는 Generic Interface",
        `interface HasId {
    id: number;
}

interface EntityRepository<T extends HasId> {
    items: T[];
    add(item: T): void;
    findById(id: number): T | undefined;
}

type Product = {
    id: number;
    name: string;
    price: number;
};

const productRepo: EntityRepository<Product> = {
    items: [],
    add(item: Product) {
        this.items.push(item);
    },
    findById(id: number) {
        return this.items.find((item) => item.id === id);
    },
};`
    );

    console.log("productRepo.findById(1) →", productRepo.findById(1));
    console.log("productRepo.findById(999) →", productRepo.findById(999));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. 두 개 이상의 타입 매개변수를 가지는 Generic Alias
    // ========================================
    console.log("📌 7. 두 개 이상의 타입 매개변수를 가지는 Generic Type Alias");

    type Result<T, E> =
        | { ok: true; value: T }
        | { ok: false; error: E };

    function success<T, E = string>(value: T): Result<T, E> {
        return { ok: true, value };
    }

    function failure<T, E = string>(error: E): Result<T, E> {
        return { ok: false, error };
    }

    f_printCodeBlock(
        "Result<T, E> Generic Type Alias",
        `type Result<T, E> =
    | { ok: true; value: T }
    | { ok: false; error: E };

function success<T, E = string>(value: T): Result<T, E> {
    return { ok: true, value };
}

function failure<T, E = string>(error: E): Result<T, E> {
    return { ok: false, error };
}`
    );

    const r1 = success<number, string>(42);
    const r2 = failure<number, Error>(new Error("예외 발생!"));

    console.log("r1:", r1);
    console.log("r2:", r2);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 기본 타입 매개변수 (Default Type Parameter)
    // ========================================
    console.log("📌 8. 기본 타입 매개변수 (Default Type Parameter)");

    interface CacheEntry<T = string> {
        key: string;
        value: T;
        expiredAt: Date;
    }

    const defaultCache: CacheEntry = {
        key: "session",
        value: "abcdefg",
        expiredAt: new Date()
    };

    const numberCache: CacheEntry<number> = {
        key: "count",
        value: 123,
        expiredAt: new Date()
    };

    f_printCodeBlock(
        "기본 타입 매개변수 예제",
        `interface CacheEntry<T = string> {
    key: string;
    value: T;
    expiredAt: Date;
}

const defaultCache: CacheEntry = {
    key: "session",
    value: "abcdefg",  // T = string
    expiredAt: new Date(),
};

const numberCache: CacheEntry<number> = {
    key: "count",
    value: 123,        // T = number
    expiredAt: new Date(),
};`
    );

    console.log("defaultCache:", defaultCache);
    console.log("numberCache:", numberCache);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 9. 실전 예제 – 페이지네이션 타입 설계
    // ========================================
    console.log("📌 9. 실전 예제 – 페이지네이션 타입 설계");

    interface PageInfo {
        page: number;
        pageSize: number;
        totalCount: number;
    }

    interface PagedResponse<T> extends PageInfo {
        items: T[];
    }

    type PagedApiResponse<T> = ApiResponse<PagedResponse<T>>;

    const pagedUsers: PagedApiResponse<User> = {
        success: true,
        data: {
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                { id: 1, name: "Joshua" },
                { id: 2, name: "Alice" }
            ]
        }
    };

    f_printCodeBlock(
        "Generic Interface + Type Alias 조합 (페이지네이션)",
        `interface PageInfo {
    page: number;
    pageSize: number;
    totalCount: number;
}

interface PagedResponse<T> extends PageInfo {
    items: T[];
}

type PagedApiResponse<T> = ApiResponse<PagedResponse<T>>;

const pagedUsers: PagedApiResponse<User> = {
    success: true,
    data: {
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
            { id: 1, name: "Joshua" },
            { id: 2, name: "Alice" },
        ],
    },
};`
    );

    console.log("pagedUsers:", pagedUsers);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Generic Interface & Generic Type Alias의 핵심 패턴을 정리했습니다!");
    console.log("💡 Tip 정리:");
    console.log("  - interface<T>: 도메인 모델, 클래스 계약(implements) 표현에 자주 사용");
    console.log("  - type Alias<T>: Union, 함수 타입, Result<T,E>, ApiResponse<T> 등 표현에 최적");
    console.log("  - extends 제약, 기본 타입 매개변수(T = string)까지 활용하면 재사용성이 크게 올라갑니다.");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
