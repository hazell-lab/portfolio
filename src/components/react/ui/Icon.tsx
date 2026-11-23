// an icon from the svg sprite in the page (src/components/ui/IconSprite.astro)

export type IconName =
  | 'github'
  | 'linkedin'
  | 'mail'
  | 'arrow'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-down'
  | 'arrow-up'
  | 'download'
  | 'windows'
  | 'expand'
  | 'close';

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="icon" aria-hidden="true" focusable="false">
      <use href={`#i-${name}`} />
    </svg>
  );
}
