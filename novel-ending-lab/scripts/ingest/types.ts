export type CorpusCategory = 'target_novel' | 'author_corpus' | 'literary_references';

export type SupportedExtension = '.txt' | '.md' | '.pdf' | '.epub' | '.docx';

export interface CorpusFileRecord {
  category: CorpusCategory;
  fileName: string;
  relativePath: string;
  extension: SupportedExtension;
  sizeBytes: number;
  characterCount: number | null;
}
