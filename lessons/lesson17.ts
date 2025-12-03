// lesson17.ts
// ===============================
// 레슨 실행 함수 - 클래스 + 인터페이스 implements 적용 예제
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
    // 1. 인터페이스를 클래스의 계약(contract)으로 사용
    // ========================================
    console.log("📌 1. 인터페이스를 클래스의 계약(contract)으로 사용합니다.");
    console.log("- 클래스가 반드시 가져야 할 메서드/속성을 인터페이스로 규정할 수 있습니다.");
    console.log("");

    interface Drivable {
        speed: number;
        drive(): void;
    }

    class Car implements Drivable {
        speed: number;

        constructor(speed: number) {
            this.speed = speed;
        }

        drive(): void {
            console.log(`🚗 자동차가 시속 ${this.speed}km/h 로 달립니다.`);
        }
    }

    f_printCodeBlock(
        "인터페이스 implements 기본 예제",
        `interface Drivable {
    speed: number;
    drive(): void;
}

class Car implements Drivable {
    constructor(public speed: number) {}

    drive(): void {
        console.log(\`🚗 자동차가 시속 \${this.speed}km/h 로 달립니다.\`);
    }
}

const myCar = new Car(120);
myCar.drive();`
    );

    const myCar = new Car(120);
    myCar.drive();

    console.log("");
    await f_pause(rl);

    // ========================================
    // 2. 여러 개의 인터페이스를 implements
    // ========================================
    console.log("📌 2. 여러 인터페이스를 implements 할 수도 있습니다.");

    interface Flyable {
        fly(): void;
    }

    class Drone implements Drivable, Flyable {
        constructor(public speed: number) { }

        drive(): void {
            console.log(`🤖 드론이 지면에서 시속 ${this.speed}km/h 로 이동합니다.`);
        }

        fly(): void {
            console.log(`🛸 드론이 공중으로 날아오릅니다!`);
        }
    }

    f_printCodeBlock(
        "여러 인터페이스 implements 예제",
        `interface Drivable {
    speed: number;
    drive(): void;
}

interface Flyable {
    fly(): void;
}

class Drone implements Drivable, Flyable {
    constructor(public speed: number) {}

    drive(): void {
        console.log(\`🤖 드론이 시속 \${this.speed}km/h 로 이동합니다.\`);
    }

    fly(): void {
        console.log("🛸 드론이 공중으로 날아오릅니다!");
    }
}

const drone = new Drone(40);
drone.drive();
drone.fly();`
    );

    const drone = new Drone(40);
    drone.drive();
    drone.fly();

    console.log("");
    await f_pause(rl);

    // ========================================
    // 3. 인터페이스 확장 + 클래스 implements
    // ========================================
    console.log("📌 3. 인터페이스 확장 + 클래스 implements");

    interface Vehicle {
        brand: string;
    }

    interface Electric extends Vehicle {
        battery: number;
        charge(amount: number): void;
    }

    class Tesla implements Electric {
        constructor(public brand: string, public battery: number) { }

        charge(amount: number): void {
            this.battery = Math.min(100, this.battery + amount);
            console.log(`🔋 충전됨! 현재 배터리: ${this.battery}%`);
        }
    }

    f_printCodeBlock(
        "인터페이스 확장 + 클래스 implements 예제",
        `interface Vehicle {
    brand: string;
}

interface Electric extends Vehicle {
    battery: number;
    charge(amount: number): void;
}

class Tesla implements Electric {
    constructor(public brand: string, public battery: number) {}

    charge(amount: number): void {
        this.battery = Math.min(100, this.battery + amount);
        console.log(\`🔋 충전됨! 현재 배터리: \${this.battery}%\`);
    }
}

const car = new Tesla("Tesla", 50);
car.charge(30);`
    );

    const myTesla = new Tesla("Tesla", 50);
    myTesla.charge(30);

    console.log("");
    await f_pause(rl);

    // ========================================
    // 4. 클래스 내부 private/protected 필드와 인터페이스의 관계
    // ========================================
    console.log("📌 4. 인터페이스는 public 멤버만 요구합니다.");
    console.log("- private 또는 protected 멤버는 인터페이스의 요구 사항과 무관합니다.");
    console.log("");

    interface UserInfo {
        id: number;
        name: string;
        getInfo(): string;
    }

    class User implements UserInfo {
        private secretKey = "SECRET-001"; // 인터페이스는 요구하지 않음

        constructor(public id: number, public name: string) { }

        getInfo(): string {
            return `👤 사용자: ${this.name} (#${this.id})`;
        }
    }

    f_printCodeBlock(
        "private 필드는 인터페이스 요구에 포함되지 않음",
        `interface UserInfo {
    id: number;
    name: string;
    getInfo(): string;
}

class User implements UserInfo {
    private secretKey = "SECRET-001";  // 인터페이스 요구 X

    constructor(public id: number, public name: string) {}

    getInfo(): string {
        return \`사용자: \${this.name} (#\${this.id})\`;
    }
}`
    );

    const u1 = new User(1, "Joshua");
    console.log(u1.getInfo());

    console.log("");
    await f_pause(rl);

    // ========================================
    // 5. 실전 – 서비스 클래스 설계에 인터페이스 활용하기
    // ========================================
    console.log("📌 5. 실전 예제 – 서비스 클래스 설계에 인터페이스 활용하기");

    interface StorageService<T> {
        save(item: T): void;
        findById(id: number): T | undefined;
        findAll(): T[];
    }

    type Product = {
        id: number;
        name: string;
    };

    class MemoryStorage<T extends { id: number }> implements StorageService<T> {
        private data: T[] = [];

        save(item: T): void {
            this.data.push(item);
        }

        findById(id: number): T | undefined {
            return this.data.find((item) => item.id === id);
        }

        findAll(): T[] {
            return [...this.data];
        }
    }

    f_printCodeBlock(
        "인터페이스 기반 서비스 설계 예제",
        `interface StorageService<T> {
    save(item: T): void;
    findById(id: number): T | undefined;
    findAll(): T[];
}

type Product = {
    id: number;
    name: string;
};

class MemoryStorage<T extends { id: number }> implements StorageService<T> {
    private data: T[] = [];

    save(item: T): void {
        this.data.push(item);
    }

    findById(id: number): T | undefined {
        return this.data.find((item) => item.id === id);
    }

    findAll(): T[] {
        return [...this.data];
    }
}

const store = new MemoryStorage<Product>();
store.save({ id: 1, name: "노트북" });
store.save({ id: 2, name: "마우스" });

store.findById(1);`
    );

    const productStore = new MemoryStorage<Product>();
    productStore.save({ id: 1, name: "노트북" });
    productStore.save({ id: 2, name: "마우스" });

    console.log("findAll:", productStore.findAll());
    console.log("findById(1):", productStore.findById(1));

    console.log("");
    await f_pause(rl);

    // ========================================
    // 6. 다형성 – 같은 인터페이스를 구현한 여러 클래스 교체 가능
    // ========================================
    console.log("📌 6. 다형성 – 같은 인터페이스를 구현하면 교체가 쉽습니다.");
    console.log("- 시스템의 유연성과 확장성을 크게 높일 수 있습니다.");
    console.log("");

    class FileStorage<T extends { id: number }> implements StorageService<T> {
        private data: T[] = [];

        save(item: T): void {
            console.log("💾 File 저장:", item);
            this.data.push(item);
        }

        findById(id: number): T | undefined {
            return this.data.find((item) => item.id === id);
        }

        findAll(): T[] {
            return [...this.data];
        }
    }

    f_printCodeBlock(
        "다형성 예제",
        `let storage: StorageService<Product>;

storage = new MemoryStorage<Product>();
storage.save({ id: 3, name: "키보드" });

storage = new FileStorage<Product>();
storage.save({ id: 4, name: "모니터" });`
    );

    let storage: StorageService<Product>;

    storage = new MemoryStorage<Product>();
    storage.save({ id: 3, name: "키보드" });

    storage = new FileStorage<Product>();
    storage.save({ id: 4, name: "모니터" });

    console.log("");
    await f_pause(rl);

    // ========================================
    // 마무리
    // ========================================
    console.log("✅ 클래스 + 인터페이스 implements 패턴을 완벽히 이해했습니다!");
    console.log("");
    console.log("💡 핵심 요약:");
    console.log("  - 인터페이스는 클래스가 따라야 하는 '규약'");
    console.log("  - 클래스는 implements로 인터페이스의 요구 사항을 반드시 충족해야 함");
    console.log("  - 여러 인터페이스 implements 가능");
    console.log("  - 인터페이스 확장(extends) + 클래스 구현 패턴은 실무에서 매우 흔함");
    console.log("  - 다형성(Polymorphism)을 통해 시스템 교체/확장 용이");
    console.log("");

    console.log(`${getRandomEmoji()} 레슨을 완료했습니다!`);
    await f_pause(rl);
}
