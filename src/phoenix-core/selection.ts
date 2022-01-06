import { DataSelector, SelectorPathSegment } from './models';

class SimpleSelection extends DataSelector {
  keep?: boolean;

  constructor(
    elementId: string,
    elementType: string,
    public readonly selectedElementSubtype?: string
  ) {
    super([{ elementId: elementId, elementType: elementType }]);
  }

  get selectedElementId(): string {
    return this.selection[0].elementId;
  }

  get selectedElementType(): string {
    return this.selection[0].elementType;
  }
}

class HierarchicalSelection extends SimpleSelection {
  constructor(
    elementId: string,
    elementType: string,
    parentSelector: SelectorPathSegment[],
    selectedElementSubtype?: string
  ) {
    super(elementId, elementType, selectedElementSubtype);
    this.selection.push(...parentSelector);
  }
}

export type SelectedElementIdentification =
  | SimpleSelection
  | HierarchicalSelection;

function pathEquals(
  pathSegment: SelectorPathSegment,
  indexInPath: number,
  selection: SelectedElementIdentification,
  pathIndexDiff = 0
): boolean {
  const selectionPathIndex = indexInPath + pathIndexDiff;
  return (
    pathSegment.elementId ===
      selection.selection[selectionPathIndex].elementId &&
    pathSegment.elementType ===
      selection.selection[selectionPathIndex].elementType
  );
}

export function equalSelections(
  sel1: SelectedElementIdentification,
  sel2: SelectedElementIdentification
): boolean {
  return (
    sel1.selection.length === sel2.selection.length &&
    sel1.selection
      .map((selector, index) => pathEquals(selector, index, sel2))
      .reduce((a, b) => a && b)
  );
}

export function createSelection(
  elementId: string,
  elementType: string,
  selectedElementSubtype?: string
): SimpleSelection {
  return new SimpleSelection(elementId, elementType, selectedElementSubtype);
}
