export interface SelectorPathSegment {
  elementId: string;
  elementType: string;
}

export class DataSelector {
  constructor(public readonly selection: SelectorPathSegment[]) {}
}
