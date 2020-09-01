import { animate, keyframes, style, transition, trigger, state } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [ style({ opacity: 0 }), animate('500ms ease', style({ opacity: 1 })) ])
]);

export const fadeInAndOut = trigger('fadeInAndOut', [
  state('active', style({ opacity: 0 })),
  state('inactive', style({ opacity: 1 })),
  transition('* => *', animate('300ms ease'))
]);

export const fadeInTranslateXLeft = trigger('fadeInTranslateXLeft', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(
      '300ms ease',
      keyframes([ style({ transform: 'translateX(-100%)', offset: 0 })
      , style({ transform: 'translateX(0)', offset: 1, opacity: 1 }) ])
    )
  ])
]);

export const fadeInTranslateXRight = trigger('fadeInTranslateXRight', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(
      '300ms ease',
      keyframes([ style({ transform: 'translateX(100%)', offset: 0 })
      , style({ transform: 'translateX(0)', offset: 1, opacity: 1 }) ])
    )
  ])
]);

export const fadeInTranslateYTop = trigger('fadeInTranslateYTop', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(
      '300ms ease',
      keyframes([ style({ transform: 'translateY(-100%)', offset: 0 }), style({ transform: 'translateY(0)', offset: 1, opacity: 1 }) ])
    )
  ])
]);

export const fadeInTranslateYBottom = trigger('fadeInTranslateYBottom', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(
      '300ms ease',
      keyframes([ style({ transform: 'translateY(100%)', offset: 0 }), style({ transform: 'translateY(0)', offset: 1, opacity: 1 }) ])
    )
  ])
]);
