const STORAGE_KEY = "novelContinuationDraft";

const storyInput = document.querySelector("#storyInput");
const characterNotes = document.querySelector("#characterNotes");
const plotlines = document.querySelector("#plotlines");
const endingDirection = document.querySelector("#endingDirection");
const chapterDraft = document.querySelector("#chapterDraft");
const analysisOutput = document.querySelector("#analysisOutput");
const statusMessage = document.querySelector("#statusMessage");

const analysisButton = document.querySelector("#analysisButton");
const clearButton = document.querySelector("#clearButton");
const saveButton = document.querySelector("#saveButton");
const loadButton = document.querySelector("#loadButton");
const exportButton = document.querySelector("#exportButton");

function getWordLikeCount(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return 0;
  }

  const chineseCharacters = trimmedText.match(/[\u4e00-\u9fff]/g) || [];
  const latinWords = trimmedText.match(/[A-Za-z0-9]+/g) || [];

  return chineseCharacters.length + latinWords.length;
}

function getFirstLine(text, fallback) {
  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return firstLine || fallback;
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildPlaceholderAnalysis() {
  const storyText = storyInput.value.trim();
  const characterText = characterNotes.value.trim();
  const plotlineText = plotlines.value.trim();
  const direction = endingDirection.value.trim();

  const storyCount = getWordLikeCount(storyText);
  const characterCount = getWordLikeCount(characterText);
  const plotlineCount = getWordLikeCount(plotlineText);

  const storyPreview = escapeHtml(getFirstLine(storyText, "暂未填写故事摘要，请先补充主线背景。"));
  const characterPreview = escapeHtml(getFirstLine(characterText, "暂未填写人物笔记，请补充主角目标与关系。"));
  const plotlinePreview = escapeHtml(getFirstLine(plotlineText, "暂未填写未解决伏笔，请列出需要收束的问题。"));
  const safeDirection = escapeHtml(direction);

  analysisOutput.innerHTML = `
    <h3>资料完整度</h3>
    <ul>
      <li>故事资料约 ${storyCount} 个字符/词，可继续补充关键冲突、世界规则和当前章节位置。</li>
      <li>人物笔记约 ${characterCount} 个字符/词，建议为每个主要人物写清楚“目标、恐惧、变化”。</li>
      <li>伏笔记录约 ${plotlineCount} 个字符/词，后续章节应优先回应最影响结局的问题。</li>
    </ul>

    <h3>当前素材摘要</h3>
    <p><strong>故事线索：</strong>${storyPreview}</p>
    <p><strong>人物线索：</strong>${characterPreview}</p>
    <p><strong>伏笔线索：</strong>${plotlinePreview}</p>

    <h3>结局方向建议：${safeDirection}</h3>
    <p>占位建议：下一章可以先安排一个安静但有张力的场景，让主角主动选择方向，再让一个伏笔产生可见回响。</p>
    <p>中文示例输出：主角没有立刻得到答案，但他终于明白，真正需要完成的不是逃离过去，而是带着新的勇气走向真相。</p>
  `;

  setStatus("已生成占位分析。后续可把这里替换为真实 AI 返回结果。");
}

function getDraftData() {
  return {
    story: storyInput.value,
    characters: characterNotes.value,
    plotlines: plotlines.value,
    ending: endingDirection.value,
    draft: chapterDraft.value,
    savedAt: new Date().toISOString()
  };
}

function saveDraft() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getDraftData()));
  setStatus("草稿已保存到当前浏览器。");
}

function loadDraft() {
  const savedDraft = localStorage.getItem(STORAGE_KEY);

  if (!savedDraft) {
    setStatus("还没有保存过草稿。");
    return;
  }

  const parsedDraft = JSON.parse(savedDraft);

  storyInput.value = parsedDraft.story || "";
  characterNotes.value = parsedDraft.characters || "";
  plotlines.value = parsedDraft.plotlines || "";
  endingDirection.value = parsedDraft.ending || "温暖治愈";
  chapterDraft.value = parsedDraft.draft || "";

  const savedTime = parsedDraft.savedAt
    ? new Date(parsedDraft.savedAt).toLocaleString()
    : "未知时间";

  setStatus(`已读取草稿。保存时间：${savedTime}`);
}

function clearInputs() {
  storyInput.value = "";
  characterNotes.value = "";
  plotlines.value = "";
  chapterDraft.value = "";
  endingDirection.value = "温暖治愈";
  analysisOutput.innerHTML = "<p>点击“生成占位分析”后，这里会显示中文分析建议。</p>";
  setStatus("页面输入已清空，浏览器中已保存的草稿不会被删除。");
}

function exportTextFile() {
  const draftText = chapterDraft.value.trim();

  if (!draftText) {
    setStatus("请先填写章节草稿，再导出 .txt 文件。");
    return;
  }

  const fileContent = [
    "小说续写草稿",
    "============",
    `结局方向：${endingDirection.value.trim()}`,
    "",
    draftText
  ].join("\n");

  const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = "novel-continuation-draft.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);

  setStatus("已导出 novel-continuation-draft.txt。");
}

analysisButton.addEventListener("click", buildPlaceholderAnalysis);
clearButton.addEventListener("click", clearInputs);
saveButton.addEventListener("click", saveDraft);
loadButton.addEventListener("click", loadDraft);
exportButton.addEventListener("click", exportTextFile);
