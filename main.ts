import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { getRandomEmoji, f_pause } from "./utils.js";

interface LessonMeta {
    id: number;
    title: string;
}

const lessonsMeta: LessonMeta[] = [
    { id: 1, title: "Hello TypeScript – ts-node 환경에서 첫 출력하기" },
    { id: 2, title: "타입 선언 기초 – number, string, boolean, any 실습" },
    { id: 3, title: "타입 추론(Type Inference) 이해하기" },
    { id: 4, title: "배열 & 튜플 타입 선언하기" },
    { id: 5, title: "객체 타입(Object Types) 기초 만들기" },
    { id: 6, title: "함수 타입 정의 – parameter / return 타입 지정" },
    { id: 7, title: "Union 타입 & Literal 타입 활용 예제" },
    { id: 8, title: "Type Alias(타입 별칭) 활용하기" },
    { id: 9, title: "Enum 사용법 – 상수 그룹 정의하기" },
    { id: 10, title: "Interface 기본 사용 – 구조적 타입 시스템 이해" },
    { id: 11, title: "Interface 확장 & Intersection Types(교차 타입)" },
    { id: 12, title: "Optional / Readonly / readonly 배열 다루기" },
    { id: 13, title: "Narrowing – 타입 좁히기 (typeof, in, instanceof)" },
    { id: 14, title: "Generic 함수 만들기 (기초)" },
    { id: 15, title: "Generic Interface & Generic Type Alias" },
    { id: 16, title: "클래스(Class) – 생성자, 접근 제한자, 상속" },
    { id: 17, title: "클래스 + 인터페이스 implements 적용 예제" },
    { id: 18, title: "타입 가드(Type Guard) 직접 구현하기" },
    { id: 19, title: "유틸리티 타입(Partial, Pick, Omit, Record)" },
    { id: 20, title: "Mapped Types – 재활용 타입 만들기" },
    { id: 21, title: "Conditional Types – 삼항 타입 활용하기" },
    { id: 22, title: "infer 키워드로 타입 추론 제어하기" },
    { id: 23, title: "Template Literal Types – 문자열 기반 타입 생성" },
    { id: 24, title: "Discriminated Union으로 안전한 상태머신 만들기" },
    { id: 25, title: "Deep Readonly, Deep Partial 직접 구현하기" },
    { id: 26, title: "타입 안전한 API Client 만들기 (Fetch + TS)" },
    { id: 27, title: "타입 안전한 Form Model 설계하기 (React 예제)" },
    { id: 28, title: "Node.js + TypeScript 프로젝트 구조 설계" },
    { id: 29, title: "tsconfig 고급 옵션 이해 (paths, baseUrl, strict)" },
    { id: 30, title: "TypeScript로 라이브러리/SDK 개발하기 (d.ts 포함)" }
];

function showMenu(): void {
    console.clear();
    console.log("====================================");
    console.log(`${getRandomEmoji()} TypeScriptEx – Lesson Menu`);
    console.log("====================================\n");

    for (const meta of lessonsMeta) {
        console.log(`${getRandomEmoji()} ${meta.id.toString().padStart(2, "0")}. ${meta.title}`);
    }

    console.log("\n q | Q to quit");
    console.log("------------------------------------");
}

async function runLessonById(rl: readline.Interface, id: number): Promise<void> {
    const meta = lessonsMeta.find((m) => m.id === id);
    if (!meta) {
        console.log("⚠️ 유효하지 않은 번호입니다.");
        return;
    }

    const fileName = `lesson${id.toString().padStart(2, "0")}.js`;
    const modulePath = `./lessons/${fileName}`;

    try {
        const lessonModule = (await import(modulePath)) as {
            run?: (rl: readline.Interface, title: string) => unknown | Promise<unknown>;
        };

        if (typeof lessonModule.run === "function") {
            console.log(`\n[실행] ${id}. ${meta.title}\n`);
            await lessonModule.run(rl, meta.title);
        } else {
            console.log("⚠️ 이 lesson 파일에 run() 함수가 없습니다.");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("❌ lesson 모듈을 불러오는 중 오류 발생:", error.message);
        } else {
            console.error("❌ 알 수 없는 오류:", error);
        }
    }
}

function ask(rl: readline.Interface, query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, (answer) => resolve(answer));
    });
}

async function main(): Promise<void> {
    const rl = readline.createInterface({ input, output });

    while (true) {
        showMenu();

        const answer = await ask(rl, "\n실행할 레슨 번호를 입력하세요 (q 또는 Q: 종료): ");
        const trimmed = answer.trim().toLowerCase();

        if (trimmed === "q" || trimmed === "quit" || trimmed === "exit") {
            console.log("\n👋 수고 많으셨습니다. TypeScriptEx를 종료합니다.\n");
            rl.close();
            break;
        }

        const num = Number(trimmed);
        if (!Number.isInteger(num)) {
            console.log("\n⚠️ 숫자 또는 Q를 입력해 주세요.\n");
            await f_pause(rl);
            continue;
        }

        await runLessonById(rl, num);
    }

    rl.close();
}

void main();
