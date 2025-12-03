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
    console.log(`${getRandomEmoji()} --- ${baseNoExt}: ${title} ---`);
    console.log('');

    console.log('TODO: 레슨 내용을 구현해주세요.');

    console.log('');
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);

    await f_pause(rl); // 레슨 내에서 독립적으로 일시정지
}
