// lesson19.ts
// ===============================
// 레슨 실행 함수 - 유틸리티 타입(Partial, Pick, Omit, Record)
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

    console.log("📌 이 레슨에서 사용할 기본 User 타입:");
    console.log("type User = { id, name, email, isAdmin }");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 1. Partial<T> – 모든 속성을 선택적으로 만들기
    // ========================================
    console.log("📌 1. Partial<T> – 모든 속성을 Optional로 바꾸기");
    console.log("- Partial<User> 는 User의 모든 속성을 '있어도 되고 없어도 되는' 형태로 만듭니다.");
    console.log("- 주로 부분 업데이트(패치) 요청 등에 사용합니다.");
    console.log("");

    type UserUpdate = Partial<User>;

    const patch1: UserUpdate = {
        name: "새 이름만 수정"
    };

    const patch2: UserUpdate = {
        email: "new@example.com",
        isAdmin: true
    };

    f_printCodeBlock(
        "Partial<User> 예제",
        `type User = {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
};

// 모든 속성이 선택(Optional)이 됨
type UserUpdate = Partial<User>;

const patch1: UserUpdate = {
    name: "새 이름만 수정",
};

const patch2: UserUpdate = {
    email: "new@example.com",
    isAdmin: true,
};`
    );

    console.log("patch1:", patch1);
    console.log("patch2:", patch2);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. Pick<T, K> – 일부 속성만 골라서 사용하기
    // ========================================
    console.log("📌 2. Pick<T, K> – 필요한 속성만 골라 타입 만들기");
    console.log("- Pick<User, 'id' | 'name'> 처럼 특정 키만 골라서 새 타입을 만들 수 있습니다.");
    console.log("");

    type UserSummary = Pick<User, "id" | "name">;

    const summary: UserSummary = {
        id: 1,
        name: "Joshua"
    };

    f_printCodeBlock(
        "Pick<User, 'id' | 'name'> 예제",
        `type User = {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
};

// User에서 id, name만 골라서 타입 생성
type UserSummary = Pick<User, "id" | "name">;

const summary: UserSummary = {
    id: 1,
    name: "Joshua",
};`
    );

    console.log("summary:", summary);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. Omit<T, K> – 특정 속성만 제외하기
    // ========================================
    console.log("📌 3. Omit<T, K> – 특정 속성만 빼고 나머지로 타입 만들기");
    console.log("- Omit<User, 'email' | 'isAdmin'> 처럼 일부 필드를 제외할 수 있습니다.");
    console.log("");

    type UserWithoutSecret = Omit<User, "email" | "isAdmin">;

    const userPublic: UserWithoutSecret = {
        id: 1,
        name: "Joshua"
    };

    f_printCodeBlock(
        "Omit<User, 'email' | 'isAdmin'> 예제",
        `type User = {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
};

// email, isAdmin 을 제외한 타입
type UserWithoutSecret = Omit<User, "email" | "isAdmin">;

const userPublic: UserWithoutSecret = {
    id: 1,
    name: "Joshua",
};`
    );

    console.log("userPublic:", userPublic);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. Record<K, T> – 키/값 맵 타입 만들기
    // ========================================
    console.log("📌 4. Record<K, T> – 키/값 맵(Map) 타입 정의하기");
    console.log("- Record<string, number> 는 '임의의 문자열 키' → number 값 구조를 의미합니다.");
    console.log("- Enum이나 리터럴 유니온을 K 로 쓰면 더 안전한 '테이블'을 만들 수 있습니다.");
    console.log("");

    type ScoreMap = Record<string, number>;

    const scores: ScoreMap = {
        Joshua: 95,
        Alice: 88,
        Bob: 76
    };

    f_printCodeBlock(
        "Record<string, number> 예제",
        `type ScoreMap = Record<string, number>;

const scores: ScoreMap = {
    Joshua: 95,
    Alice: 88,
    Bob: 76,
};`
    );

    console.log("scores:", scores);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. Record + 리터럴 유니온으로 안전한 맵 만들기
    // ========================================
    console.log("📌 5. Record + 리터럴 유니온으로 더 안전한 맵 만들기");

    type Day = "mon" | "tue" | "wed" | "thu" | "fri";

    type WorkSchedule = Record<Day, string>;

    const schedule: WorkSchedule = {
        mon: "회의 & 설계",
        tue: "코딩",
        wed: "코드 리뷰",
        thu: "테스트 & 디버깅",
        fri: "리팩토링 & 정리"
    };

    f_printCodeBlock(
        "Record<Day, string> 예제",
        `type Day = "mon" | "tue" | "wed" | "thu" | "fri";

type WorkSchedule = Record<Day, string>;

const schedule: WorkSchedule = {
    mon: "회의 & 설계",
    tue: "코딩",
    wed: "코드 리뷰",
    thu: "테스트 & 디버깅",
    fri: "리팩토링 & 정리",
};`
    );

    console.log("schedule:", schedule);
    console.log("→ Day에 없는 'sat', 'sun' 같은 키는 사용할 수 없습니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. Partial + Pick + Omit 조합으로 Update 타입 만들기
    // ========================================
    console.log("📌 6. Partial + Pick + Omit 조합 – 실전 Update 타입 설계");
    console.log("- 예: User에서 id는 필수, 나머지 필드는 선택적 업데이트로 만들고 싶다.");
    console.log("");

    type UserUpdatableFields = Omit<User, "id">;
    type UserUpdateDto = {
        id: User["id"];
    } & Partial<UserUpdatableFields>;

    const updateDto1: UserUpdateDto = {
        id: 1,
        name: "New Name"
    };

    const updateDto2: UserUpdateDto = {
        id: 2,
        email: "new@example.com",
        isAdmin: false
    };

    f_printCodeBlock(
        "id는 필수, 나머지는 Partial 업데이트 타입",
        `type User = {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
};

// 나머지 필드만 따로 뽑음
type UserUpdatableFields = Omit<User, "id">;

// id는 필수 + 나머지는 부분 업데이트
type UserUpdateDto = {
    id: User["id"];
} & Partial<UserUpdatableFields>;

const updateDto1: UserUpdateDto = {
    id: 1,
    name: "New Name",
};

const updateDto2: UserUpdateDto = {
    id: 2,
    email: "new@example.com",
    isAdmin: false,
};`
    );

    console.log("updateDto1:", updateDto1);
    console.log("updateDto2:", updateDto2);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. Partial + Record 로 옵션/설정 타입 만들기
    // ========================================
    console.log("📌 7. Partial + Record 조합 – 옵션/설정 타입에 활용하기");

    type FeatureFlag = "newUI" | "betaAPI" | "logging";

    type FeatureConfig = Partial<Record<FeatureFlag, boolean>>;

    const flags: FeatureConfig = {
        newUI: true,
        logging: false
        // betaAPI는 설정 안 함 → undefined 로 간주
    };

    f_printCodeBlock(
        "Partial<Record<...>> 예제",
        `type FeatureFlag = "newUI" | "betaAPI" | "logging";

type FeatureConfig = Partial<Record<FeatureFlag, boolean>>;

const flags: FeatureConfig = {
    newUI: true,
    logging: false,
    // betaAPI는 설정 안 할 수도 있음
};`
    );

    console.log("flags:", flags);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 유틸리티 타입 몇 가지 더 소개
    // ========================================
    console.log("📌 8. 유틸리티 타입 몇 가지 더 (간단 소개)");
    console.log("- 오늘 집중 주제는 아니지만, 같이 알아두면 좋은 타입들입니다.");
    console.log("");

    type UserRequired = Required<User>;
    type UserReadonly = Readonly<User>;
    type UserOptionalEmail = Omit<User, "email"> & { email?: string };

    f_printCodeBlock(
        "기타 유틸리티 타입들 (Required / Readonly 등)",
        `type User = {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
};

// 모든 속성을 필수로
type UserRequired = Required<User>;

// 모든 속성을 읽기 전용으로
type UserReadonly = Readonly<User>;

// email만 Optional로 바꾸기
type UserOptionalEmail = Omit<User, "email"> & { email?: string };`
    );

    const readonlyUser: UserReadonly = {
        id: 1,
        name: "Joshua",
        email: "joshua@example.com",
        isAdmin: true
    };

    console.log("readonlyUser:", readonlyUser);
    console.log("→ readonlyUser.name = '변경'; // ❌ 컴파일 에러 (Readonly)");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 9. 실전 예제 – API 응답/요청 모델 정리
    // ========================================
    console.log("📌 9. 실전 예제 – API 요청/응답 모델에 적용해 보기");

    type UserListItem = Pick<User, "id" | "name" | "email">;
    type UserDetail = User; // 전체 정보
    type CreateUserRequest = Omit<User, "id">; // id는 서버에서 부여
    type UpdateUserRequest = UserUpdateDto; // 앞에서 만든 타입 재사용
    type UserMapById = Record<number, User>;

    const userMap: UserMapById = {
        1: { id: 1, name: "Joshua", email: "a@example.com", isAdmin: true },
        2: { id: 2, name: "Alice", email: "b@example.com", isAdmin: false }
    };

    f_printCodeBlock(
        "API 모델에 유틸리티 타입 적용",
        `type User = {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
};

// 목록용 Item
type UserListItem = Pick<User, "id" | "name" | "email">;

// 상세 보기용
type UserDetail = User;

// 생성 요청 (id 제외)
type CreateUserRequest = Omit<User, "id">;

// 부분 수정 요청
type UpdateUserRequest = UserUpdateDto;

// id → User 매핑
type UserMapById = Record<number, User>;`
    );

    console.log("userMap:", userMap);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ 유틸리티 타입(Partial, Pick, Omit, Record)의 핵심을 정리했습니다!");
    console.log("💡 Tip 정리:");
    console.log("  - Partial<T>  : 부분 업데이트/옵션 설정에 좋음");
    console.log("  - Pick<T, K>  : 필요한 필드만 골라서 ViewModel 등으로 사용");
    console.log("  - Omit<T, K>  : 특정 필드만 빼고 재사용 타입 만들기");
    console.log("  - Record<K,T> : Enum/리터럴 유니온 기반의 맵 타입에 최적");
    console.log("  - 이 네 가지는 실무 코드베이스 거의 어디서나 등장하는 '필수 유틸리티 타입'입니다.");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
