const formatNumber = (n: number): string => {
  const s = n.toString();
  return s[1] ? s : `0${s}`;
};

export const formatTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (dayDiff === 0) return '今天';
  if (dayDiff === 1) return '昨天';
  if (dayDiff < 7) return `${dayDiff}天前`;
  return dateStr;
};

/**
 * 轻量级 Markdown → HTML 转换器
 * 支持：标题、段落、无序/有序列表、加粗、表格、内联 HTML 保留
 */
export function markdownToHtml(md: string): string {
  if (!md) return '';

  const lines = md.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 跳过纯空行
    if (!line.trim()) {
      i++;
      continue;
    }

    // 保留内联 HTML 行（以 < 开头）
    if (line.trim().startsWith('<')) {
      result.push(line);
      i++;
      continue;
    }

    // 标题 # ## ### #### ##### ######
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      result.push(`<h${level}>${parseInline(hMatch[2])}</h${level}>`);
      i++;
      continue;
    }

    // 无序列表 - 或 *
    if (line.match(/^[\s]*[-*]\s+/)) {
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^[\s]*[-*]\s+(.+)$/);
        if (m) {
          items.push(`<li>${parseInline(m[1])}</li>`);
          i++;
        } else if (lines[i].trim() === '') {
          i++;
          break;
        } else {
          break;
        }
      }
      result.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // 有序列表 1. 2.
    if (line.match(/^[\s]*\d+\.\s+/)) {
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^[\s]*\d+\.\s+(.+)$/);
        if (m) {
          items.push(`<li>${parseInline(m[1])}</li>`);
          i++;
        } else if (lines[i].trim() === '') {
          i++;
          break;
        } else {
          break;
        }
      }
      result.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // 表格（简单实现：包含 | 的行）
    if (line.includes('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }

      // 过滤掉 Markdown 分隔行 |---|---|
      const contentRows = tableLines.filter(
        (r) => r.trim().replace(/\|/g, '').replace(/[-\s:]/g, '') !== '',
      );

      if (contentRows.length > 0) {
        const theadCells = parseTableRow(contentRows[0]);
        const thead = `<thead><tr>${theadCells.map((c) => `<th>${parseInline(c)}</th>`).join('')}</tr></thead>`;

        const tbody = contentRows
          .slice(1)
          .map((row) => {
            const cells = parseTableRow(row);
            return `<tr>${cells.map((c) => `<td>${parseInline(c)}</td>`).join('')}</tr>`;
          })
          .join('');

        result.push(
          `<table>${thead}<tbody>${tbody}</tbody></table>`,
        );
        continue;
      }
    }

    // 默认段落：收集连续的非特殊行
    const paraLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('<') &&
      !lines[i].match(/^#{1,6}\s/) &&
      !lines[i].match(/^[\s]*[-*]\s+/) &&
      !lines[i].match(/^[\s]*\d+\.\s+/) &&
      !lines[i].includes('|')
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    result.push(`<p>${parseInline(paraLines.join('<br>'))}</p>`);
  }

  return result.join('\n');
}

function parseInline(text: string): string {
  // **bold** 或 __bold__ → <strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
  return text;
}

function parseTableRow(row: string): string[] {
  return row
    .split('|')
    .map((c) => c.trim())
    .filter((c) => c !== '');
}
