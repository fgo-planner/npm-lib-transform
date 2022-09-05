import { Array2D } from '@fgo-planner/common-types';
import { MasterServantUpdateIndeterminateValue as IndeterminateValue } from '@fgo-planner/transform-types';
import { FgoManagerParsers } from '../../src/fgo-manager';
import { LoggerMessageLevel } from '../../src/logger';
import { Rarity1TestServant, Rarity2TestServant, Rarity5TestServant } from '../resources/game-servant-test-data';
import { TestLogger } from '../test-logger';

describe('parseRosterSheet', () => {

    const gameServantNameMap = {
        'Arash': Rarity1TestServant,
        'Chen Gong': Rarity2TestServant,
        'Space Ishtar': Rarity5TestServant
    };

    /* eslint-disable max-len */
    const topRow = ['General Information', '', '', '', '', 'Deck', '', '', '', '', '', 'NP', '', '', 'Levels', '', 'Skills', '', '', 'Fou', '', 'Bond', '', 'Extra'];
    const headerRow = ['Name', 'R', 'Class', 'Attr.', 'Availability', 'C1', 'C2', 'C3', 'C4', 'C5', 'isMaxAscended', 'Type', 'Target', 'Damage', 'NP', 'Level', '1', '2', '3', 'HP', 'ATK', 'Bond', 'BP', 'Acquisition'];
    const spaceIshtarRow = ['Space Ishtar', '5*', 'Avenger', 'Star', 'Limited', 'B', 'B', 'A', 'A', 'Q', 'TRUE', 'Arts', 'AoE', '52341', 'NP5', 'Lv. 90', '10', '10', '10', '1000', '1000', '6', '', '2021. 10. 18.'];
    /* eslint-enable max-len */


    // TODO Add logger to tests

    it('should log error and return empty result if given an empty input', () => {

        const data: Array2D<string> = [];

        const logger = new TestLogger();

        const result = FgoManagerParsers.parseRosterSheet(data, gameServantNameMap, logger);

        expect(result.length).toStrictEqual(0);

        expect(logger.messages.length).toBeGreaterThanOrEqual(1);
        const message = logger.findMessage(LoggerMessageLevel.Error, 'Header is missing or invalid');
        expect(message).toBeDefined();
    });

    it('should log error and return empty result if data is missing header', () => {

        const data = [
            topRow,
            spaceIshtarRow
        ];

        const logger = new TestLogger();

        const result = FgoManagerParsers.parseRosterSheet(data, gameServantNameMap, logger);

        expect(result.length).toStrictEqual(0);

        expect(logger.messages.length).toBeGreaterThanOrEqual(1);
        const message = logger.findMessage(LoggerMessageLevel.Error, 'could not be found');
        expect(message).toBeDefined();
    });

    it('should log warning and return empty result if data contains no servants', () => {

        const data = [
            topRow,
            headerRow
        ];

        const logger = new TestLogger();

        const result = FgoManagerParsers.parseRosterSheet(data, gameServantNameMap, logger);

        expect(result.length).toStrictEqual(0);

        expect(logger.messages.length).toBeGreaterThanOrEqual(1);
        const message = logger.findMessage(LoggerMessageLevel.Warn, 'Data does not contain any servant');
        expect(message).toBeDefined();
    });

    it('should return servants if data is valid', () => {

        const data = [
            topRow,
            headerRow,
            spaceIshtarRow
        ];

        const logger = new TestLogger();

        const result = FgoManagerParsers.parseRosterSheet(data, gameServantNameMap, logger);

        expect(result.length).toStrictEqual(1);

        const servant1 = result[0];
        expect(servant1.gameId).toStrictEqual(Rarity5TestServant._id);
        expect(servant1.level).toStrictEqual(90);
        expect(servant1.np).toStrictEqual(5);
        expect(servant1.fouHp).toStrictEqual(1000);
        expect(servant1.fouAtk).toStrictEqual(1000);
        expect(servant1.skills[1]).toStrictEqual(10);
        expect(servant1.skills[2]).toStrictEqual(10);
        expect(servant1.skills[3]).toStrictEqual(10);
        expect(servant1.appendSkills[1]).toStrictEqual(IndeterminateValue);
        expect(servant1.appendSkills[2]).toStrictEqual(IndeterminateValue);
        expect(servant1.appendSkills[3]).toStrictEqual(IndeterminateValue);
        expect(servant1.bondLevel).toStrictEqual(6);
        expect(servant1.summonDate).toBeDefined();

    });

    it('should return servants if data is valid with empty rows', () => {

        const data = [
            topRow,
            headerRow,
            [],
            spaceIshtarRow,
            [],
            []
        ];

        const logger = new TestLogger();

        const result = FgoManagerParsers.parseRosterSheet(data, gameServantNameMap, logger);

        expect(result.length).toStrictEqual(1);

        const servant1 = result[0];
        expect(servant1.gameId).toStrictEqual(Rarity5TestServant._id);
        expect(servant1.level).toStrictEqual(90);
        expect(servant1.np).toStrictEqual(5);
        expect(servant1.fouHp).toStrictEqual(1000);
        expect(servant1.fouAtk).toStrictEqual(1000);
        expect(servant1.skills[1]).toStrictEqual(10);
        expect(servant1.skills[2]).toStrictEqual(10);
        expect(servant1.skills[3]).toStrictEqual(10);
        expect(servant1.appendSkills[1]).toStrictEqual(IndeterminateValue);
        expect(servant1.appendSkills[2]).toStrictEqual(IndeterminateValue);
        expect(servant1.appendSkills[3]).toStrictEqual(IndeterminateValue);
        expect(servant1.bondLevel).toStrictEqual(6);
        expect(servant1.summonDate).toBeDefined();

    });

});
