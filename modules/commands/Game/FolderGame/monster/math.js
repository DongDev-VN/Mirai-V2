module.exports = {
    power: {
        basic: dataUser=>dataUser.hp + 4 * dataUser.atk + 3 * dataUser.def + 5 * dataUser.spd,
        sum: dataUser=>dataUser.hp + dataUser.weapon.HP + 4 * (dataUser.atk + dataUser.weapon.ATK) + 3 * (dataUser.def + dataUser.weapon.DEF) + 5 * (dataUser.spd + dataUser.weapon.SPD),
    },
};