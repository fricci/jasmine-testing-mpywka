import { SelectedElementIdentification } from './phoenix-core/selection';

type Translations = Map<string, string>;

export interface FullTranslationData {
  key: string;
  translatedInAllLanguage: boolean;
  userLocations: Array<SelectedElementIdentification>;
  translations: Translations;
}
