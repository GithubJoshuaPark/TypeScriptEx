// lesson09.ts
// ===============================
// 레슨 실행 함수 - Enum 사용법: 상수 그룹 정의하기
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
    // 1. 기본 Enum (숫자 기반)
    // ========================================
    console.log("📌 1. 기본 Enum (숫자 기반)");

    enum Direction {
        Up,    // 0
        Down,  // 1
        Left,  // 2
        Right  // 3
    }

    const move1 = Direction.Up;
    const move2 = Direction.Left;

    f_printCodeBlock(
        "기본 Enum 예제",
        `enum Direction {
    Up,    // 0
    Down,  // 1
    Left,  // 2
    Right  // 3
}

const move1 = Direction.Up;    // 0
const move2 = Direction.Left;  // 2`
    );

    console.log("move1:", move1);
    console.log("move2:", move2);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. 초기값 지정 Enum
    // ========================================
    console.log("📌 2. 숫자 Enum + 초기값 설정");

    enum StatusCode {
        Success = 200,
        NotFound = 404,
        ServerError = 500
    }

    f_printCodeBlock(
        "초기값 지정 Enum",
        `enum StatusCode {
    Success = 200,
    NotFound = 404,
    ServerError = 500
}

StatusCode.Success;     // 200
StatusCode.NotFound;    // 404`
    );

    console.log("Success:", StatusCode.Success);
    console.log("NotFound:", StatusCode.NotFound);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. 문자열 Enum (string enum)
    // ========================================
    console.log("📌 3. 문자열 Enum (string enum)");

    enum LogLevel {
        Info = "INFO",
        Warning = "WARN",
        Error = "ERROR"
    }

    const currentLevel = LogLevel.Warning;

    f_printCodeBlock(
        "문자열 Enum 예제",
        `enum LogLevel {
    Info = "INFO",
    Warning = "WARN",
    Error = "ERROR",
}

const currentLevel = LogLevel.Warning;  // "WARN"`
    );

    console.log("currentLevel:", currentLevel);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. Enum을 함수 매개변수 타입으로 사용하기
    // ========================================
    console.log("📌 4. Enum을 함수의 매개변수 타입으로 사용");

    function log(level: LogLevel, message: string) {
        console.log(`[\${level}] - \${message}`);
    }

    log(LogLevel.Info, "서버가 시작되었습니다.");
    log(LogLevel.Error, "DB 연결 실패!");

    f_printCodeBlock(
        "Enum 함수 매개변수 활용",
        `function log(level: LogLevel, message: string) {
    console.log(\`[\${level}] - \${message}\`);
}

log(LogLevel.Info, "서버가 시작되었습니다.");
log(LogLevel.Error, "DB 연결 실패!");`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. Enum의 역방향 매핑 (숫자 Enum만 가능)
    // ========================================
    console.log("📌 5. 숫자 Enum의 역방향 매핑");

    enum HttpMethod {
        Get = 1,
        Post,
        Put,
        Delete
    }

    const methodNum = HttpMethod.Post;   // 2
    const methodName = HttpMethod[2];    // "Post"

    f_printCodeBlock(
        "Enum 역방향 매핑",
        `enum HttpMethod {
    Get = 1,
    Post,   // 2
    Put,    // 3
    Delete  // 4
}

const methodNum = HttpMethod.Post;   // 2
const methodName = HttpMethod[2];    // "Post"   (역매핑)`
    );

    console.log("methodNum:", methodNum);
    console.log("methodName:", methodName);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. Const Enum (컴파일 시 값 인라인)
    // ========================================
    console.log("📌 6. const enum (더 가볍고 빠른 Enum)");

    // 주의: const enum은 실제 JS 결과물에 Enum 객체가 생성되지 않는다.
    const enum Color {
        Red = "#ff0000",
        Green = "#00ff00",
        Blue = "#0000ff"
    }

    const bgColor = Color.Green;

    f_printCodeBlock(
        "const enum 예제",
        `const enum Color {
    Red = "#ff0000",
    Green = "#00ff00",
    Blue = "#0000ff",
}

const bgColor = Color.Green; // "#00ff00" 로 인라인됨`
    );

    console.log("bgColor:", bgColor);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. 실제 서비스 개발에서의 Enum 활용 패턴
    // ========================================
    console.log("📌 7. 실전에서 많이 쓰는 Enum 패턴");

    enum UserRole {
        Admin = "ADMIN",
        Manager = "MANAGER",
        User = "USER"
    }

    type UserInfo = {
        id: number;
        name: string;
        role: UserRole;
    };

    const user: UserInfo = {
        id: 1,
        name: "Joshua",
        role: UserRole.Admin
    };

    f_printCodeBlock(
        "실전 Enum 패턴",
        `enum UserRole {
    Admin = "ADMIN",
    Manager = "MANAGER",
    User = "USER",
}

type UserInfo = {
    id: number;
    name: string;
    role: UserRole;
};

const user: UserInfo = {
    id: 1,
    name: "Joshua",
    role: UserRole.Admin,
};`
    );

    console.log("user:", user);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. Enum vs Literal Union 비교
    // ========================================
    console.log("📌 8. Enum vs Literal Union 비교");

    type LiteralRole = "ADMIN" | "MANAGER" | "USER";

    function setRole(role: LiteralRole) {
        console.log("Role:", role);
    }

    f_printCodeBlock(
        "Enum vs Literal Union",
        `// Enum 방식
enum UserRole {
    Admin = "ADMIN",
    Manager = "MANAGER",
    User = "USER",
}

// Literal Union 방식
type LiteralRole = "ADMIN" | "MANAGER" | "USER";`
    );

    console.log("- Enum은 객체 형태로 런타임에서도 존재함");
    console.log("- Literal Union은 타입만 존재하고 JS 결과물에는 없음 (더 가벼움!)");
    console.log("");

    setRole("ADMIN");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Enum의 핵심 개념을 완전히 정리했습니다!");
    console.log("💡 Tip:");
    console.log("  - 숫자 Enum: 인덱스 증가, 역매핑 가능");
    console.log("  - 문자열 Enum: 더 명확하고 실수 위험이 적음");
    console.log("  - const enum: 빌드 후 값만 남아 가장 성능 좋음");
    console.log("  - 작은 프로젝트에서는 Literal Union이 더 가볍고 실용적일 때도 많음");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
