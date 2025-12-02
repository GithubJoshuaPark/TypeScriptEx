#!/usr/bin/env bash
set -euo pipefail

# ###############################
# 📁 lessons 폴더 생성
# ###############################
echo "🚀 JavaScript 레슨 파일 생성 스크립트 시작..."
echo ""

# lessons 폴더가 없으면 생성
if [ ! -d "lessons" ]; then
    echo "📁 lessons 폴더를 생성합니다..."
    mkdir -p lessons
else
    echo "✅ lessons 폴더가 이미 존재합니다."
fi

echo ""

# ###############################
# 📝 레슨 파일 생성 (lesson01.js ~ lesson30.js)
# ###############################
echo "📝 레슨 파일을 생성합니다..."
echo ""

created_count=0
skipped_count=0

for i in $(seq 1 30); do
    # 숫자를 두 자리로 포맷팅 (01, 02, ..., 30)
    lesson_num=$(printf "%02d" $i)
    filename="lessons/lesson${lesson_num}.ts"

    # 파일이 이미 존재하는지 확인
    if [ -f "$filename" ]; then
        echo "⏭️  $filename - 이미 존재합니다. 건너뜁니다."
        ((skipped_count++))
    else
        # 파일 생성 및 기본 템플릿 작성
        cat > "$filename" << 'EOF'
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

    console.log('TODO: 레슨 내용을 구현해주세요.');

    console.log('');
    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);

    await f_pause(rl); // 레슨 내에서 독립적으로 일시정지
}
EOF
        echo "✅ $filename - 생성 완료!"
        ((created_count++))
    fi
done

echo ""
echo "======================================"
echo "📊 레슨 파일 생성 결과"
echo "======================================"
echo "✅ 새로 생성된 파일: ${created_count}개"
echo "⏭️  건너뛴 파일: ${skipped_count}개"
echo "📁 총 파일 수: 30개"
echo "======================================"
echo ""
echo "🎉 모든 작업이 완료되었습니다!"