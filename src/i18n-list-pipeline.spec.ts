import { of } from 'rxjs';
import { I18nListPipelineService } from './i18n-list-pipeline';

describe('I18n filtering and ordering pipeline', () => {
  let pipeline = null;

  beforeEach(() => {
    pipeline = new I18nListPipelineService();
  });

  it('testing simple pipeline (without filtering and ordering', (done) => {
    const testdata = of([
      {
        key: 'key1',
        translatedInAllLanguage: false,
        userLocations: [],
        translations: new Map([
          ['en', undefined],
          ['hu', undefined],
        ]),
      },
    ]);

    pipeline
      .createDataPipeline(testdata, of({}), of('key'))
      .subscribe((filteredList) => {
        expect(filteredList).toBeTruthy();
        expect(filteredList.length).toBe(1);
        done();
      });
  });

  it('testing simple filtering', (done) => {
    console.log(
      new Map([
        ['en', 'en_text'],
        ['hu', 'hu_text'],
      ])
    );
    const testdata = of([
      {
        key: 'key1',
        translatedInAllLanguage: false,
        userLocations: [],
        translations: new Map([
          ['en', undefined],
          ['hu', undefined],
        ]),
      },
      {
        key: 'key2',
        translatedInAllLanguage: true,
        userLocations: [],
        translations: new Map([
          ['en', 'en_text'],
          ['hu', 'hu_text'],
        ]),
      },
    ]);

    pipeline
      .createDataPipeline(testdata, of({ filterStr: 'hu_te' }), of('key'))
      .subscribe((filteredList) => {
        expect(filteredList).toBeTruthy();
        expect(filteredList.length).toBe(1);
        done();
      });
  });
});
