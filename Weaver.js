const Weaver = {};
let positions = [];
let health = [];
let isActiveGame = GameRules.IsActiveGame();
let ultimate = false;
let localHero;
let imageHandle;
let font = Renderer.LoadFont('Arial', 28, Enum.FontWeight.NORMAL);


Weaver.OnGameStart = () => {
    isActiveGame = true;
};

Weaver.OnGameEnd = () => {
    isActiveGame = false;
    ultimate = false;
    positions = [];
};

Weaver.OnUpdate = () => {
    if (isActiveGame) {
        localHero = EntitySystem.GetLocalHero();
        if (localHero.GetCurrentXP() >= 2440) {
            ultimate = true;
        }
    }
};

Weaver.OnDraw = () => {
    if (isActiveGame && localHero.GetClassName() === 'C_DOTA_Unit_Hero_Weaver') {
        if (Engine.OnceAt(0.05)) {
            const currentPos = localHero.GetAbsOrigin();
            positions.push(currentPos);
            health.push(localHero.GetHealth())
            if (positions.length > 95) {
                positions.shift();
                health.shift();
            }
        }

        if (ultimate && positions.length > 1) {
            positions.forEach((pos, i) => {
                const [x, y] = Renderer.WorldToScreen(new Vector(pos.x, pos.y, 128));
                const nextPos = positions[i + 1];
                if (nextPos) {
                    Renderer.SetDrawColor(0, 255, 255, 255);
                    const [x1, y1] = Renderer.WorldToScreen(new Vector(nextPos.x, nextPos.y, 128));
                    Renderer.DrawLine(x, y, x1, y1);
                }
            });

            const firstPos = positions[0];
            const nextHp = health[0];
            if (firstPos) {
                Renderer.SetDrawColor(255, 255, 255, 255);
                const [firstX, firstY] = Renderer.WorldToScreen(new Vector(firstPos.x, firstPos.y, 128));
                if (nextHp > localHero.GetMaxHealth() * 0.5) {
                    Renderer.DrawText(font, firstX + 5, firstY - 15, '✓')
                }
                if (!imageHandle) {
                    imageHandle = localHero.GetImageIcon();
                }
                Renderer.DrawImage(imageHandle, firstX - 15, firstY - 10, 20, 20);
            }
        }
    }
};

RegisterScript(Weaver);
