import { Directive, computed, input } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';

type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-lg';

const buttonBase =
  'inline-flex items-center justify-center rounded-md text-sm font-medium cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default';

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-10 rounded-md px-8',
  icon: 'h-9 w-9',
  'icon-lg': 'h-[48px] w-[48px] sm:h-[72px] sm:w-[72px]',
};

@Directive({
  selector: 'button[hlmButton], a[hlmButton]',
  standalone: true,
  hostDirectives: [BrnButton],
  host: {
    '[class]': 'computedClass()',
    'data-spartan': 'hlm-button',
  },
})
export class HlmButton {
  readonly variant = input<ButtonVariant>('default');
  readonly size = input<ButtonSize>('default');

  readonly computedClass = computed(
    () =>
      `${buttonBase} ${variantClasses[this.variant()]} ${sizeClasses[this.size()]}`,
  );
}
