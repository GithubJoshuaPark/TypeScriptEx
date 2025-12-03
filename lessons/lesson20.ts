// lesson20.ts
// ===============================
// 레슨 실행 함수 - Mapped Types – 재활용 타입 만들기
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

    // 공통 예제용 기본 타입
    type User = {
        id: number;
        name: string;
        email: string;
        isAdmin: boolean;
    };

    console.log("📌 이 레슨에서 사용할 기본 User 타입");
    console.log("type User = { id, name, email, isAdmin }");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 1. Mapped Type 기본 구조
    // ========================================
    console.log("📌 1. Mapped Type 기본 구조");
    console.log("- 이미 존재하는 타입의 모든 프로퍼티를 순회하면서");
    console.log("  새로운 타입으로 '변환'하는 패턴입니다.");
    console.log("");

    type ReadonlyUserLike = {
        readonly [K in keyof User]: User[K];
    };

    f_printCodeBlock(
        "Mapped Type 기본 형태",
        `type User = {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
};

// Mapped Type 기본 패턴
type ReadonlyUserLike = {
    readonly [K in keyof User]: User[K];
};`
    );

    const u1: ReadonlyUserLike = {
        id: 1,
        name: "Joshua",
        email: "joshua@example.com",
        isAdmin: true
    };
    console.log("ReadonlyUserLike:", u1);
    console.log("→ 모든 프로퍼티에 readonly가 적용된 버전입니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. keyof + in 으로 키 순회하기
    // ========================================
    console.log("📌 2. keyof + in 으로 키 순회하기");
    console.log("- keyof User  →  'id' | 'name' | 'email' | 'isAdmin'");
    console.log("- [K in keyof User]  → 각 키 K에 대해 순회하면서 새 타입 정의");
    console.log("");

    type OnlyStringProps<T> = {
        [K in keyof T]: T[K] extends string ? T[K] : never;
    };

    type UserStringOnly = OnlyStringProps<User>;

    f_printCodeBlock(
        "keyof + in 기본 패턴 예제",
        `type OnlyStringProps<T> = {
    [K in keyof T]: T[K] extends string ? T[K] : never;
};

type UserStringOnly = OnlyStringProps<User>;
// 결과:
// type UserStringOnly = {
//   id: never;
//   name: string;
//   email: string;
//   isAdmin: never;
// }`
    );

    const u2: UserStringOnly = {
        id: undefined as never,
        name: "Joshua",
        email: "test@example.com",
        isAdmin: undefined as never
    };
    console.log("UserStringOnly:", u2);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. Partial, Readonly를 직접 구현해 보기
    // ========================================
    console.log("📌 3. Partial / Readonly 유틸리티를 직접 구현해 보기");

    type MyPartial<T> = {
        [K in keyof T]?: T[K];
    };

    type MyReadonly<T> = {
        readonly [K in keyof T]: T[K];
    };

    type UserPartial = MyPartial<User>;
    type UserReadonly = MyReadonly<User>;

    f_printCodeBlock(
        "MyPartial / MyReadonly 구현",
        `type MyPartial<T> = {
    [K in keyof T]?: T[K];
};

type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};

type UserPartial = MyPartial<User>;
type UserReadonly = MyReadonly<User>;`
    );

    const up: UserPartial = {
        id: 1,
        name: "변경 가능",
        // 나머지는 생략 가능
    };

    const ur: UserReadonly = {
        id: 1,
        name: "읽기 전용",
        email: "readonly@example.com",
        isAdmin: false
    };

    console.log("UserPartial:", up);
    console.log("UserReadonly:", ur);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. Mapped Type에서 수정자(+/-) 활용하기
    // ========================================
    console.log("📌 4. Mapped Type에서 수정자(+ / -) 활용하기");
    console.log("- readonly, ?(optional) 같은 수정자를 추가/제거할 수 있습니다.");
    console.log("");

    type Mutable<T> = {
        -readonly [K in keyof T]: T[K];
    };

    type RequiredProps<T> = {
        [K in keyof T]-?: T[K];
    };

    interface Example {
        readonly id: number;
        name?: string;
        email?: string;
    }

    type ExampleMutable = Mutable<Example>;
    type ExampleRequired = RequiredProps<Example>;

    f_printCodeBlock(
        "수정자 제거/추가 예제",
        `interface Example {
    readonly id: number;
    name?: string;
    email?: string;
}

// readonly 제거
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

// optional(?) 제거
type RequiredProps<T> = {
    [K in keyof T]-?: T[K];
};

type ExampleMutable = Mutable<Example>;
type ExampleRequired = RequiredProps<Example>;`
    );

    const em: ExampleMutable = {
        id: 1,
        name: "mutable",
        email: "m@example.com"
    };
    em.id = 2; // 이제 가능

    const er: ExampleRequired = {
        id: 10,
        name: "required",
        email: "r@example.com"
    };

    console.log("ExampleMutable:", em);
    console.log("ExampleRequired:", er);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. Pick / Omit 비슷한 패턴 만들기
    // ========================================
    console.log("📌 5. Pick / Omit 과 비슷한 Mapped Type 패턴");

    type MyPick<T, K extends keyof T> = {
        [P in K]: T[P];
    };

    type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>;

    type UserSummary = MyPick<User, "id" | "name">;
    type UserWithoutSecret = MyOmit<User, "email" | "isAdmin">;

    f_printCodeBlock(
        "MyPick / MyOmit 구현 예제",
        `type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>;

type UserSummary = MyPick<User, "id" | "name">;
type UserWithoutSecret = MyOmit<User, "email" | "isAdmin">;`
    );

    const summary: UserSummary = { id: 1, name: "Joshua" };
    const publicUser: UserWithoutSecret = { id: 1, name: "Joshua" };

    console.log("UserSummary:", summary);
    console.log("UserWithoutSecret:", publicUser);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. 값 타입 변환 – 모든 값 타입을 string으로 바꾸기
    // ========================================
    console.log("📌 6. 값 타입 변환 – 모든 필드를 string으로 바꾸기");
    console.log("- 예: 로그 출력용, 폼 입력용 등에서 자주 쓰는 패턴입니다.");
    console.log("");

    type ToStringProps<T> = {
        [K in keyof T]: string;
    };

    type UserStringProps = ToStringProps<User>;

    f_printCodeBlock(
        "모든 프로퍼티를 string으로 바꾸는 Mapped Type",
        `type ToStringProps<T> = {
    [K in keyof T]: string;
};

type UserStringProps = ToStringProps<User>;
// 결과:
// type UserStringProps = {
//   id: string;
//   name: string;
//   email: string;
//   isAdmin: string;
// }`
    );

    const us: UserStringProps = {
        id: "1",
        name: "Joshua",
        email: "mail@example.com",
        isAdmin: "true"
    };
    console.log("UserStringProps:", us);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. 부분적인 프로퍼티만 변환 – 숫자형 필드만 Optional로 만들기
    // ========================================
    console.log("📌 7. 조건부 Mapped Type – 특정 프로퍼티만 변환하기");
    console.log("- 숫자 필드는 Optional로, 나머지는 그대로 두는 예제입니다.");
    console.log("");

    type OptionalNumbers<T> = {
        [K in keyof T]: T[K] extends number ? T[K] | undefined : T[K];
    };

    type UserOptionalNumbers = OptionalNumbers<User>;

    f_printCodeBlock(
        "숫자형 필드만 Optional로 만드는 Mapped Type",
        `type OptionalNumbers<T> = {
    [K in keyof T]: T[K] extends number ? T[K] | undefined : T[K];
};

type UserOptionalNumbers = OptionalNumbers<User>;
// 결과 예:
// id: number | undefined
// isAdmin: boolean (그대로)
// name, email: string (그대로)`
    );

    const uOptNum: UserOptionalNumbers = {
        id: undefined, // 허용
        name: "Joshua",
        email: "opt@example.com",
        isAdmin: true
    };

    console.log("UserOptionalNumbers:", uOptNum);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 키 이름 리매핑 (as) – 접두사/접미사 붙이기
    // ========================================
    console.log("📌 8. 키 이름 리매핑 (Key Remapping: as) – 접두사/접미사");
    console.log("- TS 4.1+ 에서 도입된 기능입니다.");
    console.log("- 각 프로퍼티 이름을 변형해서 새로운 키로 사용할 수 있습니다.");
    console.log("");

    type ApiRequest<T> = {
        [K in keyof T as `request_${Extract<K, string>}`]: T[K];
    };

    type UserApiRequest = ApiRequest<User>;

    f_printCodeBlock(
        "키 이름 리매핑 (as) 예제",
        `type ApiRequest<T> = {
    [K in keyof T as \`request_\${Extract<K, string>}\`]: T[K];
};

type UserApiRequest = ApiRequest<User>;
// 결과:
// type UserApiRequest = {
//   request_id: number;
//   request_name: string;
//   request_email: string;
//   request_isAdmin: boolean;
// }`
    );

    const req: UserApiRequest = {
        request_id: 1,
        request_name: "Joshua",
        request_email: "req@example.com",
        request_isAdmin: true
    };

    console.log("UserApiRequest:", req);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 9. 실전 예제 – 도메인 모델용 Mapped Type 세트 만들기
    // ========================================
    console.log("📌 9. 실전 예제 – 도메인 모델용 Mapped Type 세트");

    type EntityBase = {
        id: number;
        createdAt: Date;
        updatedAt: Date;
    };

    type Entity<T> = EntityBase & T;

    type CreateDto<T> = Omit<Entity<T>, "id" | "createdAt" | "updatedAt">;
    type UpdateDto<T> = Partial<CreateDto<T>> & { id: number };

    type UserEntity = Entity<{
        name: string;
        email: string;
        isAdmin: boolean;
    }>;

    type CreateUserDto = CreateDto<{
        name: string;
        email: string;
        isAdmin: boolean;
    }>;

    type UpdateUserDto = UpdateDto<{
        name: string;
        email: string;
        isAdmin: boolean;
    }>;

    f_printCodeBlock(
        "도메인 모델용 Mapped / 재활용 타입 설계",
        `type EntityBase = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
};

// 도메인별 필드를 제네릭으로 받는 Entity
type Entity<T> = EntityBase & T;

// 생성 DTO: id, createdAt, updatedAt 제거
type CreateDto<T> = Omit<Entity<T>, "id" | "createdAt" | "updatedAt">;

// 수정 DTO: 생성 DTO의 Partial + id 필수
type UpdateDto<T> = Partial<CreateDto<T>> & { id: number };

type UserEntity = Entity<{
    name: string;
    email: string;
    isAdmin: boolean;
}>;

type CreateUserDto = CreateDto<{
    name: string;
    email: string;
    isAdmin: boolean;
}>;

type UpdateUserDto = UpdateDto<{
    name: string;
    email: string;
    isAdmin: boolean;
}>;`
    );

    const newUser: CreateUserDto = {
        name: "New User",
        email: "new@example.com",
        isAdmin: false
    };

    const patchUser: UpdateUserDto = {
        id: 1,
        email: "updated@example.com"
    };

    console.log("CreateUserDto 예:", newUser);
    console.log("UpdateUserDto 예:", patchUser);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Mapped Types – 재활용 타입 만들기의 핵심 패턴들을 정리했습니다!");
    console.log("💡 Tip 정리:");
    console.log("  - [K in keyof T] 패턴을 기억하면 대부분의 유틸리티 타입을 이해할 수 있습니다.");
    console.log("  - readonly / ? 수정자에 + / - 를 붙여 추가/제거 가능합니다.");
    console.log("  - 조건부 타입(extends ? : )와 결합하면 매우 강력한 변환 타입을 만들 수 있습니다.");
    console.log("  - 키 리매핑(as) + 템플릿 리터럴 타입과 결합하면 정교한 API 모델을 만들 수 있습니다.");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
