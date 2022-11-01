import { ClankDlcEnum } from '../clank.types';
import {
    ClankCardConfig,
    ClankCardHeight,
    ClankCardWidth,
} from './cards.types';

export class ClankCard {

    id = '';
    style: Partial<CSSStyleDeclaration> = {};

    constructor(
        public config: ClankCardConfig,
        public index: number,
        public copy_index: number,
        public dlc_name: ClankDlcEnum,
        public url: string,
        public playerId?: string,
    ) {
        this.id = `${dlc_name}_${index}_${copy_index}_${playerId}`,
        this.updateStyle();
    }

    getCopy(playerId?: string) {
        return new ClankCard(
            this.config,
            this.index,
            this.copy_index,
            this.dlc_name,
            this.url,
            playerId,
        );
    }

    private updateStyle() {
        const positionX = this.config.column * ClankCardWidth;
        const positionY = this.config.row * ClankCardHeight;
        this.style = {
            width: `${ClankCardWidth}px`,
            height: `${ClankCardHeight}px`,
            backgroundImage: `url(${this.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
        };
    }

}
