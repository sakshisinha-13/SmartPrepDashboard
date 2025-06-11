export const exportToMarkdown = (questions) => {
  const headers = "| Link | Type | Topic | Difficulty |\n|------|------|--------|------------|";
  const rows = questions.map(q =>
    `| ${q.link || ''} | ${q.type || ''} | ${q.topic || ''} | ${q.difficulty || ''} |`
  );

  const mdContent = [headers, ...rows].join('\n');
  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "questions.md");
  link.click();
};
