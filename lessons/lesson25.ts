// lesson25.ts
// ===============================
// 레슨 실행 함수 - Deep Readonly, Deep Partial 직접 구현하기
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

    // 공통 샘플 타입
    type Address = {
        city: string;
        zipCode: string;
    };

    type Profile = {
        nickname: string;
        bio?: string;
    };

    type User = {
        id: number;
        name: string;
        address: Address;
        tags: string[];
        profile?: Profile;
    };

    console.log("📌 이 레슨에서 사용할 기본 User 타입");
    console.log("type User = { id, name, address, tags, profile? }");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 1. 얕은 Readonly / Partial 의 한계
    // ========================================
    console.log("📌 1. 얕은 Readonly / Partial 의 한계");
    console.log("- TS 내장 Readonly<T>, Partial<T> 는 1단계(얕은 레벨)에만 적용됩니다.");
    console.log("- 중첩 객체 안쪽까지 불변/옵셔널로 만들고 싶을 때는 부족합니다.");
    console.log("");

    type ShallowReadonlyUser = Readonly<User>;
    type ShallowPartialUser = Partial<User>;

    f_printCodeBlock(
        "얕은 Readonly / Partial",
        `type ShallowReadonlyUser = Readonly<User>;
type ShallowPartialUser = Partial<User>;

// Readonly<User> 인 경우,
// - user.id = 2;    // ❌ 불가
// 하지만 user.address.city 는 여전히 변경 가능
`
    );

    console.log("→ 이제 중첩된 모든 필드에 적용되는 DeepReadonly / DeepPartial 을 직접 만들어 봅니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. Primitive 헬퍼 타입 정의
    // ========================================
    console.log("📌 2. Primitive 헬퍼 타입 정의");
    console.log("- 재귀 타입 구현 시 '더 이상 들어가지 않을' 기본 타입들을 한 번 정의해 두면 편합니다.");
    console.log("");

    type Primitive =
        | string
        | number
        | boolean
        | bigint
        | symbol
        | null
        | undefined;

    f_printCodeBlock(
        "Primitive 헬퍼 타입",
        `type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined;`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. DeepReadonly<T> 1차 구현 (object 기준)
    // ========================================
    console.log("📌 3. DeepReadonly<T> – 객체 기준 재귀 구현");
    console.log("- 1) Primitive, 함수 등은 그대로 유지");
    console.log("- 2) 배열/Map/Set 은 별도로 다룸");
    console.log("- 3) 나머지 object 는 프로퍼티마다 재귀적으로 적용");
    console.log("");

    type DeepReadonly<T> =
        T extends Primitive
        ? T
        : T extends (...args: any[]) => any
        ? T
        : T extends Array<infer U>
        ? ReadonlyArray<DeepReadonly<U>>
        : T extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepReadonly<U>>
        : T extends Map<infer K, infer V>
        ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
        : T extends Set<infer U>
        ? ReadonlySet<DeepReadonly<U>>
        : T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T;

    type DeepReadonlyUser = DeepReadonly<User>;

    f_printCodeBlock(
        "DeepReadonly<T> 구현",
        `type DeepReadonly<T> =
  T extends Primitive
    ? T
    : T extends (...args: any[]) => any
      ? T
      : T extends Array<infer U>
        ? ReadonlyArray<DeepReadonly<U>>
        : T extends ReadonlyArray<infer U>
          ? ReadonlyArray<DeepReadonly<U>>
          : T extends Map<infer K, infer V>
            ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
            : T extends Set<infer U>
              ? ReadonlySet<DeepReadonly<U>>
              : T extends object
                ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
                : T;

type DeepReadonlyUser = DeepReadonly<User>;`
    );

    console.log("→ DeepReadonlyUser 에서는 모든 하위 필드까지 재귀적으로 readonly 가 적용됩니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. DeepReadonly 런타임 사용 예
    // ========================================
    console.log("📌 4. DeepReadonly 런타임 사용 예 (타입 설명용)");
    const user: DeepReadonlyUser = {
        id: 1,
        name: "Joshua",
        address: {
            city: "Incheon",
            zipCode: "12345"
        },
        tags: ["dev", "ts"],
        profile: {
            nickname: "senior-dev",
            bio: "TypeScript learner"
        }
    };

    console.log("DeepReadonlyUser 값 예:");
    console.log(user);

    f_printCodeBlock(
        "DeepReadonlyUser 사용 시 (컴파일 타임)",
        `const user: DeepReadonlyUser = {
  id: 1,
  name: "Joshua",
  address: {
    city: "Incheon",
    zipCode: "12345",
  },
  tags: ["dev", "ts"],
  profile: {
    nickname: "senior-dev",
    bio: "TypeScript learner",
  },
};

// 아래 코드는 모두 컴파일 에러(읽기 전용)
// user.id = 2;                       // ❌
// user.address.city = "Seoul";       // ❌
// user.tags.push("new");            // ❌
// user.profile!.nickname = "jinwoo"; // ❌`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. DeepPartial<T> 구현
    // ========================================
    console.log("📌 5. DeepPartial<T> – 모든 필드를 재귀적으로 Optional 처리");
    console.log("- Partial<T> 의 깊은 버전입니다.");
    console.log("- 중첩 객체 구조 전체를 '부분 업데이트용' 타입으로 만들 때 유용합니다.");
    console.log("");

    type DeepPartial<T> =
        T extends Primitive
        ? T
        : T extends (...args: any[]) => any
        ? T
        : T extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : T extends Map<infer K, infer V>
        ? Map<DeepPartial<K>, DeepPartial<V>>
        : T extends Set<infer U>
        ? Set<DeepPartial<U>>
        : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : T;

    type DeepPartialUser = DeepPartial<User>;

    f_printCodeBlock(
        "DeepPartial<T> 구현",
        `type DeepPartial<T> =
  T extends Primitive
    ? T
    : T extends (...args: any[]) => any
      ? T
      : T extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T extends ReadonlyArray<infer U>
          ? ReadonlyArray<DeepPartial<U>>
          : T extends Map<infer K, infer V>
            ? Map<DeepPartial<K>, DeepPartial<V>>
            : T extends Set<infer U>
              ? Set<DeepPartial<U>>
              : T extends object
                ? { [K in keyof T]?: DeepPartial<T[K]> }
                : T;

type DeepPartialUser = DeepPartial<User>;`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. DeepPartial 런타임 사용 예 – 부분 업데이트 패턴
    // ========================================
    console.log("📌 6. DeepPartial – 부분 업데이트 예제");

    const patchUser: DeepPartialUser = {
        id: 1, // 최상위 id는 그대로 number
        address: {
            city: "Seoul" // 하위 address.city 만 선택적으로 수정
        },
        profile: {
            bio: "새로운 자기소개" // profile 전체가 optional, 그 안의 bio 도 optional
        }
    };

    console.log("DeepPartialUser 값 예 (부분 업데이트):");
    console.log(patchUser);

    f_printCodeBlock(
        "DeepPartialUser 부분 업데이트 예",
        `const patchUser: DeepPartialUser = {
  id: 1,
  address: {
    city: "Seoul",
  },
  profile: {
    bio: "새로운 자기소개",
  },
};

// 나머지 필드는 모두 생략 가능
// address.zipCode 생략, profile.nickname 생략 등`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. DeepReadonly / DeepPartial + 컬렉션(Map, Set, 배열) 예시
    // ========================================
    console.log("📌 7. 컬렉션 타입(Map, Set, 배열)에 대한 DeepReadonly / DeepPartial");

    type AppConfig = {
        env: "dev" | "prod";
        retryCount: number;
        endpoints: {
            [key: string]: {
                url: string;
                timeout: number;
            };
        };
        tags: string[];
        featureFlags: Map<string, boolean>;
        roles: Set<string>;
    };

    type AppConfigReadonly = DeepReadonly<AppConfig>;
    type AppConfigPartial = DeepPartial<AppConfig>;

    f_printCodeBlock(
        "AppConfig 예제 타입",
        `type AppConfig = {
  env: "dev" | "prod";
  retryCount: number;
  endpoints: {
    [key: string]: {
      url: string;
      timeout: number;
    };
  };
  tags: string[];
  featureFlags: Map<string, boolean>;
  roles: Set<string>;
};

type AppConfigReadonly = DeepReadonly<AppConfig>;
type AppConfigPartial = DeepPartial<AppConfig>;`
    );

    const readonlyConfig: AppConfigReadonly = {
        env: "dev",
        retryCount: 3,
        endpoints: {
            user: {
                url: "/api/user",
                timeout: 3000
            }
        },
        tags: ["ts", "deep"],
        featureFlags: new Map([["new-ui", true]]),
        roles: new Set(["admin", "user"])
    };

    console.log("AppConfigReadonly 예:");
    console.log(readonlyConfig);
    console.log("※ featureFlags, roles 도 readonly 컬렉션으로 간주됩니다.");
    console.log("");

    const partialConfig: AppConfigPartial = {
        endpoints: {
            user: {
                timeout: 5000
            }
        },
        featureFlags: new Map([["beta-api", true]])
    };

    console.log("AppConfigPartial 예 (부분 설정):");
    console.log(partialConfig);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. DeepReadonly / DeepPartial 조합 – Snapshot & Patch 패턴
    // ========================================
    console.log("📌 8. Snapshot & Patch 패턴");
    console.log("- 상태의 스냅샷(snapShot)은 DeepReadonly 로 관리하고,");
    console.log("- 업데이트 요청은 DeepPartial 로 표현하는 패턴입니다.");
    console.log("");

    type UserSnapshot = DeepReadonly<User>;
    type UserPatch = DeepPartial<User>;

    // 기존 applyPatchUser 함수를 이 코드로 교체하세요
    function applyPatchUser(snapshot: UserSnapshot, patch: UserPatch): UserSnapshot {
        // 1) profile 병합을 먼저 타입 안전하게 처리
        const mergedProfile: Profile | undefined =
            snapshot.profile || patch.profile
                ? {
                    // nickname은 항상 string 이 되도록 보장
                    nickname:
                        patch.profile?.nickname ??
                        snapshot.profile?.nickname ??
                        "anonymous", // 둘 다 없으면 기본값
                    // bio는 optional(string | undefined)이므로 그대로 합쳐도 OK
                    bio: patch.profile?.bio ?? snapshot.profile?.bio,
                }
                : undefined;

        // 2) User 전체를 필드별로 명시적으로 병합
        const merged: User = {
            // 최상위 스칼라 값들
            id: patch.id ?? snapshot.id,
            name: patch.name ?? snapshot.name,

            // address는 안쪽 필드별로 병합
            address: {
                city: patch.address?.city ?? snapshot.address.city,
                zipCode: patch.address?.zipCode ?? snapshot.address.zipCode,
            },

            // tags: readonly string[] → string[] 로 새 배열 생성
            // patch.tags가 있으면 그걸 우선 사용하고, 없으면 snapshot.tags를 복사
            tags: patch.tags ? [...patch.tags] : [...snapshot.tags],

            // profile: 위에서 타입 안전하게 만든 mergedProfile 사용
            profile: mergedProfile,
        };

        // User → DeepReadonly<User> 로 캐스팅해서 반환
        return merged as UserSnapshot;
    }

    f_printCodeBlock(
        "Snapshot & Patch 타입 패턴",
        `type UserSnapshot = DeepReadonly<User>;
type UserPatch = DeepPartial<User>;

function applyPatchUser(snapshot: UserSnapshot, patch: UserPatch): UserSnapshot {
  const merged: User = {
    ...snapshot,
    ...patch,
    address: {
      ...snapshot.address,
      ...(patch.address ?? {}),
    },
    profile: {
      ...snapshot.profile,
      ...(patch.profile ?? {}),
    },
  };
  return merged as UserSnapshot;
}`
    );

    const before: UserSnapshot = {
        id: 1,
        name: "Joshua",
        address: { city: "Incheon", zipCode: "12345" },
        tags: ["ts"],
        profile: { nickname: "senior-dev" }
    };

    const after = applyPatchUser(before, {
        address: { city: "Seoul" },
        profile: { bio: "Deep types 연습 중" }
    });

    console.log("Snapshot & Patch 적용 예:");
    console.log("before:", before);
    console.log("after :", after);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 9. DeepReadonly / DeepPartial 의 주의사항
    // ========================================
    console.log("📌 9. DeepReadonly / DeepPartial 사용 시 주의사항");
    console.log("- 1) 너무 깊은 구조에 사용하면 타입 추론/표시가 복잡해질 수 있습니다.");
    console.log("- 2) any, unknown 타입에는 재귀가 크게 의미가 없을 수 있습니다.");
    console.log("- 3) Date, RegExp 같은 특별한 객체 타입은 필요에 따라 예외 처리할 수도 있습니다.");
    console.log("");

    type DeepReadonlySimple<T> =
        T extends Primitive
        ? T
        : T extends Function
        ? T
        : T extends object
        ? { readonly [K in keyof T]: DeepReadonlySimple<T[K]> }
        : T;

    f_printCodeBlock(
        "조금 더 단순화한 버전 (object 위주)",
        `type DeepReadonlySimple<T> =
  T extends Primitive
    ? T
    : T extends Function
      ? T
      : T extends object
        ? { readonly [K in keyof T]: DeepReadonlySimple<T[K]> }
        : T;`
    );

    console.log("→ 실무에서는 '필요한 정도'까지만 깊게 들어가는 버전으로 커스터마이징해서 쓰기도 합니다.");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Deep Readonly, Deep Partial 직접 구현하기 – 정리 완료!");
    console.log("💡 핵심 정리:");
    console.log("  - Readonly<T>, Partial<T> 는 얕은(1단계) 변환만 해 준다.");
    console.log("  - DeepReadonly<T>, DeepPartial<T> 를 직접 만들면 중첩 구조 전체를 제어할 수 있다.");
    console.log("  - Primitive / 함수 / 배열 / Map / Set / object 에 대해 분기 처리하는 패턴이 핵심.");
    console.log("  - Snapshot(DeepReadonly) + Patch(DeepPartial) 조합은 상태 관리/도메인 모델에서 매우 유용.");
    console.log("  - 필요에 따라 더 단순화/특수화한 버전으로 커스터마이징하는 것도 많이 쓰이는 패턴.");
    console.log("");
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
