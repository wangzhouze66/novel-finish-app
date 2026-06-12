export type CorpusCategory = 'target_novel' | 'author_corpus' | 'literary_references';

export interface CorpusFileRecord {
  category: CorpusCategory;
  fileName: string;
  relativePath: string;
  extension: string;
  sizeBytes: number;
  characterCount: number | null;
}
