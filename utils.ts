import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";

// ###############################
// 🎲 이모지 배열 정의
// ###############################
export const ME_EMOJI: string[] = [
  "💡", "✅️", "⛔", "🚫", "⚙️", "🧩", "✨", "⚠️", "💻",
  "🐶", "🐱", "🐹", "🐰", "🦊", "🐻", "🐼", "🐯", "🦁", "🐮",
  "🐸", "😺", "😸", "😹", "😻", "😼", "😽", "🙀",
  "🐣", "🐳", "🌏", "🍎", "🍳", "⚾️", "🏄", "🚴",
  "🎧", "🎮", "🏍", "✈️", "🏝️", "🕹️", "❤️", "💞",
  "⚽️", "🥊", "🐘", "🐒", "🐨", "🐺", "🐷", "🐧",
  "🐥", "🐔", "🐦", "🐍", "🐄", "🐟", "🐉", "🐋",
  "🐌", "🐙", "🐝", "🐞", "🐛", "🐳", "🐐", "🐃",
  "🐡", "🌸", "🌹", "🐆", "🐫", "🐈", "🐊", "🐩",
  "🐾", "🎃", "🎅", "💾", "🎊", "📷", "🎁", "🎇",
  "🌆", "⛪", "🏬", "🏤", "😁", "😝", "🙈", "🙉",
  "💎", "💗"
];

// ###############################
// 🎲 랜덤 이모지 선택 함수
// ###############################
/**
 * ME_EMOJI 배열에서 랜덤으로 하나의 이모지를 선택하여 반환합니다.
 * @returns 랜덤으로 선택된 이모지
 */
export function getRandomEmoji(): string {
  const randomIndex = Math.floor(Math.random() * ME_EMOJI.length);
  return ME_EMOJI[randomIndex];
}

// 간단한 sleep 유틸 (ms 후 resolve)
export function f_sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ###############################
// ⏸️ 일시정지 함수
// ###############################
/**
 * 사용자가 Enter 키를 누를 때까지 대기합니다.
 * @param rlInterface - 선택적 readline 인터페이스
 */
export async function f_pause(
  rlInterface?: readline.Interface
): Promise<void> {
  console.log();

  const message = `${getRandomEmoji()} 계속하려면 [Enter] 키를 누르세요...`;

  if (rlInterface) {
    // 기존 readline 인터페이스 사용 (main.ts에서 넘겨준 경우)
    await new Promise<void>((resolve) => {
      rlInterface.question(message, () => {
        console.log();
        resolve();
      });
    });
  } else {
    // 독립적으로 사용 시 (레슨 내부에서 직접 호출하는 경우)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    await new Promise<void>((resolve) => {
      rl.question(message, () => {
        console.log();
        rl.close();
        resolve();
      });
    });
  }
}

/**
 * YYYYMMDD 형식으로 정리:
 * - 사용자가 2025-11-28, 2025/11/28, 20251128 처럼 입력해도
 *   숫자만 남기고 "20251128" 형태로 맞춰 줍니다.
 */
export function f_normalizeDateInput(input?: string | null): string {
  if (!input) return "";
  return input.replace(/\D/g, ""); // 숫자만 남김
}

/**
 * 파일명에 쓸 라벨을 안전하게 변환 (공백/한글 등 → _ 로 대체)
 */
export function f_normalizeLabel(label: unknown): string {
  if (label == null) return "unknown";
  return String(label).replace(/[^0-9A-Za-z_-]+/g, "_");
}

// 헬퍼: 코드 블록 출력
export function f_printCodeBlock(title: string, code: string): void {
  console.log(`\n${getRandomEmoji()} ${title}`);
  console.log("-".repeat(60));
  console.log(code);
  console.log("-".repeat(60));
  console.log("");
}

// ###############################
// 📝 간단 Logger 생성 함수
// ###############################
export interface LoggerInstance {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  debug(msg: string): void;
  getLogFilePath(): string;
}

/**
 * scope(이름) 별로 로그 파일을 만들어 주는 간단 Logger
 * - 콘솔 출력 + 파일 로그 둘 다 남김
 * - 로그 파일 경로: <프로젝트>/tmp/logs/<scope>.log
 */
export function Logger(scope = "app"): LoggerInstance {
  // utils.ts가 어디 있든, 현재 작업 디렉터리 기준으로 logs 생성
  const logDir = path.join(process.cwd(), "tmp", "logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFile = path.join(logDir, `${scope}.log`);

  function write(level: string, message: string): void {
    const time = new Date().toISOString();
    const line = `[${time}][${scope}][${level}] ${message}`;
    // 콘솔 출력
    console.log(line);
    // 파일에 추가
    try {
      fs.appendFileSync(logFile, line + "\n", "utf-8");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Logger 파일 쓰기 오류:", err.message);
      } else {
        console.error("Logger 파일 쓰기 오류:", err);
      }
    }
  }

  return {
    info: (msg: string) => write("💡 INFO", msg),
    warn: (msg: string) => write("⚠️ WARN", msg),
    error: (msg: string) => write("🚫 ERROR", msg),
    debug: (msg: string) => write("🐛 DEBUG", msg),
    getLogFilePath: () => logFile
  };
}

// ###############################
// ✅ 유효성 검사 함수들
// ###############################

/**
 * 비어있지 않은 문자열인지 검사
 * - null, undefined, 빈 문자열, 공백만 있는 문자열 → false
 */
export function isNonEmptyString(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return value.trim().length > 0;
}

/**
 * 숫자 형태의 문자열인지 검사 (정수/실수 모두 허용)
 */
export function isNumberString(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed === "") return false;
  const num = Number(trimmed);
  return !Number.isNaN(num);
}

/**
 * 정수 형태의 문자열인지 검사
 */
export function isIntegerString(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed === "") return false;
  const num = Number(trimmed);
  return Number.isInteger(num);
}

/**
 * 정수가 특정 범위 안에 있는지 검사 (문자열도 허용)
 * - 값이 숫자가 아니거나 정수가 아니면 false
 * - min <= 값 <= max 이면 true
 */
export function isIntInRange(
  value: number | string,
  min: number,
  max: number
): boolean {
  const num =
    typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isInteger(num)) return false;
  return num >= min && num <= max;
}

/**
 * 이메일 형식인지 간단히 검사
 */
export function isEmail(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed === "") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

/**
 * 휴대폰 번호(한국) 형식인지 검사
 * - 숫자만 남긴 후 01로 시작 + 10~11자리 허용
 */
export function isKoreanPhone(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const digits = value.replace(/\D/g, "");
  return /^01[0-9]{8,9}$/.test(digits);
}

/**
 * 날짜 입력이 유효한 YYYYMMDD인지 검사
 * - "2025-11-28", "2025/11/28", "20251128" 모두 허용
 */
export function isValidDateYYYYMMDD(input: unknown): boolean {
  if (typeof input !== "string") return false;
  const digits = f_normalizeDateInput(input);

  if (digits.length !== 8) return false;

  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return false;
  }

  if (year < 1900 || year > 2100) return false;

  const date = new Date(year, month - 1, day);
  const valid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return valid;
}
