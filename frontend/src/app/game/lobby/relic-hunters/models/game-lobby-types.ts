import { LobbyClient } from '../../models/lobby-client';
import { RelicHuntersGameBuilder } from './game-builder';
import { RelicHuntersSetupData } from './game-setup-data';
import { RelicHuntersGameType } from './game-type';

export type RhLobbyClient = LobbyClient<
    RelicHuntersGameType,
    RelicHuntersSetupData,
    RelicHuntersGameBuilder
>;
