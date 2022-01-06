import { Observable, Subject, pipe, BehaviorSubject } from 'rxjs';
import { combineLatest, debounceTime, map, tap } from 'rxjs/operators';

import {
  equalSelections,
  SelectedElementIdentification,
} from './phoenix-core/selection';
import { FullTranslationData } from './translation';

export interface Filter {
  location: SelectedElementIdentification;
  filterStr: string;
  showOnlyRowsWithEmptyValues: boolean;
}

const DEBOUNCE_TIME = 500;

export class I18nListPipelineService {
  readonly filteringInProgress$: Subject<boolean> =
    new BehaviorSubject<boolean>(false);
  readonly orderingInProgress$: Subject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  createDataPipeline(
    dataInput: Observable<FullTranslationData[]>,
    filterObserver: Observable<Filter>,
    orderObserver: Observable<string>
  ) {
    return dataInput.pipe(
      tap(() => this.filteringInProgress$.next(true)),
      i18nFiltering(filterObserver.pipe(debounceTime(DEBOUNCE_TIME))),
      tap(() => this.filteringInProgress$.next(false)),
      tap(() => this.orderingInProgress$.next(true)),
      i18nOrdering(orderObserver.pipe(debounceTime(DEBOUNCE_TIME))),
      tap(() => this.orderingInProgress$.next(false))
    );
  }
}

// Filter implementation
function i18nFiltering(params: Observable<Filter>) {
  return pipe(
    combineLatest(params),
    map(([translations, filterValues]: [FullTranslationData[], Filter]) => {
      return translations.filter((translation) => {
        return (
          (!filterValues.location ||
            translation.userLocations.some((loc) =>
              equalSelections(loc, filterValues.location)
            )) &&
          (!filterValues.showOnlyRowsWithEmptyValues ||
            !translation.translatedInAllLanguage) &&
          (!filterValues.filterStr ||
            Array.from(translation.translations.values()).some(
              (transStr) => transStr.indexOf(filterValues.filterStr) > -1
            ))
        );
      });
    })
  );
}

// Order implementation
function i18nOrdering(params: Observable<string>) {
  return pipe(
    combineLatest(params),
    map(([translations, compareBy]: [FullTranslationData[], string]) => {
      return translations.sort((firstValue, lastValue) => {
        const firstValueTranslation = firstValue.translations.get(compareBy);
        const lastValueTranslation = lastValue.translations.get(compareBy);
        return (firstValueTranslation || '').localeCompare(
          lastValueTranslation
        );
      });
    })
  );
}
