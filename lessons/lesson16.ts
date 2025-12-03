// lesson16.ts
// ===============================
// 레슨 실행 함수 - 클래스(Class) – 생성자, 접근 제한자, 상속
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
    // 1. 가장 기본적인 클래스와 생성자
    // ========================================
    console.log("📌 1. 가장 기본적인 클래스와 생성자");

    class Person {
        name: string;
        age: number;

        constructor(name: string, age: number) {
            this.name = name;
            this.age = age;
        }

        introduce(): void {
            console.log(`안녕하세요, 저는 ${this.name}이고, 나이는 ${this.age}살 입니다.`);
        }
    }

    f_printCodeBlock(
        "기본 클래스 & 생성자 예제",
        `class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    introduce(): void {
        console.log(\`안녕하세요, 저는 \${this.name}이고, 나이는 \${this.age}살 입니다.\`);
    }
}

const p1 = new Person("Joshua", 53);
p1.introduce();`
    );

    console.log("");
    const p1 = new Person("Joshua", 53);
    p1.introduce();

    await f_pause(rl);

    // ========================================
    // 2. 생성자 파라미터 속성(Shorthand)
    // ========================================
    console.log("📌 2. 생성자 파라미터 속성(Shorthand)");

    class SimplePerson {
        // 생성자 파라미터에 접근 제한자를 붙이면 자동으로 필드 선언 + 초기화
        constructor(public name: string, public age: number) { }

        sayHello(): void {
            console.log(`👋 안녕하세요, ${this.name} (${this.age}) 입니다.`);
        }
    }

    f_printCodeBlock(
        "생성자 파라미터 Shorthand",
        `class SimplePerson {
    constructor(public name: string, public age: number) {
        // this.name, this.age 필드 자동 선언 + 할당
    }

    sayHello(): void {
        console.log(\`👋 안녕하세요, \${this.name} (\${this.age}) 입니다.\`);
    }
}

const sp = new SimplePerson("Alice", 30);
sp.sayHello();`
    );

    const sp = new SimplePerson("Alice", 30);
    sp.sayHello();

    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. 접근 제한자 – public / private / protected / readonly
    // ========================================
    console.log("📌 3. 접근 제한자 – public / private / protected / readonly");

    class Account {
        public owner: string;          // 어디서나 접근 가능
        private balance: number;       // 클래스 내부에서만 접근 가능
        protected readonly id: string; // 하위 클래스까지 접근 가능, 읽기 전용

        constructor(owner: string, id: string, initialBalance: number) {
            this.owner = owner;
            this.id = id;
            this.balance = initialBalance;
        }

        public deposit(amount: number): void {
            if (amount <= 0) return;
            this.balance += amount;
            console.log(`💰 입금 완료! 현재 잔액: ${this.balance} 원`);
        }

        public getBalance(): number {
            return this.balance;
        }

        protected getMaskedId(): string {
            // ID 일부만 보여주는 메서드 (하위 클래스에서 사용 가능)
            return this.id.slice(0, 3) + "***";
        }
    }

    const acc = new Account("Joshua", "ACC-12345", 100_000);
    acc.deposit(50_000);
    console.log("조회된 잔액:", acc.getBalance());
    // acc.balance  // ❌ private 이라서 외부에서 접근 불가

    f_printCodeBlock(
        "접근 제한자 예제",
        `class Account {
    public owner: string;
    private balance: number;
    protected readonly id: string;

    constructor(owner: string, id: string, initialBalance: number) {
        this.owner = owner;
        this.id = id;
        this.balance = initialBalance;
    }

    public deposit(amount: number): void {
        if (amount <= 0) return;
        this.balance += amount;
        console.log(\`입금! 현재 잔액: \${this.balance}\`);
    }

    public getBalance(): number {
        return this.balance;
    }

    protected getMaskedId(): string {
        return this.id.slice(0, 3) + "***";
    }
}`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. 상속(Inheritance) – extends, super
    // ========================================
    console.log("📌 4. 상속(Inheritance) – extends, super");

    class SavingsAccount extends Account {
        private interestRate: number; // 이자율 (%)

        constructor(owner: string, id: string, initialBalance: number, interestRate: number) {
            super(owner, id, initialBalance); // 부모 생성자 호출
            this.interestRate = interestRate;
        }

        public addInterest(): void {
            const current = this.getBalance();
            const interest = Math.floor((current * this.interestRate) / 100);
            this.deposit(interest);
            console.log(`📈 이자(${this.interestRate}%) 지급: ${interest} 원`);
            console.log(`계좌 ID(마스킹): ${this.getMaskedId()}`);
        }
    }

    const sa = new SavingsAccount("Joshua", "SAV-90001", 500_000, 3);
    sa.addInterest();

    f_printCodeBlock(
        "상속 & super 예제",
        `class SavingsAccount extends Account {
    private interestRate: number;

    constructor(owner: string, id: string, initialBalance: number, interestRate: number) {
        super(owner, id, initialBalance); // 부모 생성자
        this.interestRate = interestRate;
    }

    public addInterest(): void {
        const current = this.getBalance();
        const interest = Math.floor((current * this.interestRate) / 100);
        this.deposit(interest);
        console.log(\`이자(\${this.interestRate}%) 지급: \${interest} 원\`);
        console.log(\`계좌 ID(마스킹): \${this.getMaskedId()}\`);
    }
}

const sa = new SavingsAccount("Joshua", "SAV-90001", 500_000, 3);
sa.addInterest();`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. 메서드 오버라이딩(Overriding)
    // ========================================
    console.log("📌 5. 메서드 오버라이딩(Overriding)");

    class Animal {
        constructor(public name: string) { }

        speak(): void {
            console.log(`동물(${this.name})이(가) 소리를 냅니다.`);
        }
    }

    class Dog extends Animal {
        speak(): void {
            // 부모 기능을 확장하고 싶을 때 super.speak() 호출 가능
            console.log(`🐶 ${this.name}: 멍멍!`);
        }
    }

    class Cat extends Animal {
        speak(): void {
            console.log(`🐱 ${this.name}: 야옹~`);
        }
    }

    const d = new Dog("초코");
    const c = new Cat("나비");

    d.speak();
    c.speak();

    f_printCodeBlock(
        "메서드 오버라이딩 예제",
        `class Animal {
    constructor(public name: string) {}

    speak(): void {
        console.log(\`동물(\${this.name})이(가) 소리를 냅니다.\`);
    }
}

class Dog extends Animal {
    speak(): void {
        console.log(\`🐶 \${this.name}: 멍멍!\`);
    }
}

class Cat extends Animal {
    speak(): void {
        console.log(\`🐱 \${this.name}: 야옹~\`);
    }
}

const d = new Dog("초코");
const c = new Cat("나비");

d.speak(); // 🐶 초코: 멍멍!
c.speak(); // 🐱 나비: 야옹~`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. 다형성(Polymorphism) – 상속 + 동일 인터페이스
    // ========================================
    console.log("📌 6. 다형성(Polymorphism) – 상속 기반");

    function makeAllSpeak(animals: Animal[]): void {
        animals.forEach((a) => a.speak());
    }

    const animals: Animal[] = [
        new Dog("멍돌이"),
        new Cat("냥이"),
        new Animal("???")
    ];

    makeAllSpeak(animals);

    f_printCodeBlock(
        "다형성 예제",
        `function makeAllSpeak(animals: Animal[]): void {
    animals.forEach((a) => a.speak());
}

const animals: Animal[] = [
    new Dog("멍돌이"),
    new Cat("냥이"),
    new Animal("???"),
];

makeAllSpeak(animals);`
    );

    console.log("");
    await f_pause(rl);

    // ========================================
    // 7. static 필드/메서드 & 인스턴스 필드 구분
    // ========================================
    console.log("📌 7. static 필드/메서드 & 인스턴스 필드 구분");

    class MathUtil {
        static readonly PI = 3.14159;

        static circleArea(radius: number): number {
            return this.PI * radius * radius;
        }
    }

    const area = MathUtil.circleArea(10);

    f_printCodeBlock(
        "static 필드/메서드 예제",
        `class MathUtil {
    static readonly PI = 3.14159;

    static circleArea(radius: number): number {
        return this.PI * radius * radius;
    }
}

const area = MathUtil.circleArea(10);`
    );

    console.log("원 넓이 (r=10):", area);
    console.log("");
    console.log("💡 static:");
    console.log("   - 인스턴스가 아니라 '클래스 자체'에 속하는 값/함수");
    console.log("   - 공용 상수, 유틸리티 함수 등에 많이 사용");
    console.log("");
    await f_pause(rl);

    // ========================================
    // 8. 정리 – 클래스 기본 문법 요약
    // ========================================
    console.log("📌 8. 정리 – 클래스 기본 문법 요약");

    f_printCodeBlock(
        "클래스 핵심 포인트 정리",
        `// 클래스(Class) 핵심 문법
// - constructor: 인스턴스 생성 시 초기화 로직
// - 접근 제한자: public / private / protected / readonly
// - 상속: class Child extends Parent { ... }
// - super(): 부모 생성자/메서드 호출
// - 오버라이딩: 같은 메서드 이름으로 자식에서 재정의
// - static: 인스턴스가 아닌, 클래스 자체에 속하는 멤버`
    );

    console.log("✅ 클래스(Class)의 생성자, 접근 제한자, 상속의 기본기를 정리했습니다.");
    console.log("💡 Tip:");
    console.log("   - 도메인 모델(사용자, 계좌, 주문 등)을 표현할 때 클래스가 직관적일 수 있습니다.");
    console.log("   - 하지만 TS에서는 '클래스 + 인터페이스'와 '함수형 스타일 + 타입'을 적절히 혼합해서 사용하는 경우가 많습니다.");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
