// lesson08.ts
// ===============================
// 레슨 실행 함수 - Type Alias(타입 별칭) 활용하기
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
    // 1. 기본 Type Alias – 간단 타입에 별칭 붙이기
    // ========================================
    console.log("📌 1. 기본 Type Alias – 간단 타입에 별칭 붙이기");

    type UserId = number;
    type UserName = string;
    type IsAdmin = boolean;

    const id: UserId = 1;
    const name: UserName = "Joshua";
    const isAdmin: IsAdmin = true;

    f_printCodeBlock(
        "기본 Type Alias 예제",
        `type UserId = number;
type UserName = string;
type IsAdmin = boolean;

const id: UserId = 1;
const name: UserName = "Joshua";
const isAdmin: IsAdmin = true;`
    );

    console.log("id:", id);
    console.log("name:", name);
    console.log("isAdmin:", isAdmin);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. 객체 타입에 Type Alias 적용
    // ========================================
    console.log("📌 2. 객체 타입에 Type Alias 적용");

    type User = {
        id: UserId;
        name: UserName;
        email: string;
        isAdmin: IsAdmin;
    };

    const user: User = {
        id: 1001,
        name: "Joshua",
        email: "joshua@example.com",
        isAdmin: true
    };

    f_printCodeBlock(
        "객체 타입 + Type Alias",
        `type User = {
    id: UserId;
    name: UserName;
    email: string;
    isAdmin: IsAdmin;
};

const user: User = {
    id: 1001,
    name: "Joshua",
    email: "joshua@example.com",
    isAdmin: true,
};`
    );

    console.log("user:", user);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. Union 타입을 Alias로 정의
    // ========================================
    console.log("📌 3. Union 타입을 Alias로 정의");

    type Direction = "left" | "right" | "up" | "down";
    type Id = number | string;

    function move(dir: Direction): void {
        console.log("이동 방향:", dir);
    }

    function printUserId(userId: Id): void {
        console.log("User ID:", userId);
    }

    f_printCodeBlock(
        "Union Type Alias 예제",
        `type Direction = "left" | "right" | "up" | "down";
type Id = number | string;

function move(dir: Direction): void {
    console.log("이동 방향:", dir);
}

function printUserId(userId: Id): void {
    console.log("User ID:", userId);
}

move("left");
move("down");
printUserId(10);
printUserId("user-001");`
    );

    move("left");
    move("down");
    printUserId(10);
    printUserId("user-001");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. 함수 타입을 Type Alias로 정의
    // ========================================
    console.log("📌 4. 함수 타입을 Type Alias로 정의");

    type BinaryOp = (a: number, b: number) => number;

    const add: BinaryOp = (a, b) => a + b;
    const sub: BinaryOp = (a, b) => a - b;

    f_printCodeBlock(
        "함수 타입 Alias 예제",
        `type BinaryOp = (a: number, b: number) => number;

const add: BinaryOp = (a, b) => a + b;
const sub: BinaryOp = (a, b) => a - b;

add(10, 20); // 30
sub(10, 3);  // 7`
    );

    console.log("add(10, 20):", add(10, 20));
    console.log("sub(10, 3):", sub(10, 3));
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. Type Alias 재사용 & 조합
    // ========================================
    console.log("📌 5. Type Alias 재사용 & 조합");

    type BaseEntity = {
        id: number;
        createdAt: Date;
        updatedAt: Date;
    };

    type Post = BaseEntity & {
        title: string;
        content: string;
        author: User;
    };

    type Comment = BaseEntity & {
        postId: number;
        author: User;
        message: string;
    };

    const post: Post = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Type Alias 활용하기",
        content: "여러 곳에서 쓰이는 공통 구조를 재사용합니다.",
        author: user
    };

    const comment: Comment = {
        id: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        postId: 1,
        author: user,
        message: "좋은 글이네요!"
    };

    f_printCodeBlock(
        "Type Alias 조합 예제",
        `type BaseEntity = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
};

type Post = BaseEntity & {
    title: string;
    content: string;
    author: User;
};

type Comment = BaseEntity & {
    postId: number;
    author: User;
    message: string;
};`
    );

    console.log("post:", post);
    console.log("comment:", comment);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. Generic Type Alias (제네릭 타입 별칭)
    // ========================================
    console.log("📌 6. Generic Type Alias (제네릭 타입 별칭)");

    type ApiResponse<T> = {
        success: boolean;
        data: T;
        error?: string;
    };

    type UserListResponse = ApiResponse<User[]>;
    type PostResponse = ApiResponse<Post>;

    const userListResponse: UserListResponse = {
        success: true,
        data: [user]
    };

    const postResponse: PostResponse = {
        success: true,
        data: post
    };

    f_printCodeBlock(
        "Generic Type Alias 예제",
        `type ApiResponse<T> = {
    success: boolean;
    data: T;
    error?: string;
};

type UserListResponse = ApiResponse<User[]>;
type PostResponse = ApiResponse<Post>;

const userListResponse: UserListResponse = {
    success: true,
    data: [user],
};

const postResponse: PostResponse = {
    success: true,
    data: post,
};`
    );

    console.log("userListResponse:", userListResponse);
    console.log("postResponse:", postResponse);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. Type Alias vs Interface 간단 비교
    // ========================================
    console.log("📌 7. Type Alias vs Interface 간단 비교");

    type DevUser = {
        name: string;
        skill: string;
    };

    interface IDevUser {
        name: string;
        skill: string;
    }

    const dev1: DevUser = { name: "Joshua", skill: "TypeScript" };
    const dev2: IDevUser = { name: "Alice", skill: "React" };

    f_printCodeBlock(
        "Type Alias vs Interface",
        `type DevUser = {
    name: string;
    skill: string;
};

interface IDevUser {
    name: string;
    skill: string;
}

const dev1: DevUser = { name: "Joshua", skill: "TypeScript" };
const dev2: IDevUser = { name: "Alice", skill: "React" };`
    );

    console.log("dev1:", dev1);
    console.log("dev2:", dev2);
    console.log("");
    console.log("💡 요약:");
    console.log(" - 객체 타입은 Type Alias와 Interface 둘 다 표현 가능");
    console.log(" - Union, Primitive, Tuple 등은 Type Alias로만 표현 가능");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 실제로 자주 쓰이는 패턴 예시
    // ========================================
    console.log("📌 8. 실전에서 자주 쓰이는 Type Alias 패턴");

    type Nullable<T> = T | null;
    type Optional<T> = T | undefined;
    type NullableOptional<T> = T | null | undefined;

    type UserNullableEmail = {
        name: string;
        email: Nullable<string>;
    };

    const userWithNullableEmail: UserNullableEmail = {
        name: "Joshua",
        email: null
    };

    f_printCodeBlock(
        "실전 패턴 예제",
        `type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type NullableOptional<T> = T | null | undefined;

type UserNullableEmail = {
    name: string;
    email: Nullable<string>;
};

const userWithNullableEmail: UserNullableEmail = {
    name: "Joshua",
    email: null,
};`
    );

    console.log("userWithNullableEmail:", userWithNullableEmail);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Type Alias(타입 별칭)의 다양한 활용법을 정리했습니다!");
    console.log("💡 Tip:");
    console.log("  - 반복되는 타입 구조 → Type Alias/Interface로 추출");
    console.log("  - Union, Primitive, Function, Generic 등은 Type Alias로 관리하면 깔끔");
    console.log("  - 프로젝트에서 공통 타입을 모아두는 types.ts, models.ts 같은 파일을 두면 좋습니다.");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
