import { animate, state, style, transition, trigger } from "@angular/animations";

export const textAnimationTrigger = trigger('textAnimation', [
    state('hidden', style({ opacity: 0, transform: 'translateX(-350px)' })),
    transition('hidden => visible', [
        animate('1.3s ease', style({ opacity: 1, transform: 'translateX(0)' })),
    ]),
]);

export const slideAnimationTrigger = trigger('slideAnimation', [
    state('middle', style({ transform: 'translateX(200px)' })),
    state('left', style({ transform: 'translateX(0)' })),
    transition('middle => left', animate('0.5s ease-in')),
]);

export const backgroundAnimationTrigger = trigger('backgroundAnimation', [
    state('initial', style({ opacity: 1 })),
    state('mid', style({ opacity: 0.5 })),
    state('final', style({ opacity: 0 })),
    transition('initial => mid', animate('0.5s ease-in')),
    transition('mid => final', animate('0.2s ease-in')),
]);

export const moveAnimationTrigger = trigger('moveAnimation', [
    state('middle', style({ transform: 'translate(-50%, -50%)' })),
    state('top-left', style({ top: '175px', left: '375px', fontSize: '32px' })),
    transition('middle => top-left', animate('0.3s ease-out')), 
]);