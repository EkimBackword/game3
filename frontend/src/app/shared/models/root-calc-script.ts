import lodash from 'lodash';

const _FactionList = [
    // База
    { id: 1, name: 'Коты', value: 10 },
    { id: 2, name: 'Птицы', value: 7 },
    { id: 3, name: 'Мыши', value: 3 },
    { id: 4, name: 'Бродяга', value: 5 },
    // Речное братство
    { id: 5, name: 'Бобры', value: 5 },
    { id: 6, name: 'Ящирицы', value: 2 },
    // Подземный мир
    { id: 7, name: 'Кроты', value: 8 },
    { id: 8, name: 'Вороны', value: 3 },
    // Мародёры
    { id: 9, name: 'Крысы', value: 9 },
    { id: 10, name: 'Бурундуки', value: 8 },
];

const _HirelingsList = [
    // База
    { id: 1, name: 'Коты' },
    { id: 2, name: 'Птицы' },
    { id: 3, name: 'Мыши' },
    { id: 4, name: 'Бродяга' },
    // Речное братство
    { id: 5, name: 'Бобры' },
    { id: 6, name: 'Ящирицы' },
    { id: 11, name: 'Бандиты (new)' },
    // Подземный мир
    { id: 7, name: 'Кроты' },
    { id: 8, name: 'Вороны' },
    { id: 12, name: 'Заступник (new)' },
    // Мародёры
    { id: 9, name: 'Крысы' },
    { id: 10, name: 'Бурундуки' },
    { id: 13, name: 'Музыканты (new)' },
];

function calcCombination(): void {
    console.log({
        p2: getCombos({
            maxLevel: 2,
            maxTotal: 17,
        }).sort((a, b) => b.total - a.total),
        p3: getCombos({
            maxLevel: 3,
            maxTotal: 18,
        }).sort((a, b) => b.total - a.total),
    });
}

function getCombos({
    maxLevel,
    maxTotal,
    factions = [],
    factionList = _FactionList,
    level = 0,
}: {
    maxLevel: number;
    maxTotal: number;
    factions?: any[];
    factionList?: any[];
    level?: number;
}) {
    if (level < maxLevel) {
        return factionList.flatMap((faction, index1) => {
            return getCombos({
                factions: [...factions, faction],
                factionList: factionList.filter((_, index2) => index2 > index1 ),
                level: level + 1,
                maxLevel,
                maxTotal,
            })
        })
    }
    const factionsIds = factions.map(p => p.id);
    const factionsValues = factions.map(p => p.value);
    const factionsNames = factions.map(p => p.name);
    const total = lodash.sum(factionsValues);
    if (total < maxTotal) {
        return [];
    }

    const combo = {
        total,
        factions,
        name: factionsNames.join(' | '),
        hirelings: _HirelingsList.filter(p => !factionsIds.includes(p.id)),
    };
    if (_HirelingsList.length > 0 && combo.hirelings.length < 3) {
        return [];
    }
    return [combo];
}
