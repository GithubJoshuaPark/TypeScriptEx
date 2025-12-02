// ===============================
// 레슨 실행 함수
// ===============================
import * as readline from "node:readline";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import { getRandomEmoji, f_pause } from "../utils.js";

export async function run(rl: readline.Interface, title: string): Promise<void> {
    let filePath = `${basename(fileURLToPath(import.meta.url))}`;
    let baseNoExt = basename(filePath, '.js');
    console.log(`${getRandomEmoji()} --- ${baseNoExt}:${title} ---`);
    console.log('');

    const message: string = "TypeScript 학습을 시작합니다 🚀";
    const year: number = 2025;
    const isFun: boolean = true;

    console.log("message:", message);
    console.log("year:", year);
    console.log("isFun:", isFun);

    console.log('');
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);

    await f_pause(rl); // 레슨 내에서 독립적으로 일시정지
}
