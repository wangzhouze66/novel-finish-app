export interface ChapterMatch {
  title: string;
  line: string;
}

const headingPrefixPattern = String.raw`(?:#{1,6}\s*)?`;
const chineseNumberPattern = String.raw`[0-9０-９〇零一二三四五六七八九十百千万两]+`;
const chapterKeywordPattern = String.raw`第\s*${chineseNumberPattern}\s*[章节幕卷部]`;
const specialChapterPattern = String.raw`(?:序章|楔子|尾声|后记|正文)`;
const englishChapterPattern = String.raw`Chapter\s+[0-9]+`;

export const chapterTitlePattern = new RegExp(
  String.raw`^\s*${headingPrefixPattern}(${chapterKeywordPattern}|${specialChapterPattern}|${englishChapterPattern})(?:\s*[:：、.．\-—]?\s*([^\n\r]{0,80}))?\s*$`,
  'i',
);

export function detectChapterTitle(line: string): ChapterMatch | null {
  const trimmedLine = line.trim();

  if (trimmedLine.length === 0 || trimmedLine.length > 120) {
    return null;
  }

  const match = trimmedLine.match(chapterTitlePattern);

  if (!match) {
    return null;
  }

  const marker = match[1]?.trim() ?? '';
  const subtitle = match[2]?.trim() ?? '';
  const title = subtitle.length > 0 ? `${marker} ${subtitle}` : marker;

  return {
    title,
    line: trimmedLine,
  };
}
