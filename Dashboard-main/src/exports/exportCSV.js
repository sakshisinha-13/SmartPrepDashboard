export const exportToCSV = (questions) => {
  const headers = ['Link', 'Type', 'Topic', 'Difficulty'];
  const rows = questions.map(q => [
    q.link || '',
    q.type || '',
    q.topic || '',
    q.difficulty || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(e => e.map(v => `"${v}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "questions_export.csv");
  link.click();
};
