'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Autocomplete = AutocompletePrimitive.Root;

function AutocompleteInput({ className, ...props }: AutocompletePrimitive.Input.Props) {
  return (
    <AutocompletePrimitive.Input
      data-slot="autocomplete-input"
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

function AutocompleteContent({
  className,
  children,
  sideOffset = 4,
  ...props
}: AutocompletePrimitive.Popup.Props & {
  sideOffset?: number;
}) {
  return (
    <AutocompletePrimitive.Portal>
      <AutocompletePrimitive.Positioner sideOffset={sideOffset} className="isolate z-[60]">
        <AutocompletePrimitive.Popup
          data-slot="autocomplete-content"
          className={cn(
            'ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 max-h-[min(18rem,var(--available-height))] w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 shadow-md ring-1 duration-100',
            className,
          )}
          {...props}
        >
          {children}
        </AutocompletePrimitive.Popup>
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  );
}

function AutocompleteList(props: React.ComponentProps<typeof AutocompletePrimitive.List>) {
  return <AutocompletePrimitive.List data-slot="autocomplete-list" {...props} />;
}

function AutocompleteItem({ className, ...props }: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        'data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-sm outline-none select-none',
        className,
      )}
      {...props}
    />
  );
}

function AutocompleteEmpty({ className, ...props }: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn(
        'text-muted-foreground px-2 py-2 text-center text-xs empty:m-0 empty:p-0',
        className,
      )}
      {...props}
    />
  );
}

export {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
};
