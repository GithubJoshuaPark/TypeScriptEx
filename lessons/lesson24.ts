// lesson24.ts
// ===============================
// 레슨 실행 함수 - Discriminated Union으로 안전한 상태머신 만들기
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
    // 1. Discriminated Union 이란?
    // ========================================
    console.log("📌 1. Discriminated Union 이란?");
    console.log("- 공통된 식별자(discriminant) 필드를 기준으로,");
    console.log("  여러 상태(또는 형태)를 하나의 Union 타입으로 묶는 패턴입니다.");
    console.log('- 예: { status: "loading" } | { status: "success"; data: T } | { status: "error"; message: string }');
    console.log("- 상태머신(State Machine)을 타입 안전하게 만들 때 매우 유용합니다.");
    console.log("");

    f_printCodeBlock(
        "Discriminated Union 기본 형태",
        `type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. 가장 기본적인 상태 타입 + 안전한 처리 함수
    // ========================================
    console.log("📌 2. 기본 상태 타입 예제 – idle / loading / success / error");

    type LoadState<T> =
        | { status: "idle" }
        | { status: "loading" }
        | { status: "success"; data: T }
        | { status: "error"; message: string };

    function printLoadState<T>(state: LoadState<T>): void {
        switch (state.status) {
            case "idle":
                console.log("⏸ 아직 아무 작업도 시작하지 않았습니다.");
                break;
            case "loading":
                console.log("⏳ 로딩 중입니다...");
                break;
            case "success":
                console.log("✅ 성공! 데이터:", state.data);
                break;
            case "error":
                console.log("❌ 에러:", state.message);
                break;
            default: {
                // 여기 오면 안 됨 (타입상으로도 막도록 never 사용)
                const _exhaustive: never = state;
                console.log(_exhaustive);
            }
        }
    }

    f_printCodeBlock(
        "기본 상태 타입 + 안전한 switch",
        `type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function printLoadState<T>(state: LoadState<T>): void {
  switch (state.status) {
    case "idle":
      console.log("아직 시작 전");
      break;
    case "loading":
      console.log("로딩 중");
      break;
    case "success":
      console.log("성공:", state.data);
      break;
    case "error":
      console.log("에러:", state.message);
      break;
    default: {
      const _exhaustive: never = state;
      // 컴파일 타임에 누락된 case가 있으면 에러
    }
  }
}`
    );

    console.log("🔍 간단히 한 번 호출해 봅니다.");
    printLoadState<string>({ status: "idle" });
    printLoadState<string>({ status: "loading" });
    printLoadState<string>({ status: "success", data: "OK" });
    printLoadState<string>({ status: "error", message: "Network Error" });
    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. 상태 + 이벤트로 구성된 간단 상태머신
    // ========================================
    console.log("📌 3. 상태 + 이벤트를 가진 간단 상태머신 만들기");
    console.log("- 상태(State)와 이벤트(Event)를 각각 Discriminated Union으로 정의하고,");
    console.log("- transition(state, event) 함수에서 switch 문으로 안전하게 전이(transition)를 처리합니다.");
    console.log("");

    type FetchState<T> =
        | { type: "idle" }
        | { type: "loading" }
        | { type: "success"; data: T }
        | { type: "error"; message: string };

    type FetchEvent<T> =
        | { type: "FETCH" }
        | { type: "RESOLVE"; data: T }
        | { type: "REJECT"; message: string }
        | { type: "RESET" };

    function transition<T>(
        state: FetchState<T>,
        event: FetchEvent<T>
    ): FetchState<T> {
        switch (state.type) {
            case "idle":
                switch (event.type) {
                    case "FETCH":
                        return { type: "loading" };
                    case "RESET":
                        return state;
                    default:
                        return state;
                }
            case "loading":
                switch (event.type) {
                    case "RESOLVE":
                        return { type: "success", data: event.data };
                    case "REJECT":
                        return { type: "error", message: event.message };
                    case "RESET":
                        return { type: "idle" };
                    default:
                        return state;
                }
            case "success":
                switch (event.type) {
                    case "FETCH":
                        return { type: "loading" };
                    case "RESET":
                        return { type: "idle" };
                    default:
                        return state;
                }
            case "error":
                switch (event.type) {
                    case "FETCH":
                        return { type: "loading" };
                    case "RESET":
                        return { type: "idle" };
                    default:
                        return state;
                }
            default: {
                const _exhaustive: never = state;
                return _exhaustive;
            }
        }
    }

    f_printCodeBlock(
        "Fetch 상태머신 예제 (State + Event)",
        `type FetchState<T> =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; data: T }
  | { type: "error"; message: string };

type FetchEvent<T> =
  | { type: "FETCH" }
  | { type: "RESOLVE"; data: T }
  | { type: "REJECT"; message: string }
  | { type: "RESET" };

function transition<T>(
  state: FetchState<T>,
  event: FetchEvent<T>
): FetchState<T> {
  switch (state.type) {
    case "idle":
      if (event.type === "FETCH") return { type: "loading" };
      return state;
    case "loading":
      if (event.type === "RESOLVE") return { type: "success", data: event.data };
      if (event.type === "REJECT") return { type: "error", message: event.message };
      if (event.type === "RESET") return { type: "idle" };
      return state;
    case "success":
      if (event.type === "FETCH") return { type: "loading" };
      if (event.type === "RESET") return { type: "idle" };
      return state;
    case "error":
      if (event.type === "FETCH") return { type: "loading" };
      if (event.type === "RESET") return { type: "idle" };
      return state;
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}`
    );

    console.log("🔁 작은 시뮬레이션을 돌려 봅니다.");
    let state: FetchState<string> = { type: "idle" };
    console.log("초기:", state);
    state = transition(state, { type: "FETCH" });
    console.log("FETCH 후:", state);
    state = transition(state, { type: "RESOLVE", data: "Hello, TS!" });
    console.log("RESOLVE 후:", state);
    state = transition(state, { type: "RESET" });
    console.log("RESET 후:", state);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. Discriminated Union + Narrowing 으로 안전한 처리
    // ========================================
    console.log("📌 4. Discriminated Union + Narrowing");
    console.log("- 공통 필드(type/status 등)에 대한 검사만으로,");
    console.log("  나머지 속성(data, message 등)에 안전하게 접근할 수 있습니다.");
    console.log("");

    function handleFetchState<T>(state: FetchState<T>): void {
        if (state.type === "success") {
            // 여기서는 state: { type: "success"; data: T }
            console.log("✅ 성공 상태, 데이터:", state.data);
        } else if (state.type === "error") {
            console.log("❌ 에러 상태:", state.message);
        } else {
            console.log("⏳ 진행 중 or idle:", state.type);
        }
    }

    f_printCodeBlock(
        "Discriminated Union + Narrowing",
        `function handleFetchState<T>(state: FetchState<T>): void {
  if (state.type === "success") {
    // state: { type: "success"; data: T }
    console.log("성공:", state.data);
  } else if (state.type === "error") {
    console.log("에러:", state.message);
  } else {
    console.log("진행 중 or idle:", state.type);
  }
}`
    );

    handleFetchState<string>({ type: "success", data: "OK" });
    handleFetchState<string>({ type: "error", message: "Oops" });
    handleFetchState<string>({ type: "loading" });
    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. 더 구체적인 상태머신 – Form Wizard 예제
    // ========================================
    console.log("📌 5. Form Wizard 상태머신 예제");
    console.log("- 3단계 회원가입 폼을 상태머신으로 표현해 보겠습니다.");
    console.log("- 각 단계마다 필요한 데이터와 유효성 여부를 포함합니다.");
    console.log("");

    type Step1Data = {
        email: string;
    };

    type Step2Data = {
        email: string;
        password: string;
    };

    type Step3Data = {
        email: string;
        password: string;
        termsAccepted: boolean;
    };

    type SignupState =
        | { step: "step1"; data: Step1Data }
        | { step: "step2"; data: Step2Data }
        | { step: "step3"; data: Step3Data }
        | { step: "completed"; userId: number };

    type SignupEvent =
        | { type: "NEXT_FROM_STEP1"; email: string }
        | { type: "NEXT_FROM_STEP2"; email: string; password: string }
        | { type: "NEXT_FROM_STEP3"; email: string; password: string; termsAccepted: boolean }
        | { type: "BACK_TO_STEP1" }
        | { type: "BACK_TO_STEP2" }
        | { type: "COMPLETE"; userId: number };

    function signupTransition(
        state: SignupState,
        event: SignupEvent
    ): SignupState {
        switch (state.step) {
            case "step1":
                switch (event.type) {
                    case "NEXT_FROM_STEP1":
                        return {
                            step: "step2",
                            data: { email: event.email, password: "" }
                        };
                    default:
                        return state;
                }
            case "step2":
                switch (event.type) {
                    case "BACK_TO_STEP1":
                        return {
                            step: "step1",
                            data: { email: state.data.email }
                        };
                    case "NEXT_FROM_STEP2":
                        return {
                            step: "step3",
                            data: {
                                email: event.email,
                                password: event.password,
                                termsAccepted: false
                            }
                        };
                    default:
                        return state;
                }
            case "step3":
                switch (event.type) {
                    case "BACK_TO_STEP2":
                        return {
                            step: "step2",
                            data: {
                                email: state.data.email,
                                password: state.data.password
                            }
                        };
                    case "NEXT_FROM_STEP3":
                        return {
                            step: "step3",
                            data: {
                                email: event.email,
                                password: event.password,
                                termsAccepted: event.termsAccepted
                            }
                        };
                    case "COMPLETE":
                        return {
                            step: "completed",
                            userId: event.userId
                        };
                    default:
                        return state;
                }
            case "completed":
                return state;
            default: {
                const _exhaustive: never = state;
                return _exhaustive;
            }
        }
    }

    f_printCodeBlock(
        "Signup Form Wizard 상태 타입 (요약)",
        `type SignupState =
  | { step: "step1"; data: Step1Data }
  | { step: "step2"; data: Step2Data }
  | { step: "step3"; data: Step3Data }
  | { step: "completed"; userId: number };

type SignupEvent =
  | { type: "NEXT_FROM_STEP1"; email: string }
  | { type: "NEXT_FROM_STEP2"; email: string; password: string }
  | { type: "NEXT_FROM_STEP3"; email: string; password: string; termsAccepted: boolean }
  | { type: "BACK_TO_STEP1" }
  | { type: "BACK_TO_STEP2" }
  | { type: "COMPLETE"; userId: number };`
    );

    console.log("🧪 간단 시뮬레이션 (step1 → step2 → step3 → completed)");
    let signupState: SignupState = {
        step: "step1",
        data: { email: "" }
    };
    console.log("초기:", signupState);
    signupState = signupTransition(signupState, {
        type: "NEXT_FROM_STEP1",
        email: "test@example.com"
    });
    console.log("step1 → step2:", signupState);
    signupState = signupTransition(signupState, {
        type: "NEXT_FROM_STEP2",
        email: "test@example.com",
        password: "1234"
    });
    console.log("step2 → step3:", signupState);
    signupState = signupTransition(signupState, {
        type: "COMPLETE",
        userId: 999
    });
    console.log("step3 → completed:", signupState);
    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. Discriminated Union의 장점 정리
    // ========================================
    console.log("📌 6. Discriminated Union의 장점 정리");
    console.log("- 1) 상태별로 필요한 필드를 강하게 제한할 수 있습니다.");
    console.log("     ex) success 상태에서만 data 사용 가능, error 에서만 message 사용 가능");
    console.log("- 2) switch / if 분기에서 누락된 case를 컴파일 타임에 잡을 수 있습니다.");
    console.log("- 3) 상태머신(State Machine)을 선언적으로 문서화할 수 있습니다.");
    console.log("- 4) 리팩토링(상태 추가/수정) 시 컴파일러가 도와줍니다.");
    console.log("");

    f_printCodeBlock(
        "Exhaustive Check 패턴 (never)",
        `function exhaustiveCheck(x: never): never {
  throw new Error("Unhandled case: " + x);
}

function handleState(s: FetchState<string>) {
  switch (s.type) {
    case "idle":
    case "loading":
    case "success":
    case "error":
      // TODO: 각 상태 처리
      break;
    default:
      exhaustiveCheck(s); // 새로운 상태를 추가하면 여기서 컴파일 에러 발생
  }
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ Discriminated Union으로 안전한 상태머신 만들기를 정리했습니다!");
    console.log("💡 핵심 포인트:");
    console.log('  - 공통 식별자 필드(status, type, step 등)를 기준으로 상태를 Union으로 묶기');
    console.log("  - switch / if 문에서 이 필드만 체크하면 나머지 필드는 자동 Narrowing");
    console.log("  - never + default 분기로 Exhaustive Check 패턴을 적용하면 누락된 상태를 컴파일 타임에 잡을 수 있음");
    console.log("  - 비동기 로딩, 폼 단계, 워크플로우 설계 등 다양한 곳에서 활용 가능");
    console.log("");
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
