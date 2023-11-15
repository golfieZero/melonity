const Weaver = {};
let positions = [];
let isActiveGame = GameRules.IsActiveGame();
let ultimate;
let localHero;
let imageHandle;


Weaver.OnGameStart = () => {
    isActiveGame = true;
};

Weaver.OnGameEnd = () => {
    isActiveGame = false;
    positions = []; // Clear positions when the game ends
};

Weaver.OnUpdate = () => {
    if (isActiveGame) {
        localHero = EntitySystem.GetLocalHero();
        if (EntitySystem.GetLocalHero().GetCurrentXP() >= 2440) {
            ultimate = true;
        }
    }
};

Weaver.OnDraw = () => {
    if (isActiveGame) {
        if (localHero == 'C_DOTA_Unit_Hero_Weaver') {
            if (Engine.OnceAt(0.05)) {
                const currentPos = localHero.GetAbsOrigin();
                positions.push(currentPos);
                if (positions.length >= 99) {
                    positions.shift();
                }
            }

            if (ultimate) {
                positions.forEach((pos, i) => {
                    const [x, y] = Renderer.WorldToScreen(new Vector(pos.x, pos.y, 0));
                    const nextPos = positions[i + 1];
                    if (nextPos) {
                        const [x1, y1] = Renderer.WorldToScreen(new Vector(nextPos.x, nextPos.y, 0));
                        Renderer.DrawLine(x, y, x1, y1);
                    }
                });

                const firstPos = positions[0];
                if (firstPos) {
                    const [firstX, firstY] = Renderer.WorldToScreen(new Vector(firstPos.x, firstPos.y, 0));
                    if (!imageHandle) {
                        imageHandle = localHero.GetImageIcon();
                    }
                    Renderer.DrawImage(imageHandle, firstX - 15, firstY - 10, 20, 20);
                }
            }
        }
    }
};

Renderer.SetDrawColor(255, 255, 255, 255);

RegisterScript(Weaver);
