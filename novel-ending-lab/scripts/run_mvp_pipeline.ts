import { access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface PipelineStep {
  name: string;
  script: string;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, '..');

const pipelineSteps: PipelineStep[] = [
  { name: 'corpus:index', script: 'corpus:index' },
  { name: 'corpus:split', script: 'corpus:split' },
  { name: 'chapters:summarize', script: 'chapters:summarize' },
  { name: 'analysis:build', script: 'analysis:build' },
  { name: 'ending:options', script: 'ending:options' },
  { name: 'ending:outline', script: 'ending:outline' },
  { name: 'ending:chapter', script: 'ending:chapter' },
];

const outputFiles = [
  'analysis/corpus_index.md',
  'parsed/target_chapters/chapters_index.md',
  'analysis/chapter_summaries/',
  'analysis/dragon_story_bible.md',
  'analysis/dragon_unresolved_threads.md',
  'analysis/dragon_foreshadowing.md',
  'analysis/dragon_ending_rules.md',
  'output/dragon_ending/ending_options.md',
  'output/dragon_ending/ending_outline.md',
  'output/dragon_ending/generated_chapters/chapter_001_draft.md',
];

function runNpmScript(step: PipelineStep): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`\n[MVP] 开始：${step.name}`);

    const child = spawn('npm', ['run', step.script], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`[MVP] 完成：${step.name}`);
        resolve();
        return;
      }

      reject(new Error(`步骤 ${step.name} 失败，退出码：${code ?? 'unknown'}`));
    });
  });
}

async function pathExists(relativePath: string): Promise<boolean> {
  try {
    await access(path.join(labRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function printOutputList(): Promise<void> {
  console.log('\n[MVP] 输出文件清单：');

  for (const outputFile of outputFiles) {
    const exists = await pathExists(outputFile);
    console.log(`- ${exists ? '已生成' : '未找到'} ${outputFile}`);
  }
}

async function main(): Promise<void> {
  for (const step of pipelineSteps) {
    try {
      await runNpmScript(step);
    } catch (error) {
      console.error(`\n[MVP] 失败步骤：${step.name}`);
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
      return;
    }
  }

  await printOutputList();
  console.log('\n[MVP] 全部流程完成。');
}

await main();
