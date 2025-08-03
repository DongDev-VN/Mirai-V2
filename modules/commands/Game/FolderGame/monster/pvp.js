/*const player1 = {
    HP: 100,
    ATK: 10,
    DEF: 5,
    SPD: 20,
    Mana: 1
};

const player2 = {
    HP: 100,
    ATK: 15,
    DEF: 5,
    SPD: 20,
    Mana: 1
};
*/
const fight = players=>{
    let [player1, player2] = players.map($=>({
            HP:  ($.hp + $.weapon.HP) * $.weapon.hpBonus,
            ATK:  ($.atk + $.weapon.ATK) * $.weapon.dmgBonus,
            DEF:  ($.def + $.weapon.DEF) * $.weapon.defBonus,
            SPD:  ($.spd + $.weapon.SPD) * $.weapon.spdBonus,
            AP: $.weapon.ArmorPiercing,
            Mana: 1
        }));if (!player2)player2 = {
    HP: 100,
    ATK: 15,
    DEF: 5,
    SPD: 20,
    Mana: 1
};
    var log = [];
    var turn = 0;
    var player1Turns = Math.floor(player1.SPD / player2.SPD);
    var player2Turns = Math.floor(player2.SPD / player1.SPD);

    const getFirstAttack = () => {
        if (player1.SPD >= player2.SPD) {
            return "player1";
        } else {
            return "player2";
        }
    };

    const getDamageMultiplier = (attacker) => {
        if (attacker.Mana >= 100) {
            attacker.Mana = 0;
            return 1.5;
        } else {
            return 1;
        }
    };

    const calculateDamage = (attacker, defender) => {
        var damageMultiplier = getDamageMultiplier(attacker);
        var reducedDef = defender.DEF * attacker.AP;
        var damage = Math.max((attacker.ATK - reducedDef) * damageMultiplier, 1);
        reducedDef = attacker.ATK - damage
        return {
            damage: Math.round(damage),
            defender: reducedDef
        }
    };

    let currentTurn = getFirstAttack();

    while (player1.HP > 0 && player2.HP > 0) {

        const attacker =
        currentTurn === "player1" ? player1: player2;
        const defender =
        currentTurn === "player1" ? player2: player1;

        if (currentTurn === "player1") {
            player1.Mana += 25;
        } else {
            player2.Mana += 25;
        }
        const data = calculateDamage(attacker, defender);
        const damage = data.damage;
        const defenderDef = data.defender;
        defender.HP -= damage;

        const logEntry = {
            turn: turn,
            player1: {
                ...player1
            },
            player2: {
                ...player2
            },
            damage: damage,
            defenderDef: defenderDef,
            attacker: currentTurn === "player1" ? "player1": "player2",
            skill: attacker.Mana == 0 ? "skill": "normal"
        };
        log.push(logEntry);
        turn++;

        if (currentTurn === "player1") {
            player1Turns = player1Turns - 1;
            if (player1Turns <= 0) {
                currentTurn = "player2";
                player1Turns = 0
                player2Turns = Math.floor(player2.SPD / player1.SPD);
                if (player2Turns <= 0) player2Turns = 1;
            }
        } else {
            player2Turns = player2Turns - 1;
            if (player2Turns <= 0) {
                currentTurn = "player1";
                player2Turns = 0;
                player1Turns = Math.floor(player1.SPD / player2.SPD);
                if (player1Turns <= 0) player1Turns = 1;
            }
        }
    }
    if (player1.HP <= 0) {
        return {
            winner: "player2",
            log: log,
            player2: player2
        }
    } else {
        return {
            winner: "player1",
            log: log,
            player1: player1
        }
    }
};
/*
const result = fight(player1, player2);
console.log(JSON.stringify(result,0,4));
*/
module.exports = fight;